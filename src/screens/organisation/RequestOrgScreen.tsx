import { Text, StyleSheet } from "react-native";
import Input from "../../components/GeneralInputComponent";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CustomButton from "../../components/CustomButton";

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




  
  return (
    <ScrollView style={styles.screenLayout}>
      <Text style={styles.headerText}>Request an Organisation</Text>
      <Input 
        FGColor="#5A5A5A" 
        onSearchInputChange={() => {}} 
        placeHolderColor="grey" 
        placeholderText="Enter text here" 
        labelText="Organisation Name"
      />

      <View style={styles.inputSpacing} />

      <Input 
        FGColor="#5A5A5A" 
        onSearchInputChange={() => {}} 
        placeHolderColor="grey" 
        placeholderText="Enter text here" 
        labelText="Location"
      />

      <CustomButton 
        onPress={() => {}} 
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
