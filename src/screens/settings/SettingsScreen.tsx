//...............ooooooooooo000000000000 SettingsScreen.tsx 000000000000ooooooooooo...............//
import { View, ScrollView, StyleSheet, Text, Switch } from 'react-native';
import { SettingsSection } from '../../components/SettingsSection';
import CustomButton from '../../components/CustomButton';
import styles from '../../styles/SettingStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomizeAvatarScreen from './CustomizeAvatarScreen';
import TermsAndConditionsScreen from './TermsAndConditionsScreen';
import PrivacyPolicyScreen from './PrivacyPolicyScreen';
import LessonsScreen from './LessonsScreen';
import ExportReportScreen from './ExportReportScreen';
import { useTheme, darkTheme, lightTheme } from '../../styles/ThemeContext';




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

  const navigation = useNavigation<any>();
  const { theme, toggleTheme } = useTheme();


  const settingsSections: SettingsSection[] = [
    {
      header: 'PROFILE SETTINGS',
      items: [
        {
          title: 'Customize Profile',
          onPress: () => navigation.navigate('CustomizeAvatarScreen'),
        },
      ],
    },
    {
      header: 'HELP CENTRE',
      items: [
        {
          title: 'Terms and Conditions',
          onPress: () => navigation.navigate('TermsAndConditionsScreen'),
        },
        {
          title: 'Privacy Policy',
          onPress: () => navigation.navigate('PrivacyPolicyScreen'),
        },
        {
          title: 'Lessons',
          onPress: () => navigation.navigate('LessonScreen'),
        },
      ],
    },
    {
      header: 'EXPORT',
      items: [
        {
          title: 'Export Tracking Information',
          onPress: () => navigation.navigate('ExportReportScreen'),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Switch
        value={theme === darkTheme}
        onValueChange={toggleTheme}
      />
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
          fontFamily='Quittance'
          textColor={theme.text}
          textSize={20}
          buttonColor={theme.lightBlue}
          onPress={() => console.log('Request data deletion')}
        />
        <CustomButton
          title="LOG OUT"
          fontFamily='Quittance'
          textColor='#161616'
          textSize={20}
          buttonColor={theme.orange}
          onPress={() => console.log('Log out')}
        />
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
//...............ooooooooooo000000000000 End Of File 000000000000ooooooooooo...............//
