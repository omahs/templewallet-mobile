import React, { FC } from 'react';
import { StyleProp, Text, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { formatSize } from '../../styles/format-size';
import { openUrl } from '../../utils/linking.util';
import { getTruncatedProps } from '../../utils/style.util';
import { isValidAddress } from '../../utils/tezos.util';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useLinkWithIconStyles } from './link-with-icon.styles';

interface Props {
  text: string;
  iconName?: IconNameEnum;
  userAddress: string;
  style?: StyleProp<ViewStyle>;
}

const objktProfileLink = (userAddress: string) => `https://objkt.com/profile/${userAddress}/created`;

export const LinkWithIcon: FC<Props> = ({ text, iconName = IconNameEnum.ExternalLink, userAddress, style }) => {
  const styles = useLinkWithIconStyles();

  const isAddress = isValidAddress(text);

  const handleLinkPress = () => openUrl(objktProfileLink(userAddress));

  const textProps = getTruncatedProps([styles.container, styles.text], isAddress ? 'middle' : 'tail');

  return (
    <TouchableOpacity onPress={handleLinkPress} style={[styles.root, style]}>
      <Text {...textProps}>{text}</Text>
      <Icon name={iconName} size={formatSize(24)} color="blue" style={styles.container} />
    </TouchableOpacity>
  );
};
