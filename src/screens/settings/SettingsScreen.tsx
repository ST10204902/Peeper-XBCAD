import { View, StyleSheet, Text, Switch, Alert } from "react-native";
import { SettingsSection } from "../../components/SettingsSection";
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import DataDeletionConfirmationPopup from "../../components/DataDeletionConfirmationPopup";
import { useTheme } from "../../styles/ThemeContext";
import { lightTheme, darkTheme } from "../../styles/themes";
import { useCurrentStudent } from "../../hooks/useCurrentStudent";
import PDFShareComponent from "../../components/PDFShareComponent";
import { useRecoilState } from "recoil";
import { trackingState } from "../../atoms/atoms";

// Define navigation type
type SettingsNavigationType = {
  navigate: (screen: string) => void;
};

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const { signOut } = useAuth();
  const { user } = useUser();
  const navigation = useNavigation<SettingsNavigationType>();
  const [trackingAtom, setTrackingAtom] = useRecoilState(trackingState);

  const [isDeletionPopupShown, setIsDeletionPopupShown] = useState(false);
  const { currentStudent, updateCurrentStudent } = useCurrentStudent();

  if (currentStudent && !currentStudent.studentNumber) {
    console.error("Settings Screen: Failed to get student's student number. Was null or empty");
  }

  useEffect(() => {
    if (currentStudent?.darkMode !== null && currentStudent?.darkMode !== undefined) {
      if (isDarkMode !== currentStudent.darkMode) {
        toggleTheme();
      }
    }
  }, [currentStudent?.darkMode, isDarkMode, toggleTheme]);

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
    if (trackingAtom.isTracking) {
      setTrackingAtom({ isTracking: false, organizationName: "" });
    }
    user?.delete();
    Alert.alert("User successfully deleted");
    navigation.navigate("Login");
  };

  const handleSignOut = async () => {
    try {
      if (trackingAtom.isTracking) {
        setTrackingAtom({ isTracking: false, organizationName: "" });
      }
      await signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: theme.fontRegular }]}>SETTINGS</Text>
          <View style={styles.darkModeContainer}>
            <Text style={[styles.darkModeText, { color: theme.fontRegular }]}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={x => {
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
          {settingsSections.map(section => (
            <SettingsSection key={section.header} header={section.header} items={section.items} />
          ))}

          <View style={styles.buttonContainer}>
            {!trackingAtom.isTracking && <PDFShareComponent />}
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
      </View>
      {isDeletionPopupShown &&
        currentStudent?.studentNumber !== "" &&
        currentStudent?.studentNumber !== null &&
        currentStudent && (
          <DataDeletionConfirmationPopup
            studentNumber={currentStudent.studentNumber}
            onConfirmation={handleDataDeletion}
            onCancel={() => setIsDeletionPopupShown(false)}
          />
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
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
    flex: 1,
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
