// App.tsx
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Linking, StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { RecoilRoot } from "recoil";
import { ClerkProvider, SignedIn, SignedOut, useUser } from "@clerk/clerk-expo"; // Load the Clerk API from the .env file
import LandingScreen from "./src/screens/LandingScreen";
import SettingsScreen from "./src/screens/settings/SettingsScreen";
import OrgDetailsScreen from "./src/screens/organisation/OrgDetailsScreen";
import ManageOrgsScreen from "./src/screens/organisation/ManageOrgsScreen";
import RemoveOrgScreen from "./src/screens/organisation/RemoveOrgScreen";
import RequestOrgScreen from "./src/screens/organisation/RequestOrgScreen";
import RequestProgressScreen from "./src/screens/organisation/RequestProgressScreen";
import CustomizeAvatarScreen from "./src/screens/settings/CustomizeAvatarScreen";
import ExportReportScreen from "./src/screens/settings/ExportReportScreen";
import PrivacyPolicyScreen from "./src/screens/settings/PrivacyPolicyScreen";
import TermsAndConditionsScreen from "./src/screens/settings/TermsAndConditionsScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterProfilePhotoScreen from "./src/screens/RegisterProfilePhotoScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import SafetyInfoScreen from "./src/screens/SafetyInfoScreen";
import { RootStackParamsList } from "./src/screens/RootStackParamsList";
import FontLoader from "./src/components/FontLoader"; // Import FontLoader
import LandingIcon from "./src/assets/icons/LandingIcon";
import OrgDetailsIcon from "./src/assets/icons/OrgDetailsIcon";
import SettingsIcon from "./src/assets/icons/SettingsIcon";
import CurrentTrackingBanner from "./src/components/CurrentTrackingBanner";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamsList>();
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

function OrganisationsNavigator() {
  return (
    <Stack.Navigator initialRouteName="OrgDetailsScreen">
      <Stack.Screen
        name="OrgDetailsScreen"
        component={OrgDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageOrgsScreen"
        component={ManageOrgsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RemoveOrgScreen"
        component={RemoveOrgScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RequestOrgScreen"
        component={RequestOrgScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RequestProgressScreen"
        component={RequestProgressScreen}
      />
    </Stack.Navigator>
  );
}

function SettingsNavigator() {
  return (
    <Stack.Navigator initialRouteName="SettingsScreen">
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CustomizeAvatarScreen"
        component={CustomizeAvatarScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ExportReportScreen" component={ExportReportScreen} />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TermsAndConditionsScreen"
        component={TermsAndConditionsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const screenOptions = ({ route }: { route: any }) => ({
  tabBarActiveTintColor: "#4F4F4F",
  tabBarInactiveTintColor: "#969696",
  tabBarStyle: {
    backgroundColor: "#F6F6F6",
    paddingBottom: 40,
    paddingTop: 35,
    height: 90,
  },
  tabBarShowLabel: false,
  tabBarIcon: ({ focused }: { focused: boolean }) => {
    let iconName;

    if (route.name === "Landing") {
      return focused ? (
        <LandingIcon size={44} color={"#4F4F4F"} />
      ) : (
        <LandingIcon size={38} color={"#969696"} />
      );
    } else if (route.name === "Organisations") {
      return focused ? (
        <OrgDetailsIcon size={44} color={"#4F4F4F"} />
      ) : (
        <OrgDetailsIcon size={38} color={"#969696"} />
      );
    } else if (route.name === "Settings") {
      return focused ? (
        <SettingsIcon size={44} color={"#4F4F4F"} />
      ) : (
        <SettingsIcon size={38} color={"#969696"} />
      );
    }
  },
});

function BottomNavigationBar() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Landing"
        component={LandingScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Organisations"
        component={OrganisationsNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isSignedIn } = useUser(); // Fetch Clerk user state

  return (
    <Stack.Navigator initialRouteName="RegisterScreen">
      {isSignedIn ? (
        <>
          <Stack.Screen
            name="LandingScreen"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BottomNavigationBar"
            component={BottomNavigationBar}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegisterProfilePhotoScreen"
            component={RegisterProfilePhotoScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SafetyInfoScreen"
            component={SafetyInfoScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <FontLoader>
        <RecoilRoot>
          {/* Safe Area view goes above */}
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </RecoilRoot>
      </FontLoader>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
