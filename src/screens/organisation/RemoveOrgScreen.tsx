import { Text, StyleSheet } from "react-native";
import Input from "../../components/GeneralInputComponent";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CustomButton from "../../components/CustomButton";
import ExpandableOrgList from "../../components/ExpandableOrgList";
import { OrganisationData } from "../../databaseModels/OrganisationData";


/**
 * Screen Component where the user can Remove an Org
 * @returns a created RemoveOrgsScreen Component
 */
export default function RemoveOrgScreen() {
  let itemList: OrganisationData[] = [];

  const handleListButtonClick = (selectedOrg: OrganisationData) => {
    // Handle the button click event here
  };

  //I belive i set the list view correctly? if not, sorry! I tried my best :,) 
  return (
    <ScrollView style={styles.screenLayout}>
      <Text style={styles.headerText}>Remove an Organisation</Text>
      <View style={styles.inputSpacing} />
      <ExpandableOrgList
        items={itemList}
        listButtonComp={
          <CustomButton
            onPress={() => {}}
            title="Remove Organisation"
            textSize={18}
            buttonColor="#A4DB51"
            textColor="#000000"
            fontFamily="Rany-Bold"
          />
        }
        onListButtonClicked={handleListButtonClick}
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

// End of File
