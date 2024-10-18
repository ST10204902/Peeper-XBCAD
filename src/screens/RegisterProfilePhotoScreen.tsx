import { Alert, StyleSheet, Text, View } from "react-native";
import AvatarComponent from "../components/AvatarComponent";
import CustomButton from "../components/CustomButton";
import { useState } from "react";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamsList } from "./RootStackParamsList";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";

/**
 * RegisterProfilePhotoScreen component handles the avatar selection process during registration.
 *
 * This component allows users to select an avatar and submit it to be saved in their profile.
 * Upon successful submission, the user's account is saved to firebase and they are navigated to the BottomNavigationBar.
 *
 * @component
 * @returns {JSX.Element} A functional component that renders the avatar selection screen during registration.
 *
 * @example
 * <RegisterProfilePhotoScreen />
 *
 * @remarks
 * - Receives the handleSaveStudent function via navigation params to save the avatar.
 * - Navigates to "BottomNavigationBar" after the avatar is successfully saved.
 *
 * @function
 * @name RegisterProfilePhotoScreen
 *
 * @hook
 * @name useRoute
 * @description Accesses navigation parameters, including handleSaveStudent.
 *
 * @hook
 * @name useNavigation
 * @description Provides navigation functions to move to the BottomNavigationBar.
 *
 * @param {function} handleSaveStudent - Function passed via route params used to save the selected avatar to the user profile.
 *
 * @callback handleSubmit
 * @description Calls the handleSaveStudent function to save the avatar and navigates the user to the next screen upon success.
 *
 * @state {string} avatarURI - Stores the selected avatar's URI.
 *
 * @throws Will log errors to the console if there is an issue saving the avatar.
 */

function RegisterProfilePhotoScreen() {
  const [avatarURI, setAvatarURI] = useState("");
  const { user } = useUser();

  // Getting student from navigation
  const route =
    useRoute<RouteProp<RootStackParamsList, "RegisterProfilePhotoScreen">>();
  const navigation =
    useNavigation<NavigationProp<RootStackParamsList, "BottomNavigationBar">>();

  // Getting the handleSaveStudent used to save the avatar photo to the new student and save it to the firebase
  const { handleSaveStudent } = route.params;

  const handleSubmit = async () => {
    try {
      if (handleSaveStudent && typeof handleSaveStudent === "function") {
        if (user) {
          try {
            await handleSaveStudent(avatarURI);
            await user.update({
              unsafeMetadata: {
                ...(user.unsafeMetadata || {}),
                onboardingComplete: true,
              },
            });
          } catch (error) {
            console.error("Failed to update user metadata:", error);
            // Handle the error appropriately
          }
        } else {
          console.error("User is null or undefined.");
        }
      } else {
        console.error("handleSaveStudent is not a function");
      }
    } catch (error) {
      console.error("Error saving profile photo:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label_almost_done}>Almost Done!</Text>
      <Text style={styles.label_choose_avatar}>Choose Avatar:</Text>
      <AvatarComponent onAvatarSelected={(uri: string) => setAvatarURI(uri)} />
      <View style={styles.submit_button_container}>
        <CustomButton
          onPress={() => {
            handleSubmit();
          }}
          title="SUBMIT"
          textColor="black"
          buttonColor="#EC4E4B"
          fontFamily="Quittance"
          textSize={20}
          addFlex={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flex: 1,
  },
  label_almost_done: {
    fontFamily: "Quittance",
    fontSize: 30,
    marginStart: 20,
  },
  label_choose_avatar: {
    marginTop: 2,
    marginStart: 20,
    fontSize: 23,
    fontFamily: "Rany-Bold",
  },
  submit_button_container: {
    marginHorizontal: 20,
    marginBottom: 30,
    height: 65,
  },
});

export default RegisterProfilePhotoScreen;
