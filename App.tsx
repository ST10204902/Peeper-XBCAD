import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { NavigationContainer } from "@react-navigation/native";
import { RecoilRoot } from "recoil";
import { ClerkProvider } from "@clerk/clerk-expo";
import FontLoader from "./src/components/FontLoader";
import CurrentTrackingBanner from "./src/components/CurrentTrackingBanner";
import AppNavigator from "./src/screens/Navigation";
import * as Notifications from "expo-notifications";
import { ThemeProvider } from "./src/styles/ThemeContext";
import { Platform } from "react-native";
import "react-native-get-random-values";

/**
 * App component
 *
 * The root component of the application that sets up navigation, authentication, and global state management.
 * It integrates Clerk for authentication, Recoil for state management, and Expo libraries for notifications
 * and secure storage. This component serves as the main entry point to the app.
 *
 * @component
 * @example
 * <App />
 *
 * @returns {JSX.Element} The root of the app with providers for Clerk, Recoil, and navigation.
 *
 * @remarks
 * - This component initializes Clerk using the publishable key from the environment variables.
 * - It sets up local secure token storage using Expo's SecureStore and integrates push notification services via Expo.
 * - The AppNavigator component manages the navigation between screens.
 *
 * @throws {Error} Throws an error if the `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is missing.
 */
export default function App() {
  // The publishableKey necessary for Clerk to authenticate requests and connect the app to the correct project in their system.
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  // Throwing an error if the publishableKey required by Clerk is missing
  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }


 

  // Configure how notifications are handled
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.HIGH
  }),
});

// Set up Android notification channel
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('tracking', {
    name: 'Location Tracking',
    importance: Notifications.AndroidImportance.HIGH,
    enableVibrate: false,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    enableLights: false,
    showBadge: true,
  });
}
 

  // Configure how notifications are handled
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.HIGH
  }),
});

// Set up Android notification channel
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('tracking', {
    name: 'Location Tracking',
    importance: Notifications.AndroidImportance.HIGH,
    enableVibrate: false,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    enableLights: false,
    showBadge: true,
  });
}

  // Cache for storing the jwt token used for persistent login
  const localTokenCache = {
    /**
     * Retrieves a stored token by its key.
     * Used for fetching tokens during login sessions.
     *
     * @param {string} key - The key identifying the token.
     * @returns {Promise<string | null>} - The token or null if not found or on error.
     */
    async getToken(key: string) {
      // Attempt to retrieve token from secure storage
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`${key} was used 🔐 \n`);
        } else {
          console.log("No values stored under key: " + key);
        }
        return item; // Return token if found
      } catch (error) {
        console.error("SecureStore get item error: ", error);
        await SecureStore.deleteItemAsync(key); // Clean up storage if retrieval fails
        return null;
      }
    },

    /**
     * Stores a token securely using a key.
     * Used for saving tokens during login and persisting user sessions.
     *
     * @param {string} key - The key under which the token is saved.
     * @param {string} value - The token to be stored securely.
     */
    async saveToken(key: string, value: string) {
      try {
        // Save the token securely in storage
        return SecureStore.setItemAsync(key, value);
      } catch (err) {
        return;
      }
    },
  };

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={localTokenCache}>
      <FontLoader>
        <ThemeProvider>
          <RecoilRoot>
            <CurrentTrackingBanner />
            <NavigationContainer>
              <SafeAreaView></SafeAreaView>
              <AppNavigator />
            </NavigationContainer>
          </RecoilRoot>
        </ThemeProvider>
      </FontLoader>
    </ClerkProvider>
  );
}
// End of File
