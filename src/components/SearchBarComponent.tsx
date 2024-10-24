import React, { useState, useRef } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import SearchIcon from "../assets/icons/searchIcon";

interface Props {
    FGColor: string;
    onSearchInputChange: (searchInput: string) => void;
    placeHolderColor: string;
    onFocus?: () => void;   // Optional onFocus handler
    onBlur?: (searchInput: string) => void;  // Updated onBlur to receive searchInput
}

function SearchBarComponent({ FGColor, onSearchInputChange, placeHolderColor, onFocus, onBlur }: Props) {
    const [searchInput, setSearchInput] = useState('');
    const searchInputRef = useRef('');  // Ref to store the latest value of searchInput
    const [isFocused, setIsFocused] = useState(false); // Track focus state

    // Handle input change and update both state and ref
    const handleSearchChange = (text: string) => {
        setSearchInput(text);
        searchInputRef.current = text;  // Update the ref with the latest input
        onSearchInputChange(text);      // Call the parent component's search function
    };

    // Handle onFocus event and call passed onFocus handler if provided
    const handleFocus = () => {
        setIsFocused(true);
        setSearchInput(""); // Update the ref 
        if (onFocus) onFocus(); // Call the parent-provided onFocus handler
    };

    // Handle onBlur event and call passed onBlur handler with the ref value
    const handleBlur = () => {
        setIsFocused(false);
        if (onBlur) onBlur(searchInputRef.current); // Pass the current ref value to onBlur
    };

    return (
        <View>
            <View style={[styles.searchBarContainer, { borderColor: isFocused ? "#000" : "#EBEBEB" }]}>
                <SearchIcon size={15} color={placeHolderColor} />
                <TextInput
                    style={[styles.input, { color: FGColor }]} // Use FGColor for input text color
                    placeholder="Search" // Updated placeholder text
                    value={searchInput}
                    onChangeText={handleSearchChange}
                    onFocus={handleFocus}  // Use custom focus handler
                    onBlur={handleBlur}    // Use custom blur handler
                    placeholderTextColor={placeHolderColor}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    searchBarContainer: {
        backgroundColor: '#EBEBEB',
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
    }
});

export default SearchBarComponent;
