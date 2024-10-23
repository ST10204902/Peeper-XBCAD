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
 * Bottom Tab Navigator for managing navigation between the main app screens.
 * This object provides navigation for the bottom tab bar.
 */
const Tab = createBottomTabNavigator();

/**
 * Stack Navigator for managing navigation between screens.
 */
const Stack = createStackNavigator<RootStackParamsList>();

/**
 * Navigator for the Organisations tab.
 * This component manages the navigation within the Organisations section of the app,
 * including transitions between organisation details, management, removal, and request screens.
 *
 * @returns {JSX.Element} A stack navigator for the Organisations screens.
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
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

/**
 * Navigator for the Settings tab.
 * This component manages the navigation within the Settings section of the app,
 * including transitions between screens such as settings, customization,
 * reports, and legal documents.
 *
 * @returns {JSX.Element} A stack navigator for the Settings screens.
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
 * Screen options for the Bottom Navigation Bar (Tab Navigator).
 * Defines the styles and behaviors of the bottom navigation bar, including
 * custom tab icons and color schemes for active/inactive states.
 *
 * @param {Object} route - The route object for determining the active screen.
 * @returns {Object} A set of options for styling and behavior of the bottom navigation.
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
 * Bottom Navigation Bar component.
 * This component provides a tab-based navigation bar at the bottom of the app
 * with tabs for Landing, Organisations, and Settings. It includes custom styling
 * for the active/inactive states of each tab and handles screen transitions.
 *
 * @returns {JSX.Element} A tab navigator for navigating between the main app sections.
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
 * Root Navigator component for the app.
 * This component manages the app's navigation flow, handling both the login/onboarding process
 * and the main navigation (BottomNavigationBar) once the user is signed in and has completed onboarding.
 * It dynamically switches between the login screens and the main app based on the user's state.
 *
 * @returns {JSX.Element} A stack navigator that controls app navigation flow.
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
// End of File
