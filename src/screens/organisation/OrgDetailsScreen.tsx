//import { Text } from "react-native";
import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import StudentHeaderComponent from "../../components/StudentheaderComponent";
import CustomButton from "../../components/CustomButton";
import EmergencyContacts from "../../components/EmergencyContacts";
import { useUser } from "@clerk/clerk-expo";
import { Student } from "../../databaseModels/databaseClasses/Student";
import MapSessionHistory from "../../components/MapSessionHistory";

const OrgDetailsScreen = () => {
  const clerkUser = useUser();
  const [currentStudent, setCurrentStudent] = React.useState<Student | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStudent = async () => {
      const student = await Student.fetchById(clerkUser.user?.id ?? "");
      setCurrentStudent(student);
      setLoading(false);
    };

       fetchStudent();
  }, [clerkUser.user?.id]);

 
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
            ) : (
        currentStudent && <StudentHeaderComponent currentStudent={currentStudent} />
            )}
            <CustomButton
        onPress={() => {}}
        title="Organisation Management"
        textColor="black"
        buttonColor="#A4DB51"
        fontFamily="Quittance"
        textSize={20}
            />
            {currentStudent && <MapSessionHistory {...currentStudent.toJSON()} />}
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
