import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet } from "react-native";
import { Organisation } from "../databaseModels/databaseClasses/Organisation";
import { Student } from "../databaseModels/databaseClasses/Student";
import { useUser } from "@clerk/clerk-expo";
import { SessionLog } from "../databaseModels/databaseClasses/SessionLog";

/*
 * Map component for displaying the Students previous community service locations.
 */
const MapSessionHistory: React.FC<null> = () => {
  // Default location for Cape Town
  const defaultLatitude = -33.9249; // Cape Town latitude
  const defaultLongitude = 18.4241; // Cape Town longitude

  const clerkUser = useUser();
  const [currentStudent, setCurrentStudent] = React.useState<Student | null>(null);
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


const studentSessions: SessionLog[] = Array.isArray(currentStudent?.locationData) ? currentStudent.locationData : [];
const uniqueOrgIDs = Array.from(new Set(studentSessions.map((session) => session.orgID)));

// get all the start locations for the sessions with unique organisation IDs
const sessionStartLocations = studentSessions.map((session: SessionLog) => uniqueOrgIDs.includes(session.orgID) ? session.locationLogs[0] : null);
sessionStartLocations.filter((location) => location !== null);
sessionStartLocations[0]?.latitude;





  // State for the map region
  const [region, setRegion] = useState({
    latitude: sessionStartLocations?.orgLatitude ?? defaultLatitude,
    longitude: selectedOrganisation?.orgLongitude ?? defaultLongitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Update the map region when the selected organisation changes

  // Render the map with a marker for the selected organisation
  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        <Marker
          coordinate={{
            latitude: selectedOrganisation.orgLatitude,
            longitude: selectedOrganisation.orgLongitude,
          }}
          title={selectedOrganisation.orgName}
        />
      </MapView>
    </View>
  );
};

// Styles for the MapSessionHistory
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapSessionHistory;
//------------------------***EOF***-----------------------------//
