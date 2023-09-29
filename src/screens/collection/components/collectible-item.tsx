import { isNonEmptyArray } from '@apollo/client/utilities';
import { BigNumber } from 'bignumber.js';
import React, { FC, memo, useCallback, useMemo } from 'react';
import { TouchableOpacity, View, Text, Share } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { SHARE_NFT_CONTENT } from 'src/modals/collectible-modal/collectible-modal';
import { CollectibleModalSelectors } from 'src/modals/collectible-modal/collectible-modal.selectors';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { conditionalStyle } from 'src/utils/conditional-style';
import { getTempleDynamicLink } from 'src/utils/get-temple-dynamic-link.util';
import { formatImgUri, ImageResolutionEnum } from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';
import { formatAssetAmount } from 'src/utils/number.util';
import { mutezToTz } from 'src/utils/tezos.util';

import { CollectibleIcon, CollectibleIconSize } from '../../../components/collectible-icon/collectible-icon';
import { useBuyCollectible } from '../../../hooks/use-buy-collectible.hook';
import { ModalsEnum } from '../../../navigator/enums/modals.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { CollectibleOfferInteface } from '../../../token/interfaces/collectible-interfaces.interface';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { navigateToObjktForBuy } from '../utils';
import { useCollectibleItemStyles } from './collectible-item.styles';
import { OfferButton } from './offer-button';

interface Props {
  item: CollectibleOfferInteface;
  collectionContract: string;
  selectedRpc: string;
  selectedPublicKeyHash: string;
}

export const CollectibleItem: FC<Props> = memo(({ item, collectionContract, selectedRpc, selectedPublicKeyHash }) => {
  const styles = useCollectibleItemStyles();
  const { navigate } = useNavigation();

  const { trackEvent } = useAnalytics();

  const lastPrice = useMemo(() => {
    if (isDefined(item.lastPrice) && isDefined(item.lastPrice.price)) {
      const price = formatAssetAmount(mutezToTz(BigNumber(item.lastPrice?.price), item.lastPrice?.decimals));

      return `${price} ${item.lastPrice.symbol}`;
    }

    return '---';
  }, [item]);

  const highestOffer = isDefined(item.highestOffer)
    ? `${mutezToTz(BigNumber(item.highestOffer.price), item.decimals)} ${item.symbol}`
    : 'No offers yet';

  const holders = item?.holders?.filter(holder => holder.quantity > 0).map(holder => holder.holderAddress) ?? [];
  const isHolder = useMemo(() => holders.includes(selectedPublicKeyHash), [selectedPublicKeyHash]);
  const isOffersExisted = isDefined(item.highestOffer);

  const listedByUser = item.listed ?? 0;
  const quantityByUser = useMemo(
    () => item?.holders?.find(holder => holder.holderAddress === selectedPublicKeyHash)?.quantity ?? 0,
    [selectedPublicKeyHash, item]
  );

  const handleList = () => navigateToObjktForBuy(collectionContract, item.id);

  const { buyCollectible, purchaseCurrency } = useBuyCollectible(item);

  const fxHashListed = item?.listingsActive?.find(listing => listing.sellerAddress === selectedPublicKeyHash);

  const isAbleToList = quantityByUser > listedByUser && purchaseCurrency.price > 0;
  const isListed = isNonEmptyArray(item.listingsActive);

  const buttonText = useMemo(() => {
    if (isListed) {
      const price = mutezToTz(new BigNumber(purchaseCurrency.price), purchaseCurrency.decimals);

      return `Buy for ${price} ${purchaseCurrency.symbol}`;
    }

    return 'Not listed';
  }, [purchaseCurrency.price]);

  const handleShare = useCallback(async () => {
    // Max link length: 7168 symbols, so we need to reduce the amount of data we send
    const urlEncodedData = encodeURIComponent(JSON.stringify(`${item.address}_${item.id}`));

    if (urlEncodedData.length > 7168) {
      return void showErrorToast({ title: 'Cannot share', description: 'Data isa too large' });
    }

    try {
      const dynamicLink = await getTempleDynamicLink(`/nft?jsonData=${urlEncodedData}`, {
        title: item.name,
        descriptionText: item.description,
        imageUrl: isDefined(item.thumbnailUri) ? formatImgUri(item.thumbnailUri, ImageResolutionEnum.MEDIUM) : undefined
      });

      await Share.share({
        message: SHARE_NFT_CONTENT + dynamicLink
      });

      await trackEvent(CollectibleModalSelectors.shareNFTSuccess, AnalyticsEventCategory.ButtonPress);
    } catch (e: any) {
      showErrorToast({
        description: e.message,
        isCopyButtonVisible: true,
        onPress: () => copyStringToClipboard(e.message)
      });
      await trackEvent(CollectibleModalSelectors.shareNFTFailed, AnalyticsEventCategory.ButtonPress, {
        errorMessage: e.message
      });
    }
  }, [item, trackEvent]);

  const navigateToCollectibleModal = () => navigate(ModalsEnum.CollectibleModal, { slug: getTokenSlug(item) });

  return (
    <View style={styles.collectibleContainer}>
      {isDefined(item.lowestAsk) && (
        <View style={styles.listed}>
          <Text style={styles.listedText}>LISTED</Text>
        </View>
      )}
      <View style={styles.collectible}>
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={navigateToCollectibleModal} activeOpacity={1}>
            <CollectibleIcon iconSize={CollectibleIconSize.BIG} collectible={item} size={formatSize(295)} />
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
          <OfferButton
            isHolder={isHolder}
            isOffersExisted={isOffersExisted}
            highestOffer={highestOffer}
            item={item}
            selectedPublicKeyHash={selectedPublicKeyHash}
            selectedRpc={selectedRpc}
            collectionContract={collectionContract}
          />
          <View>
            {isHolder || !!fxHashListed ? (
              <TouchableOpacity
                onPress={handleList}
                style={[
                  styles.sellButton,
                  conditionalStyle(!isAbleToList, styles.listButtonNotListed, styles.listButtonActive)
                ]}
                disabled={!isAbleToList}
              >
                <Text
                  style={[
                    styles.sellButtonText,
                    conditionalStyle(!isAbleToList, styles.listButtonDisabled, styles.listButtonActiveText)
                  ]}
                >
                  {!isAbleToList ? 'Listed' : 'List'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.sellButton,
                  conditionalStyle(isListed, styles.listButtonActive, styles.listButtonNotListed)
                ]}
                onPress={buyCollectible}
                disabled={!isListed}
              >
                <Text
                  style={[
                    styles.sellButtonText,
                    conditionalStyle(isListed, styles.listButtonActiveText, styles.listButtonDisabled)
                  ]}
                >
                  {buttonText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
});
