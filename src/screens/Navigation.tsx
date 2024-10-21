import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamsList } from "./RootStackParamsList";
import { useUser } from "@clerk/clerk-expo";
import LandingIcon from "../assets/icons/LandingIcon";
import OrgDetailsIcon from "../assets/icons/OrgDetailsIcon";
import SettingsIcon from "../assets/icons/SettingsIcon";
import OrgDetailsScreen from "./organisation/OrgDetailsScreen";
import ManageOrgsScreen from "./organisation/ManageOrgsScreen";
import RemoveOrgScreen from "./organisation/RemoveOrgScreen";
import RequestOrgScreen from "./organisation/RequestOrgScreen";
import RequestProgressScreen from "./organisation/RequestProgressScreen";
import SettingsScreen from "./settings/SettingsScreen";
import CustomizeAvatarScreen from "./settings/CustomizeAvatarScreen";
import PrivacyPolicyScreen from "./settings/PrivacyPolicyScreen";
import ExportReportScreen from "./settings/ExportReportScreen";
import TermsAndConditionsScreen from "./settings/TermsAndConditionsScreen";
import ExportLessonScreen from "./settings/LessonsScreen";
import LandingScreen from "./LandingScreen";
import RegisterScreen from "./RegisterScreen";
import LoginScreen from "./LoginScreen";
import RegisterProfilePhotoScreen from "./RegisterProfilePhotoScreen";
import SafetyInfoScreen from "./SafetyInfoScreen";
import React from "react";

/**
 * Object for managing navigation for the BottomNavigationBar
 */
const Tab = createBottomTabNavigator();

/**
 * Object for managing all the navigation
 */
const Stack = createStackNavigator<RootStackParamsList>();

/**
 * Navigation component for navigation under the Organisations tab on the bottom navigation bar
 * @returns a new OrganisationsNavigator component
 */
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

/**
 * Navigation component for navigation under the Settings tab on the bottom navigation bar
 * @returns a new SettingsNavigator component
 */
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
      <Stack.Screen
        name="LessonScreen"
        component={ExportLessonScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

/**
 * Screen options for the bottom tab bar (BottomNavigationBar)
 * @returns a new screenOptions component
 */
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

/**
 * Navigation component for the navbar in the application
 * @returns a new BottomNavigationBar Component
 */
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

/**
 * Navigation component for navigation under the Settings tab on the bottom navigation bar
 * @returns a new SettingsNavigator component
 */
export default function AppNavigator() {
  const { isSignedIn, user } = useUser(); // Fetch Clerk user state
  const onboardingComplete = user?.unsafeMetadata?.onboardingComplete;

  return (
    <Stack.Navigator initialRouteName="RegisterScreen">
      {isSignedIn && onboardingComplete ? (
        <>
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
