import { isNonEmptyArray } from '@apollo/client/utilities';
import { RouteProp, useRoute } from '@react-navigation/core';
import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, Share, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { CollectibleIcon } from '../../components/collectible-icon/collectible-icon';
import { CollectibleIconSize } from '../../components/collectible-icon/collectible-icon.props';
import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ImageBlurOverlayThemesEnum } from '../../components/image-blur-overlay/image-blur-overlay';
import { LinkWithIcon } from '../../components/link-with-icon/link-with-icon';
import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { TextSegmentControl } from '../../components/segmented-control/text-segment-control/text-segment-control';
import { TouchableWithAnalytics } from '../../components/touchable-with-analytics';
import { ONE_MINUTE } from '../../config/fixed-times';
import { useBurnCollectible } from '../../hooks/use-burn-collectible.hook';
import { useBuyCollectible } from '../../hooks/use-buy-collectible.hook';
import { useCollectibleOwnerCheck } from '../../hooks/use-check-is-user-collectible-owner.hook';
import { useFetchCollectibleAttributes } from '../../hooks/use-fetch-collectible-attributes.hook';
import { useAuthorisedInterval } from '../../hooks/use-interval.hook';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { updateCollectibleDetailsAction } from '../../store/collectibles/collectibles-actions';
import { formatSize } from '../../styles/format-size';
import { showErrorToast } from '../../toast/error-toast.utils';
import { AnalyticsEventCategory } from '../../utils/analytics/analytics-event.enum';
import { usePageAnalytic, useAnalytics } from '../../utils/analytics/use-analytics.hook';
import { copyStringToClipboard } from '../../utils/clipboard.utils';
import { conditionalStyle } from '../../utils/conditional-style';
import { formatNumber } from '../../utils/format-price';
import { getTempleDynamicLink } from '../../utils/get-temple-dynamic-link.util';
import { ImageResolutionEnum, formatImgUri } from '../../utils/image.utils';
import { isDefined } from '../../utils/is-defined';
import { isString } from '../../utils/is-string';
import { openUrl } from '../../utils/linking.util';
import { objktCollectionUrl } from '../../utils/objkt-collection-url.util';
import { getTruncatedProps } from '../../utils/style.util';
import { CollectibleModalSelectors } from './collectible-modal.selectors';
import { useCollectibleModalStyles } from './collectible-modal.styles';
import { CollectibleAttributes } from './components/collectible-attributes/collectible-attributes';
import { CollectibleProperties } from './components/collectible-properties/collectible-properties';
import { COLLECTION_ICON_SIZE } from './constants';
import { getObjktProfileLink } from './utils/get-objkt-profile-link.util';

enum SegmentControlNamesEnum {
  Attributes = 'Attributes',
  Properties = 'Properties',
  Offers = 'Offers'
}

const SEGMENT_VALUES = [
  SegmentControlNamesEnum.Attributes,
  SegmentControlNamesEnum.Properties,
  SegmentControlNamesEnum.Offers
];

const SHARE_NFT_CONTENT = 'View NFT with Temple Wallet mobile: ';

export const CollectibleModal = () => {
  const { collectible } = useRoute<RouteProp<ModalsParamList, ModalsEnum.CollectibleModal>>().params;

  const { width } = Dimensions.get('window');
  const iconSize = width - formatSize(32);

  usePageAnalytic(ModalsEnum.CollectibleModal);

  const { trackEvent } = useAnalytics();
  const dispatch = useDispatch();

  const styles = useCollectibleModalStyles();

  const [segmentControlIndex, setSegmentControlIndex] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const {
    collection,
    creators,
    description,
    metadata,
    timestamp,
    royalties,
    editions,
    galleries,
    listingsActive,
    mime
  } = collectible;

  const isUserOwnerCurrentCollectible = useCollectibleOwnerCheck(collectible);
  const burnCollectible = useBurnCollectible(collectible);
  const { attributes, isLoading } = useFetchCollectibleAttributes(collectible);
  const { buyCollectible, purchaseCurrency, isLoadingDetails } = useBuyCollectible(collectible);

  useAuthorisedInterval(
    () => {
      if (!isUserOwnerCurrentCollectible) {
        dispatch(updateCollectibleDetailsAction.submit(collectible));
      }
    },
    ONE_MINUTE,
    [collectible, isUserOwnerCurrentCollectible]
  );

  const isAttributesExist = attributes.length > 0;

  const segmentValues = isAttributesExist ? SEGMENT_VALUES : SEGMENT_VALUES.slice(1, 3);

  const handleCollectionNamePress = () => openUrl(objktCollectionUrl(collectible.address));

  const submitButtonTitle = useMemo(() => {
    if (isLoadingDetails && !isUserOwnerCurrentCollectible) {
      return '';
    }

    if (isUserOwnerCurrentCollectible) {
      return 'Send';
    }

    if (!isNonEmptyArray(listingsActive)) {
      return 'Not listed';
    }

    return `Buy for ${formatNumber(purchaseCurrency.priceToDisplay)} ${purchaseCurrency.symbol}`;
  }, [isUserOwnerCurrentCollectible, purchaseCurrency, listingsActive, isLoadingDetails]);

  const collectionLogo = useMemo(() => {
    if (isDefined(collection) && isDefined(collection.logo)) {
      if (collection.logo.endsWith('.svg')) {
        return (
          <SvgUri
            uri={collection.logo}
            height={COLLECTION_ICON_SIZE}
            width={COLLECTION_ICON_SIZE}
            style={styles.collectionLogo}
          />
        );
      }

      return <FastImage source={{ uri: formatImgUri(collection.logo) }} style={styles.collectionLogo} />;
    }

    return null;
  }, [collection]);

  const handleShare = useCallback(async () => {
    try {
      const dynamicLink = await getTempleDynamicLink(
        `/nft?jsonData=${encodeURIComponent(JSON.stringify(collectible))}`,
        {
          title: collectible.name,
          descriptionText: description,
          imageUrl: formatImgUri(collectible.thumbnailUri, ImageResolutionEnum.MEDIUM)
        }
      );
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
  }, [description]);

  const propertiesIndex = segmentValues.findIndex(item => item === SegmentControlNamesEnum.Properties);
  const disabledOffers = segmentValues.findIndex(item => item === SegmentControlNamesEnum.Offers);

  const isPropertiesSelected = propertiesIndex === segmentControlIndex;

  const collectionName = useMemo(() => {
    if (isNonEmptyArray(galleries)) {
      return galleries[0].gallery.name;
    }

    if (isDefined(collection)) {
      return collection.name;
    }

    return 'Unkown collection';
  }, [galleries, collection]);

  return (
    <ScreenContainer
      fixedFooterContainer={{
        submitButton: (
          <ButtonLargePrimary
            disabled={(!isUserOwnerCurrentCollectible && !isNonEmptyArray(listingsActive)) || isLoadingDetails}
            title={submitButtonTitle}
            isLoading={isLoadingDetails}
            onPress={buyCollectible}
            testID={CollectibleModalSelectors.sendButton}
          />
        )
      }}
      isFullScreenMode={true}
      scrollEnabled={scrollEnabled}
    >
      <ModalStatusBar />

      <View>
        <CollectibleIcon
          collectible={collectible}
          mime={mime}
          objktArtifact={collectible.artifactUri}
          size={iconSize}
          iconSize={CollectibleIconSize.BIG}
          setScrollEnabled={setScrollEnabled}
          blurLayoutTheme={ImageBlurOverlayThemesEnum.fullView}
        />

        <Divider size={formatSize(12)} />

        <View style={styles.collectionContainer}>
          <TouchableOpacity onPress={handleCollectionNamePress} style={styles.collection}>
            {isDefined(collection) && isDefined(collection.logo) ? (
              collectionLogo
            ) : (
              <View style={[styles.collectionLogo, styles.logoFallBack]} />
            )}

            <Text numberOfLines={1} {...getTruncatedProps(styles.collectionName)}>
              {collectionName}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Icon name={IconNameEnum.Share} />
            <Divider size={formatSize(4)} />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.name}>{collectible.name}</Text>
        </View>

        {isString(description) && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{description}</Text>
          </View>
        )}

        {isNonEmptyArray(creators) && (
          <View style={styles.creatorsContainer}>
            <Text style={styles.creatorsText}>{creators.length > 1 ? 'Creators' : 'Creator'}:</Text>

            {creators.map(({ holder }, index) => (
              <LinkWithIcon
                key={holder.address}
                text={isString(holder.tzdomain) ? holder.tzdomain : holder.address}
                link={getObjktProfileLink(holder.address)}
                valueToClipboard={isString(holder.tzdomain) ? holder.tzdomain : holder.address}
                style={[
                  styles.linkWithIcon,
                  conditionalStyle(creators.length > 0 && creators.length !== index + 1, styles.marginRight)
                ]}
              />
            ))}
          </View>
        )}

        {!isLoading && (
          <TextSegmentControl
            selectedIndex={segmentControlIndex}
            values={segmentValues}
            onChange={setSegmentControlIndex}
            disabledIndexes={[disabledOffers]}
            style={styles.segmentControl}
          />
        )}

        {!isLoading && isPropertiesSelected && (
          <CollectibleProperties
            contract={collectible.address}
            tokenId={collectible.id}
            editions={editions}
            metadata={metadata}
            minted={timestamp}
            owned={collectible.balance}
            royalties={royalties}
          />
        )}

        {!isLoading && !isPropertiesSelected && isAttributesExist && <CollectibleAttributes attributes={attributes} />}

        {isUserOwnerCurrentCollectible && (
          <View style={styles.burnContainer}>
            <TouchableWithAnalytics
              Component={TouchableOpacity}
              onPress={burnCollectible}
              style={styles.burnButton}
              testID={CollectibleModalSelectors.burnButton}
            >
              <Text style={styles.burnButtonText}>Burn Nft</Text>
              <Icon name={IconNameEnum.Burn} />
            </TouchableWithAnalytics>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
};
