import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Initialize the active notification ID
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

    // Cancel any existing notification before showing a new one on both platforms
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
    }

    // Create a new notification
    activeNotificationId = await Notifications.scheduleNotificationAsync({
      content,
      trigger: null,
    });

    return activeNotificationId;
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
