import * as React from "react";
import { SafeAreaView, Alert } from "react-native";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { RootStackParamsList } from "./RootStackParamsList";
import { StackScreenProps } from "@react-navigation/stack";
import { useSignUp } from "@clerk/clerk-expo";
import { StyleSheet } from "react-native";

type Props = StackScreenProps<RootStackParamsList>;

export default function ConfirmationScreen({ navigation }: Props) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = React.useState("");

  const onButtonPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });

      

      
    } catch (error: any) {
      console.log("Error: " + error?.status || "");
      console.log(
        "Error: " + error?.errors ? JSON.stringify(error.errors) : error
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder="Enter 6-digit code"
        keyboardType="numeric"
        maxLength={6}
      />
      <TouchableOpacity style={styles.button} onPress={onButtonPress}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

//Temp styles TODO: change this
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    width: "80%",
    textAlign: "center",
    fontSize: 18,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

