import React, { useEffect, useState, useMemo } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet, Dimensions } from "react-native";
import { Student } from "../databaseModels/databaseClasses/Student";
import { LocationLog } from "../databaseModels/databaseClasses/LocationLog";
import { Viewport } from "../databaseModels/databaseClasses/Viewport";
import { useTheme } from "../styles/ThemeContext";
import ServiceMapMarker from "../assets/icons/ServiceMapMarker.png";

interface MapSessionHistoryComponentProps {
  currentStudent: Student;
}

const MapSessionHistory: React.FC<MapSessionHistoryComponentProps> = ({ currentStudent }) => {
  const { isDarkMode } = useTheme();

  // Default location for Cape Town - memoized to prevent recreation on every render
  const defaultRegion = useMemo(
    () => ({
      latitude: -33.9249,
      longitude: 18.4241,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }),
    [],
  );

  // State for session start locations (markers)
  const [sessionStartLocations, setSessionStartLocations] = useState<LocationLog[]>([]);
  // State for map region
  const [region, setRegion] = useState(defaultRegion);
  // Loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentStudent === null || currentStudent === undefined) return;
    // Fetch session start locations
    const fetchSessionLocations = () => {
      const tempSessionStartLocations: LocationLog[] = [];
      const seenOrgs = new Set<string>();
      if (currentStudent.locationData === null || currentStudent.locationData === undefined) {
        setLoading(false);
        return;
      }
      Object.values(currentStudent.locationData).forEach(sessionLog => {
        if (!seenOrgs.has(sessionLog.orgID)) {
          seenOrgs.add(sessionLog.orgID);

          // Check if locationLogs is an array and has at least one element
          if (Array.isArray(sessionLog.locationLogs) && sessionLog.locationLogs.length > 0) {
            const firstLocationLogData = sessionLog.locationLogs[0];
            tempSessionStartLocations.push(new LocationLog(firstLocationLogData));
          }
        }
      });

      setSessionStartLocations(tempSessionStartLocations);

      if (tempSessionStartLocations.length === 0) {
        setRegion(defaultRegion);
        setLoading(false);
        return;
      }

      // Update the region based on the bounding box of the session locations
      const boundingBox = Viewport.calculateBoundingBox(tempSessionStartLocations);
      if (boundingBox !== null && boundingBox !== undefined) {
        const newRegion = {
          latitude: (boundingBox.low.latitude + boundingBox.high.latitude) / 2,
          longitude: (boundingBox.low.longitude + boundingBox.high.longitude) / 2,
          latitudeDelta:
            boundingBox.high.latitude -
            boundingBox.low.latitude +
            0.5 * (boundingBox.high.latitude - boundingBox.low.latitude),
          longitudeDelta:
            boundingBox.high.longitude -
            boundingBox.low.longitude +
            0.5 * (boundingBox.high.latitude - boundingBox.low.latitude),
        };
        setRegion(newRegion);
      }

      setLoading(false);
    };

    fetchSessionLocations();
  }, [currentStudent, defaultRegion]);

  return (
    <View style={styles.mapContainer}>
      <View style={styles.mapWrapper}>
        {!loading && (
          <MapView
            style={styles.mapStyle}
            region={region}
            userInterfaceStyle={isDarkMode ? "dark" : "light"}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            {sessionStartLocations.map((location: LocationLog, index: number) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                icon={ServiceMapMarker}
              />
            ))}
          </MapView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    height: Dimensions.get("window").height * 0.3,
  },
  mapWrapper: {
    flex: 1,
    overflow: "hidden",
  },
  mapStyle: {
    width: "100%",
    height: "100%",
  },
});

export default MapSessionHistory;
