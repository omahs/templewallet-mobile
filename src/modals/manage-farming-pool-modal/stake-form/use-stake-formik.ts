import { useFormik } from 'formik';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { object as objectSchema, SchemaOf } from 'yup';

import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { FarmPoolTypeEnum } from 'src/enums/farm-pool-type.enum';
import { createAssetAmountWithMaxValidation } from 'src/form/validation/asset-amount';
import { useFarmTokens } from 'src/hooks/use-farm-tokens';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useFarmSelector, useStakeSelector } from 'src/store/farms/selectors';
import { navigateAction } from 'src/store/root-state.actions';
import { useSelectedRpcUrlSelector, useSlippageSelector } from 'src/store/settings/settings-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { emptyTezosLikeToken } from 'src/token/interfaces/token.interface';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { getNetworkGasTokenMetadata } from 'src/utils/network.utils';

import { EXPECTED_STABLESWAP_STAKING_GAS_EXPENSE } from '../constants';
import { createStakeOperationParams } from './create-stake-operation-params';

interface StakeFormValues {
  assetAmount: AssetAmountInterface;
}

export const useStakeFormik = (farmId: string, contractAddress: string) => {
  const farm = useFarmSelector(farmId, contractAddress);
  const { stakeTokens } = useFarmTokens(farm?.item);
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const gasToken = getNetworkGasTokenMetadata(selectedRpcUrl);
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const stake = useStakeSelector(contractAddress);
  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();
  const slippageTolerance = useSlippageSelector();

  const initialValues = useMemo(
    () => ({
      assetAmount: {
        asset: stakeTokens[0] ?? emptyTezosLikeToken,
        amount: undefined
      }
    }),
    [stakeTokens]
  );

  const validationSchema = useMemo<SchemaOf<StakeFormValues>>(
    () =>
      objectSchema().shape({
        assetAmount: createAssetAmountWithMaxValidation(
          gasToken,
          farm?.item.type === FarmPoolTypeEnum.STABLESWAP ? EXPECTED_STABLESWAP_STAKING_GAS_EXPENSE : undefined
        )
      }),
    [gasToken, farm?.item.type]
  );

  const handleSubmit = useCallback(
    async (values: StakeFormValues) => {
      const { asset, amount } = values.assetAmount;

      if (!isDefined(farm) || !isDefined(amount)) {
        return;
      }

      try {
        const opParams = await createStakeOperationParams(
          farm,
          amount,
          asset,
          tezos,
          selectedAccount,
          stake?.lastStakeId,
          slippageTolerance
        );

        dispatch(
          navigateAction(ModalsEnum.Confirmation, {
            type: ConfirmationTypeEnum.InternalOperations,
            opParams,
            testID: 'STAKE_TRANSACTION_SENT'
          })
        );
        trackEvent('STAKE_FORM_SUBMIT_SUCCESS', AnalyticsEventCategory.FormSubmitSuccess);
      } catch (error) {
        showErrorToastByError(error, undefined, true);
        trackEvent('STAKE_FORM_SUBMIT_FAIL', AnalyticsEventCategory.FormSubmitFail);
      }
    },
    [farm, tezos, selectedAccount, trackEvent, stake?.lastStakeId, dispatch, slippageTolerance]
  );

  return useFormik<StakeFormValues>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit
  });
};
