import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Student } from "../databaseModels/databaseClasses/Student";
import { useTheme } from "../styles/ThemeContext";
import { lightTheme, darkTheme } from "../styles/themes";
import { AvatarUtility } from "../utils/AvatarUtility";
import MyMaths from "../utils/MyMaths";
import { Colors } from "../styles/colors";

interface StudentHeaderComponentProps {
  currentStudent: Student;
  testID?: string;
}

/**
 * @component SearchBarComponent
 * @description A reusable search input component with customizable styling and labels.
 * Provides real-time search input handling with parent component callback.
 *
 * @param {Object} props
 * @param {string} props._FGColor - Foreground color for the input text and label
 * @param {Function} props.onSearchInputChange - Callback function for search input changes
 * @param {string} props._placeHolderColor - Color for the placeholder text
 * @param {Function} [props.onFocus] - Optional callback function when the input gains focus
 * @param {Function} [props.onBlur] - Optional callback function when the input loses focus
 *
 * @state {string} searchInput - Controlled input state for the search field
 * @state {boolean} _isFocused - State to track if the input is focused
 * @state {string} placeholderText - State for the placeholder text
 *
 * @returns {JSX.Element} A styled search input component with label
 *
 * @example
 * <SearchBarComponent
 *   _FGColor="#000000"
 *   onSearchInputChange={(text) => handleSearch(text)}
 *   _placeHolderColor="#999999"
 *   onFocus={() => console.log('Focused')}
 *   onBlur={(text) => console.log('Blurred with text:', text)}
 * />
 */
const StudentHeaderComponent: React.FC<StudentHeaderComponentProps> = ({
  currentStudent,
  testID,
}) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const avatarSource = AvatarUtility.getAvatarSource(
    currentStudent.profilePhotoId !== null &&
      currentStudent.profilePhotoId !== undefined &&
      currentStudent.profilePhotoId !== ""
      ? currentStudent.profilePhotoId
      : "avatar_1",
  );

  const completedHours = MyMaths.calculateTotalLoggedHours(currentStudent);
  const progress = (completedHours / 4) * 100;
  const completedHoursRounded =
    Math.round(completedHours * 100) / 100 >= 4 ? 4 : Math.round(completedHours * 100) / 100;
  const code = currentStudent.studentNumber;

  return (
    <View style={styles.container1}>
      <Image source={avatarSource} style={styles.emoji} />
      <View style={styles.container2}>
        <Text style={[styles.code, { color: theme.fontRegular }]}>{code}</Text>
        <Text style={[styles.progressText, styles.textAlignment]}>
          {`${completedHoursRounded} out of 4 hours completed`}
        </Text>
        <View style={styles.progressBar}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={["#FE7143", "#FFFF00"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progress, { width: `${progress}%` }]}
              testID={testID}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    padding: 20,
    height: 150,
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
  },
  container2: {
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  code: {
    fontFamily: "Quittance",
    fontSize: 30,
  },
  progressText: {
    fontSize: 16,
    fontFamily: "Rany-Regular",
    marginBottom: 3,
  },
  textAlignment: {
    textAlign: "left",
    alignSelf: "flex-start",
  },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: Colors.progressBar,
    borderRadius: 10,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: Colors.progressFill,
  },
});

export default StudentHeaderComponent;
