export enum NetworkEnum {
  Mainnet = 'mainnet',
  Ghostnet = 'ghostnet'
}

export enum FarmVersionEnum {
  V1 = 'v1',
  V2 = 'v2',
  V3 = 'v3'
}

export enum PoolType {
  STABLESWAP = 'STABLESWAP',
  DEX_TWO = 'DEX_TWO'
}

enum StableswapPoolVersion {
  V1 = 'v1',
  V2 = 'v2'
}

enum FarmTokenStandardsEnum {
  Fa12 = 'FA12',
  Fa2 = 'FA2'
}

interface FarmTokenMetadata {
  decimals: number;
  symbol: string;
  name: string;
  thumbnailUri: string;
  categories?: string[];
}

interface FarmToken {
  contractAddress: string;
  fa2TokenId?: number;
  type: FarmTokenStandardsEnum;
  isWhitelisted: boolean | null;
  metadata: FarmTokenMetadata;
}

interface FarmBase {
  id: string;
  contractAddress: string;
  apr: string | null;
  depositExchangeRate: string | null;
  depositTokenUrl: string;
  lastRewards: string;
  discFactor: string;
  dailyDistribution: string;
  dailyDistributionDollarEquivalent: string;
  earnExchangeRate: string | null;
  vestingPeriodSeconds: string;
  stakeUrl: string;
  stakedToken: FarmToken;
  tokens: FarmToken[];
  rewardToken: FarmToken;
  staked: string;
  tvlInUsd: string | null;
  tvlInStakedToken: string;
  version: FarmVersionEnum;
  type?: PoolType;
}

interface StableswapFarm extends FarmBase {
  type: PoolType.STABLESWAP;
  stableswapPoolId: number;
  stableswapPoolVersion: StableswapPoolVersion;
}

interface OtherFarm extends FarmBase {
  type?: PoolType.DEX_TWO;
}

export type Farm = StableswapFarm | OtherFarm;

interface BlockInfo {
  level: number;
  hash: string;
  timestamp: string;
}

export interface SingleFarmResponse {
  item: Farm;
  blockInfo: BlockInfo;
}

export interface FarmsListResponse {
  list: SingleFarmResponse[];
}