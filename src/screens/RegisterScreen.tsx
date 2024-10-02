// App.tsx
import * as React from "react";
import { SafeAreaView, Alert } from "react-native";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import CustomButton from "../components/LoginRegisterButtonComponent"; // Ensure the path is correct
import { useSignUp } from "@clerk/clerk-expo";
import { SharedTransitionType } from "react-native-reanimated";
import { RootStackParamsList } from "./RootStackParamsList";

export default function RegisterScreen() {
  const {isLoaded, signUp} = useSignUp();
  const [emailAddress, setEmailAddress] = React.useState("");

  const onSignUpPress = async () => {
    if(!isLoaded) {
      return;
    }

    try{
      await signUp.create({emailAddress: emailAddress});

      await signUp.prepareEmailAddressVerification({strategy: "email_code"});

      navigator.
    }

    


  }

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <CustomButton onPress={handlePress} title="Register" />
    </SafeAreaView>
  );
};