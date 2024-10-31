import React, { useState, useRef } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import SearchIcon from "../assets/icons/searchIcon";
import { useTheme } from '../styles/ThemeContext';
import { lightTheme, darkTheme } from '../styles/themes';

interface Props {
    FGColor: string;
    onSearchInputChange: (searchInput: string) => void;
    placeHolderColor: string;
    onFocus?: () => void;   // Optional onFocus handler
    onBlur?: (searchInput: string) => void;  // Updated onBlur to receive searchInput
}

function SearchBarComponent({ FGColor, onSearchInputChange, placeHolderColor, onFocus, onBlur }: Props) {
    const [searchInput, setSearchInput] = useState('');
    const [isFocused, setIsFocused] = useState(false); // Track focus state
    const [placeholderText, setPlaceholderText] = useState("Search");
    const { isDarkMode } = useTheme();
    const theme = isDarkMode ? darkTheme : lightTheme;

    // Handle input change and update state
    const handleSearchChange = (text: string) => {
        setSearchInput(text);
        onSearchInputChange(text); // Call the parent component's search function
    };

    // Handle onFocus event
    const handleFocus = () => {
        setIsFocused(true);
        setPlaceholderText("Search");
        setSearchInput(placeholderText !== "Search" ? placeholderText : "");
        if (onFocus) onFocus();
    };

    // Handle onBlur event
    const handleBlur = () => {
        setIsFocused(false);
        if (searchInput.trim() !== '') {
            setPlaceholderText(searchInput); // Set placeholder to the search term
            setSearchInput(''); // Clear the input field
        } else {
            setPlaceholderText("Search"); // Keep the placeholder as "Search" if input is empty
        }
        if (onBlur) onBlur(searchInput); // Pass the current searchInput to onBlur
    };

    return (
        <View>
            <View style={[styles.searchBarContainer, { borderColor: isFocused ? "transparent" : "transparent", backgroundColor: theme.componentBackground }]}>
                <SearchIcon size={15} color={theme.componentTextColour} />
                <TextInput
                    style={[styles.input, { color: theme.componentTextColour }]} // Use FGColor for input text color
                    placeholder= {placeholderText} // Updated placeholder text
                    value={searchInput}
                    onChangeText={handleSearchChange}
                    onFocus={handleFocus}  // Use custom focus handler
                    onBlur={handleBlur}    // Use custom blur handler
                    placeholderTextColor={theme.componentTextColour}
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
