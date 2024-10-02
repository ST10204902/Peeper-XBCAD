// App.tsx
import React from "react";
import { SafeAreaView, Alert } from "react-native";
import CustomButton from "../components/LoginRegisterButtonComponent"; // Ensure the path is correct

const RegisterScreen: React.FC = () => {
  const handlePress = () => {
    Alert.alert("Button Pressed!", "You have pressed the button.");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <CustomButton onPress={handlePress} title="Register" />
    </SafeAreaView>
  );
};

export default RegisterScreen;
