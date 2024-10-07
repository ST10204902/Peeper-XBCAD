import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker, Region } from 'react-native-maps';
import { SessionLog } from '../databaseModels/databaseClasses/SessionLog';



const StudentLocationMap: React.FC<{ sessionData: SessionLog | null }> = ({ sessionData }) => {
  if (!sessionData) {
    return (
     null
    );
  }

  // Mapping location logs to coordinates
  const coordinates = sessionData.locationLogs.map(log => ({
    latitude: log.latitude,
    longitude: log.longitude,
  }));

  // Determine the initial region for the map based on viewport
  const initialRegion: Region = {
    latitude: (sessionData.viewport.high.latitude + sessionData.viewport.low.latitude) / 2,
    longitude: (sessionData.viewport.high.longitude + sessionData.viewport.low.longitude) / 2,
    latitudeDelta: Math.abs(sessionData.viewport.high.latitude - sessionData.viewport.low.latitude),
    longitudeDelta: Math.abs(sessionData.viewport.high.longitude - sessionData.viewport.low.longitude),
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {/* Render the path as a polyline */}
        <Polyline
          coordinates={coordinates}
          strokeWidth={4}
          strokeColor="rgba(0, 150, 255, 0.8)" // Customize the color
        />

        {/* Optional: Show markers at the start and end of the path */}
        <Marker
          coordinate={coordinates[0]} // Start point
          title="Start"
        />
        <Marker
          coordinate={coordinates[coordinates.length - 1]} // End point
          title="End"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default StudentLocationMap;
