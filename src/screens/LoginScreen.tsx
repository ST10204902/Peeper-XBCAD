import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";
import CustomButton from "../components/CustomButton";
import styles from "../styles/LoginScreenStyle";
import registerStyles from "../styles/RegisterScreenStyle";
import LoginRegisterHyperlink from "../components/LoginRegisterHyperlink";
import LoginRegisterInputComponent from "../components/loginRegisterInputComponent";
import LoginRegisterHeadingComponent from "../components/LoginRegisterHeadingComponent";
import { useSignIn } from "@clerk/clerk-expo";
import ConfirmationInputComponent from "../components/ConfirmationInputComponent";
import { SignInFirstFactor, EmailCodeFactor } from "@clerk/types";

interface ClerkError {
  errors?: Array<{ code?: string; message?: string }>;
  message?: string;
}

const LoginScreen: React.FC = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [emailError, setEmailError] = useState("");
  const { isLoaded, signIn, setActive } = useSignIn();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handlePress = async () => {
    if (!isLoaded) return;

    if (!validateEmail(emailAddress)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      const signInResult = await signIn?.create({
        identifier: emailAddress,
      });

      if (signInResult === null || signInResult === undefined) {
        throw new Error("Failed to create sign in attempt");
      }

      const { supportedFirstFactors } = signInResult;

      const isEmailCodeFactor = (factor: SignInFirstFactor): factor is EmailCodeFactor => {
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
      setEmailError("");
    } catch (err: unknown) {
      const error = err as ClerkError;
      if (error.errors && error.errors.length > 0) {
        const errorCode = error.errors[0]?.code;
        switch (errorCode) {
          case "form_identifier_not_found":
            Alert.alert("Email not found. Please register first.");
            break;
          case "invalid_otp":
            Alert.alert("Invalid or expired OTP. Please try again.");
            break;
          default:
            console.error("Unexpected error:", error);
            Alert.alert("An unexpected error occurred. Please try again later.");
        }
      } else if (error.message === "Network Error") {
        Alert.alert("Network error. Please check your connection and try again.");
      } else {
        console.error("Unexpected error:", error);
        Alert.alert("An unexpected error occurred. Please try again later.");
      }

      const errorMessage = error.errors?.[0]?.message;
      setEmailError(errorMessage ?? "Failed to login. Please try again.");
      console.error(JSON.stringify(error, null, 2));
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

      if (signInAttempt?.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
      }
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleEmailChange = (newEmail: string) => {
    setEmailAddress(newEmail);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        pendingVerification ? registerStyles.container : styles.container,
        { backgroundColor: styles.container.backgroundColor },
      ]}
    >
      <View style={pendingVerification ? registerStyles.headingContainer : styles.headingContainer}>
        <LoginRegisterHeadingComponent
          text={pendingVerification ? "Your OTP Awaits! Enter It Below!" : "Keep Making Change"}
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
              error={emailError}
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
              _style={registerStyles.inputContainer}
              label="Enter 6-digit code"
              FGColor="#ffffff"
              onEmailChange={setCode}
              value={code}
              _keyboardType="numeric"
              _maxLength={6}
            />
          </View>
          <View style={registerStyles.buttonContainer}>
            <CustomButton title="Verify Email" onPress={onPressVerify} textColor="#A4DB51" />
          </View>
        </>
      )}
      <View style={styles.hyperlinkContainer}>
        <LoginRegisterHyperlink toLogin={false}>
          Don&apos;t have an account? Register
        </LoginRegisterHyperlink>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
