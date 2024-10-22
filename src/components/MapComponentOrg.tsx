import React from "react";
import { View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface Props {
  coordinates: { latitude: number; longitude: number } | null;
}

const MapComponentOrg: React.FC<Props> = ({ coordinates }) => {
  return (
    <View style={{ height: 300 }}>
      {coordinates ? (
        <MapView
          style={{ flex: 1 }}
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

export default MapComponentOrg;