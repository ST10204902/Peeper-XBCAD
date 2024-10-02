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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BottomNavigationBar() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Landing" component={LandingScreen} />
      <Tab.Screen name="OrgDetails" component={OrgDetailsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="RegisterScreen">
      {/* Change the initialRouteName to your required screen name for testing purposes */}
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen
        name="RegisterProfilePhotoScreen"
        component={RegisterProfilePhotoScreen}
      />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="SafetyInfoScreen" component={SafetyInfoScreen} />
      {/* Bottom Navigation Bar - includes navbar screens*/}
      <Stack.Screen
        name="BottomNavigationBar"
        component={BottomNavigationBar}
      />
      {/* Organisations Screens */}
      <Stack.Screen name="ManageOrgsScreen" component={ManageOrgsScreen} />
      <Stack.Screen name="RemoveOrgScreen" component={RemoveOrgScreen} />
      <Stack.Screen name="RequestOrgScreen" component={RequestOrgScreen} />
      <Stack.Screen
        name="RequestProgressScreen"
        component={RequestProgressScreen}
      />
      {/* Settings Screens */}
      <Stack.Screen
        name="CustomizeAvatarScreen"
        component={CustomizeAvatarScreen}
      />
      <Stack.Screen name="ExportReportScreen" component={ExportReportScreen} />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
      />
      <Stack.Screen
        name="TermsAndConditionsScreen"
        component={TermsAndConditionsScreen}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </RecoilRoot>
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
