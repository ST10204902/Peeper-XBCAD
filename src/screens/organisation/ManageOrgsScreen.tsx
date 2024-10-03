import { StyleSheet, Text, View } from "react-native";
import { OrgAddress } from "../../models/OrgAddress";
import { Organisation } from "../../models/Organisation";
import ExpandableOrgList from "../../components/ExpandableOrgList";
import CustomButton from "../../components/LoginRegisterButtonComponent";

/**
 * Component For the ManageOrgsScreen
 * @returns The Ui for the ManageOrgsScreen
 */
export default function ManageOrgsScreen() {
  // Dummy data
  const address: OrgAddress = {
    streetAddress: "53 Main Rd",
    suburb: "Claremont",
    city: "Cape Town",
    province: "Western Cape",
    postalCode: "7700",
  };

  const itemList: Organisation[] = [
    {
      org_id: "1",
      orgName: "Massage The Pandas",
      orgAddress: address,
      orgEmail: "MassageThePandas@gmail.com",
      orgPhoneNo: "1999999999",
      orgLatitude: 0,
      orgLongitude: 0,
    },
    {
      org_id: "2",
      orgName: "Homeless People Shouldn't be Homeless",
      orgAddress: address,
      orgEmail: "HomelessPeopleBad@gmail.com",
      orgPhoneNo: "1999999999",
      orgLatitude: 0,
      orgLongitude: 0,
    },
    {
      org_id: "3",
      orgName: "Starving Women Need Makeup (SWNM)",
      orgAddress: address,
      orgEmail: "StarvingWomenNeedMakeup@gmail.com",
      orgPhoneNo: "1999999999",
      orgLatitude: 0,
      orgLongitude: 0,
    },
  ];

  return (
    <View style={styles.page}>
      <ExpandableOrgList
        items={itemList}
        onListButtonClicked={onOrgListButtonPressed}
        listButtonComp={
          <CustomButton
            onPress={() => {}}
            title="Start Tracking"
            textSize={18}
            buttonColor="#A4DB51"
            textColor="#000000"
            fontFamily="Rany-Bold"
          />
        }
      />
    </View>
  );
}

/**
 * This function activates when the user clicks on the button for given to the
 * expandable orgList
 * @param org Corresponding organisation
 */
function onOrgListButtonPressed(org: Organisation) {
  alert(org.orgName);
}

const styles = StyleSheet.create({
  // Add styles here
  page: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
});
