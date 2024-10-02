// RegisterScreen.tsx
//----------Imports---------//
import React, { useState } from "react";
import {SafeAreaView, Alert, View, TextInput, Button} from "react-native";
import CustomButton from "../components/LoginRegisterButtonComponent"; // Ensure the path is correct
import styles from "../styles/RegisterScreenStyle"; // Ensure the path is correct
import LoginRegisterHyperlink from "../components/LoginRegisterHyperlink"; // Ensure the path is correct
import LoginRegisterInputComponent from "../components/loginRegisterInputComponent";
import {useAuth, useSignUp} from "@clerk/clerk-expo";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack"; // Ensure the path is correct

//----------Code---------//
//Demonstrating where to implement pressing the button.
const RegisterScreen: React.FC = () => {
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

  //Returns the components for the screen
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
                <TextInput value={code} placeholder="Code..." onChangeText={(code) => setCode(code)} />
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