import { ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import React, { FC, useCallback, useMemo } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { getHarvestAssetsTransferParams } from 'src/apis/quipuswap-staking';
import { FarmVersionEnum, PoolType, SingleFarmResponse } from 'src/apis/quipuswap-staking/types';
import { Bage } from 'src/components/bage/bage';
import { Button } from 'src/components/button/button';
import { Divider } from 'src/components/divider/divider';
import { FarmTokens } from 'src/components/farm-tokens/farm-tokens';
import { FormattedAmount } from 'src/components/formatted-amount';
import { HorizontalBorder } from 'src/components/horizontal-border';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { useFarmTokens } from 'src/hooks/use-farm-tokens';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { UserStakeValueInterface } from 'src/store/farms/state';
import { navigateAction } from 'src/store/root-state.actions';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { aprToApy } from 'src/utils/earn.utils';
import { doAfterConfirmation } from 'src/utils/farm.utils';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';

import { useButtonPrimaryStyleConfig } from '../button-primary.styles';
import { DEFAULT_AMOUNT, DEFAULT_DECIMALS } from '../constants';
import { useButtonSecondaryStyleConfig, useFarmItemStyles } from './farm-item.styles';
import { FarmItemSelectors } from './selectors';

interface Props {
  farm: SingleFarmResponse;
  lastStakeRecord?: UserStakeValueInterface;
}

const DEFAULT_EXHANGE_RATE = 1;
const SECONDS_IN_DAY = 86400;

export const FarmItem: FC<Props> = ({ farm, lastStakeRecord }) => {
  const colors = useColors();
  const styles = useFarmItemStyles();
  const buttonPrimaryStylesConfig = useButtonPrimaryStyleConfig();
  const buttonSecondaryStylesConfig = useButtonSecondaryStyleConfig();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const tezos = useReadOnlyTezosToolkit();
  const { rewardToken, stakeTokens } = useFarmTokens(farm.item);
  const fiatToUsdRate = useFiatToUsdRateSelector();
  const { trackEvent } = useAnalytics();

  const apr = useMemo(
    () => (isDefined(farm.item.apr) ? aprToApy(Number(farm.item.apr)).toFixed(DEFAULT_DECIMALS) : '---'),
    [farm.item.apr]
  );

  const depositAmountAtomic = useMemo(
    () =>
      mutezToTz(
        new BigNumber(lastStakeRecord?.depositAmountAtomic ?? DEFAULT_AMOUNT),
        farm.item.stakedToken.metadata.decimals
      )
        .multipliedBy(farm.item.depositExchangeRate ?? DEFAULT_EXHANGE_RATE)
        .multipliedBy(fiatToUsdRate ?? DEFAULT_EXHANGE_RATE),
    [lastStakeRecord?.depositAmountAtomic, fiatToUsdRate, farm.item]
  );

  const claimableRewardsAtomic = useMemo(
    () =>
      mutezToTz(
        new BigNumber(lastStakeRecord?.claimableRewards ?? DEFAULT_AMOUNT),
        farm.item.rewardToken.metadata.decimals
      )
        .multipliedBy(farm.item.earnExchangeRate ?? DEFAULT_EXHANGE_RATE)
        .multipliedBy(fiatToUsdRate ?? DEFAULT_EXHANGE_RATE),
    [lastStakeRecord?.claimableRewards, fiatToUsdRate]
  );

  const navigateToFarm = useCallback(
    () => navigate(ModalsEnum.ManageFarmingPool, { id: farm.item.id, version: FarmVersionEnum.V3 }),
    [farm.item.id]
  );
  const navigateHarvestFarm = useCallback(
    (opParams: Array<ParamsWithKind>) =>
      dispatch(
        navigateAction(ModalsEnum.Confirmation, {
          type: ConfirmationTypeEnum.InternalOperations,
          opParams,
          testID: 'CLAIM_REWARDS'
        })
      ),
    []
  );

  const lastStakeId = lastStakeRecord?.lastStakeId;
  const harvestAssetsApi = useCallback(async () => {
    if (isDefined(lastStakeId)) {
      const opParams = await getHarvestAssetsTransferParams(tezos, farm.item.contractAddress, lastStakeId);

      if ((lastStakeRecord?.rewardsDueDate ?? 0) > Date.now()) {
        const modalAnswerAnalyticsProperties = {
          page: ScreensEnum.Earn,
          farmId: farm.item.id,
          farmContractAddress: farm.item.contractAddress
        };

        doAfterConfirmation(
          'Your claimable rewards will be claimed and sent to you. But your full rewards will be totally lost and redistributed among other participants.',
          'Claim rewards',
          () => {
            trackEvent(
              'CLAIM_REWARDS_MODAL_CONFIRM',
              AnalyticsEventCategory.ButtonPress,
              modalAnswerAnalyticsProperties
            );
            navigateHarvestFarm(opParams);
          },
          () =>
            trackEvent('CLAIM_REWARDS_MODAL_CANCEL', AnalyticsEventCategory.ButtonPress, modalAnswerAnalyticsProperties)
        );
      } else {
        navigateHarvestFarm(opParams);
      }
    }
  }, [lastStakeRecord?.rewardsDueDate, lastStakeId, farm.item, tezos, trackEvent]);

  const actionButtonsTestIDProperties = useMemo(
    () => ({
      id: farm.item.id,
      contractAddress: farm.item.contractAddress
    }),
    [farm.item]
  );

  return (
    <View style={[styles.root, styles.mb16]}>
      <View style={styles.bageContainer}>
        {farm.item.type === PoolType.STABLESWAP && (
          <Bage text="Stable Pool" color={colors.kolibriGreen} style={styles.bage} textStyle={styles.bageText} />
        )}
        {Number(farm.item.vestingPeriodSeconds) > SECONDS_IN_DAY && (
          <Bage text="Long-Term Farm" style={[styles.bage, styles.lastBage]} textStyle={styles.bageText} />
        )}
      </View>
      <View style={styles.mainContent}>
        <View style={[styles.tokensContainer, styles.row]}>
          <FarmTokens stakeTokens={stakeTokens} rewardToken={rewardToken} />
          <View>
            <Text style={styles.apyText}>APY: {apr}%</Text>
            <View style={styles.earnSource}>
              <Icon style={styles.earnSourceIcon} name={IconNameEnum.QsEarnSource} />
              <Text style={styles.attributeTitle}>Quipuswap</Text>
            </View>
          </View>
        </View>

        <HorizontalBorder />

        <Divider size={formatSize(8)} />

        <View style={[styles.row, styles.mb16]}>
          <View style={styles.flex}>
            <Text style={styles.attributeTitle}>Your deposit:</Text>
            <FormattedAmount isDollarValue amount={depositAmountAtomic} style={styles.attributeValue} />
          </View>
          {depositAmountAtomic.gt(0) && (
            <View style={styles.flex}>
              <Text style={styles.attributeTitle}>Claimable rewards:</Text>
              <FormattedAmount isDollarValue amount={claimableRewardsAtomic} style={styles.attributeValue} />
            </View>
          )}
        </View>

        <View style={styles.row}>
          {depositAmountAtomic.isGreaterThan(DEFAULT_AMOUNT) ? (
            <>
              <Button
                title="MANAGE"
                onPress={navigateToFarm}
                styleConfig={buttonSecondaryStylesConfig}
                testID={FarmItemSelectors.manageButton}
                testIDProperties={actionButtonsTestIDProperties}
              />
              <Divider size={formatSize(8)} />
              <Button
                title="CLAIM REWARDS"
                onPress={harvestAssetsApi}
                styleConfig={buttonPrimaryStylesConfig}
                testID={FarmItemSelectors.claimRewardsButton}
                testIDProperties={actionButtonsTestIDProperties}
              />
            </>
          ) : (
            <Button
              isFullWidth
              title="START FARMING"
              onPress={navigateToFarm}
              styleConfig={buttonPrimaryStylesConfig}
              testID={FarmItemSelectors.startFarmingButton}
              testIDProperties={actionButtonsTestIDProperties}
            />
          )}
        </View>
      </View>
    </View>
  );
};
