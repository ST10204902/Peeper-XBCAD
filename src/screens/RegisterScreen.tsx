import React, { useState } from "react";
import { SafeAreaView, Alert, View } from "react-native";
import CustomButton from "../components/CustomButton"; // Ensure the path is correct
import styles from "../styles/RegisterScreenStyle"; // Ensure the path is correct
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
        <LoginRegisterHeadingComponent text="Start Your Journey Of Impact " color="#ffffff" fontSize={68}/>
      </View>
      <View style={styles.inputContainer}>
        <LoginRegisterInputComponent
          label="Register with your Student Email:"
          FGColor="#ffffff"
          onEmailChange={handleEmailChange}
        />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={handlePress}
          title="Register"
          textColor="#334FD7"
          buttonColor="#ffffff"
          fontFamily="Rany-Medium"
          textSize={30}
        />
      </View>
      <View style={styles.hyperlinkContainer}>
        <LoginRegisterHyperlink toLogin={true}>
          Alredy have an account? Login
        </LoginRegisterHyperlink>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;