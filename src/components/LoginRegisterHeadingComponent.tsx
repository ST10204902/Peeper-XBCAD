import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface LoginRegisterHeadingProps {
  text: string;
  color?: string; // Optional prop for font color
  fontSize?: number; // Optional prop for font size
}

const LoginRegisterHeadingComponent: React.FC<LoginRegisterHeadingProps> = ({ text, color = '#333', fontSize = 75 }) => {
  return <Text style={[styles.heading, { color, fontSize }]}>{text}</Text>;
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 75, // Default font size
    fontFamily: 'Quinttance',
    textAlign: 'left',
    marginTop: 20,
  },
});

export default LoginRegisterHeadingComponent;