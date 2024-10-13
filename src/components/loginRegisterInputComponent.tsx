import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface Props {
    FGColor: string;
    onEmailChange: (email: string) => void;
    label: string; // Add label prop
    
}

/**
 * LoginRegisterInputComponent is a functional component that renders an input field for email.
 * It allows the user to input their email address and notifies the parent component of changes.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.FGColor - The foreground color used for the input text and placeholder.
 * @param {function} props.onEmailChange - Callback function to handle changes in the email input.
 * @param {string} props.label - The label text displayed above the input field.
 *
 * @example
 * <LoginRegisterInputComponent
 *   FGColor="#000000"
 *   onEmailChange={(email) => console.log(email)}
 *   label="Email Address"
 * />
 */
function LoginRegisterInputComponent({ FGColor, onEmailChange, label }: Props) {
    const [email, setEmail] = useState('');

    const handleEmailChange = (text: string) => {
        setEmail(text);
        onEmailChange(text); // Call the parent component's callback
    };

    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.container, { borderColor: FGColor }]}>
                <TextInput
                    style={[styles.input, { color: FGColor }]} // Use FGColor for input text color
                    placeholder="Student Email"
                    value={email}
                    onChangeText={handleEmailChange}
                    placeholderTextColor={FGColor} // Use FGColor for placeholder text color
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent', // Set background to transparent
        borderRadius: 20,
        padding: 5,
        borderWidth: 3,
    },
    label: {
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 10,
        backgroundColor: 'transparent', // Match the background color of the parent
        paddingHorizontal: 4,
        fontFamily: 'Rany-Medium',
        marginStart: 5,

    },
    input: {
        height: 40,
        paddingHorizontal: 10,
        fontSize: 16,
        fontFamily: 'Rany-Medium',

    }
});

export default LoginRegisterInputComponent;