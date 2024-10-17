import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const requestNotificationPermissions = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      //console.log('Notification permissions not granted!');
      return false;
    }
    //console.log('Notification permissions granted!');
    return true;
  } catch (error) {
    //console.error('Error requesting notification permissions:', error);
    return false;
  }
};

let activeNotificationId: string | null = null;

const formatElapsedTime = (elapsedTime: number): string => {
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;
  
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} hours`;
    } else if (minutes > 0) {
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} minutes`;
    } else {
      return `${String(seconds).padStart(2, '0')} seconds`;
    }
  };

export const showOrUpdateTrackingNotification = async (orgName: string, elapsedTime: number) => {
    try {
        const formattedTime = formatElapsedTime(elapsedTime);
      const content: Notifications.NotificationContentInput = {
        title: `Tracking at ${orgName}`,
        body: `You have logged ${formattedTime} at ${orgName}`,
        data: { orgName, elapsedTime },
        categoryIdentifier: 'tracking',
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        color: '#FF0000', // Red color for the notification icon (Android only)
        badge: 1,
      };

      if (Platform.OS === 'ios') {
        content.subtitle = 'Time Tracking';
      }

      const trigger = null;
  
      if (activeNotificationId) {
        // Update existing notification
        await Notifications.scheduleNotificationAsync({
          identifier: activeNotificationId,
          content,
          trigger,
        });
        //console.log(`Notification updated with ID: ${activeNotificationId}`);
      } else {
        // Create new notification
        activeNotificationId = await Notifications.scheduleNotificationAsync({
          content,
          trigger,
        });
        //console.log(`New notification created with ID: ${activeNotificationId}`);
      }
  
      return activeNotificationId;
    } catch (error) {
      //console.error("Error scheduling/updating notification:", error);
      return null;
    }
  };
  
  export const clearTrackingNotification = async () => {
    if (activeNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(activeNotificationId);
      //console.log(`Notification cleared with ID: ${activeNotificationId}`);
      activeNotificationId = null;
    }
  };

export const checkNotificationSettings = async () => {
  const settings = await Notifications.getPermissionsAsync();
  //console.log('Notification settings:', settings);
};