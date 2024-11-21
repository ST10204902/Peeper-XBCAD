import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet } from "react-native";
import { Organisation } from "../databaseModels/databaseClasses/Organisation";

// Props for the MapComponent
interface MapComponentProps {
  selectedOrganisation: Organisation | null;
}

/**
 * @component MapComponent
 * @description A React Native component that displays an interactive map with organization locations.
 * Centers on Cape Town by default and can show specific organization markers when selected.
 *
 * @typedef {Object} Organisation
 * @property {number} orgLatitude - Organization's latitude coordinate
 * @property {number} orgLongitude - Organization's longitude coordinate
 *
 * @param {Object} props
 * @param {Organisation|null} props.selectedOrganisation - The currently selected organization to display on map
 *
 * @constant {number} defaultLatitude - Default latitude for Cape Town (-33.9249)
 * @constant {number} defaultLongitude - Default longitude for Cape Town (18.4241)
 *
 * @state {Object} region - Current map view region
 * @state {number} region.latitude - Latitude center of the map view
 * @state {number} region.longitude - Longitude center of the map view
 * @state {number} region.latitudeDelta - Latitude zoom level
 * @state {number} region.longitudeDelta - Longitude zoom level
 *
 * @effect Updates map region when selected organisation changes
 *
 * @returns {JSX.Element} A MapView component with optional organization marker
 *
 * @example
 * <MapComponent selectedOrganisation={someOrganisation} />
 */
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
      setRegion(prevRegion => ({
        ...prevRegion,
        latitude: selectedOrganisation.orgLatitude,
        longitude: selectedOrganisation.orgLongitude,
      }));
    } else {
      // Reset to default location when no organisation is selected
      setRegion(prevRegion => ({
        ...prevRegion,
        latitude: defaultLatitude,
        longitude: defaultLongitude,
      }));
    }
  }, [selectedOrganisation, defaultLatitude, defaultLongitude]);

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
