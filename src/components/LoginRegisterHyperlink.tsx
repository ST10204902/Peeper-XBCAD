// src/components/LoginRegisterHyperlink.tsx
import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/LoginRegisterHyperlinkStyle'; // Ensure the path is correct
import { StackNavigationProp } from '@react-navigation/stack';

interface LoginRegisterHyperlinkProps {
  toLogin: boolean;
  children: React.ReactNode;
}

const LoginRegisterHyperlink: React.FC<LoginRegisterHyperlinkProps> = ({ toLogin, children }) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handlePress = () => {
    if (toLogin) {
      navigation.navigate('LoginScreen');
    } else {
      navigation.navigate('RegisterScreen');
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={[styles.hyperlinkText, styles.hyperlinkText]}>{children}</Text>
    </TouchableOpacity>
  );
};



export default LoginRegisterHyperlink;
