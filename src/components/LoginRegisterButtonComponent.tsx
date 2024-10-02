// src/components/LoginRegisterButtonComponent.tsx
import React from 'react';
import { TouchableOpacity, Text, GestureResponderEvent } from 'react-native';
import styles from '../styles/LoginRegisterButton'; // Adjust path if needed

interface CustomButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ onPress, title }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
