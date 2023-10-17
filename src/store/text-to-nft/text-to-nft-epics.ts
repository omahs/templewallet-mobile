import { combineEpics } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getStableDiffusionOrders } from 'src/apis/stable-diffusion';

import { withSelectedAccount } from '../../utils/wallet.utils';
import { RootState } from '../types';
import { loadTextToNftOrdersActions } from './text-to-nft-actions';
import { withAccessToken } from './text-to-nft-state.utils';

const loadTextToNftOrdersEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadTextToNftOrdersActions.submit),
    withSelectedAccount(state$),
    withAccessToken(state$),
    switchMap(([[, account], accessToken]) =>
      from(getStableDiffusionOrders(accessToken)).pipe(
        map(orders => loadTextToNftOrdersActions.success({ accountPkh: account.publicKeyHash, orders })),
        catchError(error =>
          of(loadTextToNftOrdersActions.fail({ accountPkh: account.publicKeyHash, error: error.message }))
        )
      )
    )
  );

export const textToNftEpics = combineEpics(loadTextToNftOrdersEpic);
