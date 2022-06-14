import { VisibilityEnum } from '../enums/visibility.enum';
import { createEntity } from '../store/create-entity';
import { LoadableEntityState } from '../store/types';
import { HIDDEN_WHITELIST_TOKENS, MAINNET_TOKENS_METADATA } from '../token/data/tokens-metadata';
import { AccountTokenInterface } from '../token/interfaces/account-token.interface';
import { getTokenSlug } from '../token/utils/token.utils';
import { ActivityGroup } from './activity.interface';

export interface AccountStateInterface {
  isVisible: boolean;
  tezosBalance: LoadableEntityState<string>;
  tokensList: AccountTokenInterface[];
  removedTokensList: string[];
  activityGroups: LoadableEntityState<ActivityGroup[]>;
  pendingActivities: ActivityGroup[];
}

export const initialAccountState: AccountStateInterface = {
  isVisible: true,
  tezosBalance: createEntity('0'),
  tokensList: [
    ...MAINNET_TOKENS_METADATA.map(token => ({
      slug: getTokenSlug(token),
      balance: '0',
      visibility: VisibilityEnum.Visible
    })),
    ...HIDDEN_WHITELIST_TOKENS.map(token => ({
      slug: getTokenSlug(token),
      balance: '0',
      visibility: VisibilityEnum.InitiallyHidden
    }))
  ],
  removedTokensList: [],
  activityGroups: createEntity([]),
  pendingActivities: []
};

export const emptyAccountState: AccountStateInterface = {
  isVisible: true,
  tezosBalance: createEntity('0'),
  tokensList: [],
  removedTokensList: [],
  activityGroups: createEntity([]),
  pendingActivities: []
};
