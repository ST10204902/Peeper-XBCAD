import { Text, StyleSheet, Alert } from "react-native";
import Input from "../../components/GeneralInputComponent";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CustomButton from "../../components/CustomButton";
import { useState } from "react";
import { ApprovalStatus } from "../../databaseModels/enums";
import { OrgRequest } from "../../databaseModels/databaseClasses/OrgRequest";
import { OrgRequestData } from "../../databaseModels/OrgRequestData";
import { OrgAddress } from "../../databaseModels/databaseClasses/OrgAddress";
import { DatabaseUtility } from "../../databaseModels/databaseClasses/DatabaseUtility";
import { useCurrentStudent } from "../../hooks/useCurrentStudent";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamsList } from "../RootStackParamsList";
import SearchLocation from "../../components/SearchLocation";
import { set } from "firebase/database";
import { useTheme } from '../../styles/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/themes';

/**
 * SearchLocation component provides a location search and selection interface.
 *
 * This component allows users to search for a location using the Google Places API, display the selected location on a map, and place a marker at the selected coordinates. It includes an autocomplete input field and a map view.
 *
 * @component
 * @param {Props} props - Props containing a function to handle place updates.
 * @returns {JSX.Element} The rendered SearchLocation component.
 *
 * @example
 * // Usage example:
 * <SearchLocation handlePlaceUpdated={(place) => console.log(place)} />
 *
 * @remarks
 * - Requires a valid Google Maps API key to function.
 * - Updates the map's region and adds a marker to the map based on the selected place.
 * - Includes keyboard handling with `KeyboardAvoidingView` for a smooth user experience on iOS.
 *
 * @function
 * @name SearchLocation
 *
 * @param {function} handlePlaceUpdated - Callback function to handle updates when a place is selected.
 *
 * @hook
 * @name useState
 * @description Manages the state for the marker's coordinates.
 *
 * @hook
 * @name useRef
 * @description Provides a reference to the MapView component for controlling the map's region.
 *
 * @state {Object | null} markerCoordinate - The coordinates of the marker on the map.
 *
 * @throws Will throw an error if the Google Maps API key is missing.
 */
export default function RequestOrgScreen() {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [orgName, setOrgName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [phoneNum, setPhoneNum] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { currentStudent } = useCurrentStudent();
  const [lng, setLng] = useState<number>(0);
  const [lat, setLat] = useState<number>(0); 
  const navigation =
    useNavigation<
      NavigationProp<RootStackParamsList, "RequestProgressScreen">
    >();

  // Function to handle form submission
  const handleSubmit = async () => {
    // Basic validation
    if (!currentStudent) {
      console.log("No student data found while submitting request");
      return;
    }
    if (!orgName || !location || !phoneNum || !email) {
      Alert.alert("Error", "Please fill in all fields.");
      console.log(location);
      return;
    }

    try {
      // Temporary location data input for development
      const locationData = location.split(",");

      // Create OrgRequestData object
      const requestData: OrgRequestData = {
        request_id: DatabaseUtility.generateUniqueId(),
        studentID: currentStudent?.student_id,
        org_id: DatabaseUtility.generateUniqueId(),
        name: orgName,
        orgAddress: new OrgAddress({
          streetAddress: locationData[0] ?? "",
          suburb: locationData[1] ?? "",
          city: locationData[2] ?? "",
          province: "",
          postalCode: locationData[3] ?? "",
        }),
        email: email ?? "nah",
        phoneNo: phoneNum ?? "nah",
        approvalStatus: ApprovalStatus.Pending, // Default to pending approval status
        orgLatitude: lat,
        orgLongitude: lng,
      };

      // Create and save the OrgRequest
      const newRequest = new OrgRequest(requestData);
      console.log("New request:", newRequest);
      await newRequest.save();

      // Success message
      Alert.alert("Success", "Your request has been submitted.");

      // Navigate to Request Progress Screen
      navigation.navigate("RequestProgressScreen");

      // Clear input fields
      setOrgName("");
      setLocation("");
      setPhoneNum("");
      setEmail("");
    } catch (error) {
      // Handle errors (e.g., network or database errors)
      Alert.alert("Error", "Failed to submit request. Please try again later.");
      console.error(error);
    }
  };

  const handlePlaceUpdated = (place: string, coordinate: { latitude: number; longitude: number }) => {
    setLocation(place);
    setLat(coordinate.latitude);
    setLng(coordinate.longitude);
  };

  return (
    <ScrollView style={[styles.screenLayout, { backgroundColor: theme.background }]} keyboardShouldPersistTaps="handled">
      <Text style={[styles.headerText, { color: theme.fontRegular }]}>Request an Organisation</Text>

      <View style={styles.map_container}>
        <SearchLocation
          handlePlaceUpdated={handlePlaceUpdated}
        />
      </View>

      <View style={styles.inputSpacing}>
        <Input
          FGColor="#5A5A5A"
          onSearchInputChange={setOrgName}
          placeHolderColor="grey"
          placeholderText="Enter organisation name"
          labelText="Organisation Name"
        />
      </View>

      <View style={styles.inputSpacing}>
        <Input
          FGColor="#5A5A5A"
          onSearchInputChange={setPhoneNum}
          placeHolderColor="grey"
          placeholderText="Enter organisation phone number"
          labelText="Phone Number"
        />
      </View>

      <View style={styles.inputSpacing}>
        <Input
          FGColor="#5A5A5A"
          onSearchInputChange={setEmail}
          placeHolderColor="grey"
          placeholderText="Enter organisation email"
          labelText="Email"
        />
      </View>

      <CustomButton
        onPress={handleSubmit}
        title="Request"
        fontFamily="Quittance"
        textSize={30}
        buttonColor="#C8B0FF"
        textColor="#161616"
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  screenLayout: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  headerText: {
    marginHorizontal: 16,
    marginTop: 50,
    marginBottom: 10,
    fontSize: 32,
    fontFamily: "Quittance",
    color: "#161616",
  },
  inputSpacing: {
    marginBottom: 15,
    marginHorizontal: 16,
  },
  map_container: {
    flex: 1,
  },
});
