import React, { useState } from "react";
import { SafeAreaView, View } from "react-native";
import CustomButton from "../components/CustomButton"; // Ensure the path is correct
import styles from "../styles/LoginScreenStyle"; // Ensure the path is correct
import registerStyles from "../styles/RegisterScreenStyle"; // Ensure the path is correct
import LoginRegisterHyperlink from "../components/LoginRegisterHyperlink"; // Ensure the path is correct
import LoginRegisterInputComponent from "../components/loginRegisterInputComponent";
import LoginRegisterHeadingComponent from "../components/LoginRegisterHeadingComponent"; // Import the heading component
import { useAuth, useSignUp } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack"; // Ensure the path is correct
import ConfirmationInputComponent from '../components/ConfirmationInputComponent';

const LoginScreen: React.FC = () => {
  const [emailAddress, setEmailAddress] = React.useState('');
  const { isLoaded, signUp, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    navigation.navigate('LandingScreen');
  }

  const handlePress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

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
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        navigation.navigate('BottomNavigationBar');
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleEmailChange = (emailAddress: string) => {
    setEmailAddress(emailAddress);
  };

  return (
    <SafeAreaView style={[
      pendingVerification ? registerStyles.container : styles.container,
      { backgroundColor: styles.container.backgroundColor }
    ]}>
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
            <CustomButton title="Verify Email" onPress={onPressVerify} textColor="#A4DB51" />
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