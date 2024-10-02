import React, { useState } from 'react';
import { TouchableOpacity, Text, GestureResponderEvent, View, ViewStyle, TextStyle, StyleSheet } from 'react-native';

interface CustomButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
  textColor?: string; // Add an optional prop for text color
  buttonColor?: string; // Add an optional prop for button color
  fontFamily?: string; // Add an optional prop for font family
  textSize?: number; // Add an optional prop for text size
  label?: string; // Add an optional prop for the label above the button
}

const CustomButton: React.FC<CustomButtonProps> = ({ onPress, title, textColor, buttonColor, fontFamily, textSize, label }) => {
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

  const labelTextStyle: TextStyle = {
    marginBottom: 5, // Add some spacing between the label and the button
    fontSize: textSize || 20, // Optional: Match label text size with button text size
    fontFamily: fontFamily || 'System', // Optional: Match label font family with button font family
  };

  return (
    <View style={localStyles.container}>
      {label && <Text style={labelTextStyle}>{label}</Text>}
      <TouchableOpacity style={[localStyles.button, dynamicButtonStyle]} onLayout={handleLayout} onPress={onPress}>
        <Text style={[localStyles.buttonText, dynamicTextStyle]}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10, // Adjust as needed for spacing
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
    alignSelf: 'center',
  },
  buttonText: {
    // Define text styles here
  },
  hyperlinkText: {
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'white',
  },
});

export default CustomButton;