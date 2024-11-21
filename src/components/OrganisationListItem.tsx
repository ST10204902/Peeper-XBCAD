// OrganisationListItem.tsx
import React from "react";
import { Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useTheme } from "../styles/ThemeContext";
import { lightTheme, darkTheme } from "../styles/themes";

// Props for the OrganisationListItem component
interface OrganisationListItemProps {
  orgName: string;
  oddOrEven: "odd" | "even"; // This will determine the background color
  onPress: () => void; // This will handle the press event when the item is clicked
}

// Get the screen width
const screenWidth = Dimensions.get("window").width;

/**
 * @component OrganisationListItem
 * @description A functional component that displays an organization name in a styled list item.
 * The background color alternates based on the item's position (odd or even) and adapts to the theme (dark/light mode).
 *
 * @param {Object} props
 * @param {string} props.orgName - The name of the organization to display
 * @param {'odd'|'even'} props.oddOrEven - Determines the background color based on the item's position
 * @param {Function} props.onPress - Callback function to handle the press event when the item is clicked
 *
 * @constant {number} screenWidth - The width of the device screen
 *
 * @returns {JSX.Element} A styled TouchableOpacity component displaying the organization name
 *
 * @example
 * <OrganisationListItem
 *   orgName="Example Organization"
 *   oddOrEven="odd"
 *   onPress={() => console.log('Item pressed')}
 * />
 */
const OrganisationListItem: React.FC<OrganisationListItemProps> = ({
  orgName,
  oddOrEven,
  onPress,
}) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const containerStyle = oddOrEven === "odd" ? styles.itemContainerOdd : styles.itemContainerEven;

  // Render the organisation list item
  return (
    <TouchableOpacity
      style={[
        containerStyle,
        {
          backgroundColor:
            oddOrEven === "odd"
              ? theme.landingListBackgroundOverall
              : theme.landingListItemBackground,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.itemText, { color: theme.landingListFont }]}>{orgName}</Text>
    </TouchableOpacity>
  );
};

// Styles for the OrganisationListItem component
const styles = StyleSheet.create({
  itemContainerOdd: {
    padding: 15,
    width: screenWidth,
  },
  itemContainerEven: {
    padding: 15,
    width: screenWidth,
  },
  itemText: {
    fontSize: 18,
  },
});

export default OrganisationListItem;
//------------------------***EOF***-----------------------------//
