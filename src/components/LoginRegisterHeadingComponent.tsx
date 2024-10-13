import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface LoginRegisterHeadingProps {
  text: string;
  color?: string; // Optional prop for font color
  fontSize?: number; // Optional prop for font size
 
}

/**
 * A functional component that renders a heading text for login or register screens.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.text - The text to be displayed in the heading.
 * @param {string} [props.color='#333'] - The color of the heading text. Defaults to '#333'.
 * @param {number} [props.fontSize=75] - The font size of the heading text. Defaults to 75.
 * @returns {JSX.Element} The rendered heading text component.
 */
const LoginRegisterHeadingComponent: React.FC<LoginRegisterHeadingProps> = ({ text, color = '#333', fontSize = 75 }) => {
  return <Text style={[styles.heading, { color, fontSize }]}>{text}</Text>;
};

/**
 * Styles for the LoginRegisterHeadingComponent.
 */
const styles = StyleSheet.create({
  heading: {
    fontSize: 75, // Default font size
    fontFamily: 'Quittance',
    textAlign: 'left',
    marginTop: 20,
    color: '#ffffff',
  },
});

export default LoginRegisterHeadingComponent;