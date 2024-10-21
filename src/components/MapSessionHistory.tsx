import React, { useEffect, useState } from "react";
import MapView, { MapMarker, Marker } from "react-native-maps";
import { View, StyleSheet } from "react-native";
import { Organisation } from "../databaseModels/databaseClasses/Organisation";
import { Student } from "../databaseModels/databaseClasses/Student";
import { SessionLog } from "../databaseModels/databaseClasses/SessionLog";
import { set } from "firebase/database";
import { LocationLog } from "../databaseModels/databaseClasses/LocationLog";
import { StudentData } from "../databaseModels/StudentData";
import { Viewport } from "../databaseModels/databaseClasses/Viewport";

interface MapSessionHistoryComponentProps {
  currentStudent: Student;
}


/*
 * Map component for displaying the Students previous community service locations.
 */
const MapSessionHistory:  React.FC<MapSessionHistoryComponentProps> = ({
  currentStudent,
}) => {
  // Default location for Cape Town
  const defaultLatitude = -33.9249; // Cape Town latitude
  const defaultLongitude = 18.4241; // Cape Town longitude

  const [allOrganisations, setAllOrganisations] = React.useState<Organisation[] | null>(null);
  const [userOrgs, setUserOrgs] = useState<Organisation | null>(null);

   // State for the map region
   const [region, setRegion] = useState({
    latitude: defaultLatitude,
    longitude: defaultLongitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [sessionStartLocations, setSessionStartLocations] = React.useState<LocationLog[]>([]);
  // State for loading status so that error handling can be implemented
  // note even for errors that should be impossible to occur, feed error messages to the user!!!
  //it will also help you debug!
  //TODO: implement error handling
  const [loading, setLoading] = React.useState(true);

  //get all organisations and set current student
  useEffect(() => {
    const fetchData = async () => {
      console.log("MapSessionHistory useEffect() was called");
      
      setLoading(false);
      if (sessionStartLocations && sessionStartLocations.length > 0) {
        const boundingBox = Viewport.calculateBoundingBox(sessionStartLocations);
        console.log("Bounding box: ", boundingBox);
        setRegion({
          latitude: (boundingBox.low.latitude + boundingBox.high.latitude) / 2,
          longitude: (boundingBox.low.longitude + boundingBox.high.longitude) / 2,
          latitudeDelta: boundingBox.high.latitude - boundingBox.low.latitude,
          longitudeDelta: boundingBox.high.longitude - boundingBox.low.longitude,
        });
      }
    };

    fetchData();
  }, [currentStudent]);



  function sessionMapMarkers() {
    if (!currentStudent) return null;

    const seenOrgs = new Set<string>();
    Object.values(currentStudent.locationData).forEach((sessionLog) => {

        if (!seenOrgs.has(sessionLog.orgID)) {
          seenOrgs.add(sessionLog.orgID);
          sessionStartLocations.push(new LocationLog(sessionLog.locationLogs[0]));
        }
      });
    

    return sessionStartLocations.map((location, index) => {
        return (
          <Marker
            key={index}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          />
        );
      });
  }


  
  // Update the map region when the selected organisation changes

  // Render the map with a marker for the selected organisation
  return (
    <View style={styles.container}>
      {!loading && (
        <MapView style={styles.mapStyle} region={region}>
          {sessionMapMarkers()}
        </MapView>
      )}
    </View>
  );
};

// Styles for the MapSessionHistory
// these are the same sytles as the Map component currently if they are when don move both to a sep
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapStyle: {
    marginTop: 10,
    ...StyleSheet.absoluteFillObject, // Correct usage of absoluteFillObject,
  },
});

export default MapSessionHistory;

//------------------------***EOF***-----------------------------//
