import { View, Text, StyleSheet } from 'react-native';
import styles from '../styles/PolicyStyle';

interface PolicySectionProps {
  heading: string;
  content: string;
}

export const PolicySectionComponent = ({ heading, content }: PolicySectionProps) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );
};