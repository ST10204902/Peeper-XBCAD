//...............ooooooooooo000000000000 SettingsScreen.tsx 000000000000ooooooooooo...............//
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { SettingsSection } from "../../components/SettingsSection";
import CustomButton from "../../components/CustomButton";
import styles from "../../styles/SettingStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import CustomizeAvatarScreen from "./CustomizeAvatarScreen";
import TermsAndConditionsScreen from "./TermsAndConditionsScreen";
import PrivacyPolicyScreen from "./PrivacyPolicyScreen";
import LessonsScreen from "./LessonsScreen";
import ExportReportScreen from "./ExportReportScreen";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useState } from "react";
import DataDeletionConfirmationPopup from "../../components/DataDeletionConfirmationPopup";
import { useStudent } from "../../hooks/useStudent";

/**
 * SettingsScreen component renders the settings screen of the application.
 *
 * This component displays various settings sections including profile settings, help center, and export options.
 * Users can request data deletion, customize their profile, and log out from this screen.
 * A data deletion confirmation popup is shown when users request to delete their data.
 *
 * @component
 * @returns {JSX.Element} The rendered settings screen component.
 *
 * @example
 * // Usage example:
 * <SettingsScreen />
 *
 * @remarks
 * - Displays a confirmation popup for data deletion.
 * - Provides a log out button for signing the user out.
 * - Retrieves and uses the current student and Clerk user to manage actions like data deletion and sign out.
 *
 * @function
 * @name SettingsScreen
 *
 * @hook
 * @name useState
 * @description Used to Manage the state for visibility of the `DataDeletionConfirmationPopup`
 *
 * @hook
 * @name useAuth
 * @description Provides authentication-related functions like sign-out.
 *
 * @hook
 * @name useUser
 * @description Retrieves the currently authenticated Clerk user for account management.
 *
 * @hook
 * @name useNavigation
 * @description Provides navigation methods to move to other screens such as "CustomizeAvatarScreen" and "ExportReportScreen."
 *
 * @callback handleSignOut
 * @description Signs the user out using Clerk's `signOut()` method.
 *
 * @callback handleDataDeletion
 * @description Deletes the current student and Clerk user accounts from the app and database.
 *
 * @callback handleCancel
 * @description Cancels the data deletion request and closes the confirmation popup.
 *
 * @state {boolean} isDeletionPopupShown - State to control the visibility of the data deletion confirmation popup.
 * @state {Student | undefined} currentStudent - Holds the current student data fetched using the `useStudent` hook.
 *
 * @throws Will log errors to the console if any actions such as logging out or deleting the user fail.
 */
export default function SettingsScreen() {
  const { signOut } = useAuth(); // used to sign the Clerk user out
  const { user } = useUser(); // Clerk user for deleting the user's account
  const navigation = useNavigation<any>();
  const [isDeletionPopupShown, setIsDeletionPopupShown] = useState(false); // Visibility of DataDeletionConfirmationPopup shown when a user requests to delete their data
  const { currentStudent } = useStudent(); // Getting student in the database

  // Error if the student number can't be obtained.
  if (currentStudent && !currentStudent.studentNumber) {
    console.error(
      "Settings Screen: Failed to get student's student number. Was null or empty"
    );
  }

  const settingsSections: SettingsSection[] = [
    {
      header: "PROFILE SETTINGS",
      items: [
        {
          title: "Customize Profile",
          onPress: () => navigation.navigate("CustomizeAvatarScreen"),
        },
      ],
    },
    {
      header: "HELP CENTRE",
      items: [
        {
          title: "Terms and Conditions",
          onPress: () => navigation.navigate("TermsAndConditionsScreen"),
        },
        {
          title: "Privacy Policy",
          onPress: () => navigation.navigate("PrivacyPolicyScreen"),
        },
        {
          title: "Lessons",
          onPress: () => navigation.navigate("LessonScreen"),
        },
      ],
    },
    {
      header: "EXPORT",
      items: [
        {
          title: "Export Tracking Information",
          onPress: () => navigation.navigate("ExportReportScreen"),
        },
      ],
    },
  ];

  const handleDataDeletion = () => {
    currentStudent?.delete();
    user?.delete();
    alert("User successfully deleted");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.content}>
          {settingsSections.map((section) => (
            <SettingsSection
              key={section.header}
              header={section.header}
              items={section.items}
            />
          ))}

          <View style={styles.buttonContainer}>
            <CustomButton
              title="REQUEST DATA DELETION"
              fontFamily="Quittance"
              textColor="#161616"
              textSize={20}
              buttonColor="#D9E7FF"
              onPress={() => setIsDeletionPopupShown(true)}
            />
            <CustomButton
              title="LOG OUT"
              fontFamily="Quittance"
              textColor="#161616"
              textSize={20}
              buttonColor="#FE7143"
              onPress={handleSignOut}
            />
          </View>
        </View>
      </ScrollView>
      {isDeletionPopupShown ? (
        <DataDeletionConfirmationPopup
          studentNumber={currentStudent?.studentNumber!}
          onConfirmation={handleDataDeletion}
          onCancel={() => setIsDeletionPopupShown(false)}
        />
      ) : null}
    </SafeAreaView>
  );
}
//...............ooooooooooo000000000000 End Of File 000000000000ooooooooooo...............//
