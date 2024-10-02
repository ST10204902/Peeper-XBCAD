import React, { useState } from "react";
import { SafeAreaView, Alert, View } from "react-native";
import CustomButton from "../components/CustomButton"; // Ensure the path is correct
import styles from "../styles/LoginScreenStyle"; // Ensure the path is correct
import LoginRegisterHyperlink from "../components/LoginRegisterHyperlink"; // Ensure the path is correct
import LoginRegisterInputComponent from "../components/loginRegisterInputComponent"; // Ensure the path is correct
import {useAuth} from "@clerk/clerk-expo";
import { useSignUp } from '@clerk/clerk-expo'
import { useNavigation } from '@react-navigation/native';
import {StackNavigationProp} from "@react-navigation/stack";
import { TextInput, Button } from 'react-native'

//----------Code---------//
//Demonstrating where to implement pressing the button.
const LoginScreen: React.FC = () => {
    const [emailAddress, setEmailAddress] = React.useState('')
    const { isLoaded, signUp, setActive } = useSignUp()
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')
    const navigation = useNavigation<StackNavigationProp<any>>();

    const { isSignedIn } = useAuth();

    if (isSignedIn) {
        navigation.navigate('LandingScreen')
    }

    const handlePress = async () => {
      if (!isLoaded) {
          return
      }

      try {
          await signUp.create({
              emailAddress,
          })

          await signUp.prepareEmailAddressVerification({strategy: 'email_code'})

          setPendingVerification(true)
      } catch (err: any) {
          // See https://clerk.com/docs/custom-flows/error-handling
          // for more info on error handling
          console.error(JSON.stringify(err, null, 2))
      }
  };

    const onPressVerify = async () => {
        if (!isLoaded) {
            return
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            })

            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId })
                navigation.navigate('LandingScreen')
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2))
            }
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

  const handleEmailChange = (emailAddress: string) => {
    setEmailAddress(emailAddress);
  };

  return (
    <SafeAreaView style={styles.container}>
        {!pendingVerification && (
            <>
              <LoginRegisterInputComponent
                label="Login with your Student Email:"
                FGColor="#ffffff"
                onEmailChange={handleEmailChange}
              />
              <CustomButton
                onPress={handlePress}
                title="Login"
                textColor="#A4DB51"
                buttonColor="#ffffff"
                fontFamily="Rany-Medium"
                textSize={30}
              />
            </>
        )}
        {pendingVerification && (
            <>
            <TextInput value={code} placeholder="Code..." onChangeText={(code) => setCode(code)} />
            <Button title="Verify Email" onPress={onPressVerify} />
            </>
        )}
      {/*<LoginRegisterHyperlink toLogin={false}>*/}
      {/*  Don't have an account? Register*/}
      {/*</LoginRegisterHyperlink>*/}
    </SafeAreaView>
  );
};

export default LoginScreen;