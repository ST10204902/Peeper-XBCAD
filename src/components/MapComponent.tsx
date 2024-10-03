import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet } from "react-native";

interface MapComponentProps {
  selectedLocation: { latitude: number; longitude: number } | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ selectedLocation }) => {
  const [region, setRegion] = useState({
    latitude: -33.9249, // Default latitude (Cape Town)
    longitude: 18.4241, // Default longitude (Cape Town)
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Update the region when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      setRegion({
        ...region,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });
    }
  }, [selectedLocation]);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            title="Selected Organisation"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;
