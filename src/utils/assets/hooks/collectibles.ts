import { isEqual } from 'lodash-es';
import { useMemo } from 'react';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useMemoWithCompare } from 'src/hooks/use-memo-with-compare';
import { useTokensMetadataSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { useCurrentAccountStoredAssetsSelector } from 'src/store/wallet/wallet-selectors';
import { AccountTokenInterface } from 'src/token/interfaces/account-token.interface';

import { UsableAccountAsset } from './utils';

export const useAccountCollectibles = () => {
  const collectibles = useCurrentAccountStoredAssetsSelector('collectibles');

  return useMemoWithCompare(
    () =>
      collectibles.map<AccountTokenInterface>(asset => {
        const visibility =
          asset.visibility === VisibilityEnum.InitiallyHidden && Number(asset.balance) > 0
            ? VisibilityEnum.Visible
            : asset.visibility;

        return {
          ...asset,
          visibility
        };
      }),
    [collectibles],
    isEqual
  );
};

export const useAvailableAccountCollectibles = (enabledOnly = false) => {
  const accountCollectibles = useAccountCollectibles();
  const allMetadatas = useTokensMetadataSelector();

  return useMemo(
    () =>
      accountCollectibles.reduce<UsableAccountAsset[]>((acc, { slug, balance, visibility }) => {
        const metadata = allMetadatas[slug]!; // `accountCollectibles` r already filtered for metadata presence

        const asset: UsableAccountAsset = {
          slug,
          visibility,
          balance,
          ...metadata
        };

        if (enabledOnly) {
          return visibility === VisibilityEnum.Visible ? acc.concat(asset) : acc;
        }

        return acc.concat(asset);
      }, []),
    [accountCollectibles, allMetadatas, enabledOnly]
  );
};

export const useCurrentAccountCollectiblesWithPositiveBalance = () => {
  const collectibles = useCurrentAccountStoredAssetsSelector('collectibles');

  return useMemo(() => collectibles.filter(c => Number(c.balance) > 0), [collectibles]);
};
