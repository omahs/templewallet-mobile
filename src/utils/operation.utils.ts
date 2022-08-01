import { BigNumber } from 'bignumber.js';

import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { ActivityInterface } from '../interfaces/activity.interface';
import { MemberInterface } from '../interfaces/member.interface';
import {
  OperationFa12Interface,
  OperationFa2Interface,
  OperationInterface,
  OperationLiquidityBakingInterface,
  ParameterFa12,
  ParameterLiquidityBaking,
  ParamterFa2
} from '../interfaces/operation.interface';
import { isDefined } from './is-defined';
import { stringToActivityStatusEnum } from './string-to-activity-status-enum.util';

export const mapOperationsToActivities = (address: string, operations: Array<OperationInterface>) => {
  const activities: Array<ActivityInterface> = [];

  for (const operation of operations) {
    const {
      id,
      type,
      status,
      hash,
      timestamp,
      entrypoint,
      contractBalance,
      sender,
      target,
      level,
      newDelegate,
      originatedContract,
      parameter
    } = operation;

    const source = sender;
    let destination: MemberInterface = { address: '' };
    let amount = '0';
    let tokenId = null;
    let contractAddress = null;

    switch (type) {
      case ActivityTypeEnum.Transaction:
        destination = target;
        amount = operation.amount.toString();
        const fa2Parameter = parameter as ParamterFa2;
        const fa12Parameter = parameter as ParameterFa12;
        const bakingParameter = parameter as ParameterLiquidityBaking;

        if (
          isDefined(fa2Parameter) &&
          fa2Parameter.value.length > 0 &&
          Array.isArray(fa2Parameter.value) &&
          isDefined(fa2Parameter.value[0].txs)
        ) {
          contractAddress = target.address;
          if (fa2Parameter.value[0].from_ === address) {
            amount = fa2Parameter.value[0].txs.reduce((acc, tx) => acc.plus(tx.amount), new BigNumber(0)).toFixed();
            tokenId = fa2Parameter.value[0].txs[0].token_id;
          }
          for (const param of fa2Parameter.value) {
            const val = param.txs.find(tx => {
              return tx.to_ === address && (amount = tx.amount);
            });
            if (isDefined(val)) {
              amount = val.amount;
              tokenId = val.token_id;
            }
          }
        } else if (isDefined(fa12Parameter) && isDefined(fa12Parameter.value.value)) {
          if (fa12Parameter.entrypoint === 'approve') {
            continue;
          }
          if (isDefined(fa12Parameter.value.from)) {
            if (fa12Parameter.value.from === address) {
              source.address = address;
            }
          }
          if (isDefined(fa12Parameter.value.to)) {
            if (fa12Parameter.value.to === address) {
              source.address = fa12Parameter.value.from;
            }
          }
          contractAddress = target.address;
          amount = fa12Parameter.value.value;
        } else if (isDefined(bakingParameter) && isDefined(bakingParameter.value.quantity)) {
          contractAddress = target.address;
          const tokenOrTezAmount =
            isDefined(parameter) && isDefined((parameter as ParameterFa12).value.value)
              ? (parameter as ParameterFa12).value.value
              : amount.toString();
          amount =
            isDefined(parameter) && isDefined((parameter as ParameterLiquidityBaking).value.quantity)
              ? (parameter as ParameterLiquidityBaking).value.quantity
              : target.address === address ||
                (isDefined(parameter) && (parameter as ParameterFa12).value.to === address)
              ? tokenOrTezAmount
              : `-${tokenOrTezAmount}`;
        }
        break;

      case ActivityTypeEnum.Delegation:
        if (address !== source.address) {
          continue;
        }
        isDefined(newDelegate) && (destination = newDelegate);
        break;

      case ActivityTypeEnum.Origination:
        isDefined(originatedContract) && (destination = originatedContract);
        isDefined(contractBalance) && (amount = contractBalance.toString());
        break;

      default:
        continue;
    }

    activities.push({
      ...(isDefined(tokenId) ? { tokenId } : {}),
      ...(isDefined(contractAddress) ? { address: contractAddress } : {}),
      id,
      type,
      hash,
      status: stringToActivityStatusEnum(status),
      source,
      entrypoint,
      level,
      destination,
      amount: source.address === address ? `-${amount}` : amount,
      timestamp: new Date(timestamp).getTime()
    });
  }

  return activities;
};

export const mapOperationsFa12ToActivities = (address: string, operations: Array<OperationFa12Interface>) => {
  const activities: Array<ActivityInterface> = [];

  for (const operation of operations) {
    const { id, type, status, hash, timestamp, entrypoint, sender, target, level, parameter } = operation;

    const source = sender;
    const amount = parameter.value.value;

    activities.push({
      address: target.address,
      id,
      type,
      hash,
      status: stringToActivityStatusEnum(status),
      source,
      entrypoint,
      level,
      destination: target,
      amount: source.address === address ? `-${amount}` : amount,
      timestamp: new Date(timestamp).getTime()
    });
  }

  return activities;
};

export const mapOperationsFa2ToActivities = (address: string, operations: Array<OperationFa2Interface>) => {
  const activities: Array<ActivityInterface> = [];

  for (const operation of operations) {
    const { id, type, status, hash, timestamp, entrypoint, sender, target, level, parameter } = operation;

    const source = sender;
    let amount = '0';
    let tokenId = '0';
    if (parameter.value.length > 0) {
      if (parameter.value[0].from_ === address) {
        amount = parameter.value[0].txs.reduce((acc, tx) => acc.plus(tx.amount), new BigNumber(0)).toFixed();
        tokenId = parameter.value[0].txs[0].token_id;
      }
      for (const param of parameter.value) {
        const val = param.txs.find(tx => {
          return tx.to_ === address && (amount = tx.amount);
        });
        if (isDefined(val)) {
          amount = val.amount;
          tokenId = val.token_id;
        }
      }
    }

    activities.push({
      address: target.address,
      id,
      tokenId,
      type,
      hash,
      status: stringToActivityStatusEnum(status),
      source,
      entrypoint,
      level,
      destination: target,
      amount: source.address === address ? `-${amount}` : amount,
      timestamp: new Date(timestamp).getTime()
    });
  }

  return activities;
};

export const mapOperationLiquidityBakingToActivity = (
  address: string,
  operations: Array<OperationLiquidityBakingInterface>
) => {
  const activities: Array<ActivityInterface> = [];

  for (const operation of operations) {
    const { id, amount, type, status, hash, timestamp, entrypoint, sender, target, level, parameter } = operation;

    const source = sender;
    const tokenOrTezAmount =
      isDefined(parameter) && isDefined((parameter as ParameterFa12).value.value)
        ? (parameter as ParameterFa12).value.value
        : amount.toString();

    activities.push({
      address: isDefined(parameter) ? target.address : undefined,
      id,
      type,
      hash,
      status: stringToActivityStatusEnum(status),
      source,
      entrypoint,
      level,
      destination: target,
      amount:
        isDefined(parameter) && isDefined((parameter as ParameterLiquidityBaking).value.quantity)
          ? (parameter as ParameterLiquidityBaking).value.quantity
          : target.address === address || (isDefined(parameter) && (parameter as ParameterFa12).value.to === address)
          ? tokenOrTezAmount
          : `-${tokenOrTezAmount}`,
      timestamp: new Date(timestamp).getTime()
    });
  }

  return activities;
};
