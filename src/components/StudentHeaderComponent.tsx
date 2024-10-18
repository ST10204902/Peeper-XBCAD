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
  const avatar = { uri: currentStudent.profilePhotoURL };

  return (
    <View style={styles.container1}>
      <Image source={avatar} style={styles.emoji} />
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
