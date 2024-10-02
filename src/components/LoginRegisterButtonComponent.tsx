import React, { useState } from 'react';
import { TouchableOpacity, Text, GestureResponderEvent, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import styles from '../styles/LoginRegisterButton'; // Ensure the path is correct

interface CustomButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
  textColor?: string; // Add an optional prop for text color
  buttonColor?: string; // Add an optional prop for button color
  fontFamily?: string; // Add an optional prop for font family
  textSize?: number; // Add an optional prop for text size
}

const CustomButton: React.FC<CustomButtonProps> = ({ onPress, title, textColor, buttonColor, fontFamily, textSize }) => {
  const [buttonHeight, setButtonHeight] = useState<number>(0);

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setButtonHeight(height);
  };

  const dynamicButtonStyle: ViewStyle = {
    backgroundColor: buttonColor || '#fff',
    borderRadius: buttonHeight / 3,
  };

  const dynamicTextStyle: TextStyle = {
    color: textColor || '#334FD7',
    fontFamily: fontFamily || 'System',
    fontSize: textSize || 25,
  };

  return (
    <TouchableOpacity style={[styles.button, dynamicButtonStyle]} onLayout={handleLayout} onPress={onPress}>
      <Text style={[styles.buttonText, dynamicTextStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;