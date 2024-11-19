import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";
import CustomButton from "../components/CustomButton";
import styles from "../styles/RegisterScreenStyle";
import LoginRegisterHyperlink from "../components/LoginRegisterHyperlink";
import LoginRegisterInputComponent from "../components/loginRegisterInputComponent";
import { Student } from "../databaseModels/databaseClasses/Student";
import LoginRegisterHeadingComponent from "../components/LoginRegisterHeadingComponent";
import { useSignUp } from "@clerk/clerk-expo";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StudentData } from "../databaseModels/StudentData";
import ConfirmationInputComponent from "../components/ConfirmationInputComponent";
import { RootStackParamsList } from "./RootStackParamsList";
import TermsAndConditionsPopup from "../components/TermsAndConditionsPopup";

/**
 * RegisterScreen component handles the user registration process.
 *
 * This component allows users to register using their email address and verify their email
 * through a code sent to their email. It also handles navigation based on the user's sign-in status.
 *
 * @component
 * @returns {React.FC} A functional component that renders the registration screen.
 *
 * @example
 * <RegisterScreen />
 *
 * @remarks
 * - Uses Clerk for authentication and email verification.
 * - Navigates to "LandingScreen" if the user is already signed in.
 * - Displays different UI based on whether the email verification is pending.
 *
 * @function
 * @name RegisterScreen
 *
 * @hook
 * @name useSignUp
 * @description Provides sign-up related functions and state.
 *
 * @hook
 * @name useAuth
 * @description Provides authentication related functions and state.
 *
 * @hook
 * @name useNavigation
 * @description Provides navigation functions.
 *
 * @state {string} emailAddress - The email address entered by the user.
 * @state {boolean} pendingVerification - Indicates if email verification is pending.
 * @state {string} code - The verification code entered by the user.
 *
 * @callback handlePress
 * @description Handles the registration button press, initiates the sign-up process, and prepares email verification.
 *
 * @callback onPressVerify
 * @description Handles the verification button press, attempts to verify the email, and completes the sign-up process.
 *
 * @callback handleEmailChange
 * @description Updates the email address state when the user changes the email input.
 *
 * @throws Will log errors to the console if any step in the sign-up or verification process fails.
 */

interface ClerkError {
  errors?: Array<{ code?: string; message?: string }>;
  message?: string;
}

const RegisterScreen: React.FC = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [emailError, setEmailError] = useState("");
  const { isLoaded, signUp, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamsList, "RegisterScreen">>();
  const [isTermsAndConditionsShown, setIsTermsAndConditionsShown] = useState(false);

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleAccept = async () => {
    if (!isLoaded) return;

    if (!validateEmail(emailAddress)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      await signUp.create({
        emailAddress,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      setEmailError("");
    } catch (err: unknown) {
      const error = err as ClerkError;
      if (error.errors && error.errors.length > 0) {
        const errorCode = error.errors[0]?.code;
        switch (errorCode) {
          case "form_identifier_exists":
            Alert.alert("Error", "This email address is already registered. Please try another.");
            break;
          default:
            console.error("Unexpected error:", error);
            Alert.alert("Error", "An unexpected error occurred. Please try again later.");
        }
      } else if (error.message === "Network Error") {
        Alert.alert("Error", "Network error. Please check your connection and try again.");
      } else {
        console.error("Unexpected error:", error);
        Alert.alert("Error", "An unexpected error occurred. Please try again later.");
      }
      const errorMessage = error.errors?.[0]?.message;
      setEmailError(errorMessage ?? "Failed to register. Please try again.");
      console.error(JSON.stringify(error, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        try {
          await setActive({ session: completeSignUp.createdSessionId });
          await new Promise(resolve => setTimeout(resolve, 1000));

          const uid = completeSignUp.createdUserId ?? "";
          if (uid === "") {
            throw new Error("No Clerk User ID found");
          }

          const handleSaveStudent = async (avatarId: string) => {
            const studentEmail = signUp.emailAddress ?? "";
            const studentNumber = studentEmail !== "" ? studentEmail.split("@")[0] : "";

            const newStudentData: StudentData = {
              student_id: uid,
              studentNumber,
              email: studentEmail,
              activeOrgs: [],
              locationData: {},
              profilePhotoId: avatarId,
              darkMode: false,
            };

            const newStudent = new Student(newStudentData);
            console.error("New Student Data:", newStudentData);

            await newStudent.save().catch(saveError => {
              console.error(`Error saving new student: ${newStudent}`, saveError);
            });
          };

          navigation.navigate("RegisterProfilePhotoScreen", {
            handleSaveStudent,
          });
        } catch (error) {
          console.error("Error during sign-up process:", error);
        }
      } else {
        console.error("Sign-up status is not complete:", completeSignUp.status);
      }
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleEmailChange = (newEmail: string) => {
    setEmailAddress(newEmail);
  };

  /**
   * The RegisterScreen component renders the registration screen.
   */
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.headingContainer}>
        <LoginRegisterHeadingComponent
          text={
            pendingVerification
              ? "Your OTP Awaits! Enter It Below!"
              : "Start Your Journey Of Impact"
          }
          color="#ffffff"
          fontSize={65}
        />
      </View>
      {!pendingVerification && (
        <>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.inputContainer}
          >
            <LoginRegisterInputComponent
              label="Register with your Student Email:"
              FGColor="#ffffff"
              onEmailChange={handleEmailChange}
              error={emailError}
            />
          </KeyboardAvoidingView>
          <View style={styles.inputContainer} />
          <View style={styles.buttonContainer}>
            <CustomButton
              onPress={() => {
                setIsTermsAndConditionsShown(true);
              }}
              title="Register"
              textColor="#334FD7"
              buttonColor="#ffffff"
              fontFamily="Rany-Medium"
              textSize={30}
            />
          </View>
        </>
      )}
      {pendingVerification && (
        <>
          <View style={styles.inputContainer}>
            <ConfirmationInputComponent
              _style={styles.inputContainer}
              label="Enter 6-digit code"
              FGColor="#ffffff"
              onEmailChange={setCode}
              value={code}
              _keyboardType="numeric"
              _maxLength={6}
            />
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton title="Verify Email" onPress={onPressVerify} />
          </View>
        </>
      )}
      <View style={styles.hyperlinkContainer}>
        <LoginRegisterHyperlink toLogin={true}>
          Already have an account? Log in
        </LoginRegisterHyperlink>
      </View>
      {isTermsAndConditionsShown && (
        <TermsAndConditionsPopup
          onAccept={() => {
            setIsTermsAndConditionsShown(false);
            handleAccept();
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
