/**
 * This list contains each of the screens and what they require when being navigated to
 * This exists for the purpose of type safety. If you want to change which props are
 * required when navigating to a screen, change the undefined value for the
 * corresponding screen below
 */
export type RootStackParamsList = {
  LoginScreen: undefined;
  RegisterProfilePhotoScreen: undefined;
  RegisterScreen: undefined;
  SafetyInfoScreen: undefined;
  // Bottom Nav Bar
  BottomNavigationBar: undefined;
  // Organisations
  ManageOrgsScreen: undefined;
  RemoveOrgScreen: undefined;
  RequestOrgScreen: undefined;
  RequestProgressScreen: undefined;
  // Settings Screen
  CustomizeAvatarScreen: undefined;
  ExportReportScreen: undefined;
  PrivacyPolicyScreen: undefined;
  TermsAndConditionsScreen: undefined;
};
