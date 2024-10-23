import React, { useRef, useMemo, useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Pressable,
  Alert,
} from "react-native";
import MapComponent from "../components/MapComponent";
import OrganisationListItem from "../components/OrganisationListItem";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import TrackingPopup from "../components/TrackingPopup";
import { OrganisationData } from "../databaseModels/OrganisationData";
import { Organisation } from "../databaseModels/databaseClasses/Organisation";
import { useLocationTracking } from "../hooks/useLocationTracking"; // Custom hook for location tracking
import { Student } from "../databaseModels/databaseClasses/Student";
import { SessionLog } from "../databaseModels/databaseClasses/SessionLog";
import StudentLocationMap from "../components/StudentLocationMap";
import { useRecoilState, useSetRecoilState } from "recoil";
import { trackingState, elapsed_time } from "../atoms/atoms";
import { registerForPushNotificationsAsync } from '../services/RequestNotificationPermissions';
import {
  requestNotificationPermissions,
  showOrUpdateTrackingNotification,
  clearTrackingNotification,
  checkNotificationSettings,
} from "../services/trackingNotification";

import * as Notifications from "expo-notifications";
import { useUser } from "@clerk/clerk-expo";
import { useFocusEffect } from "@react-navigation/native";
import { useCurrentStudent } from "../hooks/useCurrentStudent";
/**
 * Landing screen component for displaying the organisation list and tracking popup.
 */
export default function LandingScreen() {
  //-----------------------------------------------------------//
  //                          STATES                           //
  //-----------------------------------------------------------//
  const [organisations, setOrganisations] = useState<OrganisationData[]>([]); // State to hold organisation data
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for controlling visibility of the tracking popup
  const { tracking, startTracking, stopTracking, errorMsg } =
    useLocationTracking(); // Import location tracking functions from hook
    const { currentStudent, error, loading, saving, updateCurrentStudent } = useCurrentStudent();
  const { user } = useUser(); // Get the current authenticated user from Clerk
  const [selectedOrganisation, setSelectedOrganisation] =
    useState<Organisation | null>(null); // State for the selected organisation
  const sheetRef = useRef<BottomSheet>(null); // Reference for controlling the bottom sheet
  const snapPoints = useMemo(() => [100, "50%", "100%"], []); // Memoized snap points for the bottom sheet heights
  const setTracking = useSetRecoilState(trackingState);
  const [elapsedTime, setElapsedTime] = useRecoilState(elapsed_time);

  //-----------------------------------------------------------//
  //                          EFFECTS                          //
  //-----------------------------------------------------------//

  useEffect(() => {
    const setPushToken = async () => {
      const token = await registerForPushNotificationsAsync();
      console.log(token);
      if (token) {
        updateCurrentStudent({ pushToken: token });
      }
    }
    setPushToken();
  }, []);

  useEffect(() => {
    if (selectedOrganisation != null) {
      showOrUpdateTrackingNotification(
        selectedOrganisation.orgName,
        elapsedTime
      ).then((notificationId) => {
        if (notificationId) {
          console.log(`Notification updated with ID: ${notificationId}`);
        } else {
          console.log("Failed to update notification");
        }
      });
    }
    return () => {
      if (!tracking.isTracking) {
        clearTrackingNotification();
      }
    };
  }, [elapsedTime, selectedOrganisation, tracking.isTracking]);

// Method to fetch data
const fetchStudentsOrgs = async () => {
  if (!user) {
    console.error("Clerk user not found in LandingScreen");
    return;
  }
  console.log("updating active orgs");
  const studentOrgs = await Organisation.getStudentsOrgs(currentStudent?.activeOrgs ?? []);
  setOrganisations(studentOrgs.filter(org => org && typeof org.toJSON === 'function').map((org) => org.toJSON()));
};

useFocusEffect(
  React.useCallback(() => {
    if (currentStudent) {
      fetchStudentsOrgs();
    }
  }, [currentStudent])
);

  // Fetch organisation data on component mount
  useEffect(() => {
    if (currentStudent) {
      fetchStudentsOrgs();
    }
  }, [currentStudent]);





  // Snap the bottom sheet closed when an organisation is selected
  useEffect(() => {
    if (selectedOrganisation) {
      sheetRef.current?.snapToIndex(0); // Snap to the first index (collapsed)
    }
  }, [selectedOrganisation]);

  useEffect(() => {
    const setupNotifications = async () => {
      const permissionGranted = await requestNotificationPermissions();
      if (permissionGranted) {
        // Set up notification categories with a button
        await Notifications.setNotificationCategoryAsync("tracking", [
          {
            identifier: "stop",
            buttonTitle: "Stop Tracking",
            options: {
              isDestructive: true,
              isAuthenticationRequired: false,
            },
          },
        ]);

        // Set up notification handler
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
          }),
        });

        // Listen for notification responses (button presses)
        const subscription =
          Notifications.addNotificationResponseReceivedListener(
            handleNotificationResponse
          );

        return () => subscription.remove();
      }
    };

    setupNotifications();
  }, []);

  //-----------------------------------------------------------//
  //                          METHODS                          //
  //-----------------------------------------------------------//

  /* Handle organisation item click to show popup and set selected organisation
   * @param pSelectedOrganisation - The selected organisation data
   */
  const handleOrganisationPress = (pSelectedOrganisation: OrganisationData) => {
    setIsPopupVisible(true); // Show the tracking popup
    setSelectedOrganisation(new Organisation(pSelectedOrganisation)); // Set the selected organisation
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
    try {
      // Start tracking the organisation
      await startTracking(selectedOrganisation);
  
      if (currentStudent) {
      // Update the student's active organisations
      const newActiveOrgs = [
        ...currentStudent.activeOrgs,
        selectedOrganisation.org_id,
      ];
      // Update the student data using the hook
      await updateCurrentStudent({ activeOrgs: newActiveOrgs });
      }
      // Hide the popup
      setIsPopupVisible(false);
      // Show or update the tracking notification
      await showOrUpdateTrackingNotification(selectedOrganisation.orgName, 0);
    } catch (error) {
      console.error("Error starting tracking:", error);
    }
  };

  /**
   * Handles the stop tracking action.
   *
   * This function performs the following steps:
   * 1. Stops the tracking process by calling `stopTracking()`.
   * 2. Updates the state to indicate that tracking is no longer active by setting `setIsTracking(false)`.
   * 3. Clears any tracking notifications by calling `clearTrackingNotification()`.
   *
   * @async
   * @function handleStopTracking
   * @returns {Promise<void>} A promise that resolves when the tracking has been stopped and notifications cleared.
   */
  const handleStopTracking = async () => {
    await stopTracking();
    setTracking({ isTracking: false, organizationName: "" });
    await clearTrackingNotification();
  };

  /**
   * Handles the notification response.
   *
   * @param response - The response object from the notification.
   * @param response.actionIdentifier - The identifier for the action taken on the notification.
   */
  const handleNotificationResponse = (response: any) => {
    if (response.actionIdentifier === "stop") {
      handleStopTracking();
    }
  };

  /*
   * Cancel tracking, close popup, and stop tracking if it's already running
   */
  const handleCancel = async () => {
    setIsPopupVisible(false); // Close the popup
  };

   //-----------------------------------------------------------//
  //                      CONDITIONAL RENDERING                //
  //-----------------------------------------------------------//

  if (loading) {
    return <Text> Loading... </Text>;
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
    <SafeAreaView style={styles.container}>
      {/* Map Component displaying selected organisation */}
      <MapComponent selectedOrganisation={selectedOrganisation} />

      {/* Tracking Popup for start/stop tracking */}
      <TrackingPopup
        visible={isPopupVisible}
        onStartTracking={handleStartTracking}
        onCancel={handleCancel}
      />
      {tracking.isTracking && (
        <View>
          <Text>Tracking: {selectedOrganisation?.orgName}</Text>
          <Text>Time: {elapsedTime} seconds</Text>
          <Pressable onPress={handleStopTracking}>
            <Text>Stop Tracking</Text>
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
      >
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetHeading}>Organisation List</Text>
        </View>
        {/* Scrollable list of organisations */}
        {(organisations.length > 0 && <BottomSheetFlatList
        
          data={organisations}
          // Use organisation ID as key
          keyExtractor={(item) => item.org_id}
          // Render each item using renderItem function
          renderItem={renderItem}
          contentContainerStyle={styles.listContentContainer}
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
    backgroundColor: "#fff",
  },
  sheetHeader: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  sheetHeading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#161616",
    marginBottom: 10,
  },
  listContentContainer: {
    backgroundColor: "#fff",
  },
  itemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
});
//------------------------***EOF***-----------------------------//
