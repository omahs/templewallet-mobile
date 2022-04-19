import React, { useEffect, useState } from 'react';

import { useInnerScreenProgress } from '../../hooks/use-inner-screen-progress';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useAnalytics } from '../../utils/analytics/use-analytics.hook';
import { CreateNewPassword } from './create-new-password/create-new-password';
import { CreateNewWallet } from './create-new-wallet/create-new-wallet';
import { CreateNewWalletFormValues } from './create-new-wallet/create-new-wallet.form';
import { VerifySeedPhrase } from './verify-seed-phrase/verify-seed-phrase';

export const CreateAccount = () => {
  const { innerScreenIndex, setInnerScreenIndex } = useInnerScreenProgress(3);
  const [seedPhrase, setSeedPhrase] = useState('');

  const { pageEvent } = useAnalytics();
  useEffect(() => void pageEvent(ScreensEnum.CreateAccount, ''), []);

  const handleImportWalletFormSubmit = ({ seedPhrase: newSeedPhrase }: CreateNewWalletFormValues) => {
    setSeedPhrase(newSeedPhrase);
    setInnerScreenIndex(1);
  };

  return (
    <>
      {innerScreenIndex === 0 && (
        <CreateNewWallet initialSeedPhrase={seedPhrase} onSubmit={handleImportWalletFormSubmit} />
      )}
      {innerScreenIndex === 1 && (
        <VerifySeedPhrase
          seedPhrase={seedPhrase}
          onVerify={() => setInnerScreenIndex(2)}
          onGoBackPress={() => setInnerScreenIndex(0)}
        />
      )}
      {innerScreenIndex === 2 && (
        <CreateNewPassword seedPhrase={seedPhrase} onGoBackPress={() => setInnerScreenIndex(1)} />
      )}
    </>
  );
};
