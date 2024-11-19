import { View, Text, StyleSheet } from "react-native";
import { SettingsListItem } from "./SettingsListItem";
import { useTheme } from "../styles/ThemeContext";
import { lightTheme, darkTheme } from "../styles/themes"; // Import themes

interface SettingsSectionProps {
  header: string;
  items: SettingsSectionItem[];
}

/**
 * A functional component that renders a settings section with a header and a list of items.
 *
 * @param {SettingsSectionProps} props - The properties for the SettingsSection component.
 * @param {string} props.header - The header text for the settings section.
 * @param {Array<SettingsListItemProps>} props.items - An array of items to be displayed in the settings section.
 *
 * @returns {JSX.Element} The rendered settings section component.
 */
export const SettingsSection = ({ header, items }: SettingsSectionProps) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionHeader, { color: theme.fontRegular }]}>{header}</Text>
      <View style={[styles.sectionContent, { backgroundColor: theme.background }]}>
        {items.map((item, index) => (
          <SettingsListItem key={item.title} {...item} isLast={index === items.length - 1} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 26,
    marginBottom: 8,
    fontFamily: "Quittance",
  },
  sectionContent: {
    borderRadius: 12,
    overflow: "hidden",
  },
});
