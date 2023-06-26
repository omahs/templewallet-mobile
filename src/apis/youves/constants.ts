import { mainnetTokens } from 'youves-sdk/dist/networks.mainnet';

import { YouvesTokensEnum } from './enums';

export const MAINNET_SMARTPY_RPC = 'https://mainnet.smartpy.io';
const YOUVES_INDEXER_URL = 'https://youves-mainnet-indexer.prod.gke.papers.tech/v1/graphql';
export const youvesTokens: string[] = [YouvesTokensEnum.YOU, YouvesTokensEnum.UBTC, YouvesTokensEnum.UUSD];
export const INITIAL_ARP_VALUE = 0;
export const indexerConfig = { url: YOUVES_INDEXER_URL, headCheckUrl: '' };
export const PERCENTAGE_MULTIPLIER = 100;
export const youvesTokensIcons = {
  [mainnetTokens.youToken.id]: 'ipfs://QmYAJaJvEJuwvMEgRbBoAUKrTxRTT22nCC9RuY7Jy4L4Gc',
  [mainnetTokens.uusdToken.id]: 'ipfs://QmbvhanNCxydZEbGu1RdqkG3LcpNGv7XYsCHgzWBXnmxRd',
  [mainnetTokens.ubtcToken.id]: 'ipfs://Qmbev41h4axBqVzxsXP2NSaAF996bJjJBPb8FFZVqTvJTY',
  [mainnetTokens.uxtzToken.id]: 'ipfs://QmZe16xqundEf6JcRuct6gmoUE7wQM5cNHWPLrZhUY3v6Z'
};
