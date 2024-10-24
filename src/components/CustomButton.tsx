import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  GestureResponderEvent,
  View,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from "react-native";

/**
 * Props for the CustomButton component.
 *
 * @interface CustomButtonProps
 * @property {function} onPress - Function to handle the button press event.
 * @property {string} title - The title text to display on the button.
 * @property {string} [textColor] - Optional color for the button text.
 * @property {string} [buttonColor] - Optional color for the button background.
 * @property {string} [fontFamily] - Optional font family for the button text.
 * @property {number} [textSize] - Optional size for the button text.
 * @property {string} [label] - Optional label for accessibility purposes.
 * @property {boolean} [addFlex] - Optional flag to add flex styling to the button.
 * @property {boolean} [disabled] - Optional flag to disable the button.
 * @property {number} [verticalPadding] - Optional vertical padding for the button.
 * @property {number} [cornerRadius] - Optional corner radius for the button.
 * @property {number} [lineHeight] - Optional line height for the button text.
 */
interface CustomButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title: string;
  textColor?: string;
  buttonColor?: string;
  fontFamily?: string;
  textSize?: number;
  label?: string;
  addFlex?: boolean;
  disabled?: boolean;
  verticalPadding?: number;
  cornerRadius?: number;
  lineHeight?: number;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  title,
  textColor,
  buttonColor,
  fontFamily,
  textSize,
  label,
  addFlex = false,
  disabled = false,
  verticalPadding = 15, // Default vertical padding
  cornerRadius, // Optional corner radius
  lineHeight, // Optional line height
}) => {
  const [buttonHeight, setButtonHeight] = useState<number>(0);

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setButtonHeight(height);
  };

  const dynamicButtonStyle: ViewStyle = {
    backgroundColor: buttonColor || "#fff",
    borderRadius: cornerRadius !== undefined ? cornerRadius : buttonHeight / 3,
    paddingVertical: verticalPadding,
  };

  const dynamicTextStyle: TextStyle = {
    color: textColor || "#334FD7",
    fontFamily: fontFamily || "Rany-Medium",
    fontSize: textSize || 25,
    textAlign: 'center', // Center text horizontally
    textAlignVertical: 'center', // Center text vertically
    lineHeight: lineHeight, // Apply line height if provided
  };

  const labelTextStyle: TextStyle = {
    marginBottom: 5, // Add some spacing between the label and the button
    fontSize: textSize || 20, // Optional: Match label text size with button text size
    fontFamily: fontFamily || "Rany-Medium",
  };

  const containerStyle = addFlex
    ? localStyles.flexContainer
    : localStyles.container;

  return (
    <View style={containerStyle}>
      {label && <Text style={labelTextStyle}>{label}</Text>}
      <TouchableOpacity
        style={[localStyles.button, dynamicButtonStyle]}
        onLayout={handleLayout}
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
      >
        <Text style={[dynamicTextStyle]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Styles for the custom button.
 */
const localStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  flexContainer: {
    flexDirection: "row",
    flex: 1,
  },
  button: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomButton;