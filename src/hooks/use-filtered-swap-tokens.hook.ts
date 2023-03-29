import { useMemo, useState } from 'react';

import { useSwapTokensMetadataSelector } from 'src/store/swap/swap-selectors';
import { useSelectedAccountTezosTokenSelector, useTokensListSelector } from 'src/store/wallet/wallet-selectors';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { applySortByDollarValueDecrease } from 'src/utils/token-metadata.utils';

import { TokenInterface } from '../token/interfaces/token.interface';
import { isString } from '../utils/is-string';
import { isNonZeroBalance } from '../utils/tezos.util';
import { useTokenExchangeRateGetter } from './use-token-exchange-rate-getter.hook';

export enum TokensInputsEnum {
  From = 'From',
  To = 'To'
}

export const useFilteredSwapTokensList = (tokensInput: TokensInputsEnum = TokensInputsEnum.From) => {
  const { data: swapTokensMetadata } = useSwapTokensMetadataSelector();
  const userTokens = useTokensListSelector();
  const tezosToken = useSelectedAccountTezosTokenSelector();
  const getTokenExchangeRate = useTokenExchangeRateGetter();

  const balances = useMemo<Record<string, string>>(() => {
    const balancesRecord: Record<string, string> = {};

    userTokens.forEach(token => (balancesRecord[toTokenSlug(token.address, token.id)] = token.balance));

    balancesRecord[toTokenSlug(tezosToken.address, tezosToken.id)] = tezosToken.balance;

    return balancesRecord;
  }, [userTokens]);

  const swapTokensWithBalances = useMemo<Array<TokenInterface>>(() => {
    const result = swapTokensMetadata.map(token => {
      const slug = toTokenSlug(token.address, token.id);

      return {
        ...token,
        exchangeRate: getTokenExchangeRate(slug),
        balance: balances[slug] ?? '0'
      };
    });

    return applySortByDollarValueDecrease(result);
  }, [swapTokensMetadata, tezosToken, balances]);

  const fromTokens = useMemo(() => swapTokensWithBalances.filter(isNonZeroBalance), [swapTokensWithBalances]);

  const [searchValue, setSearchValue] = useState<string>();
  const filteredTokensList = useMemo<TokenInterface[]>(() => {
    const source = tokensInput === TokensInputsEnum.From ? fromTokens : swapTokensWithBalances;

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: TokenInterface[] = [];

      for (const asset of source) {
        const { name, symbol, address } = asset;

        if (
          name.toLowerCase().includes(lowerCaseSearchValue) ||
          symbol.toLowerCase().includes(lowerCaseSearchValue) ||
          address.toLowerCase().includes(lowerCaseSearchValue)
        ) {
          result.push(asset);
        }
      }

      return result;
    } else {
      return source;
    }
  }, [searchValue, fromTokens, swapTokensWithBalances]);

  return {
    filteredTokensList,
    searchValue,
    setSearchValue
  };
};
