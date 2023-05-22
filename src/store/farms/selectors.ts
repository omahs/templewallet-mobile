import { FarmVersionEnum, PoolType } from 'src/apis/quipuswap-staking/types';

import { useSelector } from '../selector';

export const useFarmsLoadingSelector = () => useSelector(({ farms }) => farms.farms.isLoading);

export const useFarmSelector = (id: string, version: FarmVersionEnum) =>
  useSelector(({ farms }) => {
    const { list } = farms.farms.data;

    return list.find(({ item }) => item.id === id && item.version === version);
  });

export const useAllFarmsSelector = () =>
  useSelector(({ farms }) => {
    const data = farms.allFarms.data.filter(farm => farm.item.type === PoolType.STABLESWAP);

    return {
      data,
      isLoading: farms.allFarms.isLoading,
      error: farms.allFarms.error
    };
  });
export const useLastStakesSelector = () => useSelector(({ farms }) => farms.lastStakes);
