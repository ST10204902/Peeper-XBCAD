import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { OrgAddress } from "../models/OrgAddress";

interface Props {
  orgName: string;
  orgAddress: OrgAddress;
  oddOrEven: "odd" | "even";
}

export default function ExpandableOrgListItem({
  orgName,
  orgAddress,
  oddOrEven,
}: Props) {
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
        <Text style={styles.distance}> xkm away </Text>
      </View>
      <Text
        style={expandedStyles.addressRow}
      >{`${orgAddress.streetAddress}, ${orgAddress.suburb}, ${orgAddress.city}, ${orgAddress.province}, ${orgAddress.postalCode}`}</Text>
    </View>
  );
}

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
    marginStart: 35,
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

const expandedStyles = StyleSheet.create({
  itemContainerOdd: {
    paddingVertical: 5,
    paddingStart: 35,
    backgroundColor: "#E7E7E7",
  },
  itemContainerEven: {
    paddingVertical: 5,
    paddingStart: 35,
    backgroundColor: "#00000000",
  },
  firstRow: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
  },
  orgName: {
    color: "#161616",
    fontWeight: "600",
    fontSize: 23,
    flexShrink: 1,
    flexWrap: "wrap",
    textAlign: "left",
  },
  addressRow: {
    marginVertical: 10,
    marginHorizontal: 20,
    fontSize: 15,
  },
});
