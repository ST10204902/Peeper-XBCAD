import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Pressable } from "react-native";
import { useTheme } from "../styles/ThemeContext";
import { lightTheme, darkTheme } from "../styles/themes";
import { Colors } from "../styles/colors";

/**
 * The ChevronDownIcon component displays a chevron down icon.
 * @param param0 - The color and size of the chevron down icon.
 * @returns The ChevronDownIcon component.
 */
const ChevronDownIcon = ({ color, size = 15 }: { color: string; size?: number }) => (
  <View style={styles.chevronContainer}>
    <View
      style={[
        styles.chevronIcon,
        {
          width: size * 0.7,
          height: size * 0.7,
          borderColor: color,
        },
      ]}
    />
  </View>
);

interface ComboBoxOption {
  label: string;
  value: string;
}

interface Props {
  FGColor: string;
  placeHolderColor: string;
  placeholder?: string;
  options: ComboBoxOption[];
  value?: string;
  onValueChange: (value: string) => void;
  testID?: string;
}

/**
 * @component ComboComponent
 * @description A customizable combo box/dropdown component for React Native that displays a selection in a modal
 *
 * @typedef {Object} Option
 * @property {string | number} value - The value of the option
 * @property {string} label - The display text for the option
 * @param {Object} props
 * @param {Option[]} props.options - Array of options to display in the dropdown
 * @param {Option} [props.selectedOption] - Currently selected option
 * @param {string} [props.placeholder] - Placeholder text to display when no option is selected
 * @param {string} [props.testID] - Test identifier for the component
 * @param {(option: Option) => void} props.onSelect - Callback function when an option is selected
 * @param {Object} [props.style] - Additional styles to apply to the container
 *
 * @example
 * <ComboComponent
 *   options={[{ value: 1, label: 'Option 1' }]}
 *   placeholder="Select an option"
 *   onSelect={(option) => console.log(option)}
 * />
 *
 * @returns {JSX.Element} A combo box component with modal selection
 */
function ComboBoxComponent({
  FGColor,
  placeHolderColor,
  placeholder = "Select an option",
  options,
  value,
  onValueChange,
  testID,
}: Props) {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [isOpen, setIsOpen] = useState(false);

  // Find the selected option's label
  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.comboBoxContainer, { backgroundColor: theme.componentBackground }]}
        onPress={() => setIsOpen(true)}
        testID={testID}
      >
        <Text
          style={[
            styles.selectedText,
            {
              color: selectedOption ? FGColor : placeHolderColor,
            },
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDownIcon color={theme.componentTextColour} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
          <View style={[styles.modalContent, { backgroundColor: theme.componentBackground }]}>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item.value === value && { backgroundColor: theme.orgListOdd },
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: FGColor,
                      },
                      item.value === value && { color: theme.componentTextColour },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  comboBoxContainer: {
    borderRadius: 15,
    padding: 0,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 3,
    borderColor: Colors.transparent,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 46,
  },
  selectedText: {
    fontSize: 16,
    flex: 1,
    fontFamily: "Rany-Medium",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.modalBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: 12,
    width: "80%",
    maxHeight: "70%",
    padding: 8,
  },
  optionItem: {
    padding: 16,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Rany-Medium",
  },
  chevronContainer: {
    width: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  chevronIcon: {
    borderRightWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: "45deg" }],
  },
});

export default ComboBoxComponent;
