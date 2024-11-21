import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../styles/ThemeContext";
import { lightTheme, darkTheme } from "../styles/themes";

interface PolicySectionProps {
  heading: string;
  content: string;
  testID?: string;
}

export const PolicySectionComponent = ({ heading, content, testID }: PolicySectionProps) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  return (
    <View
      style={[styles.sectionContainer, { backgroundColor: theme.sectionBackground }]}
      testID={testID}
    >
      <Text style={[styles.sectionHeading, { color: theme.fontRegular }]}>{heading}</Text>
      <Text style={[styles.sectionContent, { color: theme.sectionText }]}>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 26,
    marginBottom: 8,
    fontFamily: "Rany-Bold",
  },
  sectionContent: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: "Rany-Regular",
  },
});
