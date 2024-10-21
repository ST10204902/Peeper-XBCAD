//...............ooooooooooo000000000000 SettingsListItem.tsx 000000000000ooooooooooo...............//
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import styles from '../styles/SettingStyle';


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
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.itemContainer,
        !isLast && styles.borderBottom
      ]}
    >
      <Text style={styles.itemText}>{title}</Text>
      {showChevron && (
        <Text style={styles.chevron}>›</Text>
      )}
    </TouchableOpacity>
  );
};
//...............ooooooooooo000000000000 End Of File 000000000000ooooooooooo...............//
