import { OpKind } from '@taquito/rpc';
import { ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { FormikProvider, isEmptyArray, useFormik } from 'formik';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { tokenEqualityFn } from 'src/components/token-dropdown/token-equality-fn';
import { FormAssetAmountInput } from 'src/form/form-asset-amount-input/form-asset-amount-input';
import { useBlockLevel } from 'src/hooks/use-block-level.hook';
import { TokensInputsEnum, useFilteredSwapTokensList } from 'src/hooks/use-filtered-swap-tokens.hook';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { useSwap } from 'src/hooks/use-swap.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { Route3SwapParamsResponse } from 'src/interfaces/route3.interface';
import { SwapFormValues } from 'src/interfaces/swap-asset.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { createEntity } from 'src/store/create-entity';
import { navigateAction } from 'src/store/root-state.actions';
import { useSlippageSelector } from 'src/store/settings/settings-selectors';
import { useSwapTokenBySlugSelector, useSwapTokensMetadataSelector } from 'src/store/swap/swap-selectors';
import { LoadableEntityState } from 'src/store/types';
import { useSelectedAccountSelector, useSelectedAccountTezosTokenSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { emptyTezosLikeToken, TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { fetchRoute3SwapParams, getRoute3TokenSymbol } from 'src/utils/route3.util';
import { mutezToTz, tzToMutez } from 'src/utils/tezos.util';

import { ROUTING_FEE_RATIO } from '../config';
import { getRoutingFeeTransferParams } from '../swap.util';
import { SwapAssetsButton } from './swap-assets-button/swap-assets-button';
import { SwapDisclaimer } from './swap-disclaimer/swap-disclaimer';
import { SwapExchangeRate } from './swap-exchange-rate/swap-exchange-rate';
import { swapFormValidationSchema } from './swap-form.form';
import { SwapFormSelectors } from './swap-form.selectors';
import { SwapRoute } from './swap-route/swap-route';

const selectionOptions = { start: 0, end: 0 };
const swapParamsDefault = createEntity({ input: undefined, output: undefined, chains: [] });

interface SwapFormProps {
  inputToken?: TokenInterface;
  outputToken?: TokenInterface;
}

export const SwapForm: FC<SwapFormProps> = ({ inputToken, outputToken }) => {
  const dispatch = useDispatch();
  const getSwapParams = useSwap();

  const { trackEvent } = useAnalytics();
  const slippageTolerance = useSlippageSelector();
  const tezosToken = useSelectedAccountTezosTokenSelector();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const blockLevel = useBlockLevel();
  const { isLoading } = useSwapTokensMetadataSelector();

  const [swapParamsLocal, setSwapParamsLocal] =
    useState<LoadableEntityState<Route3SwapParamsResponse>>(swapParamsDefault);

  const slippageRatio = useMemo(() => (100 - slippageTolerance) / 100, [slippageTolerance]);

  const handleSubmit = async () => {
    const inputAssetSlug = getTokenSlug(inputAssets.asset);
    const outputAssetSlug = getTokenSlug(outputAssets.asset);

    const analyticsProperties = {
      inputAsset: inputAssetSlug,
      outputAsset: outputAssetSlug
    };

    trackEvent('SWAP_FORM_SUBMIT', AnalyticsEventCategory.FormSubmit, analyticsProperties);

    if (!inputAssets.amount || !fromRoute3Token || !toRoute3Token) {
      return;
    }

    const routingFeeOpParams = await getRoutingFeeTransferParams(
      toRoute3Token,
      routingFeeAtomic,
      selectedAccount.publicKeyHash,
      tezos
    );

    const swapOpParams = await getSwapParams(
      fromRoute3Token,
      toRoute3Token,
      inputAssets.amount,
      minimumReceivedAmountAtomic,
      swapParamsLocal.data.chains
    );

    if (swapOpParams === undefined) {
      return;
    }

    const opParams: Array<ParamsWithKind> = [...swapOpParams, ...routingFeeOpParams].map(transferParams => ({
      ...transferParams,
      kind: OpKind.TRANSACTION
    }));

    if (opParams.length === 0) {
      showErrorToast({ description: 'Transaction params not loaded' });
    }

    dispatch(
      navigateAction(ModalsEnum.Confirmation, {
        type: ConfirmationTypeEnum.InternalOperations,
        opParams,
        testID: 'SWAP_TRANSACTION_SENT'
      })
    );
  };

  const formik = useFormik<SwapFormValues>({
    initialValues: {
      inputAssets: {
        asset: inputToken ?? tezosToken,
        amount: undefined
      },
      outputAssets: {
        asset: outputToken ?? emptyTezosLikeToken,
        amount: undefined
      }
    },
    validationSchema: swapFormValidationSchema,
    onSubmit: handleSubmit
  });

  const { values, setFieldValue, isValid, submitForm, submitCount } = formik;
  const { inputAssets, outputAssets } = values;

  const { routingFeeAtomic, minimumReceivedAmountAtomic } = useMemo(() => {
    if (isDefined(swapParamsLocal.data.output)) {
      const swapOutputAtomic = tzToMutez(swapParamsLocal.data.output, outputAssets.asset.decimals);
      const routingFeeAtomic = swapOutputAtomic
        .minus(swapOutputAtomic.multipliedBy(ROUTING_FEE_RATIO))
        .integerValue(BigNumber.ROUND_DOWN);
      const minimumReceivedAmountAtomic = swapOutputAtomic
        .minus(routingFeeAtomic)
        .multipliedBy(slippageRatio)
        .integerValue(BigNumber.ROUND_DOWN);

      return { routingFeeAtomic, minimumReceivedAmountAtomic };
    } else {
      const routingFeeAtomic = new BigNumber(0);
      const minimumReceivedAmountAtomic = new BigNumber(0);

      return { routingFeeAtomic, minimumReceivedAmountAtomic };
    }
  }, [swapParamsLocal.data.output, slippageRatio]);

  const inputAssetSlug = tokenEqualityFn(inputAssets.asset, emptyTezosLikeToken)
    ? undefined
    : getTokenSlug(inputAssets.asset);
  const outputAssetSlug = tokenEqualityFn(outputAssets.asset, emptyTezosLikeToken)
    ? undefined
    : getTokenSlug(outputAssets.asset);

  const fromRoute3Token = useSwapTokenBySlugSelector(inputAssetSlug ?? '');
  const toRoute3Token = useSwapTokenBySlugSelector(outputAssetSlug ?? '');

  const { filteredTokensList: fromTokensList, setSearchValue: setSearchValueFromTokens } = useFilteredSwapTokensList(
    TokensInputsEnum.From
  );
  const { filteredTokensList: toTokensList, setSearchValue: setSearchValueToTokens } = useFilteredSwapTokensList(
    TokensInputsEnum.To
  );

  const loadSwapParams = () => {
    if (!isDefined(fromRoute3Token) || !isDefined(toRoute3Token)) {
      return setSwapParamsLocal(swapParamsDefault);
    }

    if (isDefined(inputAssets.amount)) {
      setSwapParamsLocal(prevState => createEntity(prevState.data, true));

      fetchRoute3SwapParams({
        fromSymbol: getRoute3TokenSymbol(inputAssets.asset),
        toSymbol: getRoute3TokenSymbol(outputAssets.asset),
        amount: mutezToTz(inputAssets.amount, inputAssets.asset.decimals).toFixed() ?? '0'
      })
        .then(params => setSwapParamsLocal(createEntity(params)))
        .catch(() => setSwapParamsLocal(swapParamsDefault));
    } else {
      setSwapParamsLocal(swapParamsDefault);
    }
  };

  useEffect(() => {
    loadSwapParams();
  }, [blockLevel]);

  useEffect(() => {
    loadSwapParams();
  }, [inputAssets.asset, inputAssets.amount, outputAssets.asset]);

  useEffect(() => {
    setFieldValue('outputAssets', {
      asset: outputAssets.asset,
      amount:
        swapParamsLocal.data.output === undefined
          ? undefined
          : tzToMutez(swapParamsLocal.data.output, outputAssets.asset.decimals)
    });
  }, [swapParamsLocal.data.output]);

  const handleInputAssetsValueChange = useCallback(
    (newInputValue: AssetAmountInterface) => {
      const isEmptyToken = tokenEqualityFn(newInputValue.asset, emptyTezosLikeToken);
      if (getTokenSlug(newInputValue.asset) === outputAssetSlug && !isEmptyToken) {
        setFieldValue('outputAssets', { asset: emptyTezosLikeToken, amount: undefined });
      }
    },
    [outputAssetSlug, setFieldValue]
  );

  const handleOutputAssetsValueChange = useCallback(
    (newOutputValue: AssetAmountInterface) => {
      if (getTokenSlug(newOutputValue.asset) === inputAssetSlug) {
        setFieldValue('inputAssets', { asset: emptyTezosLikeToken, amount: undefined });
      }
    },
    [inputAssetSlug, setFieldValue, inputAssets.amount]
  );

  return (
    <FormikProvider value={formik}>
      <ScreenContainer>
        <Divider size={formatSize(8)} />

        <FormAssetAmountInput
          name="inputAssets"
          label="From"
          isSearchable
          maxButton
          assetsList={fromTokensList}
          isLoading={isLoading}
          setSearchValue={setSearchValueFromTokens}
          onValueChange={handleInputAssetsValueChange}
          testID={SwapFormSelectors.fromAssetAmountInput}
        />
        <SwapAssetsButton />

        <FormAssetAmountInput
          name="outputAssets"
          label="To"
          selectionOptions={selectionOptions}
          toUsdToggle={false}
          editable={false}
          isSearchable
          assetsList={toTokensList}
          isLoading={isLoading}
          setSearchValue={setSearchValueToTokens}
          onValueChange={handleOutputAssetsValueChange}
          testID={SwapFormSelectors.toAssetAmountInput}
        />
        <View>
          <SwapExchangeRate
            inputAsset={inputAssets.asset}
            slippageRatio={slippageRatio}
            outputAsset={outputAssets.asset}
            inputAmount={swapParamsLocal.data.input}
            outputAmount={swapParamsLocal.data.output}
          />
          <SwapRoute {...swapParamsLocal.data} />
        </View>

        <SwapDisclaimer />
      </ScreenContainer>

      <ButtonsFloatingContainer>
        <ButtonLargePrimary
          disabled={
            (submitCount !== 0 && !isValid) ||
            (submitCount !== 0 && isEmptyArray(swapParamsLocal.data.chains)) ||
            swapParamsLocal.isLoading
          }
          title={swapParamsLocal.isLoading ? 'Searching the best route' : 'Swap'}
          onPress={submitForm}
          testID={SwapFormSelectors.swapButton}
        />
      </ButtonsFloatingContainer>
    </FormikProvider>
  );
};
