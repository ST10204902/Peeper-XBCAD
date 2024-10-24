import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Requests notification permissions from the user.
 *
 * This function uses the `Notifications.requestPermissionsAsync` method to request
 * notification permissions. If the permissions are granted, it returns `true`.
 * Otherwise, it returns `false`.
 *
 * @returns {Promise<boolean>} A promise that resolves to `true` if the permissions
 * are granted, and `false` otherwise.
 *
 * @throws {Error} If there is an error while requesting notification permissions,
 * it catches the error and returns `false`.
 */
export const requestNotificationPermissions = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
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

/**
 * A variable to store the ID of the currently active notification.
 * It can be either a string representing the notification ID or null if no notification is active.
 */
let activeNotificationId: string | null = null;

/**
 * Formats the elapsed time into a human-readable string.
 *
 * @param elapsedTime - The elapsed time in seconds.
 * @returns A formatted string representing the elapsed time in hours, minutes, or seconds.
 *
 * @example
 * ```typescript
 * formatElapsedTime(3661); // "01:01:01 hours"
 * formatElapsedTime(61);   // "01:01 minutes"
 * formatElapsedTime(59);   // "59 seconds"
 * ```
 */
const formatElapsedTime = (elapsedTime: number): string => {
  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = elapsedTime % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")} hours`;
  } else if (minutes > 0) {
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} minutes`;
  } else {
    return `${String(seconds).padStart(2, "0")} seconds`;
  }
};

/**
 * Displays or updates a tracking notification with the given organization name and elapsed time.
 *
 * @param {string} orgName - The name of the organization being tracked.
 * @param {number} elapsedTime - The elapsed time in milliseconds.
 * @returns {Promise<string | null>} - A promise that resolves to the notification ID if successful, or null if an error occurs.
 *
 * @example
 * ```typescript
 * const notificationId = await showOrUpdateTrackingNotification('My Organization', 3600000);
 * console.log(notificationId);
 * ```
 */
export const showOrUpdateTrackingNotification = async (orgName: string, elapsedTime: number) => {
  try {
    const formattedTime = formatElapsedTime(elapsedTime);
    const content: Notifications.NotificationContentInput = {
      title: `Tracking at ${orgName}`,
      body: `You have logged ${formattedTime} at ${orgName}`,
      data: { orgName, elapsedTime },
      categoryIdentifier: "tracking",
      sound: "default",
      priority: Notifications.AndroidNotificationPriority.HIGH,
      color: "#FF0000", // Red color for the notification icon (Android only)
      badge: 1,
    };

    if (Platform.OS === "ios") {
      content.subtitle = "Time Tracking";
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

/**
 * Clears the currently active tracking notification, if any.
 *
 * This function checks if there is an active notification ID. If there is,
 * it cancels the scheduled notification associated with that ID and then
 * sets the `activeNotificationId` to null.
 *
 * @returns {Promise<void>} A promise that resolves when the notification is cleared.
 */
export const clearTrackingNotification = async () => {
  if (activeNotificationId) {
    await Notifications.cancelScheduledNotificationAsync(activeNotificationId);
    //console.log(`Notification cleared with ID: ${activeNotificationId}`);
    activeNotificationId = null;
  }
};

/**
 * Checks the current notification settings for the application.
 *
 * This function retrieves the current notification permissions using the
 * `Notifications.getPermissionsAsync` method and logs the settings to the console.
 *
 * @returns {Promise<void>} A promise that resolves when the notification settings have been retrieved.
 */
export const checkNotificationSettings = async () => {
  const settings = await Notifications.getPermissionsAsync();
  //console.log('Notification settings:', settings);
};
//------------------------***EOF***-----------------------------//
