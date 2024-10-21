import React from "react";
import { StyleSheet, Text, View, SafeAreaView, FlatList } from "react-native";
import { OrgAddressData } from "../../databaseModels/OrgAddressData";
import { OrganisationData } from "../../databaseModels/OrganisationData";
import ExpandableOrgList from "../../components/ExpandableOrgList";
import CustomButton from "../../components/CustomButton";
import SearchBarComponent from "../../components/SearchBarComponent";
import ComboBoxComponent from "../../components/ComboComponent";
import { useUser } from "@clerk/clerk-expo";
import { Student } from "../../databaseModels/databaseClasses/Student";
import { useFocusEffect } from "@react-navigation/native";
import { Organisation } from "../../databaseModels/databaseClasses/Organisation";

/**
 * Component For the ManageOrgsScreen
 * @returns The UI for the ManageOrgsScreen
 */
/**
 * ManageOrgsScreen component renders a screen for managing organizations.
 * 
 * This component displays a list of organizations with options to add, edit, and remove organizations.
 * It also includes a search bar and a combo box for sorting the organizations.
 * 
 * @component
 * @returns {JSX.Element} The rendered component.
 * 
 * @example
 * // Usage example:
 * <ManageOrgsScreen />
 * 
 * @typedef {Object} OrgAddressData
 * @property {string} streetAddress - The street address of the organization.
 * @property {string} suburb - The suburb of the organization.
 * @property {string} city - The city of the organization.
 * @property {string} province - The province of the organization.
 * @property {string} postalCode - The postal code of the organization.
 * 
 * @typedef {Object} OrganisationData
 * @property {string} org_id - The unique identifier of the organization.
 * @property {string} orgName - The name of the organization.
 * @property {OrgAddressData} orgAddress - The address of the organization.
 * @property {string} orgEmail - The email address of the organization.
 * @property {string} orgPhoneNo - The phone number of the organization.
 * @property {number} orgLatitude - The latitude coordinate of the organization.
 * @property {number} orgLongitude - The longitude coordinate of the organization.
 */
export default function ManageOrgsScreen() {
  const clerkUser = useUser();
  const [currentStudent, setCurrentStudent] = React.useState<Student | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [orgList, setOrgList] = React.useState<OrganisationData[]>([]);
  let itemList: OrganisationData[] = [];

  // Method to fetch the student data
  const fetchData = async () => {
    if (clerkUser.user?.id) {
      const student = await Student.fetchById(clerkUser.user?.id);
      console.log("Student was fetched in the ManageOrgsScreen");
      const allOrgs = await Organisation.getAllOrganisations();
      setCurrentStudent(student);
      setOrgList(allOrgs);
      setLoading(false);
    }
  };

  // Run the fetchStudent method when the screen is focused (navigated to)
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [clerkUser.user?.id])
  );

  React.useEffect(() => {
    if (currentStudent && orgList.length > 0) {
     
  
      itemList = orgList.filter((org) => currentStudent.activeOrgs.includes(org.org_id));
      console.log("filtered orgs:", itemList);
    }
  }, [currentStudent, orgList]);


  // Dummy data
  const address: OrgAddressData = {
    streetAddress: "53 Main Rd",
    suburb: "Claremont",
    city: "Cape Town",
    province: "Western Cape",
    postalCode: "7700",
  };



// This constant is defined here to keep the render method clean and readable.
  // By defining it outside of the return statement, we can perform any necessary
  // calculations or logic before rendering the JSX. This approach helps in:
  // 1. Avoiding clutter in the return statement.
  // 2. Making the code more modular and easier to maintain.
  // 3. Allowing reuse of the constant if needed in multiple places within the component.  
  const renderContent = () => (
    <View style={styles.page}>
      <Text style={styles.pageHeading}>Your Organisations</Text>
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
      <Text style={styles.sectionHeading}>Organisation Management</Text>
      <View style={styles.buttonWrapper}>
        <CustomButton
          onPress={() => alert("Add Organisation")}
          title="Request a New Organisation"
          textSize={18}
          buttonColor="#FE7143"
          textColor="#161616"
          fontFamily="Rany-Bold"
        />
      </View>
      <View style={styles.buttonWrapper}>
        <CustomButton
          onPress={() => alert("Edit Organisation")}
          title="Request Progress"
          textSize={18}
          buttonColor="#C8B0FF"
          textColor="#161616"
          fontFamily="Rany-Bold"
        />
      </View>
      <View style={styles.buttonWrapper}>
        <CustomButton
          onPress={() => alert("Delete Organisation")}
          title="Remove Organisation"
          textSize={18}
          buttonColor="#FCDE39"
          textColor="#161616"
          fontFamily="Rany-Bold"
        />
      </View>
      <Text style={styles.sectionHeading}>Add Organisation</Text>
  
      <View style={styles.inputRow}>
  <View style={styles.inputWrapper}>
    <SearchBarComponent
      FGColor="#000000"
      onSearchInputChange={(searchInput) => console.log(searchInput)}
      placeHolderColor="#A9A9A9"
    />
  </View>
  <View style={styles.inputWrapper}>
      <ComboBoxComponent
        options={[
          { label: "Name (A-Z)", value: "name_asc" },
          { label: "Name (Z-A)", value: "name_desc" },
          { label: "Distance (Closest)", value: "distance_close" },
          { label: "Distance (Farthest)", value: "distance_far" },
        ]}
        placeholder="Sort By"
        FGColor="#969696"
        placeHolderColor="#A9A9A9"
        value="name_asc"
        onValueChange={(value: string) => console.log(value)}
      />
      
</View>
</View>
<ExpandableOrgList
        items={itemList}
        onListButtonClicked={onOrgListButtonPressed}
        listButtonComp={
          <CustomButton
            onPress={() => {}}
            title="Add Organisation"
            textSize={15}
            buttonColor="#D9E7FF"
            textColor="#000000"
            fontFamily="Rany-Bold"
          />
        }
      />
</View>
);
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={[]}
        renderItem={null} // Use `renderItem` to handle FlatList rendering, but in this case we are rendering static content
        ListHeaderComponent={renderContent} // This ensures scrollable content
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
  }
  
  /**
   * This function activates when the user clicks on the button for a given
   * expandable orgList
   * @param org Corresponding organisation
   */
  function onOrgListButtonPressed(org: OrganisationData) {
    alert(org.orgName);
  }
  
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#F9F9F9",
    },
    page: {
      backgroundColor: "#F9F9F9",
      flex: 1,
      padding: 16,
    },
    pageHeading: {
      fontSize: 30,
      fontFamily: "Quittance",
      color: "#161616",
      marginTop: 30,
      marginBottom: 15,
    },
    sectionHeading: {
      fontSize: 20,
      fontFamily: "Quittance",
      color: "#161616",
      marginTop: 30,
      marginBottom: 15,
    },
    buttonWrapper: {
      marginBottom: 8, // Adjust the value for desired spacing between buttons
    },
    inputRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    inputWrapper: {
      flex: 1,
      marginHorizontal: 5, // Optional: Add some horizontal margin for spacing
      marginBottom: 12, // Optional: Add some vertical margin for spacing
    },
  });
