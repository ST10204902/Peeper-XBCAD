//import { Text } from "react-native";
import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import StudentHeaderComponent from "../../components/StudentheaderComponent";
import CustomButton from "../../components/CustomButton";
import EmergencyContacts from "../../components/EmergencyContacts";
import { useUser } from "@clerk/clerk-expo";
import { Student } from "../../databaseModels/databaseClasses/Student";
import MapSessionHistory from "../../components/MapSessionHistory";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const OrgDetailsScreen = () => {
  const clerkUser = useUser();
  const [currentStudent, setCurrentStudent] = React.useState<Student | null>(null);
  const [loading, setLoading] = React.useState(true);
  const navigation = useNavigation<StackNavigationProp<any>>();

  // Method to fetch the student data
  const fetchStudent = async () => {
    if (clerkUser.user?.id) {
      const student = await Student.fetchById(clerkUser.user?.id);
      console.log("Student was fetched in the OrgDetailsScreen");
      setCurrentStudent(student);
      setLoading(false);
    }
  };

  // Run the fetchStudent method when the screen is focused (navigated to)
  useFocusEffect(
    React.useCallback(() => {
      fetchStudent();
    }, [clerkUser.user?.id])
  );

 
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
            ) : (
        currentStudent && <StudentHeaderComponent currentStudent={currentStudent} />
            )}
            <CustomButton
        onPress={() => { navigation.navigate('ManageOrgsScreen');}}
        title="Organisation Management"
        textColor="black"
        buttonColor="#A4DB51"
        fontFamily="Quittance"
        textSize={25}
            />
            {currentStudent && <MapSessionHistory currentStudent={currentStudent} />}
      <Text style={styles.BeSafeText}>Be Safe!</Text>
      <EmergencyContacts />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  BeSafeText: {
    fontFamily: "Rany-Bold",
    fontSize: 20,
    textAlign: "left",
    margin: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  sheetHeader: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  sheetHeading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#161616",
    marginBottom: 10,
  },
  listContentContainer: {
    backgroundColor: "#fff",
  },
  itemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
});

export default OrgDetailsScreen;
