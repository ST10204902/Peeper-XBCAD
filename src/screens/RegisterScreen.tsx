import React, { useEffect, useState } from "react";
import { SafeAreaView, Alert, View, TextInput, Button } from "react-native";
import CustomButton from "../components/CustomButton"; // Ensure the path is correct
import styles from "../styles/RegisterScreenStyle"; // Ensure the path is correct
import LoginRegisterHyperlink from "../components/LoginRegisterHyperlink"; // Ensure the path is correct
import LoginRegisterInputComponent from "../components/loginRegisterInputComponent";
import { useAuth, useSignUp } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack"; // Ensure the path is correct
import { StudentData } from "../databaseModels/StudentData";
import { Student } from "../databaseModels/databaseClasses/Student";

//----------Code---------//
//Demonstrating where to implement pressing the button.
const RegisterScreen: React.FC = () => {
  const [emailAddress, setEmailAddress] = React.useState("");
  const { isLoaded, signUp, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
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

  return (
    <SafeAreaView style={styles.container}>
      {!pendingVerification && (
        <>
          <LoginRegisterInputComponent
            label="Register with your Student Email:"
            FGColor="#ffffff"
            onEmailChange={handleEmailChange}
          />
          <CustomButton
            onPress={handlePress}
            title="Register"
            textColor="#334FD7"
            buttonColor="#ffffff"
            fontFamily="Rany-Medium"
            textSize={30}
          />
        </>
      )}
      {pendingVerification && (
        <>
          <TextInput
            value={code}
            placeholder="Code..."
            onChangeText={(code) => setCode(code)}
          />
          <Button title="Verify Email" onPress={onPressVerify} />
        </>
      )}

      <LoginRegisterHyperlink toLogin={true}>
        Already have an account? Log in
      </LoginRegisterHyperlink>
    </SafeAreaView>
  );
};

export default RegisterScreen;
