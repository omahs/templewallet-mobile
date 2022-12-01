import { useSelector } from 'react-redux';

import { NotificationStatus } from '../../enums/notification-status.enum';
import { NotificationType } from '../../enums/notification-type.enum';
import { NotificationInterface } from '../../interfaces/notification.interface';
import { NotificationsRootState } from './notifications-state';

export const useNotificationsSelector = () =>
  useSelector<NotificationsRootState, NotificationInterface[]>(state => {
    const notifications = state.notifications.list.data;

    if (!state.notifications.isNewsEnabled) {
      return notifications.filter(notification => notification.type !== NotificationType.News);
    }

    return notifications;
  });

export const useNotificationsItemSelector = (id: number) =>
  useSelector<NotificationsRootState, NotificationInterface | undefined>(state =>
    state.notifications.list.data.find(notification => notification.id === id)
  );

export const useIsNewNotificationsAvailableSelector = () =>
  useSelector<NotificationsRootState, boolean>(state =>
    state.notifications.list.data.some(notification => notification.status === NotificationStatus.New)
  );

export const useIsNewsEnabledSelector = () =>
  useSelector<NotificationsRootState, boolean>(({ notifications }) => notifications.isNewsEnabled);
