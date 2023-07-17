import { createReducer } from '@reduxjs/toolkit';

import { createEntity } from '../create-entity';
import {
  updateCollectibleDetailsAction,
  loadCollectiblesDetailsActions,
  loadCollectibleDetailsActions
} from './collectibles-actions';
import { CollectiblesState, collectiblesInitialState } from './collectibles-state';

export const collectiblesReducers = createReducer<CollectiblesState>(collectiblesInitialState, builder => {
  builder.addCase(loadCollectiblesDetailsActions.submit, state => {
    state.details.isLoading = true;
  });
  builder.addCase(loadCollectiblesDetailsActions.success, (state, { payload: detailsFromObjkt }) => ({
    ...state,
    details: createEntity(
      {
        ...state.details.data,
        ...detailsFromObjkt
      },
      false
    )
  }));
  builder.addCase(loadCollectiblesDetailsActions.fail, state => {
    state.details.isLoading = false;
  });

  builder.addCase(loadCollectibleDetailsActions.success, (state, { payload }) => ({
    ...state,
    details: createEntity({
      ...state.details.data,
      ...payload
    })
  }));

  builder.addCase(updateCollectibleDetailsAction.submit, state => {
    state.details.isLoading = true;
  });
  builder.addCase(updateCollectibleDetailsAction.success, (state, { payload }) => {
    return {
      ...state,
      details: createEntity(
        {
          ...state.details.data,
          ...payload
        },
        false
      )
    };
  });
  builder.addCase(updateCollectibleDetailsAction.fail, state => {
    state.details.isLoading = false;
  });
});