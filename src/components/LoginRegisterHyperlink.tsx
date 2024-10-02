// src/components/LoginRegisterHyperlink.tsx
import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
      <Text style={styles.hyperlinkText}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  hyperlinkText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    textDecorationLine: 'underline',
    marginTop: 20,
    fontFamily: 'Rany-Medium',
  },
});

export default LoginRegisterHyperlink;