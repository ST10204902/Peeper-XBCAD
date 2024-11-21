import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { OrgAddressData } from "../databaseModels/OrgAddressData";
import { useTheme } from "../styles/ThemeContext";
import { lightTheme, darkTheme } from "../styles/themes";
import { Linking } from "react-native";
import { Organisation } from "../databaseModels/databaseClasses/Organisation";
import locationIcon from "../assets/icons/location.png";

/**
 * @orgName name of the organisation
 * @orgAddress address of the organisation
 * @oddOrEven used to make the alternating grey white pattern for the items
 * @listButton button to be rendered inside of the item when expanded
 */
interface Props {
  orgData: Organisation;
  orgAddress: OrgAddressData;
  oddOrEven: "odd" | "even";
  listButton: React.ReactNode;
  index: number;
  totalItems: number;
  testID?: string;
}

/**
 * Creates an ExpandableOrgListItem component
 * @param orgName name of the organisation
 * @param orgAddress address of the organisation
 * @param oddOrEven used to make the alternating grey white pattern for the items
 * @param listButton button to be rendered inside of the item when expanded
 * @returns An ExpandableOrgListItem component
 */
export default function ExpandableOrgListItem({
  orgData,
  orgAddress,
  oddOrEven,
  listButton,
  index,
  totalItems,
}: Props) {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Determine the corner radius based on the item position
  const borderRadiusStyle = {
    borderTopLeftRadius: index === 0 ? 30 : 0, // First item
    borderTopRightRadius: index === 0 ? 30 : 0, // First item
    borderBottomLeftRadius: index === totalItems - 1 ? 30 : 0, // Last item
    borderBottomRightRadius: index === totalItems - 1 ? 30 : 0, // Last item
  };

  // Combine the corner radius with odd/even styles
  const containerStyle = [
    oddOrEven === "odd" ? styles.itemContainerOdd : styles.itemContainerEven,
    { backgroundColor: oddOrEven === "odd" ? theme.orgListOdd : theme.orgListeven },
    borderRadiusStyle, // Apply the dynamic corner radius
  ];
  const expandedContainerStyle = [
    oddOrEven === "odd" ? expandedStyles.itemContainerOdd : expandedStyles.itemContainerEven,
    { backgroundColor: oddOrEven === "odd" ? theme.orgListOdd : theme.orgListeven },
    borderRadiusStyle,
  ];

  // Hook for setting the expanded state of the item
  const [expanded, setExpanded] = useState(false);

  const openMaps = () => {
    const { orgLatitude, orgLongitude } = orgData;
    const url = `https://www.google.com/maps/search/?api=1&query=${orgLatitude},${orgLongitude}`;
    Linking.openURL(url).catch(err => console.error("An error occurred", err));
  };

  return !expanded ? (
    <View style={containerStyle} onTouchEnd={() => setExpanded(true)}>
      <Text style={[styles.orgName, { color: theme.fontRegular }]}>{orgData.orgName}</Text>
      {orgData.distance !== null && orgData.distance !== undefined && orgData.distance !== "" && (
        <Text style={[styles.distance, { color: theme.componentTextColour }]}>
          {orgData.distance}km
        </Text>
      )}
    </View>
  ) : (
    <View style={expandedContainerStyle} onTouchEnd={() => setExpanded(false)}>
      <View style={expandedStyles.firstRow}>
        <Text style={[expandedStyles.orgName, { color: theme.fontRegular }]}>
          {orgData.orgName}
        </Text>
        {orgData.distance !== null && orgData.distance !== undefined && orgData.distance !== "" && (
          <Text style={[styles.distance, { color: theme.componentTextColour }]}>
            {orgData.distance}km
          </Text>
        )}
      </View>

      <Text style={[expandedStyles.addressRow, { color: theme.componentTextColour }]}>
        {`${orgAddress.streetAddress}, ${orgAddress.suburb}, ${orgAddress.city}, ${orgAddress.province}, ${orgAddress.postalCode}`}
      </Text>

      <View style={expandedStyles.buttonContainer}>
        {listButton}
        <TouchableOpacity onPress={openMaps}>
          <Image style={expandedStyles.location_icon} source={locationIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/**
 * Styles for the unexpanded list item
 */
const styles = StyleSheet.create({
  itemContainerOdd: {
    paddingBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  itemContainerEven: {
    paddingBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  orgName: {
    paddingVertical: 15,
    marginStart: 30,
    fontWeight: "600",
    fontSize: 18,
    flexShrink: 1,
    flexWrap: "wrap",
    textAlign: "left",
  },
  distance: {
    fontWeight: "regular",
    marginEnd: 11,
    fontSize: 17,
    alignSelf: "center",
  },
});

/**
 * Styles for the expanded list item
 */
const expandedStyles = StyleSheet.create({
  itemContainerOdd: {
    paddingVertical: 5,
  },
  itemContainerEven: {
    paddingVertical: 5,
  },
  firstRow: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
  },
  orgName: {
    paddingStart: 30,
    fontWeight: "600",
    fontSize: 18,
    flexShrink: 1,
    flexWrap: "wrap",
    textAlign: "left",
  },
  addressRow: {
    marginVertical: 10,
    marginHorizontal: 40,
    fontSize: 15,
    alignSelf: "center",
  },
  distance: {
    fontWeight: "regular",
    marginEnd: 11,
    fontSize: 17,
    alignSelf: "center",
  },
  buttonContainer: {
    height: 56,
    alignSelf: "center",
    width: "60%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    gap: 10,
  },
  location_icon: {
    height: 46,
    width: 56,
    resizeMode: "contain",
  },
});
