import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { EMPTY, Subject } from 'rxjs';

import { useNavigation } from '../navigator/hooks/use-navigation.hook';
import { useAccountsListSelector } from '../store/wallet/wallet-selectors';
import { ImportWalletParams } from './interfaces/import-wallet-params.interface';
import { RevealSecretKeyParams } from './interfaces/reveal-secret-key-params.interface';
import { RevealSeedPhraseParams } from './interfaces/reveal-seed-phrase.params';
import { createHdAccountSubscription } from './util/create-hd-account-subscription';
import { createImportAccountSubscription } from './util/create-import-account-subscription';
import { enableBiometryPasswordSubscription } from './util/enable-biometry-password-subscription';
import { importWalletSubscription } from './util/import-wallet-subscription';
import { mergeSubscription } from './util/merge-subscription';

export const useShelter = () => {
  const dispatch = useDispatch();
  const accounts = useAccountsListSelector();
  const { navigate, goBack } = useNavigation();

  const importWallet$ = useMemo(() => new Subject<ImportWalletParams>(), []);
  const createHdAccount$ = useMemo(() => new Subject(), []);
  const revealSecretKey$ = useMemo(() => new Subject<RevealSecretKeyParams>(), []);
  const revealSeedPhrase$ = useMemo(() => new Subject<RevealSeedPhraseParams>(), []);
  const enableBiometryPassword$ = useMemo(() => new Subject<string>(), []);
  const createImportedAccount$ = useMemo(() => new Subject<{ privateKey: string; name: string }>(), []);

  useEffect(() => {
    const subscriptions = [
      importWalletSubscription(importWallet$, dispatch),
      createHdAccountSubscription(createHdAccount$, accounts, dispatch),
      createImportAccountSubscription(createImportedAccount$, accounts, dispatch, goBack),
      mergeSubscription(revealSecretKey$, revealSeedPhrase$),
      enableBiometryPasswordSubscription(enableBiometryPassword$, dispatch, navigate)
    ];

    return () => subscriptions.forEach(subscription => subscription.unsubscribe());
  }, [dispatch, importWallet$, revealSecretKey$, createHdAccount$, accounts.length, goBack, revealSeedPhrase$]);

  const importWallet = (params: ImportWalletParams) => importWallet$.next(params);
  const createHdAccount = () => createHdAccount$.next(EMPTY);
  const revealSecretKey = (params: RevealSecretKeyParams) => revealSecretKey$.next(params);
  const revealSeedPhrase = (params: RevealSeedPhraseParams) => revealSeedPhrase$.next(params);

  const enableBiometryPassword = (password: string) => enableBiometryPassword$.next(password);

  const createImportedAccount = (params: { privateKey: string; name: string }) => createImportedAccount$.next(params);

  return {
    importWallet,
    createHdAccount,
    revealSecretKey,
    revealSeedPhrase,
    enableBiometryPassword,
    createImportedAccount
  };
};
