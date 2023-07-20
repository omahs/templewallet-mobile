import { SingleFarmResponse } from 'src/apis/quipuswap-staking/types';
import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export type LastUserStakeInterface = Record<string, UserStakeValueInterface>;
export interface FarmsState {
  allFarms: LoadableEntityState<Array<SingleFarmResponse>>;
  lastStakes: LoadableEntityState<LastUserStakeInterface>;
  sortField: EarnOpportunitiesSortFieldEnum;
}

export const farmsInitialState: FarmsState = {
  lastStakes: createEntity({}),
  allFarms: createEntity([]),
  sortField: EarnOpportunitiesSortFieldEnum.Default
};
