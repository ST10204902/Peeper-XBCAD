import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Polyline, Marker, Region } from "react-native-maps";
import { SessionLog } from "../databaseModels/databaseClasses/SessionLog";

/**
 * @component StudentLocationMap
 * @description A React Native component that displays a map with a polyline representing a student's session path.
 * It shows markers at the start and end points of the path.
 *
 * @typedef {Object} SessionLog
 * @property {Array<LocationLog>} locationLogs - Array of location logs for the session
 * @property {Viewport} viewport - Viewport data for the session
 *
 * @typedef {Object} LocationLog
 * @property {number} latitude - Latitude coordinate of the location log
 * @property {number} longitude - Longitude coordinate of the location log
 *
 * @typedef {Object} Viewport
 * @property {Coordinate} high - High coordinate of the viewport
 * @property {Coordinate} low - Low coordinate of the viewport
 *
 * @typedef {Object} Coordinate
 * @property {number} latitude - Latitude coordinate
 * @property {number} longitude - Longitude coordinate
 *
 * @param {Object} props
 * @param {SessionLog|null} props.sessionData - The session data containing location logs and viewport information
 *
 * @returns {JSX.Element|null} A MapView component displaying the session path or null if no session data is provided
 *
 * @example
 * <StudentLocationMap sessionData={sessionData} />
 */
const StudentLocationMap: React.FC<{ sessionData: SessionLog | null }> = ({ sessionData }) => {
  if (!sessionData) {
    return null;
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
    longitudeDelta: Math.abs(
      sessionData.viewport.high.longitude - sessionData.viewport.low.longitude,
    ),
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
    width: "100%",
    height: "100%",
  },
});

export default StudentLocationMap;
