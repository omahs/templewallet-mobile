import { isEqual } from 'lodash-es';
import React, { FC, memo } from 'react';
import { View, Text } from 'react-native';

import { AvatarImage } from 'src/components/avatar-image/avatar-image';
import { Divider } from 'src/components/divider/divider';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { WalletAddress } from 'src/components/wallet-address/wallet-address';
import { useBakerByAddressSelector } from 'src/store/baking/baking-selectors';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { truncateLongAddress } from 'src/utils/address.utils';
import { isDefined } from 'src/utils/is-defined';
import { tzktUrl } from 'src/utils/linking.util';

import {
  useActivityCommonStyles,
  useActivityDetailsStyles,
  useActivityGroupItemStyles
} from '../activity-group-item.styles';
import { ActivityGroupItemSelectors } from '../selectors';
import { AbstractItem } from './abstract-item';
import { ActivityItemProps } from './item.props';

export const Delegate: FC<ActivityItemProps> = memo(({ activity }) => {
  return (
    <AbstractItem
      face={<Face address={activity.from.address} />}
      details={<Details hash={activity.hash} address={activity.from.address} />}
      status={activity.status}
      timestamp={activity.timestamp}
    />
  );
}, isEqual);

const Face: FC<{ address: string }> = ({ address }) => {
  const styles = useActivityGroupItemStyles();
  const commonStyles = useActivityCommonStyles();

  const baker = useBakerByAddressSelector(address);

  return (
    <View style={[commonStyles.row, commonStyles.itemsCenter]}>
      {isDefined(baker) && isDefined(baker.logo) ? (
        <AvatarImage size={formatSize(36)} uri={baker.logo} />
      ) : (
        <RobotIcon size={formatSize(36)} seed={address} style={styles.robotBackground} />
      )}

      <Divider size={formatSize(10)} />
      <View style={styles.flex}>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.oprationTitle}>Delegate</Text>
        </View>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.oprationSubtitle}>To: {baker?.name ?? truncateLongAddress(address)}</Text>
        </View>
      </View>
    </View>
  );
};

const Details: FC<{ hash: string; address: string }> = ({ hash, address }) => {
  const styles = useActivityDetailsStyles();
  const commonStyles = useActivityCommonStyles();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  return (
    <>
      <View style={[styles.itemWrapper, styles.border, commonStyles.itemsCenter]}>
        <Text style={styles.text}>To:</Text>
        <View style={commonStyles.row}>
          <WalletAddress isLocalDomainNameShowing publicKeyHash={address} />
          <Divider size={formatSize(4)} />
          <ExternalLinkButton url={tzktUrl(selectedRpcUrl, address)} testID={ActivityGroupItemSelectors.externalLink} />
        </View>
      </View>
      <View style={styles.itemWrapper}>
        <Text style={styles.text}>TxHash:</Text>
        <View style={commonStyles.row}>
          <PublicKeyHashText longPress publicKeyHash={hash} testID={ActivityGroupItemSelectors.operationHash} />
          <Divider size={formatSize(4)} />
          <ExternalLinkButton url={tzktUrl(selectedRpcUrl, hash)} testID={ActivityGroupItemSelectors.externalLink} />
        </View>
      </View>
    </>
  );
};
