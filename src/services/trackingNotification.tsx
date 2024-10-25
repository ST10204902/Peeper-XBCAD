import * as Notifications from "expo-notifications";
import { Platform } from "react-native";


// Define a constant identifier for iOS notifications
const IOS_NOTIFICATION_IDENTIFIER = 'tracking-notification';

/**
 * Requests notification permissions from the user.
 *
 * This function uses the Notifications.requestPermissionsAsync method to request
 * notification permissions. If the permissions are granted, it returns true.
 * Otherwise, it returns false.
 *
 * @returns {Promise<boolean>} A promise that resolves to true if the permissions
 * are granted, and false otherwise.
 *
 * @throws {Error} If there is an error while requesting notification permissions,
 * it catches the error and returns false.
 */
export const requestNotificationPermissions = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * A variable to store the ID of the currently active notification.
 * For iOS, this will always be IOS_NOTIFICATION_IDENTIFIER
 * For Android, it will be the dynamically generated ID
 */
let activeNotificationId: string | null = null;

/**
 * Formats the elapsed time into a human-readable string.
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
 */
export const showOrUpdateTrackingNotification = async (orgName: string, elapsedTime: number) => {
  try {
    const validElapsedTime = Math.max(0, Math.floor(elapsedTime));

    // Cancel any existing notification
    if (activeNotificationId) {
      await Notifications.dismissNotificationAsync(activeNotificationId);
    }

    const content: Notifications.NotificationContentInput = {
      title: `Tracking at ${orgName}`,
      body: `You have logged ${formatElapsedTime(validElapsedTime)} at ${orgName}`,
      data: { orgName, elapsedTime: validElapsedTime },
      categoryIdentifier: "tracking",
      sound: "default",
      priority: Notifications.AndroidNotificationPriority.HIGH,
      badge: 1,
    };

    if (Platform.OS === "ios") {
      content.subtitle = "Time Tracking";
      
      // For iOS, we'll use a consistent identifier
      activeNotificationId = IOS_NOTIFICATION_IDENTIFIER;
      
      // On iOS, we need to use the identifier option to update the same notification
      return await Notifications.scheduleNotificationAsync({
        content,
        trigger: null,
        identifier: IOS_NOTIFICATION_IDENTIFIER
      });
    } else {
      // For Android, continue with the current behavior
      activeNotificationId = await Notifications.scheduleNotificationAsync({
        content,
        trigger: null,
      });
      return activeNotificationId;
    }
  } catch (error) {
    console.error("Error showing/updating notification:", error);
    return null;
  }
};

/**
 * Clears the currently active tracking notification, if any.
 */
export const clearTrackingNotification = async () => {
  if (activeNotificationId) {
    await Notifications.dismissNotificationAsync(activeNotificationId);
    activeNotificationId = null;
  }
};