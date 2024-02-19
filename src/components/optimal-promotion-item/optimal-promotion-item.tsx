import React, { FC, useEffect, useRef, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { PromotionItem } from 'src/components/promotion-item/promotion-item';
import { EmptyFn } from 'src/config/general';
import { useAdTemporaryHiding } from 'src/hooks/use-ad-temporary-hiding.hook';
import { TestIdProps } from 'src/interfaces/test-id.props';
import {
  useIsPartnersPromoEnabledSelector,
  usePartnersPromoLoadingSelector,
  usePartnersPromoSelector
} from 'src/store/partners-promotion/partners-promotion-selectors';
import { useTimeout } from 'src/utils/hooks';
import { useIsEmptyPromotion } from 'src/utils/optimal.utils';

import { TextPromotionItem } from '../text-promotion-item/text-promotion-item';

import { OptimalPromotionVariantEnum } from './optimal-promotion-variant.enum';

interface Props extends TestIdProps {
  id: string;
  style?: StyleProp<ViewStyle>;
  shouldShowCloseButton?: boolean;
  variant?: OptimalPromotionVariantEnum;
  onImageError?: EmptyFn;
  onEmptyPromotionReceived?: EmptyFn;
}

export const OptimalPromotionItem: FC<Props> = ({
  testID,
  id,
  style,
  shouldShowCloseButton = true,
  variant = OptimalPromotionVariantEnum.Image,
  onImageError,
  onEmptyPromotionReceived
}) => {
  const partnersPromotion = usePartnersPromoSelector();
  const partnersPromotionLoading = usePartnersPromoLoadingSelector();
  const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();
  const { isHiddenTemporarily, hidePromotion } = useAdTemporaryHiding(id);
  const prevIsLoadingRef = useRef(partnersPromotionLoading);
  const [shouldPreventShowingPrevAd, setShouldPreventShowingPrevAd] = useState(true);

  const promotionIsEmpty = useIsEmptyPromotion(partnersPromotion);

  useEffect(() => {
    if (prevIsLoadingRef.current && !partnersPromotionLoading) {
      setShouldPreventShowingPrevAd(false);
    }
  }, [partnersPromotionLoading]);
  useTimeout(() => setShouldPreventShowingPrevAd(false), 2000);

  useEffect(() => {
    if (partnersPromotionEnabled && onEmptyPromotionReceived && promotionIsEmpty && !shouldPreventShowingPrevAd) {
      onEmptyPromotionReceived();
    }
  }, [partnersPromotionEnabled, onEmptyPromotionReceived, promotionIsEmpty, shouldPreventShowingPrevAd]);

  if (!partnersPromotionEnabled || promotionIsEmpty || isHiddenTemporarily) {
    return null;
  }

  if (variant === OptimalPromotionVariantEnum.Text) {
    return (
      <TextPromotionItem
        testID={testID}
        content={partnersPromotion?.copy?.content ?? 'fallback'}
        headline={partnersPromotion?.copy?.headline ?? 'fallback'}
        imageUri={partnersPromotion.image}
        link={partnersPromotion.link}
        loading={partnersPromotionLoading || shouldPreventShowingPrevAd}
        shouldShowCloseButton={shouldShowCloseButton}
        style={style}
        onClose={hidePromotion}
        onImageError={onImageError}
      />
    );
  }

  return (
    <PromotionItem
      testID={testID}
      source={{ uri: partnersPromotion.image }}
      link={partnersPromotion.link}
      loading={partnersPromotionLoading}
      shouldShowAdBage
      shouldShowCloseButton={shouldShowCloseButton}
      style={style}
      onCloseButtonClick={hidePromotion}
      onImageError={onImageError}
    />
  );
};
