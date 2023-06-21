import { PortalProvider } from '@gorhom/portal';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useDispatch } from 'react-redux';

import { useBeaconHandler } from 'src/beacon/use-beacon-handler.hook';
import { exolixScreenOptions } from 'src/components/header/exolix-screen-options';
import { generateScreenOptions } from 'src/components/header/generate-screen-options.util';
import { HeaderAction } from 'src/components/header/header-action/header-actions';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { HeaderTokenInfo } from 'src/components/header/header-token-info/header-token-info';
import { ScreenStatusBar } from 'src/components/screen-status-bar/screen-status-bar';
import {
  TOKENS_SYNC_INTERVAL,
  BALANCES_SYNC_INTERVAL,
  RATES_SYNC_INTERVAL,
  SELECTED_BAKER_SYNC_INTERVAL,
  NOTIFICATIONS_SYNC_INTERVAL
} from 'src/config/fixed-times';
import { useBlockSubscription } from 'src/hooks/block-subscription/use-block-subscription.hook';
import { useAdvertising } from 'src/hooks/use-advertising.hook';
import { useAppLockTimer } from 'src/hooks/use-app-lock-timer.hook';
import { useFirebaseApp } from 'src/hooks/use-firebase-app.hook';
import { useAuthorisedInterval } from 'src/hooks/use-interval.hook';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { About } from 'src/screens/about/about';
import { Activity } from 'src/screens/activity/activity';
import { Backup } from 'src/screens/backup/backup';
import { Buy } from 'src/screens/buy/buy';
import { BuyWithCreditCard } from 'src/screens/buy/buy-with-credit-card';
import { Exolix } from 'src/screens/buy/crypto/exolix/exolix';
import { CloudBackup } from 'src/screens/cloud-backup';
import { CollectiblesHome } from 'src/screens/collectibles-home/collectibles-home';
import { Contacts } from 'src/screens/contacts/contacts';
import { ContinueWithCloud } from 'src/screens/continue-with-cloud';
import { CreateNewWallet } from 'src/screens/create-new-wallet/create-new-wallet';
import { DAppsSettings } from 'src/screens/d-apps-settings/d-apps-settings';
import { DApps } from 'src/screens/d-apps/d-apps';
import { Debug } from 'src/screens/debug/debug';
import { DelegationScreen } from 'src/screens/delegation-screen/delegation-screen';
import { FiatSettings } from 'src/screens/fiat-settings/fiat-settings';
import { ImportAccount } from 'src/screens/import-account/import-account';
import { LiquidityBakingDapp } from 'src/screens/liquidity-baking-dapp/liquidity-baking-dapp';
import { ManageAccounts } from 'src/screens/manage-accounts/manage-accounts';
import { ManageAssets } from 'src/screens/manage-assets/manage-assets';
import { ManualBackup } from 'src/screens/manual-backup/manual-backup';
import { Market } from 'src/screens/market/market';
import { NodeSettings } from 'src/screens/node-settings/node-settings';
import { NotificationsItem } from 'src/screens/notifications-item/notifications-item';
import { NotificationsSettings } from 'src/screens/notifications-settings/notifications-settings';
import { Notifications } from 'src/screens/notifications/notifications';
import { ScanQrCode } from 'src/screens/scan-qr-code/scan-qr-code';
import { SecureSettings } from 'src/screens/secure-settings/secure-settings';
import { Settings } from 'src/screens/settings/settings';
import { SwapSettingsScreen } from 'src/screens/swap/settings/swap-settings';
import { SwapScreen } from 'src/screens/swap/swap';
import { AfterSyncQRScan } from 'src/screens/sync-account/after-sync-qr-scan/after-sync-qr-scan';
import { SyncInstructions } from 'src/screens/sync-account/sync-instructions/sync-instructions';
import { TezosTokenScreen } from 'src/screens/tezos-token-screen/tezos-token-screen';
import { TokenScreen } from 'src/screens/token-screen/token-screen';
import { Wallet } from 'src/screens/wallet/wallet';
import { Welcome } from 'src/screens/welcome/welcome';
import { loadSelectedBakerActions } from 'src/store/baking/baking-actions';
import { loadExchangeRates } from 'src/store/currency/currency-actions';
import { loadNotificationsAction } from 'src/store/notifications/notifications-actions';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import {
  loadTokensActions,
  loadTezosBalanceActions,
  loadTokensBalancesArrayActions
} from 'src/store/wallet/wallet-actions';
import { useIsAuthorisedSelector, useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { emptyTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
import { cloudTitle } from 'src/utils/cloud-backup';

import { useUsdToTokenRates } from '../store/currency/currency-selectors';
import { loadTokensApyActions } from '../store/d-apps/d-apps-actions';
import { ScreensEnum, ScreensParamList } from './enums/screens.enum';
import { useStackNavigatorStyleOptions } from './hooks/use-stack-navigator-style-options.hook';
import { NavigationBar } from './navigation-bar/navigation-bar';

const MainStack = createStackNavigator<ScreensParamList>();

export const MainStackScreen = () => {
  const dispatch = useDispatch();
  const isAuthorised = useIsAuthorisedSelector();
  const { publicKeyHash: selectedAccountPkh } = useSelectedAccountSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const styleScreenOptions = useStackNavigatorStyleOptions();
  const exchangeRates = useUsdToTokenRates();

  const blockSubscription = useBlockSubscription();

  const { metadata } = useNetworkInfo();

  useAppLockTimer();
  useBeaconHandler();
  useFirebaseApp();
  useAdvertising();

  const refreshDeps = [blockSubscription.block.header, selectedAccountPkh, selectedRpcUrl];

  useAuthorisedInterval(() => dispatch(loadTokensApyActions.submit()), RATES_SYNC_INTERVAL, [exchangeRates]);
  useAuthorisedInterval(() => dispatch(loadTokensActions.submit()), TOKENS_SYNC_INTERVAL, refreshDeps);
  useAuthorisedInterval(() => dispatch(loadSelectedBakerActions.submit()), SELECTED_BAKER_SYNC_INTERVAL, refreshDeps);
  useAuthorisedInterval(
    () => {
      dispatch(loadTezosBalanceActions.submit());
      dispatch(loadTokensBalancesArrayActions.submit());
    },
    BALANCES_SYNC_INTERVAL,
    refreshDeps
  );
  useAuthorisedInterval(() => dispatch(loadExchangeRates.submit()), RATES_SYNC_INTERVAL);
  useAuthorisedInterval(() => dispatch(loadNotificationsAction.submit()), NOTIFICATIONS_SYNC_INTERVAL, [
    selectedAccountPkh
  ]);

  return (
    <PortalProvider>
      <ScreenStatusBar />

      <NavigationBar>
        <MainStack.Navigator screenOptions={styleScreenOptions}>
          {!isAuthorised ? (
            <>
              <MainStack.Screen name={ScreensEnum.Welcome} component={Welcome} options={{ headerShown: false }} />
              <MainStack.Screen
                name={ScreensEnum.ImportAccount}
                component={ImportAccount}
                options={generateScreenOptions(<HeaderTitle title="Import existing Wallet" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.SyncInstructions}
                component={SyncInstructions}
                options={generateScreenOptions(<HeaderTitle title="Sync" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.ConfirmSync}
                component={AfterSyncQRScan}
                options={generateScreenOptions(<HeaderTitle title="Confirm Sync" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.CreateAccount}
                component={CreateNewWallet}
                options={generateScreenOptions(<HeaderTitle title="Create a new Wallet" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.ContinueWithCloud}
                component={ContinueWithCloud}
                options={generateScreenOptions(<HeaderTitle title={`Restore from ${cloudTitle}`} />)}
              />
            </>
          ) : (
            <>
              {/** Wallet stack **/}
              <MainStack.Screen
                name={ScreensEnum.Wallet}
                component={Wallet}
                options={{ animationEnabled: false, headerShown: false }}
              />
              <MainStack.Screen
                name={ScreensEnum.CollectiblesHome}
                component={CollectiblesHome}
                options={{ animationEnabled: false, headerShown: false }}
              />
              <MainStack.Screen
                name={ScreensEnum.TezosTokenScreen}
                component={TezosTokenScreen}
                options={generateScreenOptions(<HeaderTokenInfo token={metadata} />)}
              />
              <MainStack.Screen
                name={ScreensEnum.TokenScreen}
                component={TokenScreen}
                options={generateScreenOptions(<HeaderTokenInfo token={emptyTokenMetadata} />)}
              />
              <MainStack.Screen
                name={ScreensEnum.Delegation}
                component={DelegationScreen}
                options={generateScreenOptions(<HeaderTitle title="Delegation" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.ManageAssets}
                component={ManageAssets}
                options={generateScreenOptions(<HeaderTitle title="Manage Assets" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.Activity}
                component={Activity}
                options={generateScreenOptions(<HeaderTitle title="Activity" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.Notifications}
                component={Notifications}
                options={generateScreenOptions(<HeaderTitle title="Notifications and Ads" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.NotificationsItem}
                component={NotificationsItem}
                options={generateScreenOptions(<HeaderTitle title="Notifications" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.Buy}
                component={Buy}
                options={generateScreenOptions(<HeaderTitle title="Top up balance" />)}
              />

              <MainStack.Screen name={ScreensEnum.Exolix} component={Exolix} options={exolixScreenOptions()} />

              <MainStack.Screen
                name={ScreensEnum.BuyWithCreditCard}
                component={BuyWithCreditCard}
                options={generateScreenOptions(<HeaderTitle title="Top up balance" />)}
              />

              {/** DApps stack **/}
              <MainStack.Screen
                name={ScreensEnum.DApps}
                component={DApps}
                options={{ animationEnabled: false, headerShown: false }}
              />
              <MainStack.Screen
                name={ScreensEnum.LiquidityBakingDapp}
                component={LiquidityBakingDapp}
                options={generateScreenOptions(<HeaderTitle title={'Liquidity Baking'} />)}
              />

              {/** Swap stack **/}
              <MainStack.Screen
                name={ScreensEnum.SwapScreen}
                component={SwapScreen}
                options={{
                  ...generateScreenOptions(<HeaderTitle title="Swap" />, <HeaderAction />, false),
                  animationEnabled: false
                }}
              />

              <MainStack.Screen
                name={ScreensEnum.SwapSettingsScreen}
                component={SwapSettingsScreen}
                options={generateScreenOptions(<HeaderTitle title="Swap Settings" />)}
              />

              {/** Market stack **/}
              <MainStack.Screen
                name={ScreensEnum.Market}
                component={Market}
                options={{ animationEnabled: false, headerShown: false }}
              />

              {/** Settings stack **/}
              <MainStack.Screen
                name={ScreensEnum.Settings}
                component={Settings}
                options={{ animationEnabled: false, headerShown: false }}
              />
              <MainStack.Screen
                name={ScreensEnum.ManageAccounts}
                component={ManageAccounts}
                options={generateScreenOptions(<HeaderTitle title="Manage Accounts" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.Contacts}
                component={Contacts}
                options={generateScreenOptions(<HeaderTitle title="Contacts" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.About}
                component={About}
                options={generateScreenOptions(<HeaderTitle title="About" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.DAppsSettings}
                component={DAppsSettings}
                options={generateScreenOptions(<HeaderTitle title="Authorized DApps" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.NodeSettings}
                component={NodeSettings}
                options={generateScreenOptions(<HeaderTitle title="Default node (RPC)" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.FiatSettings}
                component={FiatSettings}
                options={generateScreenOptions(<HeaderTitle title="Default currency" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.SecureSettings}
                component={SecureSettings}
                options={generateScreenOptions(<HeaderTitle title="Secure" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.Backup}
                component={Backup}
                options={generateScreenOptions(<HeaderTitle title="Backup" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.ManualBackup}
                component={ManualBackup}
                options={generateScreenOptions(<HeaderTitle title="Manual backup" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.CloudBackup}
                component={CloudBackup}
                options={generateScreenOptions(<HeaderTitle title={`Backup to ${cloudTitle}`} />)}
              />
              <MainStack.Screen
                name={ScreensEnum.NotificationsSettings}
                component={NotificationsSettings}
                options={generateScreenOptions(<HeaderTitle title="Notifications and Ads" />)}
              />
              <MainStack.Screen
                name={ScreensEnum.Debug}
                component={Debug}
                options={generateScreenOptions(<HeaderTitle title="Debugging" />)}
              />
            </>
          )}
          <MainStack.Screen
            name={ScreensEnum.ScanQrCode}
            component={ScanQrCode}
            options={generateScreenOptions(<HeaderTitle title="Scan QR Code" />)}
          />
        </MainStack.Navigator>
      </NavigationBar>
    </PortalProvider>
  );
};
