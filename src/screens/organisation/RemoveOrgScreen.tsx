import { Text, StyleSheet, View, FlatList } from "react-native";
import Input from "../../components/GeneralInputComponent";
import CustomButton from "../../components/CustomButton";
import ExpandableOrgList from "../../components/ExpandableOrgList";
import { OrganisationData } from "../../databaseModels/OrganisationData";
import { Organisation } from "../../databaseModels/databaseClasses/Organisation";
import { useCurrentStudent } from "../../hooks/useCurrentStudent";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";

/**
 * Screen Component where the user can Remove an Org
 * @returns a created RemoveOrgsScreen Component
 */
export default function RemoveOrgScreen() {
  const clerkUser = useUser();
  const { currentStudent, error, loading, saving, updateCurrentStudent } = useCurrentStudent();
  const [studentOrganisations, setStudentOrganisations] = useState<OrganisationData[]>([]);

  // Method to fetch data
  const fetchData = async () => {
    if (!clerkUser.user) {
      console.error("Clerk user not found in ManageOrgsScreen");
      return;
    }
    const studentOrgs = await Organisation.getStudentsOrgs(currentStudent?.activeOrgs ?? []);

    setStudentOrganisations(
      studentOrgs
        .filter((org) => org && typeof org.toJSON === "function")
        .map((org) => org.toJSON())
    );
  };

  // Run the fetchData method when the screen is focused (navigated to) or when currentStudent changes
  useEffect(() => {
    if (currentStudent) {
      fetchData();
    }
  }, [currentStudent]);

  const handleListButtonClick = (selectedOrg: OrganisationData) => {
   let newOrgs = currentStudent?.activeOrgs.filter((org) => org !== selectedOrg.org_id);
    updateCurrentStudent({ activeOrgs: newOrgs });
  };

  const renderHeader = () => (
    <>
      <Text style={styles.headerText}>Remove an Organisation</Text>
      <View style={styles.inputSpacing} />
    </>
  );

  return (
    <FlatList
      style={styles.screenLayout}
      data={studentOrganisations}
      ListHeaderComponent={renderHeader}
      renderItem={({ item }) => (
        <ExpandableOrgList
          items={[item]}
          listButtonComp={
            <CustomButton
              onPress={() => handleListButtonClick(item)}
              title="Remove Organisation"
              textSize={18}
              buttonColor="#A4DB51"
              textColor="#000000"
              fontFamily="Rany-Bold"
            />
          }
          onListButtonClicked={handleListButtonClick}
        />
      )}
      keyExtractor={(item) => item.org_id}
    />
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