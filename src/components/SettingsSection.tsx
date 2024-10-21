//...............ooooooooooo000000000000 SettingsSection.tsx 000000000000ooooooooooo...............//
import { View, Text, StyleSheet } from 'react-native';
import { SettingsListItem } from './SettingsListItem';
import styles from '../styles/SettingStyle';


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
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeader}>{header}</Text>
      <View style={styles.sectionContent}>
        {items.map((item, index) => (
          <SettingsListItem
            key={item.title}
            {...item}
            isLast={index === items.length - 1}
          />
        ))}
      </View>
    </View>
  );
};
//...............ooooooooooo000000000000 End Of File 000000000000ooooooooooo...............//
