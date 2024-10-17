//import { Text } from "react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import StudentHeaderComponent from "../../components/StudentheaderComponent";
import CustomButton from "../../components/CustomButton";
import EmergencyContacts from "../../components/EmergencyContacts";
import { useUser } from "@clerk/clerk-expo";
import { Student } from "../../databaseModels/databaseClasses/Student";

const OrgDetailsScreen = () => {
  const clerkUser = useUser();
  const [currentStudent, setCurrentStudent] = React.useState<Student | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStudent = async () => {
      const student = await Student.fetchById(clerkUser.user?.id ?? "");
      console.log("Student: ", student?.email);
      setCurrentStudent(student);
      setLoading(false);
    };
    fetchStudent();
  }, [clerkUser.user?.id]);


  return (
    <View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        currentStudent && <StudentHeaderComponent currentStudent={currentStudent}/> 
      )}
      <CustomButton
        onPress={() => {}}
        title="Organisation Management"
        textColor="black"
        buttonColor="#A4DB51"
        fontFamily="Quittance"
        textSize={20}
      />
      <Text style={styles.BeSafeText}>Be Safe!</Text>
      <EmergencyContacts />
    </View>
  );
};
const styles = StyleSheet.create({
  BeSafeText: {
    fontFamily: "Rany-Bold",
    fontSize: 20,
    textAlign: "left",
    margin: 10,
  }
});


export default OrgDetailsScreen;
