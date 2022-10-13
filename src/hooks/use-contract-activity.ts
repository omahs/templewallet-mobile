import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ActivityGroup } from '../interfaces/activity.interface';
import { UseActivityInterface } from '../interfaces/use-activity.interface';
import { removePendingActivity } from '../store/activity/activity-actions';
import { usePendingActivitySelector } from '../store/activity/activity-selectors';
import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { isDefined } from '../utils/is-defined';
import { loadActivity } from '../utils/token-operations.util';

export const useContractActivity = (tokenSlug?: string): UseActivityInterface => {
  const selectedAccount = useSelectedAccountSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const dispatch = useDispatch();

  const lastActivityRef = useRef<string>('');

  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(false);
  const [activities, setActivities] = useState<Array<ActivityGroup>>([]);
  const pendingActivities = usePendingActivitySelector();

  const removePending = useCallback(
    (activitiesGroups: Array<ActivityGroup>) => {
      activitiesGroups.forEach(group =>
        group.forEach(activity => {
          const pendingFound = pendingActivities.find(y => y.length > 0 && y[0].hash === activity.hash);
          if (isDefined(pendingFound)) {
            dispatch(removePendingActivity(pendingFound[0].hash.toString()));
          }
        })
      );
    },
    [pendingActivities, dispatch]
  );

  useEffect(() => {
    const asyncFunction = async () => {
      const activities = await loadActivity(selectedRpcUrl, selectedAccount, tokenSlug);
      removePending(activities);

      if (activities.length === 0) {
        setIsAllLoaded(true);
      }
      setActivities(activities);
    };

    asyncFunction();
  }, [selectedRpcUrl, selectedAccount, tokenSlug, removePending]);

  const handleUpdate = async () => {
    if (activities.length > 0 && !isAllLoaded) {
      const lastActivityGroup = activities[activities.length - 1].sort((a, b) => b.id - a.id);

      if (lastActivityGroup.length > 0) {
        const lastItem = lastActivityGroup[lastActivityGroup.length - 1];

        if (lastItem.hash !== lastActivityRef.current) {
          lastActivityRef.current = lastItem.hash;

          if (isDefined(lastItem)) {
            const newActivity = await loadActivity(selectedRpcUrl, selectedAccount, tokenSlug, lastItem);

            removePending(newActivity);

            if (newActivity.length === 0) {
              setIsAllLoaded(true);
            }
            setActivities(prev => [...prev, ...newActivity]);
          }
        }
      }
    }
  };

  const filteredPendingActivities = pendingActivities.filter(group =>
    group.some(activity => activity.destination.address === tokenSlug)
  );

  return {
    handleUpdate,
    activities: [...filteredPendingActivities, ...activities]
  };
};
