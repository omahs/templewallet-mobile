import { RouteProp, useRoute } from '@react-navigation/native';
import { FormikProvider } from 'formik';
import { noop } from 'lodash-es';
import React, { FC, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { PoolType } from 'src/apis/quipuswap/types';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { ModalButtonsContainer } from 'src/components/modal-buttons-container/modal-buttons-container';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { QuestionAccordion } from 'src/components/question-accordion';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { FormCheckbox } from 'src/form/form-checkbox';
import { useBlockLevel } from 'src/hooks/use-block-level.hook';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { loadSingleFarmActions, loadSingleFarmStakeActions } from 'src/store/farms/actions';
import {
  useFarmSelector,
  useFarmsLoadingSelector,
  useStakeIsInitializedSelector,
  useStakeLoadingSelector,
  useStakeSelector
} from 'src/store/farms/selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { formatTimespan, SECONDS_IN_DAY } from 'src/utils/date.utils';
import { isDefined } from 'src/utils/is-defined';

import { ManageFarmingPoolModalSelectors } from './selectors';
import { StakeForm } from './stake-form';
import { useStakeFormik } from './stake-form/use-stake-formik';
import { useManageFarmingPoolModalStyles } from './styles';

const risksPoints = [
  'The value of a yield-generating asset may not perfectly track its reference value, however with the conversion rights, the holder has a protection against significant price differences that may occur.',
  'There is a risk that the collateral is not managed adequately and, in extreme scenarios, the protection via the conversion can no longer be kept. Such situations may require a liquidation of YOU staked tokens.',
  'Liquidity providers consider the risk of impermanent loss, however, due to the nature of the youves flat-curves (CFMM) and the highly-correlated asset pairs, such risks are much lower than on constant product market maker (CPMM) DEXs with uncorrelated pairs.'
];

export const ManageFarmingPoolModal: FC = () => {
  const params = useRoute<RouteProp<ModalsParamList, ModalsEnum.ManageFarmingPool>>().params;
  const styles = useManageFarmingPoolModalStyles();
  const blockLevel = useBlockLevel();
  const prevBlockLevelRef = useRef<number | undefined>(-1);
  const dispatch = useDispatch();

  const farm = useFarmSelector(params.id, params.version);
  const farmIsLoading = useFarmsLoadingSelector();
  const farmLevel = farm?.blockInfo.level;
  const stake = useStakeSelector(params.id, params.version);
  const stakeIsInitialized = useStakeIsInitializedSelector(params.id, params.version);
  const stakeIsLoading = useStakeLoadingSelector(params.id, params.version);
  const vestingPeriodSeconds = Number(farm?.item.vestingPeriodSeconds ?? 0);
  const formattedVestingPeriod = formatTimespan(vestingPeriodSeconds * 1000, { roundingMethod: 'ceil', unit: 'day' });

  const pageIsLoading =
    (farmIsLoading && !isDefined(farm)) || !stakeIsInitialized || (stakeIsLoading && !isDefined(stake));

  const stakeFormik = useStakeFormik(params.id, params.version);
  const { errors: formErrors, submitForm, isSubmitting } = stakeFormik;

  useEffect(() => {
    if (prevBlockLevelRef.current === blockLevel || (isDefined(farmLevel) && farmLevel === blockLevel)) {
      return;
    }

    dispatch(loadSingleFarmActions.submit(params));
    prevBlockLevelRef.current = blockLevel;
  }, [blockLevel, farmLevel, dispatch, params]);

  useEffect(() => {
    if (isDefined(farm)) {
      dispatch(loadSingleFarmStakeActions.submit(farm.item));
    }
  }, [farm]);

  usePageAnalytic(ModalsEnum.ManageFarmingPool);

  const disabledTabSwitcherIndices = useMemo(() => (isDefined(stake?.stakeId) ? [] : [1]), [stake]);

  return (
    <>
      <ModalStatusBar />
      <ScreenContainer isFullScreenMode>
        <TextSegmentControl
          disabledValuesIndices={disabledTabSwitcherIndices}
          selectedIndex={0}
          values={['Deposit', 'Withdraw']}
          onChange={noop}
          testID={ManageFarmingPoolModalSelectors.tabSwitch}
        />
        {pageIsLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={formatSize(32)} />
          </View>
        )}
        {!pageIsLoading && <Divider size={formatSize(16)} />}
        {!pageIsLoading && farm?.item.type === PoolType.STABLESWAP && (
          <FormikProvider value={stakeFormik}>
            <View style={styles.content}>
              <StakeForm farm={farm} formik={stakeFormik} />
              <Divider size={formatSize(16)} />
              {vestingPeriodSeconds > SECONDS_IN_DAY && (
                <>
                  <Disclaimer title="Long-term rewards vesting">
                    <Text style={styles.disclaimerDescriptionText}>
                      You can pick up your assets at any time, but the reward will be distributed within{' '}
                      <Text style={styles.emphasized}>{formattedVestingPeriod}</Text> of staking. Which means that if
                      you pick up sooner you won't get the entire reward.
                    </Text>
                  </Disclaimer>
                  <Divider size={formatSize(16)} />
                </>
              )}
              <QuestionAccordion
                question="What are the main risks?"
                testID={ManageFarmingPoolModalSelectors.mainRisksQuestion}
              >
                {risksPoints.map((point, index) => (
                  <React.Fragment key={index}>
                    <View style={styles.listItem}>
                      <Text style={styles.listItemBullet}>•</Text>
                      <Text style={styles.listItemText}>{point}</Text>
                    </View>
                    {index !== risksPoints.length - 1 && <Divider size={formatSize(5)} />}
                  </React.Fragment>
                ))}
              </QuestionAccordion>
              <Divider size={formatSize(16)} />
              <FormCheckbox
                testID={ManageFarmingPoolModalSelectors.acceptRisksCheckbox}
                size={formatSize(20)}
                name="acceptRisks"
              >
                <Text style={styles.acceptRisksText}>Accept risks</Text>
              </FormCheckbox>
            </View>
          </FormikProvider>
        )}
        {!pageIsLoading && isDefined(farm) && farm.item.type !== PoolType.STABLESWAP && (
          <View style={styles.content}>
            <Text style={styles.notSupportedText}>Non-stableswap farms are not supported yet</Text>
          </View>
        )}
      </ScreenContainer>
      <ModalButtonsContainer>
        <ButtonLargePrimary
          title="Deposit"
          disabled={
            pageIsLoading ||
            farm?.item.type !== PoolType.STABLESWAP ||
            Object.keys(formErrors).length > 0 ||
            isSubmitting
          }
          onPress={submitForm}
          testID={ManageFarmingPoolModalSelectors.depositButton}
        />
      </ModalButtonsContainer>
    </>
  );
};
