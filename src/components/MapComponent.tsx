import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet } from "react-native";
import { Organisation } from "../databaseModels/databaseClasses/Organisation";

/*
  * Map component for displaying the organisation location.
  */

// Props for the MapComponent
interface MapComponentProps {
  selectedOrganisation: Organisation | null;
}

// MapComponent functional component
const MapComponent: React.FC<MapComponentProps> = ({ selectedOrganisation }) => {
  // Default location for Cape Town
  const defaultLatitude = -33.9249; // Cape Town latitude
  const defaultLongitude = 18.4241; // Cape Town longitude

  // State for the map region
  const [region, setRegion] = useState({
    latitude: selectedOrganisation?.orgLatitude ?? defaultLatitude,
    longitude: selectedOrganisation?.orgLongitude ?? defaultLongitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Update the map region when the selected organisation changes
  useEffect(() => {
    if (selectedOrganisation) {
      setRegion((prevRegion) => ({
        ...prevRegion,
        latitude: selectedOrganisation.orgLatitude,
        longitude: selectedOrganisation.orgLongitude,
      }));
    } else {
      // Reset to default location when no organisation is selected
      setRegion((prevRegion) => ({
        ...prevRegion,
        latitude: defaultLatitude,
        longitude: defaultLongitude,
      }));
    }
  }, [selectedOrganisation]);

  // Render the map with a marker for the selected organisation
  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        {selectedOrganisation && (
          <Marker
            coordinate={{
              latitude: selectedOrganisation.orgLatitude,
              longitude: selectedOrganisation.orgLongitude,
            }}
            title={selectedOrganisation.orgName}
          />
        )}
      </MapView>
    </View>
  );
};

// Styles for the MapComponent
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;
//------------------------***EOF***-----------------------------//