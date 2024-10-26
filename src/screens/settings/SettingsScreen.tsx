import { View, ScrollView, StyleSheet, Text, Switch } from "react-native";
import { SettingsSection } from "../../components/SettingsSection";
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import CustomizeAvatarScreen from "./CustomizeAvatarScreen";
import TermsAndConditionsScreen from "./TermsAndConditionsScreen";
import PrivacyPolicyScreen from "./PrivacyPolicyScreen";
import LessonsScreen from "./LessonsScreen";
import ExportReportScreen from "./ExportReportScreen";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import DataDeletionConfirmationPopup from "../../components/DataDeletionConfirmationPopup";
import { useTheme } from "../../styles/ThemeContext";
import { lightTheme, darkTheme } from "../../styles/themes";
import { useCurrentStudent } from "../../hooks/useCurrentStudent";
import PDFShareComponent from "../../components/PDFShareComponent";

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const { signOut } = useAuth(); // used to sign the Clerk user out
  const { user } = useUser(); // Clerk user for deleting the user's account
  const navigation = useNavigation<any>();

  const [isDeletionPopupShown, setIsDeletionPopupShown] = useState(false); // Visibility of DataDeletionConfirmationPopup shown when a user requests to delete their data
  const { currentStudent, updateCurrentStudent } = useCurrentStudent(); // Getting student in the database

  // Error if the student number can't be obtained.
  if (currentStudent && !currentStudent.studentNumber) {
    console.error(
      "Settings Screen: Failed to get student's student number. Was null or empty"
    );
  }

  useEffect(() => {
    if (
      currentStudent?.darkMode !== null &&
      currentStudent?.darkMode !== undefined
    ) {
      if (isDarkMode !== currentStudent.darkMode) {
        toggleTheme();
      }
    }
  }, [currentStudent?.darkMode]);

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
      items: [],
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        {/* Header Section with Dark Mode Toggle */}
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: theme.fontRegular }]}>
            SETTINGS
          </Text>
          <View style={styles.darkModeContainer}>
            <Text style={[styles.darkModeText, { color: theme.fontRegular }]}>
              Dark Mode
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={(x) => {
                updateCurrentStudent({ darkMode: x });
                toggleTheme();
              }}
              trackColor={{ false: "#767577", true: "#4CD964" }}
              thumbColor={isDarkMode ? "#ffffff" : "#f4f3f4"}
              ios_backgroundColor="#767577"
              style={styles.switch}
            />
          </View>
        </View>

        <View style={[styles.content, { backgroundColor: theme.background }]}>
          {settingsSections.map((section) => (
            <SettingsSection
              key={section.header}
              header={section.header}
              items={section.items}
            />
          ))}

          <View style={styles.buttonContainer}>
            <PDFShareComponent />
            <CustomButton
              title="REQUEST DATA DELETION"
              fontFamily="Quittance"
              textColor={theme.fontRegular}
              textSize={20}
              buttonColor={theme.settingsBlueButton}
              onPress={() => {
                setIsDeletionPopupShown(true);
              }}
            />
            <CustomButton
              title="LOG OUT"
              fontFamily="Quittance"
              textColor={theme.fontRegular}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 32,
  },
  content: {
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontFamily: "Quittance",
  },
  buttonContainer: {
    gap: 12,
  },
  darkModeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  darkModeText: {
    fontSize: 16,
    fontFamily: "Rany-Regular",
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
});
