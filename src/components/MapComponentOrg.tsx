import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface Props {
  coordinates: { latitude: number; longitude: number } | null;
}

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
