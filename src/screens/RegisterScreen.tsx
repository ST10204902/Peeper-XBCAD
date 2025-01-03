import React, { useEffect, useState } from "react";
import { SafeAreaView, Alert, View, } from "react-native";
import CustomButton from "../components/CustomButton"; // Ensure the path is correct
import styles from "../styles/RegisterScreenStyle"; // Ensure the path is correct
import LoginRegisterHyperlink from "../components/LoginRegisterHyperlink"; // Ensure the path is correct
import LoginRegisterInputComponent from "../components/loginRegisterInputComponent";
import { Student } from "../databaseModels/databaseClasses/Student";
//----------Code---------//
//Demonstrating where to implement pressing the button.
import LoginRegisterHeadingComponent from "../components/LoginRegisterHeadingComponent"; // Import the heading component
import {  useAuth, useSignUp  } from "@clerk/clerk-expo";
import {  useNavigation  } from "@react-navigation/native";
import {  StackNavigationProp  } from "@react-navigation/stack"; // Ensure the path is correct
import { StudentData } from "../databaseModels/StudentData";
import ConfirmationInputComponent from '../components/ConfirmationInputComponent';

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
const RegisterScreen: React.FC = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const { isLoaded, signUp, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { userId: clerkUserId } = useAuth();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      navigation.navigate("LandingScreen");
    }
  }, [isSignedIn, navigation]);

  const handlePress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
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

          await new Promise((resolve) => setTimeout(resolve, 1000));

          

          const uid = completeSignUp.createdUserId || "";

          console.log("Clerk User ID:", uid); // Log Clerk User ID
          Alert.alert(`Welcome, ${uid}!`);

          if (!uid) {
            throw new Error("No Clerk User ID found");
          }

          // Create a new student instance
          const newStudentData: StudentData = {
            student_id: uid,
            studentNumber: "", // Set default or prompt user for input
            email: signUp.emailAddress || "",
            activeOrgs: [],
            locationData: {},
          };

          const newStudent = new Student(newStudentData);
          console.log("New Student Data:", newStudentData); // Log new student data

          // Save to Firebase
          await newStudent.save().then(() => {
            Alert.alert(newStudent.email);
          }).catch((error) => {
            console.error("Error saving new student:", error); // Log error if save fails
          });

          navigation.navigate("BottomNavigationBar");
        } catch (error) {
          console.error("Error during sign-up process:", error); // Log any caught errors
        }
      } else {
        console.error("Sign-up status is not complete:", completeSignUp.status); // Log if status is not complete
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleEmailChange = (emailAddress: string) => {
    setEmailAddress(emailAddress);
  };

  /**
 * The RegisterScreen component renders the registration screen.
 */
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headingContainer}>
        <LoginRegisterHeadingComponent
        text={pendingVerification ? "Your OTP Awaits! Enter It Below!" : "Start Your Journey Of Impact"}
        color="#ffffff"
        fontSize={65}/>
      </View>
      {!pendingVerification && (
        <>
          <View style={styles.inputContainer}>
            <LoginRegisterInputComponent
              label="Register with your Student Email:"
              FGColor="#ffffff"
              onEmailChange={handleEmailChange}
            />
          </View>
          <View style={styles.inputContainer}>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              onPress={handlePress}
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
            style={styles.inputContainer}
            label="Enter 6-digit code"
            FGColor="#ffffff"
            onEmailChange={setCode}
            value={code}
            keyboardType="numeric"
            maxLength={6}
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
    </SafeAreaView>
  );
};

export default RegisterScreen;
