import React, { useState } from "react";
import { SafeAreaView, Alert, View } from "react-native";
import CustomButton from "../components/CustomButton"; // Ensure the path is correct
import styles from "../styles/LoginScreenStyle"; // Ensure the path is correct
import LoginRegisterHyperlink from "../components/LoginRegisterHyperlink"; // Ensure the path is correct
import LoginRegisterInputComponent from "../components/loginRegisterInputComponent"; // Ensure the path is correct
import {useAuth} from "@clerk/clerk-expo";
import { useSignIn } from '@clerk/clerk-expo'
import { useNavigation } from '@react-navigation/native';
import {StackNavigationProp} from "@react-navigation/stack";
import { TextInput, Button } from 'react-native'
import { SignInFirstFactor, EmailCodeFactor } from '@clerk/types'

//----------Code---------//
//Demonstrating where to implement pressing the button.
const LoginScreen: React.FC = () => {
    const [emailAddress, setEmailAddress] = useState('')
    const { isLoaded, signIn, setActive } = useSignIn()
    const [pendingVerification, setPendingVerification] = useState(false)
    const [code, setCode] = useState('')
    const navigation = useNavigation<StackNavigationProp<any>>();

    const { isSignedIn } = useAuth();

    if (isSignedIn) {
        navigation.navigate('BottomNavigationBar')
    }

    const handlePress = async () => {
      if (!isLoaded) {
          return
      }

      try {
          const { supportedFirstFactors } = await signIn?.create({
              identifier: emailAddress,
          });

          const isEmailCodeFactor = (factor: SignInFirstFactor): factor is EmailCodeFactor => {
              return factor.strategy === 'email_code'
          }
          const emailCodeFactor = supportedFirstFactors?.find(isEmailCodeFactor)

          if(emailCodeFactor) {
              const { emailAddressId } = emailCodeFactor


              await signIn?.prepareFirstFactor({
                  strategy: 'email_code',
                  emailAddressId,
              })
          }

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
            const signInAttempt = await signIn?.attemptFirstFactor({
                strategy: 'email_code',
                code,
            })

            if (signInAttempt.status === 'complete') {
                await setActive ({ session: signInAttempt.createdSessionId })

                navigation.navigate('LandingScreen')
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
      <LoginRegisterHyperlink toLogin={false}>
        Don't have an account? Register
      </LoginRegisterHyperlink>
    </SafeAreaView>
  );
};

export default LoginScreen;