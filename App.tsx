// App.tsx
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { NavigationContainer } from "@react-navigation/native";
import { RecoilRoot } from "recoil";
import { ClerkProvider } from "@clerk/clerk-expo"; // Load the Clerk API from the .env file
import FontLoader from "./src/components/FontLoader";
import CurrentTrackingBanner from "./src/components/CurrentTrackingBanner";
import AppNavigator from "./src/screens/Navigation";
import { registerForPushNotifications } from "./src/services/RequestNotificationPermissions";
import * as Notifications from "expo-notifications";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

/**
 * App component for entry into the applicaiton
 * @returns a new App component
 */
export default function App() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const localTokenCache = {
    async getToken(key: string) {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`${key} was used 🔐 \n`);
        } else {
          console.log("No values stored under key: " + key);
        }
        return item;
      } catch (error) {
        console.error("SecureStore get item error: ", error);
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return SecureStore.setItemAsync(key, value);
      } catch (err) {
        return;
      }
    },
  };

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={localTokenCache}>
      <FontLoader>
        <RecoilRoot>
          <CurrentTrackingBanner />
          <NavigationContainer>
            <SafeAreaView></SafeAreaView>
            <AppNavigator />
          </NavigationContainer>
        </RecoilRoot>
      </FontLoader>
    </ClerkProvider>
  );
}
// End of File
