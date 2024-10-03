import React, { useState } from "react";
import { SafeAreaView, Alert, View } from "react-native";
import CustomButton from "../components/CustomButton"; // Ensure the path is correct
import styles from "../styles/LoginScreenStyle"; // Ensure the path is correct
import LoginRegisterHyperlink from "../components/LoginRegisterHyperlink"; // Ensure the path is correct
import LoginRegisterInputComponent from "../components/loginRegisterInputComponent"; // Ensure the path is correct
import LoginRegisterHeadingComponent from "../components/LoginRegisterHeadingComponent"; // Ensure the path is correct

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");

  const handlePress = () => {
    Alert.alert("Button Pressed!", "You have pressed the button.");
  };

  const handleEmailChange = (email: string) => {
    setEmail(email);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headingContainer}>
        <LoginRegisterHeadingComponent text="Keep Making Change" color="#ffffff" fontSize={75} />
      </View>
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
      <View style={styles.hyperlinkContainer}>
        <LoginRegisterHyperlink toLogin={false}>
          Don't have an account? Register
        </LoginRegisterHyperlink>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;