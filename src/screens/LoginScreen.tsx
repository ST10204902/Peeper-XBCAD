import React, { useState, useEffect } from "react";
import { SafeAreaView, View } from "react-native";
import CustomButton from "../components/CustomButton"; // Ensure the path is correct
import styles from "../styles/LoginScreenStyle"; // Ensure the path is correct
import registerStyles from "../styles/RegisterScreenStyle"; // Ensure the path is correct
import LoginRegisterHyperlink from "../components/LoginRegisterHyperlink"; // Ensure the path is correct
import LoginRegisterInputComponent from "../components/loginRegisterInputComponent";
import LoginRegisterHeadingComponent from "../components/LoginRegisterHeadingComponent"; // Import the heading component
import { useAuth, useClerk, useSignIn } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack"; // Ensure the path is correct
import ConfirmationInputComponent from "../components/ConfirmationInputComponent";
import { SignInFirstFactor, EmailCodeFactor } from "@clerk/types";

/**
 * LoginScreen component handles the user login process.
 *
 * This component allows users to log in using their email address. It supports
 * email-based authentication and handles the verification process using a
 * one-time password (OTP) sent to the user's email.
 *
 * @component
 * @returns {React.FC} A functional component representing the login screen.
 *
 * @example
 * // Usage example:
 * <LoginScreen />
 *
 * @remarks
 * - If the user is already signed in, they are redirected to the 'LandingScreen'.
 * - The component manages the state for email address, verification code, and
 *   pending verification status.
 * - It uses the `useSignIn` hook to handle the sign-in process and the `useAuth`
 *   hook to check the authentication status.
 *
 * @function handlePress
 * Initiates the sign-in process by creating a sign-in attempt with the provided
 * email address. If an email code factor is supported, it prepares the first
 * factor for email code verification.
 *
 * @function onPressVerify
 * Attempts to verify the email code entered by the user. If the verification is
 * successful, it sets the active session and navigates to the 'LandingScreen'.
 *
 * @function handleEmailChange
 * Updates the email address state when the user changes the input.
 *
 * @hook useState
 * Manages the state for email address, verification code, and pending verification status.
 *
 * @hook useSignIn
 * Provides methods for handling the sign-in process.
 *
 * @hook useAuth
 * Provides the authentication status of the user.
 *
 * @hook useNavigation
 * Provides navigation methods for navigating between screens.
 */
const LoginScreen: React.FC = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const { isLoaded, signIn, setActive } = useSignIn();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { isSignedIn } = useAuth();

  // useEffect(() => {
  //   if (isSignedIn) {
  //     navigation.navigate('BottomNavigationBar');
  //   }
  // }, [isSignedIn, navigation]);

  const handlePress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const { supportedFirstFactors } = await signIn?.create({
        identifier: emailAddress,
      });

      const isEmailCodeFactor = (
        factor: SignInFirstFactor
      ): factor is EmailCodeFactor => {
        return factor.strategy === "email_code";
      };
      const emailCodeFactor = supportedFirstFactors?.find(isEmailCodeFactor);

      if (emailCodeFactor) {
        const { emailAddressId } = emailCodeFactor;

        await signIn?.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId,
        });
      }

      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn?.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleEmailChange = (emailAddress: string) => {
    setEmailAddress(emailAddress);
  };

  /**
   * The LoginScreen component renders the login screen for the application.
   */
  return (
    <SafeAreaView
      style={[
        pendingVerification ? registerStyles.container : styles.container,
        { backgroundColor: styles.container.backgroundColor },
      ]}
    >
      <View
        style={
          pendingVerification
            ? registerStyles.headingContainer
            : styles.headingContainer
        }
      >
        <LoginRegisterHeadingComponent
          text={
            pendingVerification
              ? "Your OTP Awaits! Enter It Below!"
              : "Keep Making Change"
          }
          color="#ffffff"
          fontSize={65}
        />
      </View>
      {!pendingVerification && (
        <>
          <View style={styles.inputContainer}>
            <LoginRegisterInputComponent
              label="Login with your Student Email:"
              FGColor="#ffffff"
              onEmailChange={handleEmailChange}
            />
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              onPress={handlePress}
              title="Login"
              textColor="#A4DB51"
              buttonColor="#ffffff"
              fontFamily="Rany-Medium"
              textSize={30}
            />
          </View>
        </>
      )}
      {pendingVerification && (
        <>
          <View style={registerStyles.inputContainer}>
            <ConfirmationInputComponent
              style={registerStyles.inputContainer}
              label="Enter 6-digit code"
              FGColor="#ffffff"
              onEmailChange={setCode}
              value={code}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
          <View style={registerStyles.buttonContainer}>
            <CustomButton
              title="Verify Email"
              onPress={onPressVerify}
              textColor="#A4DB51"
            />
          </View>
        </>
      )}
      <View style={styles.hyperlinkContainer}>
        <LoginRegisterHyperlink toLogin={false}>
          Don't have an account? Register
        </LoginRegisterHyperlink>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
