import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

interface Props {
    FGColor: string;
    onEmailChange: (email: string) => void;
}




/**
 * LoginRegisterInputComponent is a functional component that renders a text input field for a student's email.
 * It allows the parent component to receive updates when the email changes.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.FGColor - The foreground color to be used for the input text and placeholder.
 * @param {function} props.onEmailChange - Callback function to be called when the email text changes.
 *
 * @returns {JSX.Element} The rendered component.
 */
function LoginRegisterInputComponent({ FGColor, onEmailChange }: Props) {
    const [email, setEmail] = useState('');

    const handleEmailChange = (text: string) => {
        setEmail(text);
        onEmailChange(text); // Call the parent component's callback
    };

    return (
        <View style={[styles.container, { borderColor: FGColor }]}>
            <TextInput
                style={[styles.input, { color: FGColor }]} // Use FGColor for input text color
                placeholder="Student Email"
                value={email}
                onChangeText={handleEmailChange}
                placeholderTextColor={FGColor} // Use FGColor for placeholder text color
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent', // Set background to transparent
        borderRadius: 10,
        padding: 5,
        borderWidth: 3,
        width: 300, // Adjust width if needed
    },
    input: {
        height: 40,
        paddingHorizontal: 10,
        fontSize: 16,
    }
});

export default LoginRegisterInputComponent;