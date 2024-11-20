// src/components/LoginRegisterHyperlink.tsx
import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamsList } from "../screens/RootStackParamsList";
import { Colors } from "../styles/colors";

interface LoginRegisterHyperlinkProps {
  toLogin: boolean;
  children: React.ReactNode;
}

/**
 * A functional component that renders a hyperlink which navigates to either the Login or Register screen
 * based on the `toLogin` prop.
 *
 * @param {Object} props - The props object.
 * @param {boolean} props.toLogin - Determines whether the hyperlink navigates to the Login screen (if true)
 *                                  or the Register screen (if false).
 * @param {React.ReactNode} props.children - The content to be displayed inside the hyperlink.
 *
 * @returns {JSX.Element} The rendered hyperlink component.
 */
const LoginRegisterHyperlink: React.FC<LoginRegisterHyperlinkProps> = ({ toLogin, children }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();

  const handlePress = () => {
    if (toLogin) {
      navigation.navigate("LoginScreen");
    } else {
      navigation.navigate("RegisterScreen");
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.hyperlinkText}>{children}</Text>
    </TouchableOpacity>
  );
};

/**
 * Styles for hyperlink text.
 */
const styles = StyleSheet.create({
  hyperlinkText: {
    fontSize: 20,
    textAlign: "center",
    color: Colors.hyperlinkText,
    backgroundColor: Colors.transparent,
    textDecorationLine: "underline",
    marginTop: 20,
    fontFamily: "Rany-Medium",
  },
});

export default LoginRegisterHyperlink;
