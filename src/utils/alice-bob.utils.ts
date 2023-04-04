import { templeWalletApi } from 'src/api.service';
import { AliceBobOrderInfoInterface } from 'src/interfaces/alice-bob-order-info.interface';

export const getTezUahPairInfo = async () => {
  const { data } = await templeWalletApi.get<{ minAmount: number; maxAmount: number }>('/alice-bob/get-pair-info');

  return data;
};

export const getTezUahPairEstimation = async (uahAmount: number) => {
  const { data } = await templeWalletApi.post<{ outputAmount: number }>('/alice-bob/estimate-amount', {
    params: {
      amount: uahAmount
    }
  });

  return data.outputAmount;
};

export const createOrder = async (
  isWithdraw: boolean,
  amount: string,
  userId: string,
  walletAddress?: string,
  cardNumber?: string
) => {
  const { data } = await templeWalletApi.post<{ orderInfo: AliceBobOrderInfoInterface }>(
    '/alice-bob/create-order',
    null,
    {
      params: {
        isWithdraw,
        amount,
        userId,
        walletAddress,
        cardNumber
      }
    }
  );

  return data.orderInfo;
};