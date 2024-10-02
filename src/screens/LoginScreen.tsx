// RegisterScreen.tsx
//----------Imports---------//
import React from "react";
import { SafeAreaView, Alert, View } from "react-native";
import CustomButton from "../components/LoginRegisterButtonComponent"; // Ensure the path is correct
import styles from "../styles/LoginScreenStyle"; // Ensure the path is correct
import LoginRegisterHyperlink from "../components/LoginRegisterHyperlink"; // Ensure the path is correct

//----------Code---------//
//Demonstrating where to implement pressing the button. 
const RegisterScreen: React.FC = () => {
  const handlePress = () => {
    Alert.alert("Button Pressed!", "You have pressed the button.");
  };

  //Returns the components for the screen 
  return (
    <SafeAreaView style={styles.container}>
      <CustomButton
        onPress={handlePress}
        title="Login"
        textColor="#A4DB51"
        buttonColor="#ffffff"
        fontFamily="Rany-Medium"
        textSize={30}
      />

      <LoginRegisterHyperlink toLogin={false}> {/* */} 
        Don't have an account? Register
      </LoginRegisterHyperlink>
    </SafeAreaView>
  );
};

export default RegisterScreen;
