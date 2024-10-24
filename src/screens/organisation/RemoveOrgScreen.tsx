import { Text, StyleSheet, View, FlatList } from "react-native";
import Input from "../../components/GeneralInputComponent";
import CustomButton from "../../components/CustomButton";
import ExpandableOrgList from "../../components/ExpandableOrgList";
import { OrganisationData } from "../../databaseModels/OrganisationData";
import { Organisation } from "../../databaseModels/databaseClasses/Organisation";
import { useCurrentStudent } from "../../hooks/useCurrentStudent";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import DataDeletionConfirmationPopup from "../../components/DataDeletionConfirmationPopup";

/**
 * Screen Component where the user can Remove an Org
 * @returns a created RemoveOrgsScreen Component
 */
export default function RemoveOrgScreen() {
  const { user: clerkUser } = useUser();
  const { currentStudent, error, loading, saving, updateCurrentStudent } = useCurrentStudent();
  const [studentOrganisations, setStudentOrganisations] = useState<OrganisationData[]>([]);
  const [isDeletionPopupShown, setIsDeletionPopupShown] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<OrganisationData | null>(null);

  // Method to fetch data
  const fetchData = async () => {
    if (!clerkUser) {
      console.error("Clerk user not found in ManageOrgsScreen");
      return;
    }
    
    if (!currentStudent?.activeOrgs) {
      console.error("No active orgs found for current student");
      return;
    }

    try {
      const studentOrgs = await Organisation.getStudentsOrgs(currentStudent.activeOrgs);
      
      const validOrgs = studentOrgs
        .filter((org): org is Organisation => org !== null && typeof org.toJSON === "function")
        .map(org => org.toJSON());
      
      setStudentOrganisations(validOrgs);
    } catch (error) {
      console.error("Error fetching student organizations:", error);
    }
  };

  // Run the fetchData method when the screen is focused or when currentStudent changes
  useEffect(() => {
    if (currentStudent) {
      fetchData();
    }
  }, [currentStudent]);

  const handleOrgSelection = (org: OrganisationData) => {
    setSelectedOrg(org);
    setIsDeletionPopupShown(true);
  };

  const handleDataDeletion = async () => {
    if (!currentStudent) {
      console.error("No current student found");
      return;
    }

    if (!selectedOrg) {
      console.error("No organization selected for deletion");
      return;
    }

    try {
      const newOrgs = currentStudent.activeOrgs.filter(
        (orgId) => orgId !== selectedOrg.org_id
      );

      await updateCurrentStudent({ activeOrgs: newOrgs });
      
      // Refresh the organizations list after successful deletion
      await fetchData();
      
      // Reset UI state
      setIsDeletionPopupShown(false);
      setSelectedOrg(null);
    } catch (error) {
      console.error("Error deleting organization:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleCancelDeletion = () => {
    setIsDeletionPopupShown(false);
    setSelectedOrg(null);
  };

  const renderHeader = () => (
    <>
      <Text style={styles.headerText}>Remove an Organisation</Text>
      <View style={styles.inputSpacing} />
    </>
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error loading organizations</Text>;
  }

  return (
    <>
      <FlatList
        style={styles.screenLayout}
        data={studentOrganisations}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <ExpandableOrgList
            items={[item]}
            listButtonComp={
              <CustomButton
                onPress={() => handleOrgSelection(item)}
                title="Remove Organisation"
                textSize={18}
                buttonColor="#A4DB51"
                textColor="#000000"
                fontFamily="Rany-Bold"
              />
            }
            onListButtonClicked={() => handleOrgSelection(item)}
          />
        )}
        keyExtractor={(item) => item.org_id}
      />
      {isDeletionPopupShown && selectedOrg && (
        <DataDeletionConfirmationPopup
          studentNumber={currentStudent?.studentNumber ?? ""}
          onConfirmation={handleDataDeletion}
          onCancel={handleCancelDeletion}
        />
      )}
    </>
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