import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../styles/ThemeContext';
import { lightTheme, darkTheme } from '../styles/themes'; // Import themes

interface SettingsListItemProps extends SettingsSectionItem {
  isLast?: boolean;
}

/**
 * A component that renders a settings list item with a title, optional chevron, and optional bottom border.
 * 
 * @param {Object} props - The properties object.
 * @param {string} props.title - The title of the settings list item.
 * @param {function} props.onPress - The function to call when the item is pressed.
 * @param {boolean} [props.showChevron=true] - Whether to show the chevron icon.
 * @param {boolean} [props.isLast=false] - Whether this item is the last in the list, affecting the bottom border.
 * 
 * @returns {JSX.Element} The rendered settings list item component.
 */
export const SettingsListItem = ({ 
  title, 
  onPress, 
  showChevron = true,
  isLast = false 
}: SettingsListItemProps) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.itemContainer,
        !isLast && styles.borderBottom
      ]}
    >
      <Text style={[styles.itemText, { color: theme.fontSecondary }]}>{title}</Text>
      {showChevron && (
        <Text style={[styles.chevron, { color: theme.fontSecondary }]}>›</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  itemText: {
    fontFamily: 'Rany-Medium',
    fontSize: 16,
  },
  chevron: {
    fontSize: 20,
  },
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'transparent',
  },
});