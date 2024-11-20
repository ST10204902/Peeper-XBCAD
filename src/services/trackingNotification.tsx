import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { trackingState } from "../atoms/atoms";
import { useSetRecoilState } from "recoil";

// Define a constant identifier for iOS notifications
const IOS_NOTIFICATION_IDENTIFIER = "tracking-notification";

// Add notification category configuration
Notifications.setNotificationCategoryAsync("tracking", [
  {
    identifier: "stop_tracking",
    buttonTitle: "Stop Tracking",
    options: {
      isDestructive: true,
    },
  },
]);

// Add notification handler setup
Notifications.addNotificationResponseReceivedListener(response => {
  if (response.actionIdentifier === "stop_tracking") {
    // Update tracking state
    const setTrackingAtom = useSetRecoilState(trackingState);
    setTrackingAtom({ isTracking: false, organizationName: "" });
  }
});

/**
 * Requests notification permissions from the user.
 */
export const requestNotificationPermissions = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      return false;
    }
    return true;
  } catch {
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
      seconds,
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

    const content: Notifications.NotificationContentInput = {
      title: `Tracking at ${orgName}`,
      body: `You have logged ${formatElapsedTime(validElapsedTime)} at ${orgName}`,
      data: { orgName, elapsedTime: validElapsedTime },
      categoryIdentifier: "tracking",
      sound: "", // Disable sound for updates
      priority: Notifications.AndroidNotificationPriority.HIGH,
      badge: 1,
      sticky: true, // Make notification persistent
    };

    // Set platform-specific options
    if (Platform.OS === "ios") {
      content.subtitle = "Time Tracking";
      activeNotificationId = IOS_NOTIFICATION_IDENTIFIER;
    }

    // If we already have an active notification, update it
    if (activeNotificationId !== null && activeNotificationId !== "") {
      await Notifications.scheduleNotificationAsync({
        content,
        trigger: null,
        identifier: activeNotificationId,
      });
    } else {
      // Create new notification if none exists
      const id = await Notifications.scheduleNotificationAsync({
        content,
        trigger: null,
        identifier: Platform.OS === "ios" ? IOS_NOTIFICATION_IDENTIFIER : undefined,
      });

      if (Platform.OS === "android") {
        activeNotificationId = id;
      }
    }

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
  if (activeNotificationId !== null && activeNotificationId !== "") {
    try {
      if (Platform.OS === "ios") {
        await Notifications.cancelScheduledNotificationAsync(activeNotificationId);
      } else {
        await Notifications.dismissNotificationAsync(activeNotificationId);
      }
    } catch (error) {
      console.error("Error clearing notification:", error);
    }
    activeNotificationId = null;
  }
};
