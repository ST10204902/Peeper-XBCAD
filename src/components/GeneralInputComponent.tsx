import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface Props {
    FGColor: string;
    onSearchInputChange: (searchInput: string) => void;
    placeHolderColor: string;
    placeholderText: string;
    labelText: string;
}

function SearchBarComponent({ FGColor, onSearchInputChange, placeHolderColor, placeholderText, labelText }: Props) {
    const [searchInput, setSearchInput] = useState('');

    const handleSearchChange = (text: string) => {
        setSearchInput(text);
        onSearchInputChange(text); // Call the parent component's callback
    };

    return (
        <View>
            <View style={styles.labelContainer}>
                <Text style={[styles.label, { color: FGColor }]}>{labelText}</Text>
            </View>
            <View style={[styles.searchBarContainer, { borderColor: "#EBEBEB" }]}>
                <TextInput
                    style={[styles.input, { color: FGColor }]} // Use FGColor for input text color
                    placeholder={placeholderText} // Use placeholderText prop
                    value={searchInput} // Correct state variable used here
                    onChangeText={handleSearchChange}
                    placeholderTextColor={placeHolderColor} // Use placeHolderColor for placeholder text color
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    labelContainer: {
        marginBottom: 5,
    },
    label: {
        fontSize: 20,
        fontFamily: 'Rany-Bold',
        color: '#4A4A4A', // Set text color to #5A5A5A
        paddingLeft: 15,
    },
    searchBarContainer: {
        backgroundColor: '#EBEBEB', // Set background to transparent
        borderRadius: 15,
        padding: 0,
        paddingLeft: 15,
        borderWidth: 3,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        height: 40,
        paddingHorizontal: 10,
        fontSize: 16,
        fontFamily: 'Rany-Medium',
        width: '100%',
        color: '#5A5A5A', // Set text color to #5A5A5A
    }
});

export default SearchBarComponent;