import React, { FC, memo, useMemo } from 'react';
import { ImageRequireSource, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { Divider } from 'src/components/divider/divider';
import { DropdownListItemComponent } from 'src/components/dropdown/dropdown';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { StaticTokenIcon } from 'src/components/static-token-icon/static-token-icon';
import { TopUpInputTypeEnum } from 'src/enums/top-up-input-type.enum';
import { TopUpInputInterface } from 'src/interfaces/topup.interface';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';
import { jsonEqualityFn } from 'src/utils/store.utils';
import { getTruncatedProps } from 'src/utils/style.util';

import { getProperNetworkFullName } from '../../crypto/exolix/steps/initial-step/initial-step.utils';
import { useTopUpTokenDropdownItemStyles } from './top-up-token-dropdown-item.styles';

const preloadedTokensIcons: Record<string, ImageRequireSource> = {
  CNY: require('../../assets/cny.png'),
  EGP: require('../../assets/egp.png'),
  INR: require('../../assets/inr.png'),
  JOD: require('../../assets/jod.png'),
  KES: require('../../assets/kes.png'),
  KRW: require('../../assets/krw.png'),
  KWD: require('../../assets/kwd.png'),
  PHP: require('../../assets/php.png'),
  ZAR: require('../../assets/zar.png')
};

interface Props {
  token?: TopUpInputInterface;
  actionIconName?: IconNameEnum;
  iconSize?: number;
  isDropdownClosed?: boolean;
}

export const TopUpTokenDropdownItem: FC<Props> = memo(
  ({ token, actionIconName, iconSize = formatSize(40), isDropdownClosed = false }) => {
    const styles = useTopUpTokenDropdownItemStyles();

    const tokenIcon = useMemo(() => {
      if (token?.code === 'UAH' && token?.type === TopUpInputTypeEnum.Fiat) {
        return <Icon name={IconNameEnum.Uah} size={iconSize} />;
      }

      if (token?.code === 'XTZ') {
        return <Icon name={IconNameEnum.TezToken} size={iconSize} />;
      }

      if (isDefined(token) && token.code in preloadedTokensIcons) {
        return (
          <FastImage
            source={preloadedTokensIcons[token.code]}
            style={{ width: iconSize, height: iconSize, borderRadius: iconSize / 2 }}
          />
        );
      }

      return <StaticTokenIcon uri={token?.icon} size={iconSize} />;
    }, [token]);
    const codeFromToken = token?.codeToDisplay ?? token?.code;
    const tokenCodeToDisplay = codeFromToken === 'XTZ' ? 'TEZ' : codeFromToken;

    return (
      <View style={[styles.row, styles.height40]}>
        {tokenIcon}

        <Divider size={formatSize(8)} />

        <View style={styles.infoContainer}>
          <View style={[styles.row, styles.justifySpaceBetween]}>
            <Text {...getTruncatedProps(token?.name === '' ? styles.textRegular17 : styles.textRegular15)}>
              {tokenCodeToDisplay}
            </Text>
            <Divider size={formatSize(8)} />
            {!isDropdownClosed && token?.type !== TopUpInputTypeEnum.Fiat && (
              <Text {...getTruncatedProps([styles.textRegular11, isDropdownClosed && styles.colorGray1])}>
                {token?.name}
              </Text>
            )}
            {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
          </View>

          {token?.name !== '' && (
            <View style={styles.row}>
              <Text {...getTruncatedProps(styles.textRegular13)}>
                {isDropdownClosed &&
                  token?.type === TopUpInputTypeEnum.Crypto &&
                  (token?.networkShortName ?? token?.networkFullName)}
                {!isDropdownClosed && token?.type === TopUpInputTypeEnum.Crypto && getProperNetworkFullName(token)}
                {token?.type === TopUpInputTypeEnum.Fiat && token?.name}
              </Text>

              <Divider size={formatSize(4)} />
            </View>
          )}
        </View>
      </View>
    );
  },
  jsonEqualityFn
);

export const renderTopUpTokenListItem: DropdownListItemComponent<TopUpInputInterface> = ({ item, isSelected }) => (
  <TopUpTokenDropdownItem token={item} actionIconName={isSelected ? IconNameEnum.Check : undefined} />
);
