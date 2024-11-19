import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { OrganisationData } from "../../databaseModels/OrganisationData";
import ExpandableOrgList from "../../components/ExpandableOrgList";
import CustomButton from "../../components/CustomButton";
import SearchBarComponent from "../../components/SearchBarComponent";
import * as Location from "expo-location";
import ComboBoxComponent from "../../components/ComboComponent";
import { useUser } from "@clerk/clerk-expo";
import { Organisation } from "../../databaseModels/databaseClasses/Organisation";
import { useNavigation } from "@react-navigation/native";
import { useCurrentStudent } from "../../hooks/useCurrentStudent";
import TrackingPopup from "../../components/TrackingPopup";
import { useLocationTracking } from "../../hooks/useLocationTracking";
import { useTheme } from "../../styles/ThemeContext";
import { lightTheme, darkTheme } from "../../styles/themes";
import useAllOrganisations from "../../hooks/useAllOrganisations";
import MyMaths from "../../utils/MyMaths";

export default function ManageOrgsScreen() {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const navigation = useNavigation();
  const clerkUser = useUser();
  const {
    currentStudent,
    error: studentError,
    loading,
    updateCurrentStudent,
  } = useCurrentStudent();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { tracking, startTracking } = useLocationTracking();
  const [displayedOrganisations, setDisplayedOrganisations] = useState<Organisation[]>([]);
  const { allOrganisations } = useAllOrganisations();
  const [studentOrganisations, setStudentOrganisations] = useState<Organisation[]>([]);
  const [studentsOrgsLoaded, setStudentsOrgsLoaded] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("name_asc");
  const [location, setLocation] = useState<Location.LocationObject>();
  const [selectedOrganisation, setSelectedOrganisation] = useState<Organisation | null>(null);
  const itemList: OrganisationData[] = [];

  // Method to fetch data
  const fetchData = useCallback(async () => {
    if (!clerkUser.user || !allOrganisations?.length) {
      return;
    }

    const studentOrgs = await Organisation.getStudentsOrgs(currentStudent?.activeOrgs ?? []);

    let updatedAllOrganisations = allOrganisations;
    let updatedStudentOrgs = studentOrgs;

    if (location) {
      updatedAllOrganisations = allOrganisations.map(org => {
        const distance = MyMaths.haversineDistance(
          location.coords.latitude,
          location.coords.longitude,
          org.orgLatitude,
          org.orgLongitude,
        );
        org.distance = distance.toFixed(0);
        return org;
      });

      if (studentOrgs?.length > 0) {
        updatedStudentOrgs = studentOrgs.map(studentOrg => {
          const distance = MyMaths.haversineDistance(
            location.coords.latitude,
            location.coords.longitude,
            studentOrg.orgLatitude,
            studentOrg.orgLongitude,
          );
          studentOrg.distance = distance.toFixed(0);
          return studentOrg;
        });
      }
    }

    setDisplayedOrganisations(
      updatedAllOrganisations.sort((a, b) => a.orgName.localeCompare(b.orgName)),
    );

    if (updatedStudentOrgs?.length > 0) {
      setStudentOrganisations(updatedStudentOrgs);
    }
    setStudentsOrgsLoaded(true);
  }, [clerkUser.user, allOrganisations, currentStudent?.activeOrgs, location]);

  useEffect(() => {
    if (currentStudent && allOrganisations?.length > 0) {
      fetchData().catch(fetchError => {
        // Log to error reporting service in production
        console.error("Error fetching data:", fetchError);
      });
    }
  }, [currentStudent, allOrganisations, fetchData]);

  useEffect(() => {
    let isCancelled = false;

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert("Permission Denied", "Permission to access location was denied.");
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        if (!isCancelled) {
          setLocation(currentLocation);
        }
      } catch (locationError) {
        Alert.alert("Error", "An error occurred while fetching the location.");
        console.error("Location error:", locationError);
      }
    };

    getLocation();

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
    // eslint-disable-next-line no-console
    console.log(
      "Adding org to active orgs: ",
      allOrganisations.filter(o => o.org_id === org.org_id)[0].orgName,
    );
    updateCurrentStudent({ activeOrgs: [...currentStudent.activeOrgs, org.org_id] });
  }

  const changeSortBy = useCallback(
    (value: string): void => {
      setSortBy(value);
      const sortedOrgs = [...displayedOrganisations];
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
      setDisplayedOrganisations(sortedOrgs);
    },
    [displayedOrganisations],
  );

  const handleBlur = (searchInput: string) => {
    let filteredOrgs = [];

    if (searchInput.trim() === "") {
      if (allOrganisations?.length > 0) {
        filteredOrgs = [...allOrganisations];
      } else {
        return;
      }
    } else {
      filteredOrgs = allOrganisations.filter(org =>
        org.orgName.toLowerCase().includes(searchInput.toLowerCase().trim()),
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
          return Number(a.distance) - Number(b.distance);
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
            _FGColor={theme.componentTextColour}
            // eslint-disable-next-line no-console
            onSearchInputChange={searchInput => console.log(searchInput)}
            _placeHolderColor={theme.componentTextColour}
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
        />
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );

  if (loading) {
    return <ActivityIndicator />;
  }

  if (studentError) {
    return <Text>Error loading student data: {studentError.message}</Text>;
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
        renderItem={null}
        ListHeaderComponent={renderContent}
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
    marginBottom: 8,
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
    marginHorizontal: 5,
    marginBottom: 12,
  },
});
