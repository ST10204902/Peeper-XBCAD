import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamsList } from "./RootStackParamsList";

const LoadingScreen: React.FC = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamsList>>();

  useEffect(() => {
    if (isLoaded) {
      // Add a small delay to prevent flash of loading screen
      setTimeout(() => {
        if (isSignedIn) {
          navigation.reset({
            index: 0,
            routes: [{ name: "BottomNavigationBar" }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "RegisterScreen" }],
          });
        }
      }, 1000);
    }
  }, [isLoaded, isSignedIn]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#334FD7" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});

export default LoadingScreen;
