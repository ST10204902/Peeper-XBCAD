import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import the expo gradient
import { Student } from "../databaseModels/databaseClasses/Student";

interface StudentHeaderComponentProps {
  currentStudent: Student;
}



const calculateTotalLoggedHours = (student: Student): number => {
  let totalHours = 0;

  Object.values(student.locationData).forEach((sessionLog) => {
    const sessionStartTime = new Date(sessionLog.sessionStartTime);
    const sessionEndTime = new Date(sessionLog.sessionEndTime) || sessionStartTime; // If session end time is not set, use start time
    // Calculate the difference in hours between session start and end time
    const sessionDurationMs = sessionEndTime.getTime() - sessionStartTime.getTime();
    const sessionDurationHours = sessionDurationMs / (1000 * 60 * 60); // Convert milliseconds to hours

    totalHours += sessionDurationHours;
  });

  return totalHours;
};

const StudentHeaderComponent: React.FC<StudentHeaderComponentProps> = ({
  currentStudent,
}) => {
  const completedHours = calculateTotalLoggedHours(currentStudent);
  const progress =  (completedHours / 4) * 100 ;
  const completedHoursRounded = Math.round(completedHours * 100) / 100;
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
  if (currentStudent.profilePhotoURL != "" && currentStudent.profilePhotoURL != null) {
    // get the index of the avatar
    let pfpURL = (currentStudent.profilePhotoURL) as keyof typeof valuePairs;
    let index = valuePairs[pfpURL];
    // set the avatar
    userAvatar = possibleAvatars[index];
  }

  return (
    <View style={styles.container1}>
      <Image source={userAvatar} style={styles.emoji} />
      <View style={styles.container2}>
        <Text style={styles.code}>{code}</Text>
        <Text
          style={styles.progressText}
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
    marginTop: 50,
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
    color: '#666666',
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
