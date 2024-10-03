import { View, FlatList, StyleSheet } from "react-native";
import { Organisation } from "../models/Organisation";
import ExpandableOrgListItem from "./ExpandableOrgListItem";
import React from "react";

/**
 * Defines the properties to be passed to the expandable Orgs List
 * @items List of organisations
 * @listButtonComp Component for the button contained in the expanded
 * version of the list item
 * @onListButtonClicked Function run when the listButtonComp is clicked
 */
interface Props {
  items: Organisation[];
  listButtonComp: React.ReactNode;
  onListButtonClicked: (selectedOrg: Organisation) => void;
}

/**
 * Function creating an ExpandableOrgList component
 * @param items List of organisations
 * @param listButtonComp Component for the button contained in the expanded
 * version of the list item
 * @param onListButtonClicked Function run when the listButtonComp is clicked
 * @returns The ExpandableOrgList component
 */
export default function ExpandableOrgList({
  items,
  listButtonComp,
  onListButtonClicked,
}: Props) {
  return (
    <View style={styles.listContainer}>
      <FlatList
        data={items}
        renderItem={({ index, item }) => (
          <ExpandableOrgListItem
            orgName={item.orgName}
            orgAddress={item.orgAddress}
            oddOrEven={index % 2 === 0 ? "even" : "odd"}
            listButton={React.cloneElement(
              listButtonComp as React.ReactElement,
              { onPress: () => onListButtonClicked(item) }
            )}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Add styles here
  listContainer: {
    marginTop: 100,
    backgroundColor: "#F3F3F3",
    borderRadius: 30,
  },
});
