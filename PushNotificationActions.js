import {
  NEW_MESSAGE_NOTIF,
  RESET_CAME_FROM_NOTIFICATION
} from './types';

export const newMessage = (cameFromNotification, notificationOnChannel, notificationOnChannelId) => {
  return (dispatch) => {
    dispatch({ type: NEW_MESSAGE_NOTIF, payload: { cameFromNotification, notificationOnChannel, notificationOnChannelId } });
  };
};

export const resetCameFromNotification = () => {
  return (dispatch) => {
    dispatch({ type: RESET_CAME_FROM_NOTIFICATION });
  };
}
