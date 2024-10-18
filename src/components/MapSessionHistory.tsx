import React, { useEffect, useState } from "react";
import MapView, { MapMarker, Marker } from "react-native-maps";
import { View, StyleSheet } from "react-native";
import { Organisation } from "../databaseModels/databaseClasses/Organisation";
import { Student } from "../databaseModels/databaseClasses/Student";
import { useUser } from "@clerk/clerk-expo";
import { SessionLog } from "../databaseModels/databaseClasses/SessionLog";

/*
 * Map component for displaying the Students previous community service locations.
 */
const MapSessionHistory: React.FC = () => {
  // Default location for Cape Town
  const defaultLatitude = -33.9249; // Cape Town latitude
  const defaultLongitude = 18.4241; // Cape Town longitude

  const clerkUser = useUser();
  const [currentStudent, setCurrentStudent] = React.useState<Student | null>(null);
  const [allOrganisations, setAllOrganisations] = React.useState<Organisation[] | null>(null);
  // State for loading status so that error handling can be implemented
  // note even for errors that should be impossible to occur, feed error messages to the user!!!
  //it will also help you debug!
  //TODO: implement error handling
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStudent = async () => {
      const student = await Student.fetchById(clerkUser.user?.id ?? "");
      console.log("Student: ", student?.email);
      setCurrentStudent(student);
      setLoading(false);
    };
    fetchStudent();
  }, [clerkUser.user?.id]);

  //get all organisations
  useEffect(() => {
    const fetchOrganisations = async () => {
      const orgs = await Organisation.getAllOrganisations();
      setAllOrganisations(orgs);
    };
    fetchOrganisations();
  });

  //All the students SessionLogs.
  const studentSessions: SessionLog[] = Array.isArray(currentStudent?.locationData)
    ? currentStudent.locationData
    : [];

    studentSessions.forEach(element => {
      console.log("Session: ", element);
    });

  const uniqueOrgIDs = Array.from(new Set(studentSessions.map((session) => session.orgID)));

  // get all the start locations for the sessions with unique organisation IDs
  const sessionStartLocations = studentSessions.map((session: SessionLog) =>
    uniqueOrgIDs.includes(session.orgID) ? session.locationLogs[0] : null
  );
  sessionStartLocations.filter((location) => location !== null);

  sessionStartLocations.forEach(element => {
    console.log("StartLocation: ", element);
  });

  function sessionMapMarkers() {
    return sessionStartLocations.map((location, index) => {
      return (
        <Marker
          key={index}
          coordinate={{
            latitude: location?.latitude ?? defaultLatitude,
            longitude: location?.longitude ?? defaultLongitude,
          }}
           title={userOrgs?.orgName ?? "Location"}
        />
      );
    });
  }

  const [userOrgs, setUserOrgs] = useState<Organisation | null>(null);

  useEffect(() => {
    const fetchOrganisation = async () => {
      const org = await Organisation.fetchById(uniqueOrgIDs[0]);
      setUserOrgs(org);
      setRegion({
        latitude: sessionStartLocations[0]?.latitude ?? defaultLatitude,
        longitude: sessionStartLocations[0]?.longitude ?? defaultLongitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    };

    fetchOrganisation();
  }, [uniqueOrgIDs]);

  // State for the map region
  const [region, setRegion] = useState({
    latitude: sessionStartLocations[0]?.latitude ?? defaultLatitude,
    longitude: sessionStartLocations[0]?.longitude ?? defaultLongitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

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
