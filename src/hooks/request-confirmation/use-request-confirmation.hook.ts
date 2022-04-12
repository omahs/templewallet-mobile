import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { EMPTY, ObservableInput, of, Subject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { Action } from '../../interfaces/action.interface';
import { showErrorToast } from '../../toast/toast.utils';
import { isDefined } from '../../utils/is-defined';

export const useRequestConfirmation = <T, O extends ObservableInput<Action>>(
  project: (value: T, index: number) => O
) => {
  const dispatch = useDispatch();

  const isConfirmed = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const confirmRequest$ = useMemo(() => new Subject<T>(), []);

  useEffect(() => {
    const subscription = confirmRequest$
      .pipe(
        tap(() => setIsLoading(true)),
        switchMap(value =>
          of(value).pipe(
            switchMap(project),
            tap(() => setIsLoading(false)),
            catchError(err => {
              setIsLoading(false);
              if (isDefined(err.message) && typeof err.message === 'string') {
                if (String(err.message).startsWith('JSON Parse error: Unexpected token')) {
                  showErrorToast({ description: 'Transaction is likely to fail' });
                } else {
                  showErrorToast({ description: err.message });
                }
              }

              return EMPTY;
            })
          )
        )
      )
      .subscribe(action => {
        isConfirmed.current = true;

        dispatch(action);
      });

    return () => subscription.unsubscribe();
  }, [confirmRequest$, project]);

  return {
    confirmRequest: (value: T) => confirmRequest$.next(value),
    isLoading,
    isConfirmed
  };
};
