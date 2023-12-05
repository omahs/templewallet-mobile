import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  migrateAccountsState,
  migrateIsShownDomainName,
  addDcpRpc,
  migrateQuipuApy,
  migrateTokensMetadata,
  migrateTokenSuggestion,
  addDcpTokensMetadata,
  changeTempleRpc,
  updateSirsTokenAction,
  addMarigoldRpc
} from 'src/store/migration/migration-actions';

export const useStorageMigration = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(migrateTokensMetadata());
    dispatch(migrateTokenSuggestion());
    dispatch(migrateIsShownDomainName());
    dispatch(migrateQuipuApy());
    dispatch(migrateAccountsState());
    dispatch(addDcpRpc());
    dispatch(changeTempleRpc());
    dispatch(addMarigoldRpc());
    dispatch(addDcpTokensMetadata());
    dispatch(updateSirsTokenAction());
  }, []);
};
