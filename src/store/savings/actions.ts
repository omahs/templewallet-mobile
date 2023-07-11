import { createAction } from '@reduxjs/toolkit';

import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';

import { createActions } from '../create-actions';
import { UserStakeInterface } from './state';

export const loadAllSavingsAndStakesAction = createAction<void>('savings/LOAD_ALL_SAVINGS_AND_STAKES');

export const loadAllSavingsActions = createActions<void, Array<SavingsItem>, void>('savings/LOAD_ALL_FARMS');

export const loadAllStakesActions = createActions<Array<SavingsItem>, UserStakeInterface, void>(
  'savings/LOAD_ALL_STAKES'
);

export const selectSavingsSortValueAction = createAction<EarnOpportunitiesSortFieldEnum>('savings/SELECT_SORT_VALUE');