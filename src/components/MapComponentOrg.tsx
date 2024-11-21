import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface Props {
  coordinates: { latitude: number; longitude: number } | null;
}

/**
 * @component MapComponentOrg
 * @description A React Native map component that displays a location marker based on provided coordinates.
 * Shows a fallback message when no coordinates are available.
 *
 * @typedef {Object} Coordinates
 * @property {number} latitude - The latitude coordinate
 * @property {number} longitude - The longitude coordinate
 *
 * @param {Object} props
 * @param {Coordinates|null} props.coordinates - The coordinates to display on the map
 *
 * @styles {Object} styles - StyleSheet containing:
 *  - mapContainer: Container with fixed height
 *  - map: Flex layout for the MapView
 *
 * @returns {JSX.Element} A MapView with marker or fallback text message
 *
 * @example
 * <MapComponentOrg
 *   coordinates={{
 *     latitude: -33.9249,
 *     longitude: 18.4241
 *   }}
 * />
 */
const MapComponentOrg: React.FC<Props> = ({ coordinates }) => {
  return (
    <View style={styles.mapContainer}>
      {coordinates ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={coordinates} />
        </MapView>
      ) : (
        <Text>Enter a location to see it on the map</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    height: 300,
  },
  map: {
    flex: 1,
  },
});

export default MapComponentOrg;
