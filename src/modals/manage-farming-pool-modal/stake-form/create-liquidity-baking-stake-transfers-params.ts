import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { firstValueFrom } from 'rxjs';

import { MAX_ROUTING_FEE_CHAINS, ROUTING_FEE_ADDRESS, ZERO } from 'src/config/swap';
import { AccountInterface } from 'src/interfaces/account.interface';
import {
  THREE_ROUTE_SIRS_TOKEN,
  THREE_ROUTE_TZBTC_TOKEN,
  THREE_ROUTE_XTZ_TOKEN
} from 'src/token/data/three-route-tokens';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { fetchRoute3LiquidityBakingParams } from 'src/utils/route3.util';
import { calculateRoutingInputAndFee, calculateSlippageRatio, getSwapTransferParams } from 'src/utils/swap.utils';
import { mutezToTz } from 'src/utils/tezos.util';
import { getTransferParams$ } from 'src/utils/transfer-params.utils';

export const createLiquidityBakingStakeTransfersParams = async (
  amount: BigNumber,
  asset: TokenInterface,
  tezos: TezosToolkit,
  account: AccountInterface,
  slippageTolerancePercentage: number
) => {
  const inputIsTezos = getTokenSlug(asset) === TEZ_TOKEN_SLUG;
  const inputToken = inputIsTezos ? THREE_ROUTE_XTZ_TOKEN : THREE_ROUTE_TZBTC_TOKEN;
  const { swapInputMinusFeeAtomic, routingFeeAtomic } = calculateRoutingInputAndFee(amount);
  const {
    output: rawSwapOutput,
    tzbtcChain,
    xtzChain
  } = await fetchRoute3LiquidityBakingParams({
    fromSymbol: inputToken.symbol,
    toSymbol: 'SIRS',
    amount: mutezToTz(swapInputMinusFeeAtomic, inputToken.decimals).toFixed(),
    chainsLimit: MAX_ROUTING_FEE_CHAINS
  });
  const slippageRatio = calculateSlippageRatio(slippageTolerancePercentage);

  if (!isDefined(rawSwapOutput) || rawSwapOutput === ZERO.toFixed()) {
    throw new Error('Please try depositing a bigger amount');
  }

  const swapOutputAtomic = BigNumber.max(
    new BigNumber(rawSwapOutput).times(slippageRatio).integerValue(BigNumber.ROUND_DOWN),
    1
  );

  const transferDevFeeParams = await firstValueFrom(
    getTransferParams$(
      { address: inputToken.contract ?? '', id: Number(inputToken.tokenId ?? '0') },
      tezos.rpc.getRpcUrl(),
      account,
      ROUTING_FEE_ADDRESS,
      routingFeeAtomic
    )
  );

  const threeRouteSwapOpParams = await getSwapTransferParams(
    inputToken,
    THREE_ROUTE_SIRS_TOKEN,
    swapInputMinusFeeAtomic,
    swapOutputAtomic,
    { tzbtcChain, xtzChain },
    tezos,
    account.publicKeyHash
  );

  return [transferDevFeeParams, ...threeRouteSwapOpParams];
};
