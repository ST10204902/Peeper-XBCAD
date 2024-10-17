import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

export const registerForPushNotifications = async () => {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  if (status !== 'granted') {
    const { status: newStatus } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (newStatus !== 'granted') {
      alert('Permission to send notifications was denied!');
      return;
    }
  }

  const token = await Notifications.getExpoPushTokenAsync();
  console.log(token); // Send this token to your backend
};
