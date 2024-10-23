import { Text, StyleSheet, Alert } from "react-native";
import Input from "../../components/GeneralInputComponent";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CustomButton from "../../components/CustomButton";
import { useState } from "react";
import { ApprovalStatus } from "../../databaseModels/enums";
import { OrgRequest } from "../../databaseModels/databaseClasses/OrgRequest";
import { OrgRequestData } from "../../databaseModels/OrgRequestData";
import { OrgAddress } from "../../databaseModels/databaseClasses/OrgAddress";
import { DatabaseUtility } from "../../databaseModels/databaseClasses/DatabaseUtility";
import { useCurrentStudent } from "../../hooks/useCurrentStudent";

/**
 * Screen Component where the user can request approval for an org
 * @returns a created RequestOrgScreen Component
 */
/**
 * RequestOrgScreen component renders a screen where users can request an organisation.
 * 
 * The screen includes:
 * - A header text "Request an Organisation".
 * - Two input fields for "Organisation Name" and "Location".
 * - A custom button to submit the request.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function RequestOrgScreen() {
  // State for form fields
  const [orgName, setOrgName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const { currentStudent } = useCurrentStudent(); // Fetch student data from context

 // Function to handle form submission
 const handleSubmit = async () => {
  // Basic validation
  if (!currentStudent) {
    console.log('No student data found while submitting request');
  return;
  }
  if (!orgName || !location) {
    Alert.alert('Error', 'Please fill in all fields.');
    return;
  }

  try {
    // Create OrgRequestData object
    const requestData: OrgRequestData = {
      request_id: DatabaseUtility.generateUniqueId() , // For simplicity, use timestamp as request_id
      studentID: currentStudent?.student_id, // Replace with actual studentID, could be fetched from context or user state
      org_id: DatabaseUtility.generateUniqueId(), // Generate org_id (or handle it in another way)
      name: orgName,
      orgAddress: new OrgAddress({
        streetAddress: location,
        suburb: "12345",
        city: "12345",
        province: "12345",
        postalCode: "12345",
      }),
      email: "", // Optional, can add if needed
      phoneNo: "", // Optional, can add if needed
      approvalStatus: ApprovalStatus.Pending // Default to pending approval status
    };

    // Create and save the OrgRequest
    const newRequest = new OrgRequest(requestData);
    console.log('New request:', newRequest);
    await newRequest.save();

    // Success message
    Alert.alert('Success', 'Your request has been submitted.');

    // Clear input fields
    setOrgName('');
    setLocation('');
  } catch (error) {
    // Handle errors (e.g., network or database errors)
    Alert.alert('Error', 'Failed to submit request. Please try again later.');
    console.error(error);
  }
};

return (
  <ScrollView style={styles.screenLayout}>
    <Text style={styles.headerText}>Request an Organisation</Text>

    <Input 
      FGColor="#5A5A5A" 
      onSearchInputChange={setOrgName} // Bind the state setter
      placeHolderColor="grey" 
      placeholderText="Enter organisation name" 
      labelText="Organisation Name"
      
    />

    <View style={styles.inputSpacing} />

    <Input 
      FGColor="#5A5A5A" 
      onSearchInputChange={setLocation} // Bind the state setter
      placeHolderColor="grey" 
      placeholderText="Enter location" 
      labelText="Location"
    />

    <CustomButton 
      onPress={handleSubmit}
      title="Request"
      fontFamily="Quittance"
      textSize={30}
      buttonColor="#C8B0FF"
      textColor="#161616"
    />
  </ScrollView>
);
}
const styles = StyleSheet.create({
  screenLayout: {
    flex: 1,
    padding: 16,
  },
  headerText: {
    marginTop: 30,
    marginBottom: 20,
    fontSize: 32,
    fontFamily: 'Quittance',
    color: '#161616',
  },
  inputSpacing: {
    height: 20,
  },
});
