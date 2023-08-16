import { Activity, ActivityType } from '@temple-wallet/transactions-parser';
import React, { FC } from 'react';

import { ActivityAmount } from 'src/interfaces/non-zero-amounts.interface';

import { BakingRewards } from './baking-rewards';
import { Delegation } from './delegation';
import { Receive } from './receive';
import { Send } from './send';
import { UnknownInfo } from './unknown-info';

export const Info: FC<{ activity: Activity; nonZeroAmounts: Array<ActivityAmount> }> = ({
  activity,
  nonZeroAmounts
}) => {
  switch (activity.type) {
    case ActivityType.Send:
      return <Send address={activity.to.address} nonZeroAmounts={nonZeroAmounts} />;
    case ActivityType.Recieve:
      return <Receive address={activity.from.address} nonZeroAmounts={nonZeroAmounts} />;
    case ActivityType.BakingRewards:
      return <BakingRewards address={activity.from.address} nonZeroAmounts={nonZeroAmounts} />;
    case ActivityType.Delegation:
      return <Delegation address={activity.to?.address} />;

    default:
      return <UnknownInfo nonZeroAmounts={nonZeroAmounts} />;
  }
};
