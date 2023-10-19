import React, { memo } from 'react';
import FastImage from 'react-native-fast-image';

import { AssetMediaURIs } from 'src/utils/assets/types';
import { isImgUriDataUri } from 'src/utils/image.utils';

import { ActivityIndicator } from '../activity-indicator';
import { AnimatedSvg } from '../animated-svg';
import { BrokenImage } from '../broken-image';
import { useCollectibleImageStyles } from './styles';
import { useCollectibleImagesStack } from './use-images-stack';

interface Props extends AssetMediaURIs {
  slug: string;
  size: number;
  isFullView?: boolean;
}

export const CollectibleImage = memo<Props>(
  ({ slug, artifactUri, displayUri, thumbnailUri, size, isFullView = false }) => {
    const styles = useCollectibleImageStyles();

    const { src, isStackFailed, isLoading, onSuccess, onFail } = useCollectibleImagesStack(
      slug,
      artifactUri,
      displayUri,
      thumbnailUri,
      isFullView
    );

    if (isStackFailed) {
      return <BrokenImage isBigIcon={isFullView} style={styles.brokenImage} />;
    }

    if (src && isImgUriDataUri(src)) {
      return <AnimatedSvg style={styles.image} dataUri={src} onError={onFail} onLoadEnd={onSuccess} />;
    }

    if (slug === 'KT18kkvmUoefkdok5mrjU6fxsm7xmumy1NEw_5171') {
      console.log('artifactUri:', artifactUri);
      console.log('displayUri:', displayUri);
      console.log('thumbnailUri:', thumbnailUri);
      console.log('SRC:', src);
    }

    return (
      <>
        <FastImage
          style={[styles.image, { height: size, width: size }]}
          source={{ uri: src }}
          resizeMode="contain"
          onError={onFail}
          onLoad={onSuccess}
        />

        {isLoading ? <ActivityIndicator size={isFullView ? 'large' : 'small'} /> : null}
      </>
    );
  }
);
