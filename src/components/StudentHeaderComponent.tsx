import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import the expo gradient
import { Student } from "../databaseModels/databaseClasses/Student";
import { useTheme } from "../styles/ThemeContext";
import { lightTheme, darkTheme } from "../styles/themes"; // Import themes
import { AvatarUtility } from "../utils/AvatarUtility";
import MyMaths from "../utils/MyMaths";

interface StudentHeaderComponentProps {
  currentStudent: Student;
}

const StudentHeaderComponent: React.FC<StudentHeaderComponentProps> = ({
  currentStudent,
}) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const avatarSource = AvatarUtility.getAvatarSource(currentStudent.profilePhotoId || "avatar_1");

  const completedHours = MyMaths.calculateTotalLoggedHours(currentStudent);

  const progress = (completedHours / 4) * 100;

  const completedHoursRounded =
    Math.round(completedHours * 100) / 100 >= 4
      ? 4
      : Math.round(completedHours * 100) / 100;

  const code = currentStudent.studentNumber;

  // yes, this looks disgusting, but it works and that's what matters
  const possibleAvatars = [
    require("../assets/Avatars/A9.png"),
    require("../assets/Avatars/A8.png"),
    require("../assets/Avatars/A7.png"),
    require("../assets/Avatars/A6.png"),
    require("../assets/Avatars/A5.png"),
    require("../assets/Avatars/A4.png"),
    require("../assets/Avatars/A3.png"),
    require("../assets/Avatars/A2.png"),
    require("../assets/Avatars/A1.png"),
  ];
  const valuePairs = {
    "../assets/Avatars/A9.png": 0,
    "../assets/Avatars/A8.png": 1,
    "../assets/Avatars/A7.png": 2,
    "../assets/Avatars/A6.png": 3,
    "../assets/Avatars/A5.png": 4,
    "../assets/Avatars/A4.png": 5,
    "../assets/Avatars/A3.png": 6,
    "../assets/Avatars/A2.png": 7,
    "../assets/Avatars/A1.png": 8,
  };

  // set default avatar
  let userAvatar = require("../assets/Avatars/A1.png");

  // check if student has a profile
  if (
    currentStudent.profilePhotoId != "" &&
    currentStudent.profilePhotoId != null
  ) {
    // get the index of the avatar
    let pfpURL = currentStudent.profilePhotoId as keyof typeof valuePairs;
    let index = valuePairs[pfpURL];
    // set the avatar
    userAvatar = possibleAvatars[index];
  }

  return (
    <View style={styles.container1}>
      <Image source={avatarSource} style={styles.emoji} />
      <View style={styles.container2}>
        <Text style={[styles.code, { color: theme.fontRegular }]}>{code}</Text>
        <Text
          style={[
            styles.progressText,
            {
              color: theme.fontRegular,
              textAlign: "left",
              alignSelf: "flex-start",
            },
          ]}
        >{`${completedHoursRounded} out of 4 hours completed`}</Text>
        <View style={styles.progressBar}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={["#FE7143", "#FFFF00"]} // peach to yellow
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progress, { width: `${progress}%` }]}
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
  studentNumber: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
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
    textAlign: "left", // Align text to the start
    alignSelf: "flex-start", // Align text container to the start
    marginTop: 2,
    fontFamily: "Rany-Regular",
    marginBottom: 3,
  },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "orange",
  },
});

export default StudentHeaderComponent;
