import React from "react";
import { TextInput, View, Text, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "../styles/colors";

interface Props {
  label: string;
  FGColor: string;
  onEmailChange: (text: string) => void;
  value?: string;
  _keyboardType?: string;
  _maxLength?: number;
  _style?: ViewStyle;
}

/**
 * ConfirmationScreen component renders a confirmation input screen with a label and a text input field.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.label - The label text to display above the input field.
 * @param {string} props.FGColor - The foreground color for the text and placeholder.
 * @param {function} props.onEmailChange - The callback function to handle text input changes.
 * @param {string} props.value - The current value of the text input.
 * @param {string} [props._keyboardType='default'] - The type of keyboard to display.
 * @param {number} props._maxLength - The maximum length of the input text.
 * @param {Object} props._style - Additional styles for the component.
 *
 * @returns {JSX.Element} The rendered confirmation input screen component.
 */
const ConfirmationScreen: React.FC<Props> = ({
  label,
  FGColor,
  onEmailChange,
  value,
  _keyboardType = "default",
  _maxLength,
  _style,
}) => {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.container, { borderColor: FGColor }]}>
        <TextInput
          style={[styles.input, { color: FGColor }]} // Use FGColor for input text color
          placeholder="Input 6-digit code"
          value={value}
          onChangeText={onEmailChange}
          placeholderTextColor={FGColor} // Use FGColor for placeholder text color
          keyboardType="numeric"
          maxLength={6}
        />
      </View>
    </View>
  );
};

/**
 * Styles for the confirmation input.
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.transparent,
    borderRadius: 20,
    padding: 5,
    borderWidth: 3,
  },
  label: {
    fontSize: 16,
    color: Colors.inputText,
    marginBottom: 10,
    backgroundColor: Colors.transparent,
    paddingHorizontal: 4,
    fontFamily: "Rany-Medium",
    marginStart: 5,
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: "Rany-Medium",
  },
});

export default ConfirmationScreen;
