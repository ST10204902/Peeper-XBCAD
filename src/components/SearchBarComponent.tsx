import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import SearchIcon from "../assets/icons/searchIcon";

interface Props {
    FGColor: string;
    onSearchInputChange: (searchInput: string) => void;
    placeHolderColor: string,
}

function SearchBarComponent({ FGColor, onSearchInputChange, placeHolderColor }: Props) {
    const [searchInput, setSearchInput] = useState('');

    const handleSearchChange = (text: string) => {
        setSearchInput(text);
        onSearchInputChange(text); // Call the parent component's callback
    };

    return (
        <View>
            <View style={[styles.searchBarContainer, { borderColor: "#EBEBEB" }]}>
                <SearchIcon size={15} color={placeHolderColor} />
                <TextInput
                    style={[styles.input, { color: FGColor }]} // Use FGColor for input text color
                    placeholder="Search" // Updated placeholder text
                    value={searchInput} // Correct state variable used here
                    onChangeText={handleSearchChange}
                    placeholderTextColor={placeHolderColor} // Use FGColor for placeholder text color
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    searchBarContainer: {
        backgroundColor: '#EBEBEB', // Set background to transparent
        borderRadius: 20,
        padding: 5,
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
    }
});

export default SearchBarComponent;
