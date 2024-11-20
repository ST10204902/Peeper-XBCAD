import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  GestureResponderEvent,
  View,
  ViewStyle,
  TextStyle,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import { Colors } from "../styles/colors";

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
  verticalPadding = 15,
  cornerRadius,
  lineHeight,
}) => {
  const [buttonHeight, setButtonHeight] = useState<number>(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setButtonHeight(height);
  };

  const dynamicButtonStyle: ViewStyle = {
    backgroundColor:
      buttonColor !== null && buttonColor !== undefined && buttonColor !== ""
        ? buttonColor
        : Colors.pageBackground,
    borderRadius:
      cornerRadius !== null && cornerRadius !== undefined ? cornerRadius : buttonHeight / 3,
    paddingVertical: verticalPadding,
  };

  const dynamicTextStyle: TextStyle = {
    color:
      textColor !== null && textColor !== undefined && textColor !== ""
        ? textColor
        : Colors.registerPrimary,
    fontFamily:
      fontFamily !== null && fontFamily !== undefined && fontFamily !== ""
        ? fontFamily
        : "Rany-Medium",
    fontSize:
      textSize !== null && textSize !== undefined && !Number.isNaN(textSize) ? textSize : 25,
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: lineHeight,
  };

  const labelTextStyle: TextStyle = {
    marginBottom: 5,
    fontSize:
      textSize !== null && textSize !== undefined && !Number.isNaN(textSize) ? textSize : 20,
    fontFamily:
      fontFamily !== null && fontFamily !== undefined && fontFamily !== ""
        ? fontFamily
        : "Rany-Medium",
  };

  const containerStyle = addFlex ? localStyles.flexContainer : localStyles.container;

  return (
    <View style={containerStyle}>
      {label !== null && label !== undefined && label !== "" && (
        <Text style={labelTextStyle}>{label}</Text>
      )}
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
