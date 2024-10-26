import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  FlatList,
  Pressable
} from 'react-native';
import { useTheme } from '../styles/ThemeContext';
import { lightTheme, darkTheme } from '../styles/themes';

// Simple chevron down icon component using just View elements
const ChevronDownIcon = ({ color, size = 15 }: { color: string, size?: number }) => (
  <View style={{ 
    width: size, 
    height: size, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
    <View style={{
      width: size * 0.7,
      height: size * 0.7,
      borderRightWidth: 2,
      borderBottomWidth: 2,
      borderColor: color,
      transform: [{ rotate: '45deg' }]
    }} />
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
}

function ComboBoxComponent({ 
  FGColor, 
  placeHolderColor, 
  placeholder = "Select an option",
  options,
  value,
  onValueChange
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
        style={[styles.comboBoxContainer, { borderColor: "transparent" }, {backgroundColor: theme.componentBackground}]}
        onPress={() => setIsOpen(true)}
      >
        <Text 
          style={[
            styles.selectedText, 
            { 
              color: selectedOption ? FGColor : placeHolderColor,
              fontFamily: 'Rany-Medium'
            }
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
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.componentBackground }]}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item.value === value && { backgroundColor: theme.orgListOdd }
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      { 
                        color: FGColor,
                        fontFamily: 'Rany-Medium'
                      },
                      item.value === value && { color: theme.componentTextColour }
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
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    height: 46, // To match search bar height (40 + vertical padding)
  },
  selectedText: {
    fontSize: 16,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    width: '80%',
    maxHeight: '70%',
    padding: 8,
  },
  optionItem: {
    padding: 16,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    fontWeight: '600',
  },
});

export default ComboBoxComponent;