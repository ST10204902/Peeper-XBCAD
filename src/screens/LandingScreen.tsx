import React, { useRef, useMemo, useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import MapComponent from "../components/MapComponent";
import OrganisationListItem from "../components/OrganisationListItem";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import TrackingPopup from "../components/TrackingPopup";
import { OrganisationData } from "../databaseModels/OrganisationData";
import { Organisation } from "../databaseModels/databaseClasses/Organisation";
import { useLocationTracking } from "../hooks/useLocationTracking"; // Custom hook for location tracking
import { useUser } from "@clerk/clerk-expo";

import { useCurrentStudent } from "../hooks/useCurrentStudent";
import { useTheme } from '../styles/ThemeContext';
import { lightTheme, darkTheme } from '../styles/themes';
import { useRecoilState } from "recoil";
import { trackingState } from "../atoms/atoms";

/**
 * Landing screen component for displaying the organisation list and tracking popup.
 */
export default function LandingScreen() {
  //-----------------------------------------------------------//
  //                          STATES                           //
  //-----------------------------------------------------------//
  const [organisations, setOrganisations] = useState<OrganisationData[]>([]); // State to hold organisation data
  const [trackingAtom, setTrackingAtom] = useRecoilState(trackingState);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for controlling visibility of the tracking popup
  const { tracking, startTracking} = useLocationTracking(); // Import location tracking functions from hook
  const { currentStudent, error, loading, saving, updateCurrentStudent } = useCurrentStudent();
  const { user } = useUser(); // Get the current authenticated user from Clerk
  const [selectedOrganisation, setSelectedOrganisation] =
    useState<Organisation | null>(null); // State for the selected organisation
  const sheetRef = useRef<BottomSheet>(null); // Reference for controlling the bottom sheet
  const snapPoints = useMemo(() => [100, "48%"], []); // Memoized snap points for the bottom sheet heights
  const { isDarkMode, toggleTheme } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  //-----------------------------------------------------------//
  //                          EFFECTS                          //
  //-----------------------------------------------------------//

 

  // Method to fetch data
  const fetchStudentsOrgs = async () => {
    if (!user || !currentStudent) {
      console.error("User or student data not found while fetching organisations");
      return;
    }
    const studentOrgs = await Organisation.getStudentsOrgs(currentStudent?.activeOrgs);
    setOrganisations(studentOrgs.filter(org => org && typeof org.toJSON === 'function').map((org) => org.toJSON()));
  };

  // Fetch organisation data on component mount
  useEffect(() => {
    if (currentStudent) {
      fetchStudentsOrgs();
    }
  }, [currentStudent?.activeOrgs]);

  // Snap the bottom sheet closed when an organisation is selected
  useEffect(() => {
    if (selectedOrganisation) {
      sheetRef.current?.snapToIndex(0); // Snap to the first index (collapsed)
    }
  }, [selectedOrganisation]);


  useEffect(() => {
    if (currentStudent?.darkMode !== null && currentStudent?.darkMode !== undefined) {
      if (isDarkMode !== currentStudent.darkMode) {
        toggleTheme();
      }
    }
  }, [currentStudent?.darkMode]);
  

  //-----------------------------------------------------------//
  //                          METHODS                          //
  //-----------------------------------------------------------//

  /* Handle organisation item click to show popup and set selected organisation
   * @param pSelectedOrganisation - The selected organisation data
   */
  const handleOrganisationPress = (pSelectedOrganisation: OrganisationData) => {
    setIsPopupVisible(true); // Show the tracking popup
    const newSelectedOrg = new Organisation(pSelectedOrganisation);
    setSelectedOrganisation(newSelectedOrg); // Set the selected organisation
    console.log(`${pSelectedOrganisation.orgName} selected`);
  };

  /*
   * Handle start tracking button click to start tracking the student's location
   */
  const handleStartTracking = async () => {
    if (!selectedOrganisation) {
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
          console.log("Starting tracking for", selectedOrganisation.orgName);
          await startTracking(selectedOrganisation);
      }
      catch (error) {
      console.error("Error starting tracking:", error);
      }
    finally {
      setIsPopupVisible(false);
    }
  };

   //-----------------------------------------------------------//
  //                      CONDITIONAL RENDERING                //
  //-----------------------------------------------------------//

  if (loading) {
    return  <ActivityIndicator/>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }


  if (!currentStudent) {
    return <Text>No student data available.</Text>;
  }

  //-----------------------------------------------------------//
  //                          RENDER                           //
  //-----------------------------------------------------------//

  /*
   * Render each organisation list item with alternating colors for styling
   * @param item - The organisation data
   * @param index - The index of the item in the list
   */
  const renderItem = ({
    item,
    index,
  }: {
    item: OrganisationData;
    index: number;
  }) => (
    <OrganisationListItem
      orgName={item.orgName}
      // Alternate between 'odd' and 'even'
      oddOrEven={index % 2 === 0 ? "even" : "odd"}
      onPress={() => {
        // Handle item press to select organisation
        handleOrganisationPress(item);
      }}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Map Component displaying selected organisation */}
      <MapComponent selectedOrganisation={selectedOrganisation} />

      {/* Tracking Popup for start/stop tracking */}
      <TrackingPopup
        visible={isPopupVisible}
        onStartTracking={handleStartTracking}
        onCancel={() => setIsPopupVisible(false)}
      />
        
        {/* Where is this?? */}
      {tracking.isTracking && (
        <View>
          <Text style={{ color: theme.fontRegular }}>Tracking: {trackingAtom.organizationName}</Text>
          <Text style={{ color: theme.fontRegular }}>Time: where is this seconds</Text>
          <Pressable onPress={() => () => setTrackingAtom({ isTracking: false, organizationName: "" }) }>
            <Text style={{ color: theme.fontRegular }}>Stop Tracking</Text>
          </Pressable>
        </View>
      )}
      {/* Bottom Sheet containing the organisation list */}
      <BottomSheet
        ref={sheetRef}
        // Initial position (collapsed)
        index={0}
        // Snap points for different heights
        snapPoints={snapPoints}
        // Prevent closing the sheet by swiping down
        enablePanDownToClose={false}
        backgroundStyle={{ backgroundColor: theme.background }}
      >
        <View style={[styles.sheetHeader, { backgroundColor: theme.background }]}>
          <Text style={[styles.sheetHeading, { color: theme.fontRegular }]}>Organisation List</Text>
        </View>
        {/* Scrollable list of organisations */}
        {(organisations.length > 0 && <BottomSheetFlatList
        
          data={organisations}
          // Use organisation ID as key
          keyExtractor={(item) => item.org_id}
          // Render each item using renderItem function
          renderItem={renderItem}
          contentContainerStyle={[styles.listContentContainer, { backgroundColor: theme.background }]}
        />
        )
        }
        
      </BottomSheet>
    </SafeAreaView>
  );
}
//-----------------------------------------------------------//
//                          STYLES                           //
//-----------------------------------------------------------//

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sheetHeader: {
    padding: 16,
    alignItems: "center",
  },
  sheetHeading: {
    fontSize: 30,
    marginBottom: 10,
    fontFamily: "Quittance",
  },
  listContentContainer: {
  },
  itemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
  },
});
//------------------------***EOF***-----------------------------//