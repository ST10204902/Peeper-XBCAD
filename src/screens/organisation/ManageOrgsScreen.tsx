import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, FlatList, Alert, ActivityIndicator } from "react-native";
import { OrgAddressData } from "../../databaseModels/OrgAddressData";
import { OrganisationData } from "../../databaseModels/OrganisationData";
import ExpandableOrgList from "../../components/ExpandableOrgList";
import CustomButton from "../../components/CustomButton";
import SearchBarComponent from "../../components/SearchBarComponent";
import * as Location from "expo-location";
import ComboBoxComponent from "../../components/ComboComponent";
import { useUser } from "@clerk/clerk-expo";
import { Student } from "../../databaseModels/databaseClasses/Student";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { Organisation } from "../../databaseModels/databaseClasses/Organisation";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamsList } from "../RootStackParamsList";
import { useCurrentStudent } from "../../hooks/useCurrentStudent";
import TrackingPopup from "../../components/TrackingPopup";
import { useLocationTracking } from "../../hooks/useLocationTracking";
import { useTheme } from '../../styles/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/themes';
import useAllOrganisations from "../../hooks/useAllOrganisations";
import MyMaths from "../../utils/MyMaths";

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
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const navigation = useNavigation();
  const clerkUser = useUser();
  const { currentStudent, error, loading, updateCurrentStudent } = useCurrentStudent();
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for controlling visibility of the tracking popup
  const { tracking, startTracking } = useLocationTracking(); // Import location tracking functions from hook
  const [displayedOrganisations, setDisplayedOrganisations] = useState<Organisation[]>([]);
  const { allOrganisations } = useAllOrganisations();
  const [studentOrganisations, setStudentOrganisations] = useState<Organisation[]>([]);
  const [studentsOrgsLoaded, setStudentsOrgsLoaded] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("name_asc");
  const [location, setLocation] = useState<Location.LocationObject>(); // State to hold location data
  const [selectedOrganisation, setSelectedOrganisation] = useState<Organisation | null>(null);
  let itemList: OrganisationData[] = [];

  // Method to fetch data
  const fetchData = async () => {
    if (!clerkUser.user) {
      console.error("Clerk user not found in ManageOrgsScreen");
      return;
    }
    if (!allOrganisations || allOrganisations.length === 0) {
      console.log("All organisations not loaded yet");
      return;
    }

    const studentOrgs = await Organisation.getStudentsOrgs(currentStudent?.activeOrgs ?? []);

    let updatedAllOrganisations = allOrganisations;
    let updatedStudentOrgs = studentOrgs;

    if (location !== undefined) {
      updatedAllOrganisations = allOrganisations.map((org) => {
        const distance = MyMaths.haversineDistance(
          location.coords.latitude,
          location.coords.longitude,
          org.orgLatitude,
          org.orgLongitude
        );
        org.distance = distance.toFixed(0);
        return org; // org is still an instance of Organisation
      });
  
      if (studentOrgs && studentOrgs.length > 0) {
        updatedStudentOrgs = studentOrgs.map((studentOrg) => {
          const distance = MyMaths.haversineDistance(
            location.coords.latitude,
            location.coords.longitude,
            studentOrg.orgLatitude,
            studentOrg.orgLongitude
          );
          studentOrg.distance = distance.toFixed(0);
          return studentOrg; // studentOrg is still an instance of Organisation
        });
      }
    }
    // Set the state variables with the fetched data
    setDisplayedOrganisations(
      updatedAllOrganisations.sort((a, b) => a.orgName.localeCompare(b.orgName))
    );
  
    if (updatedStudentOrgs && updatedStudentOrgs.length > 0) {
      setStudentOrganisations(updatedStudentOrgs);
    }
    setStudentsOrgsLoaded(true);
  };

  // Run the fetchData method when currentStudent or allOrganisations changes
  useEffect(() => {
    if (currentStudent && allOrganisations && allOrganisations.length > 0) {
      (async () => {
        try {
          await fetchData();
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [currentStudent, allOrganisations, location]);

  // Fetch the location data when the component mounts
  useEffect(() => {
    let isCancelled = false;
    (async () => {
      try {
        // Request permission to access location
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert("Permission Denied", "Permission to access location was denied.");
          return;
        }

        // Get the user's current location
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        if (!isCancelled) {
          setLocation(currentLocation);
          console.log("Location:", currentLocation);
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while fetching the location.");
        console.error(error);
      }
    })();
    // Cleanup function to cancel the fetch operation
    return () => {
      isCancelled = true;
    };
  }, []);

  /**
   * This function activates when the user clicks on the button for a given
   * expandable orgList
   * @param org Corresponding organisation
   */
  function onStudentOrgsListButtonPressed(org: OrganisationData) {
    setIsPopupVisible(true);
    setSelectedOrganisation(new Organisation(org));
  }

  /*
   * Handle start tracking button click to start tracking the student's location
   */
  const handleStartTracking = async () => {
    if (!selectedOrganisation) {
      setIsPopupVisible(false);
      console.error("organisation not found");
      return;
    }
    if (tracking.isTracking) {
      setIsPopupVisible(false);
      Alert.alert("Tracking already in progress");
      return;
    }
    try {
      // Start tracking the organisation
      await startTracking(selectedOrganisation);
      setIsPopupVisible(false);
    } catch (error) {
      console.error("Error starting tracking:", error);
      setIsPopupVisible(false);
    }
  };

  /**
   * This function activates when the user clicks on the button for a given
   * expandable orgList this changes studentActiveOrgs which triggers a re-render
   * @param org Corresponding organisation
   */
  function onAllOrgsListButtonPressed(org: OrganisationData) {
    if (!currentStudent) {
      return;
    }
    if (currentStudent.activeOrgs.includes(org.org_id)) {
      Alert.alert("Error", "You are already tracking this organisation.");
      return;
    }
    if (currentStudent.activeOrgs.length >= 4) {
      Alert.alert("Error", "You can only track up to 4 organisations at a time.");
      return;
    }
    console.log(
      "Adding org to active orgs: ",
      allOrganisations.filter((o) => o.org_id === org.org_id)[0].orgName
    );
    updateCurrentStudent({ activeOrgs: [...currentStudent.activeOrgs, org.org_id] });
  }

  const changeSortBy = useCallback((value: string): void => {
    setSortBy(value);
    let sortedOrgs = [...displayedOrganisations]; // Create a copy to avoid mutating state directly
    switch (value) {
      case "name_asc": {
        sortedOrgs.sort((a, b) => a.orgName.localeCompare(b.orgName));
        break;
      }
      case "name_desc": {
        sortedOrgs.sort((a, b) => b.orgName.localeCompare(a.orgName));
        break;
      }
      case "distance_asc": {
        sortedOrgs.sort((a, b) => {
          // Handle cases where distance might be undefined
          if (a.distance == null && b.distance == null) return 0;
          if (a.distance == null) return 1;
          if (b.distance == null) return -1;
          return Number(a.distance) - Number(b.distance);
        });
        break;
      }
      case "distance_desc": {
        sortedOrgs.sort((a, b) => {
          if (a.distance == null && b.distance == null) return 0;
          if (a.distance == null) return 1;
          if (b.distance == null) return -1;
          return Number(b.distance) - Number(a.distance);
        });
        break;
      }
      default:
        break;
    }
    setDisplayedOrganisations(sortedOrgs); // Update the state with sorted organisations
  }, [displayedOrganisations]);

  const handleBlur = (searchInput: string) => {
    let filteredOrgs = [];
  
    if (searchInput.trim() === "") {
      if (allOrganisations && allOrganisations.length > 0) {
        filteredOrgs = [...allOrganisations]; // Create a copy
      } else {
        return;
      }
    } else {
      filteredOrgs = allOrganisations.filter((org) =>
        org.orgName.toLowerCase().includes(searchInput.toLowerCase().trim())
      );
    }
  
    if (filteredOrgs.length === 0) {
      Alert.alert("No organisations found", "Please try a different search term.");
      return;
    }
  
    switch (sortBy) {
      case "name_asc": {
        filteredOrgs.sort((a, b) => a.orgName.localeCompare(b.orgName));
        break;
      }
      case "name_desc": {
        filteredOrgs.sort((a, b) => b.orgName.localeCompare(a.orgName));
        break;
      }
      case "distance_asc": {
        filteredOrgs.sort((a, b) => {
          if (a.distance == null && b.distance == null) return 0;
          if (a.distance == null) return 1;
          if (b.distance == null) return -1;
          return  Number(a.distance) - Number(b.distance);
        });
        break;
      }
      case "distance_desc": {
        filteredOrgs.sort((a, b) => {
          if (a.distance == null && b.distance == null) return 0;
          if (a.distance == null) return 1;
          if (b.distance == null) return -1;
          return Number(b.distance) - Number(a.distance);
        });
        break;
      }
      default:
        break;
    }
  
    setDisplayedOrganisations(filteredOrgs);
  };

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
    <View style={[styles.page, { backgroundColor: theme.background }]}>
      <Text style={[styles.pageHeading, { color: theme.fontRegular }]}>Your Organisations</Text>

      <View style={styles.componentWrapper}>
        {studentOrganisations.length > 0 ? (
          <ExpandableOrgList
            items={studentOrganisations}
            onListButtonClicked={onStudentOrgsListButtonPressed}
            listButtonComp={
              <CustomButton
                onPress={() => {}}
                title="Start Tracking"
                textSize={18}
                buttonColor="#A4DB51"
                textColor={theme.fontRegular}
                fontFamily="Rany-Bold"
              />
            }
          />
        ) : studentsOrgsLoaded ? (
          <Text> Select up to 4 organisations list below</Text>
        ) : (
          <ActivityIndicator />
        )}
      </View>
      <Text style={[styles.sectionHeading, { color: theme.fontRegular }]}>
        Organisation Management
      </Text>
      <View style={styles.buttonWrapper}>
        <CustomButton
          onPress={handleRequestNewOrganisation}
          title="Request a New Organisation"
          textSize={18}
          buttonColor="#FE7143"
          textColor={theme.fontRegular}
          fontFamily="Rany-Bold"
        />
      </View>
      <View style={styles.buttonWrapper}>
        <CustomButton
          onPress={handleRequestProgress}
          title="Request Progress"
          textSize={18}
          buttonColor="#C8B0FF"
          textColor={theme.fontRegular}
          fontFamily="Rany-Bold"
        />
      </View>
      <View style={styles.buttonWrapper}>
        <CustomButton
          onPress={handleRemoveOrganisation}
          title="Remove Organisation"
          textSize={18}
          buttonColor="#FCDE39"
          textColor={theme.fontRegular}
          fontFamily="Rany-Bold"
        />
      </View>
      <Text style={[styles.sectionHeading, { color: theme.fontRegular }]}>Add Organisation</Text>

      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <SearchBarComponent
            FGColor="#000000"
            onSearchInputChange={(searchInput) => console.log(searchInput)}
            placeHolderColor="#A9A9A9"
            onBlur={handleBlur}
          />
        </View>
        <View style={styles.inputWrapper}>
          <ComboBoxComponent
            options={[
              { label: "Name (A-Z)", value: "name_asc" },
              { label: "Name (Z-A)", value: "name_desc" },
              { label: "Distance (Nearest)", value: "distance_asc" },
              { label: "Distance (Farthest)", value: "distance_desc" },
            ]}
            placeholder="Sort By"
            FGColor={theme.componentTextColour}
            placeHolderColor={theme.componentTextColour}
            value={sortBy}
            onValueChange={(value: string) => changeSortBy(value)}
          />
        </View>
      </View>
      {displayedOrganisations.length > 0 ? (
      <ExpandableOrgList
        userLocation={location}
        items={displayedOrganisations}
        onListButtonClicked={onAllOrgsListButtonPressed}
        listButtonComp={
          <CustomButton
            onPress={() => {}}
            title="Add"
            textSize={14}
            buttonColor="#D9E7FF"
            textColor={theme.fontRegular}
            fontFamily="Rany-Bold"
            addFlex={true}
          />
        }
      />) : (
        <ActivityIndicator />
      )}

    </View>
  );

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error loading student data: {error.message}</Text>;
  }

  if (!currentStudent) {
    return <Text>No student data available.</Text>;
  }
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Tracking Popup for start/stop tracking */}
      <TrackingPopup
        visible={isPopupVisible}
        onStartTracking={handleStartTracking}
        onCancel={() => setIsPopupVisible(false)}
      />
      <FlatList
        data={itemList}
        renderItem={null} // Use `renderItem` to handle FlatList rendering, but in this case we are rendering static content
        ListHeaderComponent={renderContent} // This ensures scrollable content
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  page: {
    flex: 1,
    padding: 16,
  },
  pageHeading: {
    fontSize: 30,
    fontFamily: "Quittance",
    marginTop: 30,
    marginBottom: 15,
  },
  sectionHeading: {
    fontSize: 20,
    fontFamily: "Quittance",
    marginTop: 30,
    marginBottom: 15,
  },
  buttonWrapper: {
    marginBottom: 8, // Adjust the value for desired spacing between buttons
  },
  componentWrapper: {
borderRadius: 30,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 5, // Optional: Add some horizontal margin for spacing
    marginBottom: 12, // Optional: Add some vertical margin for spacing
  },
});
