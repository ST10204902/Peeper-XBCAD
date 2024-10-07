import React, { useRef, useMemo, useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import MapComponent from "../components/MapComponent";
import OrganisationListItem from "../components/OrganisationListItem";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import TrackingPopup from "../components/TrackingPopup";
import { OrganisationData } from "../databaseModels/OrganisationData";
import { Organisation } from "../databaseModels/databaseClasses/Organisation";
import { useLocationTracking } from "../hooks/useLocationTracking";
import { Student } from "../databaseModels/databaseClasses/Student";
import { useUser } from "@clerk/clerk-expo";
import { SessionLog } from "../databaseModels/databaseClasses/SessionLog";
import StudentLocationMap from "../components/StudentLocationMap";



export default function LandingScreen() {
  const [organisations, setOrganisations] = useState<OrganisationData[]>([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { isTracking, startTracking, stopTracking, errorMsg   } = useLocationTracking();
  const [currentStudent, setCurrentStudent] = useState<Student>();
  const { user } = useUser(); // Get the current user from the Clerk context
  const [selectedOrganisation, setSelectedOrganisation] = useState<Organisation | null>(null);
  const [sessionData, setSessionData] = useState<SessionLog>();
  const [endTracking, setEndTracking] = useState(false);
  const sheetRef = useRef<BottomSheet>(null);
  // Define snap points (different heights the bottom sheet can snap to)
  const snapPoints = useMemo(() => [100, "50%", "100%"], []);
  
  useEffect(() => {
    const fetchOrganisations = async () => {
      try{
        const orgs = await Organisation.getAllOrganisations();
        setOrganisations(orgs);
      } catch (error) {
        console.error("Error fetching organisations:", error);
      }
    };

    fetchOrganisations();
  }, []);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (!user)
        {
          console.error("Landing Screen ln39: ", "clerk user not found");
         // add navigation to login screen here
           return;
        }
        const student = await Student.fetchById(user.id);
        if (!student)
        {
          console.error("Landing Screen ln44: ", "Student not found");
           return;
        }
        setCurrentStudent(student);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };

    fetchStudent();
  }, [user]);

  useEffect(() => {
    if (selectedOrganisation) {
      sheetRef.current?.snapToIndex(0); // Snap to the closed position when an organisation is selected
    }
  }, [selectedOrganisation]);
 

   // Function to handle organisation item click
   const handleOrganisationPress = (pSelectedOrganisation: OrganisationData) => {
    setIsPopupVisible(true);
    setSelectedOrganisation(new Organisation(pSelectedOrganisation));
    console.log(`${pSelectedOrganisation.orgName} selected`);
  };

  const handleStartTracking = () => {
    if (!currentStudent || !selectedOrganisation) {
      console.error("Student or organisation not found");
      return;
    }
    startTracking(currentStudent, selectedOrganisation).then(() => {
      setIsPopupVisible(false); // Close the popup
    });
  };

  const handleCancel = async () => {
    setIsPopupVisible(false); // Close the popup
    if (isTracking && currentStudent) {
      stopTracking()
    };
  };

  const renderItem = ({ item, index }: { item: OrganisationData; index: number }) => (
    <OrganisationListItem
      orgName={item.orgName}
      oddOrEven={index % 2 === 0 ? "even" : "odd"} // Alternate between 'odd' and 'even'
      onPress={() => {
        handleOrganisationPress(item);
      }}
    />
  );
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Map Component */}
       <MapComponent selectedOrganisation={selectedOrganisation} /> 
      
      {/* Tracking Popup */}
      <TrackingPopup
        visible={isPopupVisible}
        onStartTracking={handleStartTracking}
        onCancel={handleCancel}
      />
      {/* Bottom Sheet for Organisation List */}
      <BottomSheet
        ref={sheetRef}
        index={0} // Initial position (0 = collapsed)
        snapPoints={snapPoints} // Snap points for the bottom sheet
        enablePanDownToClose={false} // Prevent closing with a swipe down
      >
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetHeading}>Organisation List</Text>
        </View>

        {/* Scrollable Organisation List */}
        <BottomSheetFlatList
          data={organisations}
          keyExtractor={(item) => item.org_id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContentContainer}
        />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  sheetHeader: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  sheetHeading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#161616", // White text
    marginBottom: 10,
  },
  listContentContainer: {
    backgroundColor: "#fff",
  },
  itemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
});
