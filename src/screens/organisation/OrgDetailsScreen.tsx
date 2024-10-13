//import { Text } from "react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import StudentHeaderComponent from "../../components/StudentheaderComponent";
import CustomButton from "../../components/CustomButton";
import EmergencyContacts from "../../components/EmergencyContacts";

const OrgDetailsScreen = () => {
  const currentStudent = null; //set student here

  return (
    <View>
      {/* <StudentHeaderComponent currentStudent={currentStudent}/> */}
      <CustomButton
        onPress={() => {}}
        title="Organisation Management"
        textColor="black"
        buttonColor="#A4DB51"
        fontFamily="Quittance"
        textSize={20}
      />
      <Text>Be Safe!</Text>
      <EmergencyContacts />
    </View>
  );
};

export default OrgDetailsScreen;
