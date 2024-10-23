import React, { useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, FlatList } from "react-native";
import { OrgAddressData } from "../../databaseModels/OrgAddressData";
import { OrganisationData } from "../../databaseModels/OrganisationData";
import ExpandableOrgList from "../../components/ExpandableOrgList";
import CustomButton from "../../components/CustomButton";
import SearchBarComponent from "../../components/SearchBarComponent";
import ComboBoxComponent from "../../components/ComboComponent";
import { useUser } from "@clerk/clerk-expo";
import { Student } from "../../databaseModels/databaseClasses/Student";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { Organisation } from "../../databaseModels/databaseClasses/Organisation";
import { useNavigation } from "@react-navigation/native";
import { useStudent } from "../../hooks/useStudent";
import { RootStackParamsList } from "../RootStackParamsList";
import { set } from "firebase/database";

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
  const navigation = useNavigation();
  const clerkUser = useUser();
  const {currentStudent, setCurrentStudent} = useStudent();
  const [loading, setLoading] = React.useState(true);
  const [allOrganisations, setAllOrganisations] = React.useState<OrganisationData[]>([]);
  const [studentOrganisations, setStudentOrganisations] = React.useState<OrganisationData[]>([]);
  //const [studentActiveOrgs, setStudentActiveOrgs] = React.useState<string[]>([]);
  const route = useRoute<RouteProp<RootStackParamsList, "ManageOrgsScreen">>();
  let studentOrgs: Organisation[] = [];
  let allOrgs: Organisation[] = [];
  let itemList: OrganisationData[] = [];
   // Method to log error if there is an error fetching student data
  const fetchData = async () => {
    if (!clerkUser.user) {
      console.error("Clerk user not found in ManageOrgsScreen");
      return;
    }
    // Fetch all organisations and student's organisations
    allOrgs = await Organisation.getAllOrganisations();
    studentOrgs = await Organisation.getStudentsOrgs(currentStudent?.activeOrgs ?? []);
  };

  // Run the fetchStudent method when the screen is focused (navigated to)
  // this is in case they have just recorded a session and the the location needs to be updated on the map
  useEffect(() => {
    if (currentStudent) {
      fetchData().then(() => {
      // Set the state variables with the fetched data
      setAllOrganisations(allOrgs.map((org) => org.toJSON()));
      setStudentOrganisations(studentOrgs.map((org) => org.toJSON())); 
      setLoading(false);
    });
    }
    }, [currentStudent]);

  useEffect(() => {
    const newActiveOrgs = allOrganisations.filter((org) => currentStudent?.activeOrgs.includes(org.org_id));
    setStudentOrganisations(newActiveOrgs);
  }, [currentStudent?.activeOrgs]);

  
  /**
   * This function activates when the user clicks on the button for a given
   * expandable orgList
   * @param org Corresponding organisation
   */
  function onStudentOrgsListButtonPressed(org: OrganisationData) {
   // start tracking pop up
  }

  /**
   * This function activates when the user clicks on the button for a given
   * expandable orgList this changes studentActiveOrgs which triggers a re-render
   * @param org Corresponding organisation
   */
  function onAllOrgsListButtonPressed(org: OrganisationData) {
    console.log("Adding org to active orgs: ", allOrganisations.filter((o) => o.org_id === org.org_id)[0].orgName);
    currentStudent?.activeOrgs.push(org.org_id);
    setCurrentStudent(currentStudent);

    // Find and add the new organisation to studentOrganisations
    setStudentOrganisations((prevStudentOrgs) => {
      // Check if the organisation is already in the student's organisations list
      if (prevStudentOrgs.some((o) => o.org_id === org.org_id)) {
        return prevStudentOrgs; // Don't add duplicates
      }
      // Add the selected organisation to the student's organisation list
      const updatedStudentOrgs = [...prevStudentOrgs, org];
  
      // Return the updated list
      return updatedStudentOrgs;
    });
  }


  const handleRequestNewOrganisation = () => {
      navigation.navigate("RequestOrgScreen" as never);
    };
  
    const handleRequestProgress = () => {
      navigation.navigate("RequestProgressScreen" as never);
    };
  
    const handleRemoveOrganisation = () => {
      navigation.navigate("RemoveOrgScreen" as never);
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
       items={studentOrganisations}
       onListButtonClicked={onStudentOrgsListButtonPressed}
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
          onPress={handleRequestNewOrganisation}
          title="Request a New Organisation"
          textSize={18}
          buttonColor="#FE7143"
          textColor="#161616"
          fontFamily="Rany-Bold"
        />
      </View>
      <View style={styles.buttonWrapper}>
        <CustomButton
          onPress={handleRequestProgress}
          title="Request Progress"
          textSize={18}
          buttonColor="#C8B0FF"
          textColor="#161616"
          fontFamily="Rany-Bold"
        />
      </View>
      <View style={styles.buttonWrapper}>
        <CustomButton
          onPress={handleRemoveOrganisation}
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
        items={allOrganisations}
        onListButtonClicked={onAllOrgsListButtonPressed}
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
    
      {loading ? (
        <Text>Loading...</Text>
            ) : (
              <FlatList
              data={itemList}
              renderItem={null} // Use `renderItem` to handle FlatList rendering, but in this case we are rendering static content
              ListHeaderComponent={renderContent} // This ensures scrollable content
              keyExtractor={(item, index) => index.toString()}
            />
            )}
    </SafeAreaView>
  );
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
