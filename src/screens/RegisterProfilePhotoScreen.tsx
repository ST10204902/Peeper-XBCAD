import { StyleSheet, Text, View } from "react-native";
import AvatarComponent from "../components/AvatarComponent";
import CustomButton from "../components/CustomButton";
import { useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
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
 *
 * @returns {JSX.Element} A functional component that renders the avatar selection screen during registration.
 */

interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

function RegisterProfilePhotoScreen() {
  const [avatarURI, setAvatarURI] = useState("");
  const { user } = useUser();

  // Getting the handleSaveStudent used to save the avatar photo to the new student and save it to the firebase
  const {
    params: { handleSaveStudent },
  } = useRoute<RouteProp<RootStackParamsList, "RegisterProfilePhotoScreen">>();

  // Error logging helper
  const logError = (message: string, error?: unknown) => {
    if (error !== null && error !== undefined) {
      const errorMessage = isErrorWithMessage(error) ? error.message : "Unknown error occurred";
      console.error(message, errorMessage);
    } else {
      console.error(message);
    }
  };

  // handle the user clicking the submit button
  const handleSubmit = async () => {
    try {
      if (typeof handleSaveStudent === "function" && user) {
        // Saving the student to Firebase using the function from RegisterScreen
        await handleSaveStudent(avatarURI);
        // Updating the metadata to indicate the user has completed onboarding
        // This RERENDERS the AppNavigator Component in App.tsx effectively navigating the user to the BottomNavigationBar
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            onboardingComplete: true,
          },
        });
      } else {
        logError("handleSaveStudent is not a function or user is undefined");
      }
    } catch (error) {
      logError("Error saving profile photo", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label_almost_done}>Almost Done!</Text>
      <Text style={styles.label_choose_avatar}>Choose Avatar:</Text>
      <AvatarComponent
        onAvatarSelected={(uri: string) => setAvatarURI(uri)}
        selectedAvatarURI={avatarURI}
      />
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
