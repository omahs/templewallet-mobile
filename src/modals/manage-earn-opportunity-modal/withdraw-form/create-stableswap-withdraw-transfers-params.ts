import { MichelsonMap, TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { estimateWithdrawTokenOutput } from 'src/apis/quipuswap-staking';
import { StableswapFarm, TooLowPoolReservesError } from 'src/apis/quipuswap-staking/types';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { getTransactionTimeoutDate } from 'src/op-params/op-params.utils';
import { TEZ_TOKEN_SLUG, WTEZ_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { convertEarnOpportunityToken } from 'src/utils/earn.utils';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';

import { STABLESWAP_REFERRAL } from '../constants';

export const createStableswapWithdrawTransfersParams = async (
  farm: StableswapFarm,
  tokenIndex: number,
  tezos: TezosToolkit,
  accountPkh: string,
  stake: UserStakeValueInterface
) => {
  const { contractAddress: farmAddress, stakedToken } = farm;
  const { contractAddress: poolAddress, fa2TokenId: poolId = 0 } = stakedToken;
  const asset = convertEarnOpportunityToken(farm.tokens[tokenIndex]);
  const assetSlug = toTokenSlug(asset.address, asset.id);
  const shouldBurnWtezToken = assetSlug === TEZ_TOKEN_SLUG;
  const farmContract = await getReadOnlyContract(farmAddress, tezos);
  const poolContract = await getReadOnlyContract(poolAddress, tezos);
  const depositAmount = new BigNumber(stake.depositAmountAtomic ?? 0);
  const [tokenOutput] = await estimateWithdrawTokenOutput(tezos, poolContract, [tokenIndex], depositAmount, poolId);

  if (tokenOutput === null) {
    throw new TooLowPoolReservesError();
  }

  if (tokenOutput === undefined) {
    throw new Error('Failed to estimate token output');
  }

  const tokensOutput = new MichelsonMap<BigNumber, BigNumber>();
  tokensOutput.set(new BigNumber(tokenIndex), tokenOutput);

  let burnWTezParams: TransferParams[] = [];
  if (shouldBurnWtezToken) {
    const wTezContract = await getReadOnlyContract(WTEZ_TOKEN_METADATA.address, tezos);
    burnWTezParams = [wTezContract.methods.burn(accountPkh, accountPkh, tokenOutput).toTransferParams()];
  }

  const withdrawTransferParams = farmContract.methods.withdraw(stake.lastStakeId).toTransferParams();
  const divestOneCoinTransferParams = poolContract.methods
    .divest_imbalanced(poolId, tokensOutput, depositAmount, getTransactionTimeoutDate(), null, STABLESWAP_REFERRAL)
    .toTransferParams();

  return [withdrawTransferParams, divestOneCoinTransferParams, ...burnWTezParams];
};
