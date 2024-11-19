import React, { useState } from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import { Colors } from "../styles/colors";

interface Props {
  FGColor: string;
  onSearchInputChange: (searchInput: string) => void;
  placeHolderColor: string;
  placeholderText: string;
  labelText: string;
}

function SearchBarComponent({
  FGColor,
  onSearchInputChange,
  placeHolderColor,
  placeholderText,
  labelText,
}: Props) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchChange = (text: string) => {
    setSearchInput(text);
    onSearchInputChange(text); // Call the parent component's callback
  };

  return (
    <View>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: FGColor }]}>{labelText}</Text>
      </View>
      <View style={styles.searchBarContainer}>
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
    fontFamily: "Rany-Bold",
    color: Colors.inputLabel,
    paddingLeft: 15,
  },
  searchBarContainer: {
    backgroundColor: Colors.inputBorder,
    borderRadius: 15,
    padding: 0,
    paddingLeft: 15,
    borderWidth: 3,
    borderColor: Colors.inputBorder,
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
    color: Colors.inputText,
  },
});

export default SearchBarComponent;
