import React, { ReactNode, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { OrgAddressData } from "../databaseModels/OrgAddressData";

/**
 * @orgName name of the organisation
 * @orgAddress address of the organisation
 * @oddOrEven used to make the alternating grey white pattern for the items
 * @listButton button to be rendered inside of the item when expanded
 */
interface Props {
  orgName: string;
  orgAddress: OrgAddressData;
  oddOrEven: "odd" | "even";
  listButton: ReactNode;
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
  orgName,
  orgAddress,
  oddOrEven,
  listButton,
}: Props) {
  // Odd even code
  const containerStyle =
    oddOrEven === "odd" ? styles.itemContainerOdd : styles.itemContainerEven;
  const expandedContainerStyle =
    oddOrEven === "odd"
      ? expandedStyles.itemContainerOdd
      : expandedStyles.itemContainerEven;

  // Hook for setting the expanded state of the item
  const [expanded, setExpanded] = useState(false);

  return !expanded ? (
    <View style={containerStyle} onTouchEnd={() => setExpanded(true)}>
      <Text style={styles.orgName}>{orgName}</Text>
      <Text style={styles.distance}> xkm away </Text>
    </View>
  ) : (
    <View style={expandedContainerStyle} onTouchEnd={() => setExpanded(false)}>
      <View style={expandedStyles.firstRow}>
        <Text style={expandedStyles.orgName}>{orgName}</Text>
        <Text style={expandedStyles.distance}> xkm away </Text>
      </View>

      <Text style={expandedStyles.addressRow}>
        {`${orgAddress.streetAddress}, ${orgAddress.suburb}, ${orgAddress.city}, ${orgAddress.province}, ${orgAddress.postalCode}`}
      </Text>

      <View style={expandedStyles.buttonContainer}>{listButton}</View>
    </View>
  );
}

/**
 * Styles for the unexpanded list item
 */
const styles = StyleSheet.create({
  itemContainerOdd: {
    paddingBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#E7E7E7",
    gap: 20,
  },
  itemContainerEven: {
    paddingBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#00000000",
    gap: 20,
  },
  orgName: {
    color: "#161616",
    paddingVertical: 20,
    marginStart: 30,
    fontWeight: "600",
    fontSize: 23,
    flexShrink: 1,
    flexWrap: "wrap",
    textAlign: "left",
  },
  distance: {
    color: "#696969",
    fontWeight: "regular",
    marginEnd: 11,
    fontSize: 17,
    alignSelf: "flex-end",
  },
});

/**
 * Styles for the expanded list item
 */
const expandedStyles = StyleSheet.create({
  itemContainerOdd: {
    paddingVertical: 5,
    backgroundColor: "#E7E7E7",
  },
  itemContainerEven: {
    paddingVertical: 5,

    backgroundColor: "#00000000",
  },
  firstRow: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
  },
  orgName: {
    paddingStart: 30,
    color: "#161616",
    fontWeight: "600",
    fontSize: 23,
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
    color: "#696969",
    fontWeight: "regular",
    marginEnd: 11,
    fontSize: 17,
    alignSelf: "flex-start",
  },
  buttonContainer: {
    paddingHorizontal: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
});
// End of File
