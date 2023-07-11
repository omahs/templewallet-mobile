import { BigNumber } from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { catchError, from, of } from 'rxjs';

import { estimateDivestOneCoinOutputs } from 'src/apis/quipuswap-staking';
import { Farm } from 'src/apis/quipuswap-staking/types';
import { useFarmTokens } from 'src/hooks/use-farm-tokens';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { getTaquitoRpcErrorMessage } from 'src/utils/get-taquito-rpc-error-message';
import { isDefined } from 'src/utils/is-defined';

import { WithdrawTokenOption } from './use-withdraw-formik';

export const useTokensOptions = (farm: Farm, lpAmount?: BigNumber) => {
  const { stakeTokens } = useFarmTokens(farm);
  const tezos = useReadOnlyTezosToolkit();
  const [atomicAmounts, setAtomicAmounts] = useState<(BigNumber | null | undefined)[]>();

  useEffect(() => {
    if (!isDefined(lpAmount) || lpAmount.isZero()) {
      setAtomicAmounts(farm.tokens.map(() => undefined));

      return;
    }

    const subscription = from(
      estimateDivestOneCoinOutputs(
        tezos,
        farm.stakedToken.contractAddress,
        farm.tokens.map((_, index) => index),
        lpAmount,
        farm.stakedToken.fa2TokenId ?? 0
      )
    )
      .pipe(
        catchError(error => {
          showErrorToast({ description: getTaquitoRpcErrorMessage(error) });

          return of(undefined);
        })
      )
      .subscribe(value => setAtomicAmounts(value));

    return () => subscription.unsubscribe();
  }, [farm, lpAmount, lpAmount, tezos]);

  const options = useMemo(() => {
    const shouldFilterOutFailingOptions = isDefined(atomicAmounts) && atomicAmounts.some(amount => amount !== null);

    return stakeTokens.reduce<WithdrawTokenOption[]>((acc, token, index) => {
      const amount = atomicAmounts?.[index];
      if ((!shouldFilterOutFailingOptions || amount !== null) && (!isDefined(amount) || amount.gt(0))) {
        acc.push({ token, amount: amount ?? undefined });
      }

      return acc;
    }, []);
  }, [stakeTokens, atomicAmounts]);

  return options;
};
