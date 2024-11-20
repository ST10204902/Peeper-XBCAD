import { Text, StyleSheet, View, FlatList, ActivityIndicator, Alert } from "react-native";
import CustomButton from "../../components/CustomButton";
import ExpandableOrgList from "../../components/ExpandableOrgList";
import { OrganisationData } from "../../databaseModels/OrganisationData";
import { Organisation } from "../../databaseModels/databaseClasses/Organisation";
import { useCurrentStudent } from "../../hooks/useCurrentStudent";
import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/clerk-expo";
import DataDeletionConfirmationPopup from "../../components/DataDeletionConfirmationPopup";
import { useTheme } from "../../styles/ThemeContext";
import { lightTheme, darkTheme } from "../../styles/themes";
import { useRecoilState } from "recoil";
import { trackingState } from "../../atoms/atoms";
import { Spacing } from "../../styles/colors";
import { SessionLogData } from "../../databaseModels/SessionLogData";

// Create a separate component for the list separator
const ListSeparator = () => <View style={styles.separator} />;

/**
 * Screen Component where the user can Remove an Org
 * @returns a created RemoveOrgsScreen Component
 */
export default function RemoveOrgScreen() {
  const { user: clerkUser } = useUser();
  const {
    currentStudent,
    error: studentError,
    loading,
    updateCurrentStudent,
  } = useCurrentStudent();
  const [studentOrganisations, setStudentOrganisations] = useState<OrganisationData[]>([]);
  const [trackingAtom] = useRecoilState(trackingState);
  const [isDeletionPopupShown, setIsDeletionPopupShown] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<OrganisationData | null>(null);
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Method to fetch data
  const fetchData = useCallback(async () => {
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
    } catch (fetchError) {
      console.error("Error fetching student organizations:", fetchError);
    }
  }, [clerkUser, currentStudent?.activeOrgs]);

  useEffect(() => {
    if (currentStudent) {
      fetchData();
    }
  }, [currentStudent, fetchData]);

  const handleOrgSelection = (org: OrganisationData) => {
    if (trackingAtom.isTracking && trackingAtom.organizationName === org.orgName) {
      Alert.alert("Error", "You cannot remove an organisation that you are currently tracking");
      return;
    }
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
      const newOrgs = currentStudent.activeOrgs.filter(orgId => orgId !== selectedOrg.org_id);

      // Create new locationData object with filtered sessions
      const newLocationData: { [sessionLog_id: string]: SessionLogData } = {};
      Object.entries(currentStudent.locationData).forEach(([sessionId, sessionLog]) => {
        if (sessionLog.orgID !== selectedOrg.org_id) {
          newLocationData[sessionId] = sessionLog;
        }
      });

      await updateCurrentStudent({
        activeOrgs: newOrgs,
        locationData: newLocationData,
      });

      setIsDeletionPopupShown(false);
      setSelectedOrg(null);
    } catch (deleteError) {
      console.error("Error deleting organization:", deleteError);
    }
  };

  const handleCancelDeletion = () => {
    setIsDeletionPopupShown(false);
    setSelectedOrg(null);
  };

  const renderHeader = () => (
    <>
      <Text style={[styles.headerText, { color: theme.fontRegular }]}>Remove an Organisation</Text>
      <View style={styles.inputSpacing} />
    </>
  );

  if (loading) {
    return <ActivityIndicator />;
  }

  if (studentError) {
    return <Text>Error loading organizations</Text>;
  }

  return (
    <>
      <FlatList
        style={[styles.screenLayout, { backgroundColor: theme.background }]}
        data={studentOrganisations}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <ExpandableOrgList
            items={[new Organisation(item)]}
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
        keyExtractor={item => item.org_id}
        ItemSeparatorComponent={ListSeparator}
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
    fontFamily: "Quittance",
  },
  inputSpacing: {
    height: 20,
  },
  separator: {
    height: Spacing.listSeparator,
  },
});
