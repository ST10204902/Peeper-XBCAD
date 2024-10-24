import React from "react";
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from "react-native";
import StudentHeaderComponent from "../../components/StudentheaderComponent";
import CustomButton from "../../components/CustomButton";
import EmergencyContacts from "../../components/EmergencyContacts";
import { useUser } from "@clerk/clerk-expo";
import MapSessionHistory from "../../components/MapSessionHistory";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootStackParamsList } from "../RootStackParamsList";
import { useCurrentStudent } from "../../hooks/useCurrentStudent";
import { useTheme } from '../../styles/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/themes';

const OrgDetailsScreen = () => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const clerkUser = useUser();
  const {
    currentStudent,
    error,
    loading,
    saving,
    updateCurrentStudent,
  } = useCurrentStudent();
  const navigation = useNavigation<NavigationProp<RootStackParamsList, "OrgDetails">>();

  // Method to fetch the student data
  const fetchStudent = async () => {
    if (error) {
      console.log("Error fetching student in OrgDetailsScreen:", error);
      return;
    }
  };

  // Run the fetchStudent method when the screen is focused (navigated to)
  // this is in case they have just recorded a session and the the location needs to be updated on the map
  useFocusEffect(
    React.useCallback(() => {
      fetchStudent();
    }, [currentStudent, error, loading, saving])
  );

  if (loading) {
    return <Text>Loading student data...</Text>;
  }

  if (error) {
    return <Text>Error loading student data: {error.message}</Text>;
  }

  if (!currentStudent) {
    return <Text>No student data available.</Text>;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.paddedContainer}>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            currentStudent && <StudentHeaderComponent currentStudent={currentStudent} />
          )}
          <CustomButton
            onPress={() => { navigation.navigate("ManageOrgsScreen", currentStudent!); }}
            title="Organisation Management"
            textColor={theme.fontRegular}
            buttonColor="#A4DB51"
            fontFamily="Quittance"
            textSize={28}
            verticalPadding={25}
            cornerRadius={20}
            lineHeight={30}
          />
          <Text style={[styles.BeSafeText, { color: theme.fontRegular }]}>Session History</Text>
        </View>
        {currentStudent && <MapSessionHistory currentStudent={currentStudent} />}
        <View style={styles.paddedContainer}>
          <Text style={[styles.BeSafeText, { color: theme.fontRegular }]}>Be Safe!</Text>
          <EmergencyContacts />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  paddedContainer: {
    padding: 10,
  },
  BeSafeText: {
    fontFamily: "Rany-Bold",
    fontSize: 18,
    textAlign: "left",
    marginLeft: 10,
    marginTop: 12,
  },
  container: {
    flex: 1,
  },
  sheetHeader: {
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  sheetHeading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#161616",
    marginBottom: 10,
  },
  listContentContainer: {
    backgroundColor: "#fff",
  },
  itemContainer: {
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 16,
  },
});

export default OrgDetailsScreen;