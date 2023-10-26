import { BigNumber } from 'bignumber.js';
import React, { memo, useMemo } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import useSWR from 'swr';

import { fetchCollectibleExtraDetails, objktCurrencies } from 'src/apis/objkt';
import { CollectibleImage } from 'src/components/collectible-image';
import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ImageBlurOverlay } from 'src/components/image-blur-overlay';
import { BLOCK_DURATION } from 'src/config/fixed-times';
import { useShareNFT } from 'src/hooks/use-share-nft.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { CollectionItemInterface } from 'src/token/interfaces/collectible-interfaces.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { formatAssetAmount } from 'src/utils/number.util';
import { SUPPORTED_CONTRACTS, buildBuyCollectibleParams, buildSellCollectibleParams } from 'src/utils/objkt';
import { createTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { mutezToTz } from 'src/utils/tezos.util';

import { navigateToObjktForBuy } from '../utils';
import { useCollectibleItemStyles } from './collectible-item.styles';

const DETAILS_SYNC_INTERVAL = 4 * BLOCK_DURATION;

interface Props {
  item: CollectionItemInterface;
  collectionContract: string;
  accountPkh: string;
}

export const CollectibleItem = memo<Props>(({ item, collectionContract, accountPkh }) => {
  const slug = getTokenSlug(item);

  const styles = useCollectibleItemStyles();
  const { navigate } = useNavigation();
  const selectedRpc = useSelectedRpcUrlSelector();

  const lastPrice = useMemo(() => {
    if (item.lastDeal?.price == null) {
      return '---';
    }

    const currency = objktCurrencies[item.lastDeal.currency_id];
    if (!currency) {
      return '---';
    }

    const price = formatAssetAmount(mutezToTz(BigNumber(item.lastDeal.price), currency.decimals));

    return `${price} ${currency.symbol}`;
  }, [item]);

  const { data: extraDetails } = useSWR(
    ['fetchCollectibleExtraDetails', item.address, item.id],
    () => fetchCollectibleExtraDetails(item.address, item.id),
    {
      errorRetryCount: 2,
      refreshInterval: DETAILS_SYNC_INTERVAL
    }
  );

  const isAccountHolder = useMemo(
    () => item.holders.some(h => h.holder_address === accountPkh && h.quantity > 0),
    [item.holders, accountPkh]
  );

  const firstButton = useMemo(() => {
    if (!isAccountHolder) {
      return {
        title: 'Make offer',
        onPress: () => navigateToObjktForBuy(collectionContract, item.id)
      };
    }

    const takableOffers = extraDetails?.offers_active.filter(o => o.buyer_address !== accountPkh);
    const highestOffer = takableOffers?.length ? takableOffers[takableOffers.length - 1] : null;

    if (!highestOffer) {
      return {
        title: 'No offers yet',
        disabled: true
      };
    }

    const currency = objktCurrencies[highestOffer.currency_id];

    if (!currency) {
      return {
        title: 'Sell',
        disabled: true
      };
    }

    const priceToDisplay = mutezToTz(BigNumber(highestOffer.price), currency.decimals);

    return {
      title: `Sell for ${priceToDisplay} ${currency.symbol}`,
      onPress: () =>
        void buildSellCollectibleParams(
          createTezosToolkit(selectedRpc),
          accountPkh,
          collectionContract,
          item.id,
          highestOffer,
          currency
        ).then(opParams =>
          navigate(ModalsEnum.Confirmation, {
            type: ConfirmationTypeEnum.InternalOperations,
            opParams
          })
        )
    };
  }, [accountPkh, selectedRpc, isAccountHolder, collectionContract, item.id, extraDetails?.offers_active, navigate]);

  const secondButton = useMemo(() => {
    if (isAccountHolder) {
      const holdingAmount = item.holders.reduce(
        (acc, curr) => (curr.holder_address === accountPkh ? acc + curr.quantity : acc),
        0
      );
      const listedAmount = item.listingsActive.reduce(
        (acc, curr) => (curr.seller_address === accountPkh ? acc + curr.amount_left : acc),
        0
      );

      if (listedAmount < holdingAmount) {
        return {
          title: 'List',
          onPress: () => navigateToObjktForBuy(collectionContract, item.id)
        };
      }

      return {
        title: 'Listed',
        disabled: true
      };
    }

    const listing = item.listingsActive[0];

    if (!listing) {
      return {
        title: 'Not listed',
        disabled: true
      };
    }

    const isSupportedContract = SUPPORTED_CONTRACTS.includes(listing.marketplace_contract);
    const purchaseCurrency = objktCurrencies[listing.currency_id];

    if (!isSupportedContract || !purchaseCurrency) {
      return {
        title: 'Buy',
        disabled: true
      };
    }

    const priceToDisplay = mutezToTz(new BigNumber(listing.price), purchaseCurrency.decimals);

    return {
      title: `Buy for ${priceToDisplay} ${purchaseCurrency.symbol}`,
      onPress: () =>
        void buildBuyCollectibleParams(createTezosToolkit(selectedRpc), accountPkh, listing, purchaseCurrency).then(
          opParams =>
            navigate(ModalsEnum.Confirmation, {
              type: ConfirmationTypeEnum.InternalOperations,
              opParams
            })
        )
    };
  }, [
    slug,
    accountPkh,
    selectedRpc,
    isAccountHolder,
    collectionContract,
    item.id,
    item.holders,
    item.listingsActive,
    navigate
  ]);

  const handleShare = useShareNFT(slug, item.thumbnailUri, item.name, item.description);

  const navigateToCollectibleModal = () => navigate(ModalsEnum.CollectibleModal, { slug });

  const imageSize = formatSize(295);

  return (
    <View style={styles.collectibleContainer}>
      {isDefined(item.lowestAsk) && (
        <View style={styles.listed}>
          <Text style={styles.listedText}>LISTED</Text>
        </View>
      )}

      <View style={styles.collectible}>
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={navigateToCollectibleModal} activeOpacity={0.7}>
            <View style={[styles.imageWrap, { width: imageSize, height: imageSize }]}>
              {item.isAdultContent ? (
                <ImageBlurOverlay size={imageSize} isBigIcon={true} />
              ) : (
                <CollectibleImage
                  isFullView={true}
                  slug={slug}
                  artifactUri={item.artifactUri}
                  displayUri={item.displayUri}
                  thumbnailUri={item.thumbnailUri}
                  size={imageSize}
                />
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.nameBlock}>
            <Text style={styles.collectibleName} numberOfLines={1}>
              {item.name}
            </Text>

            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Icon name={IconNameEnum.Share} />
              <Divider size={formatSize(4)} />
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.collectibleDescription} numberOfLines={3}>
            {item.description}
          </Text>

          <View style={styles.infoContainer}>
            <View style={styles.containerRight}>
              <View style={styles.smallContainer}>
                <Text style={styles.text}>Last Price</Text>
                <Text style={styles.value}>{lastPrice}</Text>
              </View>
            </View>
            <View style={styles.containerLeft}>
              <View style={styles.smallContainer}>
                <Text style={styles.text}>Editions</Text>
                <Text style={styles.value}>{item.editions}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={firstButton.onPress}
            disabled={firstButton.disabled}
            style={[styles.actionButton, firstButton.disabled ? styles.firstButtonDisabled : styles.firstButtonActive]}
          >
            <Text
              style={[
                styles.actionButtonText,
                firstButton.disabled ? styles.firstButtonDisabled : styles.firstButtonActive
              ]}
            >
              {firstButton.title}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={secondButton.onPress}
            style={[
              styles.actionButton,
              secondButton.disabled ? styles.secondButtonDisabled : styles.secondButtonActive
            ]}
            disabled={secondButton.disabled}
          >
            <Text
              style={[
                styles.actionButtonText,
                secondButton.disabled ? styles.secondButtonTextDisabled : styles.secondButtonTextActive
              ]}
            >
              {secondButton.title}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});
