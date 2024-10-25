import { Student } from "../databaseModels/databaseClasses/Student";

/**
 * This list contains each of the screens and what they require when being navigated to
 * This exists for the purpose of type safety. If you want to change which props are
 * required when navigating to a screen, change the undefined value for the
 * corresponding screen below
 */
export type RootStackParamsList = {
  LoginScreen: undefined;
  RegisterProfilePhotoScreen: {
    handleSaveStudent: (profilePhotoURL: string) => Promise<void>;
  };
  LoadingScreen: undefined;
  RegisterScreen: undefined;
  SafetyInfoScreen: undefined;
  LandingScreen: undefined;
  ConfirmationScreen: undefined;
  // Bottom Nav Bar
  BottomNavigationBar: undefined;
  // Organisations
  OrgDetails: undefined;
  ManageOrgsScreen: Student;
  RemoveOrgScreen: undefined;
  RequestOrgScreen: undefined;
  RequestProgressScreen: undefined;
  // Settings Screen
  SettingsScreen: undefined;
  CustomizeAvatarScreen: undefined;
  ExportReportScreen: undefined;
  PrivacyPolicyScreen: undefined;
  TermsAndConditionsScreen: undefined;
  OrgDetailsScreen: undefined;
  LessonScreen: undefined;

};
