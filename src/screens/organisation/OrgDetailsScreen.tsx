//import { Text } from "react-native";
import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import StudentHeaderComponent from "../../components/StudentheaderComponent";
import CustomButton from "../../components/CustomButton";
import EmergencyContacts from "../../components/EmergencyContacts";
import { useUser } from "@clerk/clerk-expo";
import { Student } from "../../databaseModels/databaseClasses/Student";
import MapSessionHistory from "../../components/MapSessionHistory";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootStackParamsList } from "../RootStackParamsList";
import { StackNavigationProp } from "@react-navigation/stack";
import { useStudent } from "../../hooks/useStudent";
import { set } from "firebase/database";

const OrgDetailsScreen = () => {
  const clerkUser = useUser();
  const {currentStudent, setCurrentStudent, error} = useStudent();
  const [loading, setLoading] = React.useState(true);
  const navigation =
  useNavigation<NavigationProp<RootStackParamsList, "OrgDetails">>();

  // Method to fetch the student data
  const fetchStudent = async () => {
    if (error) {
      console.log("Error fetching student in OrgDetailsScreen:", error);
      return;
    }
  };

  // Run the fetchStudent method when the screen is focused (navigated to)
  // this is in case they have just recorded a session and the the location needs to be updated on the map
  useFocusEffect(
    React.useCallback(() => {
      fetchStudent();
      setLoading(false);
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
        onPress={() => { navigation.navigate("ManageOrgsScreen", currentStudent!);}}
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
