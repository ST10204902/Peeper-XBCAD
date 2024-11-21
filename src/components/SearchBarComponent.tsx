import React, { useState } from "react";
import { TextInput, StyleSheet, View } from "react-native";
import SearchIcon from "../assets/icons/searchIcon";
import { useTheme } from "../styles/ThemeContext";
import { lightTheme, darkTheme } from "../styles/themes";
import { Colors } from "../styles/colors";

interface Props {
  _FGColor: string;
  onSearchInputChange: (searchInput: string) => void;
  _placeHolderColor: string;
  onFocus?: () => void;
  onBlur?: (searchInput: string) => void;
}

/**
 * @component SearchBarComponent
 * @description A reusable search input component with customizable styling and labels.
 * Provides real-time search input handling with parent component callback.
 *
 * @param {Object} props
 * @param {string} props._FGColor - Foreground color for the input text and label
 * @param {Function} props.onSearchInputChange - Callback function for search input changes
 * @param {string} props._placeHolderColor - Color for the placeholder text
 * @param {Function} [props.onFocus] - Optional callback function when the input gains focus
 * @param {Function} [props.onBlur] - Optional callback function when the input loses focus
 *
 * @state {string} searchInput - Controlled input state for the search field
 * @state {boolean} _isFocused - State to track if the input is focused
 * @state {string} placeholderText - State for the placeholder text
 *
 * @returns {JSX.Element} A styled search input component with label
 *
 * @example
 * <SearchBarComponent
 *   _FGColor="#000000"
 *   onSearchInputChange={(text) => handleSearch(text)}
 *   _placeHolderColor="#999999"
 *   onFocus={() => console.log('Focused')}
 *   onBlur={(text) => console.log('Blurred with text:', text)}
 * />
 */
function SearchBarComponent({ onSearchInputChange, onFocus, onBlur }: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [_isFocused, setIsFocused] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("Search");
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleSearchChange = (text: string) => {
    setSearchInput(text);
    onSearchInputChange(text);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setPlaceholderText("Search");
    setSearchInput(placeholderText !== "Search" ? placeholderText : "");
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (searchInput.trim() !== "") {
      setPlaceholderText(searchInput);
      setSearchInput("");
    } else {
      setPlaceholderText("Search");
    }
    if (onBlur) onBlur(searchInput);
  };

  return (
    <View>
      <View
        style={[
          styles.searchBarContainer,
          {
            backgroundColor: theme.componentBackground,
          },
        ]}
      >
        <SearchIcon size={15} color={theme.componentTextColour} />
        <TextInput
          style={[styles.input, { color: theme.componentTextColour }]}
          placeholder={placeholderText}
          value={searchInput}
          onChangeText={handleSearchChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={theme.componentTextColour}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    backgroundColor: Colors.searchBarBackground,
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
    fontFamily: "Rany-Medium",
    width: "100%",
  },
});

export default SearchBarComponent;
