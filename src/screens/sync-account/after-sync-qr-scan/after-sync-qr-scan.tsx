import { RouteProp, useRoute } from '@react-navigation/core';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { ScreensEnum, ScreensParamList } from '../../../navigator/enums/screens.enum';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { setPasswordAttempts } from '../../../store/security/security-actions';
import { usePasswordAttempt } from '../../../store/security/security-selectors';
import { showErrorToast } from '../../../toast/toast.utils';
import { parseSyncPayload } from '../../../utils/sync.utils';
import { ConfirmSync } from './confirm-sync/confirm-sync';
import { ConfirmSyncFormValues } from './confirm-sync/confirm-sync.form';
import { CreateNewPassword } from './create-new-password/create-new-password';

export const AfterSyncQRScan = () => {
  const { importWallet } = useShelter();

  const [seedPhrase, setSeedPhrase] = useState('');
  const [useBiometry, setUseBiometry] = useState(false);
  const [hdAccountsLength, setHdAccountsLength] = useState(0);
  const [innerScreenIndex, setInnerScreenIndex] = useState(0);

  const { payload } = useRoute<RouteProp<ScreensParamList, ScreensEnum.ConfirmSync>>().params;
  const dispatch = useDispatch();
  const attempt = usePasswordAttempt();

  const handleConfirmSyncFormSubmit = ({ usePrevPassword, password, useBiometry }: ConfirmSyncFormValues) => {
    parseSyncPayload(payload, password)
      .then(res => {
        setUseBiometry(useBiometry === true);
        setSeedPhrase(res.mnemonic);
        setHdAccountsLength(res.hdAccountsLength);

        if (usePrevPassword === true) {
          importWallet({ seedPhrase: res.mnemonic, password, useBiometry, hdAccountsLength: res.hdAccountsLength });
          dispatch(setPasswordAttempts.submit(1));
        } else {
          setInnerScreenIndex(1);
        }
      })
      .catch(e => {
        if (e.message === 'Failed to decrypt sync payload') {
          dispatch(setPasswordAttempts.submit(attempt + 1));
        }

        return showErrorToast({ description: e.message });
      });
  };

  return (
    <>
      {innerScreenIndex === 0 && <ConfirmSync onSubmit={handleConfirmSyncFormSubmit} />}
      {innerScreenIndex === 1 && (
        <CreateNewPassword
          seedPhrase={seedPhrase}
          useBiometry={useBiometry}
          hdAccountsLength={hdAccountsLength}
          onGoBackPress={() => setInnerScreenIndex(0)}
        />
      )}
    </>
  );
};
