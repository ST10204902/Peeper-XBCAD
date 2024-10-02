// App.tsx
import React from "react";
import { SafeAreaView, Alert } from "react-native";
import CustomButton from "../components/LoginRegisterButtonComponent"; // Ensure the path is correct
import styles from "../styles/RegisterScreenStyle"; // Ensure the path is correct

const App: React.FC = () => {
  
  const handlePress = () => {
    Alert.alert("Button Pressed!", "You have pressed the button.");
    Alert.alert("Button Pressed!", "You have pressed the button.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomButton
        onPress={handlePress}
        title="YOUR MOM"
        textColor="#334FD7"
        buttonColor="#ffffff"
        fontFamily="Rany-Medium"
        textSize={30}
      />
    </SafeAreaView>
  );
};

export default App;