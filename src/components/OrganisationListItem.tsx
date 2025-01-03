// OrganisationListItem.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";

// Props for the OrganisationListItem component
interface OrganisationListItemProps {
  orgName: string;
  oddOrEven: "odd" | "even"; // This will determine the background color
  onPress: () => void; // This will handle the press event when the item is clicked
}

// Get the screen width
const screenWidth = Dimensions.get("window").width;

// OrganisationListItem functional component
const OrganisationListItem: React.FC<OrganisationListItemProps> = ({
  orgName,
  oddOrEven,
  onPress,
}) => {
  const containerStyle = oddOrEven === "odd" ? styles.itemContainerOdd : styles.itemContainerEven;

  // Render the organisation list item
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <Text style={styles.itemText}>{orgName}</Text>
    </TouchableOpacity>
  );
};

// Styles for the OrganisationListItem component
const styles = StyleSheet.create({
  itemContainerOdd: {
    padding: 15,
    borderBottomColor: "#ccc",
    backgroundColor: "#f9f9f9",
    width: screenWidth,
  },
  itemContainerEven: {
    padding: 15,
    borderBottomColor: "#ccc",
    backgroundColor: "#f0f0f0",
    width: screenWidth,
  },
  itemText: {
    color: "#cecece",
    fontSize: 18,
  },
});

export default OrganisationListItem;
//------------------------***EOF***-----------------------------//