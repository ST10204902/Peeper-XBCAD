import React, { useRef, useMemo, useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import MapComponent from "../components/MapComponent";
import OrganisationListItem from "../components/OrganisationListItem";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import TrackingPopup from "../components/TrackingPopup";
import { OrganisationData } from "../databaseModels/OrganisationData";
import { Organisation } from "../databaseModels/databaseClasses/Organisation";

export default function LandingScreen() {
  const [organisations, setOrganisations] = useState<OrganisationData[]>([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    const fetchOrganisations = async () => {
      try{
        const orgs = await Organisation.getAllOrganisations();
        setOrganisations(orgs);
      } catch (error) {
        console.error("Error fetching organisations:", error);
      }
    };

    fetchOrganisations();
  }, []);

  

  const handleStartTracking = () => {
  // IMPLEMENT THE TRACKING FUNCTIONALITY HERE
    setIsPopupVisible(false); // Close the popup
  };

  const handleCancel = () => {
    setIsPopupVisible(false); // Close the popup
  };

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const sheetRef = useRef<BottomSheet>(null);

  // Define snap points (different heights the bottom sheet can snap to)
  const snapPoints = useMemo(() => [100, "50%", "100%"], []);

  useEffect(() => {
    if (selectedLocation) {
      sheetRef.current?.snapToIndex(0); // Snap to the closed position
    }
  }, [selectedLocation]);

  // Function to handle organisation item click
  const handleOrganisationPress = (
    latitude: number,
    longitude: number,
    organisationName: String
  ) => {
    setSelectedLocation({ latitude, longitude });
    setIsPopupVisible(true);
    console.log(`${organisationName} selected`);
  };

  const renderItem = ({ item, index }: { item: OrganisationData; index: number }) => (
    <OrganisationListItem
      orgName={item.orgName}
      oddOrEven={index % 2 === 0 ? "even" : "odd"} // Alternate between 'odd' and 'even'
      onPress={() => {
        handleOrganisationPress(item.orgLatitude, item.orgLongitude, item.orgName);
        console.log("Pressed:", item.orgName);
      }}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Map Component */}
      <MapComponent selectedLocation={selectedLocation} />

      {/* Tracking Popup */}
      <TrackingPopup
        visible={isPopupVisible}
        onStartTracking={handleStartTracking}
        onCancel={handleCancel}
      />
      {/* Bottom Sheet for Organisation List */}
      <BottomSheet
        ref={sheetRef}
        index={0} // Initial position (0 = collapsed)
        snapPoints={snapPoints} // Snap points for the bottom sheet
        enablePanDownToClose={false} // Prevent closing with a swipe down
      >
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetHeading}>Organisation List</Text>
        </View>

        {/* Scrollable Organisation List */}
        <BottomSheetFlatList
          data={organisations}
          keyExtractor={(item) => item.org_id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContentContainer}
        />
      </BottomSheet>
    </SafeAreaView>
  );
}

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
    color: "#161616", // White text
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
