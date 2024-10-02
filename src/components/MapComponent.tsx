// MapComponent.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapComponent: React.FC = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825, // Default latitude (you can change it)
          longitude: -122.4324, // Default longitude (you can change it)
          latitudeDelta: 0.0922, // Zoom level for latitude
          longitudeDelta: 0.0421, // Zoom level for longitude
        }}
      >
        {/* Example marker */}
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title="Marker Title"
          description="Marker Description"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes full screen
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Makes the map fill the screen
  },
});

export default MapComponent;
