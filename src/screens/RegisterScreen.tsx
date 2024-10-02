// RegisterScreen.tsx
//----------Imports---------//
import React, { useState } from "react";
import { SafeAreaView, Alert, View } from "react-native";
import CustomButton from "../components/LoginRegisterButtonComponent"; // Ensure the path is correct
import styles from "../styles/RegisterScreenStyle"; // Ensure the path is correct
import LoginRegisterHyperlink from "../components/LoginRegisterHyperlink"; // Ensure the path is correct
import LoginRegisterInputComponent from "../components/loginRegisterInputComponent"; // Ensure the path is correct

//----------Code---------//
//Demonstrating where to implement pressing the button.
const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState("");

  const handlePress = () => {
    Alert.alert("Button Pressed!", "You have pressed the button.");
  };

  const handleEmailChange = (email: string) => {
    setEmail(email);
  };

  //Returns the components for the screen
  return (
    <SafeAreaView style={styles.container}>
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
      <LoginRegisterHyperlink toLogin={true}>
        Already have an account? Log in
      </LoginRegisterHyperlink>
    </SafeAreaView>
  );
};

export default RegisterScreen;