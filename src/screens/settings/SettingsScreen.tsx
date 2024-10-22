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
 * The `SettingsScreen` component renders a settings screen with various sections and items.
 * Each section contains a header and a list of items, each with a title and an onPress handler.
 * The screen also includes buttons for requesting data deletion and logging out.
 *
 * @returns {JSX.Element} The rendered settings screen component.
 */

/**
 * SettingsScreen component renders the settings screen of the application.
 * It displays various sections of settings including profile settings, help centre, and export options.
 * Each section contains items that can be pressed to navigate to different parts of the application.
 * Additionally, it provides buttons for requesting data deletion and logging out.
 *
 * @returns {JSX.Element} The rendered settings screen component.
 */
export default function SettingsScreen() {
  const { signOut } = useAuth(); // used to sign the Clerk user out
  const { user } = useUser(); // Clerk user for deleting the user's account
  const navigation = useNavigation<any>();
  // Hook used to set the visibility of the confirmation popup shown when a user requests to delete their data
  const [isDeletionPopupShown, setIsDeletionPopupShown] = useState(false);
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
