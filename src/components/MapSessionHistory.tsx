import React, { useEffect, useState } from "react";
import MapView, { MapMarker, Marker } from "react-native-maps";
import { View, StyleSheet } from "react-native";
import { Organisation } from "../databaseModels/databaseClasses/Organisation";
import { Student } from "../databaseModels/databaseClasses/Student";
import { SessionLog } from "../databaseModels/databaseClasses/SessionLog";
import { set } from "firebase/database";
import { LocationLog } from "../databaseModels/databaseClasses/LocationLog";
import { StudentData } from "../databaseModels/StudentData";

/*
 * Map component for displaying the Students previous community service locations.
 */
const MapSessionHistory: React.FC<StudentData> = (student: StudentData) => {
  // Default location for Cape Town
  const defaultLatitude = -33.9249; // Cape Town latitude
  const defaultLongitude = 18.4241; // Cape Town longitude

  const [currentStudent, setCurrentStudent] = React.useState<Student | null>(null);
  const [allOrganisations, setAllOrganisations] = React.useState<Organisation[] | null>(null);
  const [sessionStartLocations, setSessionStartLocations] = React.useState<LocationLog[]>([]);
  // State for loading status so that error handling can be implemented
  // note even for errors that should be impossible to occur, feed error messages to the user!!!
  //it will also help you debug!
  //TODO: implement error handling
  const [loading, setLoading] = React.useState(true);

  //get all organisations and set current student
  useEffect(() => {
    const fetchData = async () => {
      
      setCurrentStudent(new Student(student));
      console.log("Student: ", student);
      const organisations = await Organisation.getAllOrganisations();
      setAllOrganisations(organisations);
      setLoading(false);
    };

    fetchData();
  }, [student]);



  function sessionMapMarkers() {

    Object.values(student.locationData).forEach((sessionLog) => {
      const seenOrgs = new Set<string>();
      for (const locationLog of sessionLog.locationLogs) {
        if (!seenOrgs.has(sessionLog.orgID)) {
          seenOrgs.add(sessionLog.orgID);
          sessionStartLocations.push(new LocationLog(locationLog));
        }
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
 

  // State for the map region
  const [region, setRegion] = useState({
    latitude: defaultLatitude,
    longitude: defaultLongitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [userOrgs, setUserOrgs] = useState<Organisation | null>(null);

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
