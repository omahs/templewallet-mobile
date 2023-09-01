import { Activity, TzktMemberInterface, TzktOperation, parseOperations } from '@temple-wallet/transactions-parser';
import { LiquidityBakingMintOrBurnInterface } from '@temple-wallet/transactions-parser/dist/types/liquidity-baking';
import { Fa12TransferInterface, Fa2TransferInterface } from '@temple-wallet/transactions-parser/dist/types/transfers';
import { isEmpty, uniq } from 'lodash-es';

import { getTzktApi } from '../api.service';
import { OPERATION_LIMIT } from '../config/general';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { AccountInterface } from '../interfaces/account.interface';
import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { LIQUIDITY_BAKING_DEX_ADDRESS } from '../token/data/token-slugs';
import { TEZ_TOKEN_SLUG } from '../token/data/tokens-metadata';
import { getTokenType } from '../token/utils/token.utils';
import { isDefined } from './is-defined';
import { createReadOnlyTezosToolkit } from './rpc/tezos-toolkit.utils';
import { sleep } from './timeouts.util';

const getOperationGroupByHash = <T>(selectedRpcUrl: string, hash: string) =>
  getTzktApi(selectedRpcUrl).get<Array<T>>(`operations/${hash}`);

// LIQUIDITY BAKING ACTIVITY
const getContractOperations = <T>(selectedRpcUrl: string, account: string, contractAddress: string, lastId?: number) =>
  getTzktApi(selectedRpcUrl)
    .get<Array<T>>(`accounts/${contractAddress}/operations`, {
      params: {
        type: 'transaction',
        limit: OPERATION_LIMIT,
        sort: '1',
        initiator: account,
        entrypoint: 'mintOrBurn',
        ...(isDefined(lastId) ? { lastId } : undefined)
      }
    })
    .then(x => x.data);

const getTokenFa2Operations = (
  selectedRpcUrl: string,
  account: string,
  contractAddress: string,
  tokenId = '0',
  lastId?: number
) =>
  getTzktApi(selectedRpcUrl)
    .get<Array<Fa2TransferInterface>>('operations/transactions', {
      params: {
        limit: OPERATION_LIMIT,
        entrypoint: 'transfer',
        'sort.desc': 'level',
        target: contractAddress,
        'parameter.[*].in': `[{"from_":"${account}","txs":[{"token_id":"${tokenId}"}]},{"txs":[{"to_":"${account}","token_id":"${tokenId}"}]}]`,
        ...(isDefined(lastId) ? { 'id.lt': lastId } : undefined)
      }
    })
    .then(x => x.data);

const getTokenFa12Operations = (selectedRpcUrl: string, account: string, contractAddress: string, lastId?: number) =>
  getTzktApi(selectedRpcUrl)
    .get<Array<Fa12TransferInterface>>('operations/transactions', {
      params: {
        limit: OPERATION_LIMIT,
        entrypoint: 'transfer',
        'sort.desc': 'level',
        target: contractAddress,
        'parameter.in': `[{"from":"${account}"},{"to":"${account}"}]`,
        ...(isDefined(lastId) ? { 'id.lt': lastId } : undefined)
      }
    })
    .then(x => x.data);

const getTezosOperations = (selectedRpcUrl: string, account: string, lastId?: number) =>
  getTzktApi(selectedRpcUrl)
    .get<Array<TzktOperation>>(`accounts/${account}/operations`, {
      params: {
        limit: OPERATION_LIMIT,
        type: ActivityTypeEnum.Transaction,
        sort: '1',
        'parameter.null': true,
        ...(isDefined(lastId) ? { lastId } : undefined)
      }
    })
    .then(x => x.data);

const getAccountOperations = (selectedRpcUrl: string, account: string, lastId?: number) =>
  getTzktApi(selectedRpcUrl)
    .get<Array<TzktOperation>>(`accounts/${account}/operations`, {
      params: {
        limit: OPERATION_LIMIT,
        type: `${ActivityTypeEnum.Delegation},${ActivityTypeEnum.Origination},${ActivityTypeEnum.Transaction}`,
        sort: '1',
        ...(isDefined(lastId) ? { lastId } : undefined)
      }
    })
    .then(x => x.data);

const getFa12IncomingOperations = (selectedRpcUrl: string, account: string, lowerId: number, upperId?: number) =>
  getTzktApi(selectedRpcUrl)
    .get<Array<Fa12TransferInterface>>('operations/transactions', {
      params: {
        'sender.ne': account,
        'target.ne': account,
        'initiator.ne': account,
        'id.gt': lowerId,
        entrypoint: 'transfer',
        'parameter.to': account,
        ...(isDefined(upperId) ? { 'id.lt': upperId } : undefined)
      }
    })
    .then(x => x.data);

const getFa2IncomingOperations = (selectedRpcUrl: string, account: string, lowerId: number, upperId?: number) =>
  getTzktApi(selectedRpcUrl)
    .get<Array<Fa2TransferInterface>>('operations/transactions', {
      params: {
        'sender.ne': account,
        'target.ne': account,
        'initiator.ne': account,
        'id.gt': lowerId,
        entrypoint: 'transfer',
        'parameter.[*].txs.[*].to_': account,
        ...(isDefined(upperId) ? { 'id.lt': upperId } : undefined)
      }
    })
    .then(x => x.data);

const getAllOperations = async (
  selectedRpcUrl: string,
  publicKeyHash: string,
  upperId?: number
): Promise<TzktOperation[]> => {
  const operations = await getAccountOperations(selectedRpcUrl, publicKeyHash, upperId);
  if (operations.length === 0) {
    return [];
  }
  const localLastItem = operations[operations.length - 1];
  if (!isDefined(localLastItem)) {
    return [];
  }
  const lowerId = localLastItem.id;
  const [operationsFa12, operationsFa2] = await Promise.all([
    getFa12IncomingOperations(selectedRpcUrl, publicKeyHash, lowerId, upperId),
    getFa2IncomingOperations(selectedRpcUrl, publicKeyHash, lowerId, upperId)
  ]);

  return operations
    .concat(operationsFa12)
    .concat(operationsFa2)
    .sort((b, a) => a.id - b.id);
};

const loadOperations = async (
  selectedRpcUrl: string,
  selectedAccount: AccountInterface,
  tokenSlug?: string,
  oldestOperation?: TzktOperation
) => {
  const [contractAddress, tokenId] = (tokenSlug ?? '').split('_');

  if (isDefined(tokenSlug)) {
    if (tokenSlug === TEZ_TOKEN_SLUG) {
      return getTezosOperations(selectedRpcUrl, selectedAccount.publicKeyHash, oldestOperation?.id);
    }

    if (tokenSlug === LIQUIDITY_BAKING_DEX_ADDRESS) {
      return getContractOperations<LiquidityBakingMintOrBurnInterface>(
        selectedRpcUrl,
        selectedAccount.publicKeyHash,
        contractAddress,
        oldestOperation?.id
      );
    }

    const tezos = createReadOnlyTezosToolkit(selectedRpcUrl, selectedAccount);
    const contract = await tezos.contract.at(contractAddress);
    const tokenType = getTokenType(contract);

    if (tokenType === TokenTypeEnum.FA_1_2) {
      return getTokenFa12Operations(
        selectedRpcUrl,
        selectedAccount.publicKeyHash,
        contractAddress,
        oldestOperation?.id
      );
    }

    if (tokenType === TokenTypeEnum.FA_2) {
      return getTokenFa2Operations(
        selectedRpcUrl,
        selectedAccount.publicKeyHash,
        contractAddress,
        tokenId,
        oldestOperation?.id
      );
    }
  }

  return getAllOperations(selectedRpcUrl, selectedAccount.publicKeyHash, oldestOperation?.id);
};

export const loadActivity = async (
  selectedRpcUrl: string,
  selectedAccount: AccountInterface,
  tokenSlug?: string,
  knownBakers?: Array<TzktMemberInterface>,
  oldestOperation?: TzktOperation
): Promise<{ activities: Array<Array<Activity>>; reachedTheEnd: boolean; oldestOperation?: TzktOperation }> => {
  const operationsHashesRaw = await loadOperations(selectedRpcUrl, selectedAccount, tokenSlug, oldestOperation).then(
    operations => operations.map(operation => operation.hash)
  );

  const operationsHashesUniq = uniq(operationsHashesRaw.filter(x => x !== oldestOperation?.hash));

  const operationGroups: Array<Array<TzktOperation>> = [];

  for (const opHash of operationsHashesUniq) {
    const { data } = await getOperationGroupByHash<TzktOperation>(selectedRpcUrl, opHash);
    operationGroups.push(data.sort((a, b) => b.id - a.id));
    await sleep(100);
  }

  const reachedTheEnd = operationGroups.length === 0;

  if (reachedTheEnd) {
    return { activities: [], reachedTheEnd };
  }

  const oldestOperationNew = operationGroups[operationGroups.length - 1]?.[0];

  const activities = operationGroups
    .map(group => parseOperations(group, selectedAccount.publicKeyHash, knownBakers))
    .filter(group => !isEmpty(group));

  if (activities.length === 0) {
    return loadActivity(selectedRpcUrl, selectedAccount, tokenSlug, knownBakers, oldestOperationNew);
  }

  return { activities, reachedTheEnd, oldestOperation: oldestOperationNew };
};
