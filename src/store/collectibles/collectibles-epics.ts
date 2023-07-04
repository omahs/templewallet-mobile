import { combineEpics } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { loadAllCollectiblesDetails$ } from '../../utils/collectibles.utils';
import { loadCollectiblesDetailsActions } from './collectibles-actions';

const loadCollectiblesDetailsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadCollectiblesDetailsActions.submit),
    toPayload(),
    switchMap(account =>
      loadAllCollectiblesDetails$(account).pipe(
        map(collectiblesDetails => loadCollectiblesDetailsActions.success(collectiblesDetails)),
        catchError(err => of(loadCollectiblesDetailsActions.fail(err.message)))
      )
    )
  );

export const collectiblesEpics = combineEpics(loadCollectiblesDetailsEpic);
