import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet } from "react-native";
import { Student } from "../databaseModels/databaseClasses/Student";
import { LocationLog } from "../databaseModels/databaseClasses/LocationLog";
import { Viewport } from "../databaseModels/databaseClasses/Viewport";

/*
* Props for the MapSessionHistory component
*/
interface MapSessionHistoryComponentProps {
  currentStudent: Student;
}

/*
 * Map component for displaying the Students previous community service locations.
 */
const MapSessionHistory:  React.FC<MapSessionHistoryComponentProps> = ({
  currentStudent,
})  => {
  // Default location for Cape Town
  const defaultRegion = {
    latitude: -33.9249,   // Cape Town latitude
    longitude: 18.4241,   // Cape Town longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // State for session start locations (markers)
  const [sessionStartLocations, setSessionStartLocations] = useState<LocationLog[]>([]);
  // State for map region
  const [region, setRegion] = useState(defaultRegion);
  // Loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentStudent) return;
    // Fetch session start locations
    const fetchSessionLocations = () => {
      const tempSessionStartLocations: LocationLog[] = [];
      const seenOrgs = new Set<string>();

      Object.values(currentStudent.locationData).forEach((sessionLog) => {
        if (!seenOrgs.has(sessionLog.orgID)) {
          seenOrgs.add(sessionLog.orgID);
          tempSessionStartLocations.push(new LocationLog(sessionLog.locationLogs[0]));
        }
      });

      setSessionStartLocations(tempSessionStartLocations);

      // Update the region based on the bounding box of the session locations
      const boundingBox = Viewport.calculateBoundingBox(tempSessionStartLocations);
      if (boundingBox) {
        const newRegion = {
          latitude: (boundingBox.low.latitude + boundingBox.high.latitude) / 2,
          longitude: (boundingBox.low.longitude + boundingBox.high.longitude) / 2,
          latitudeDelta: boundingBox.high.latitude - boundingBox.low.latitude + 0.003,
          longitudeDelta: boundingBox.high.longitude - boundingBox.low.longitude + 0.003,
        };
        setRegion(newRegion);
      }

      setLoading(false);
    };

    fetchSessionLocations();
  }, [currentStudent]);

  return (
    <View style={styles.container}>
      {!loading && (
        <MapView
          style={styles.mapStyle}
          region={region}
          scrollEnabled={false}  // Disables scrolling
          zoomEnabled={false}    // Disables zooming
          pitchEnabled={false}   // Disables changing the viewing angle
          rotateEnabled={false}  // Disables rotating the map
        >
          {/* Render markers for each session start location*/}
          {sessionStartLocations.map((location: LocationLog, index: number) => (
            <Marker
              key={index}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              icon={require("../assets/icons/ServiceMapMarker.png")}
            />
          ))}
        </MapView>
      )}
    </View>
  );
};

// Styles for the MapSessionHistory component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapStyle: {
    marginTop: 10,
    ...StyleSheet.absoluteFillObject,  // Correct usage of absoluteFillObject,
  },
});

export default MapSessionHistory;

//------------------------***EOF***-----------------------------//
