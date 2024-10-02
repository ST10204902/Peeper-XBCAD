// App.tsx
import React from 'react';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { RecoilRoot } from "recoil";
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
import FontLoader from './src/components/FontLoader'; // Import FontLoader


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function OrganisationsNavigator() {
  return (
    <Stack.Navigator initialRouteName="OrgDetails">
      <Stack.Screen
        name="OrgDetails"
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

function BottomNavigationBar() {
  return (
    <Tab.Navigator>
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
  return (
    <Stack.Navigator initialRouteName="RegisterScreen">
      {/* Change the initialRouteName to your required screen name for testing purposes */}
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
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SafetyInfoScreen"
        component={SafetyInfoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BottomNavigationBar"
        component={BottomNavigationBar}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <FontLoader>
      <RecoilRoot>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </RecoilRoot>
    </FontLoader>
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