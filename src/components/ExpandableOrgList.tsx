import { View, FlatList, StyleSheet } from "react-native";
import { OrganisationData } from "../databaseModels/OrganisationData";
import ExpandableOrgListItem from "./ExpandableOrgListItem";
import React from "react";
import * as Location from "expo-location";

/**
 * Defines the properties to be passed to the expandable Orgs List
 * @items List of organisations
 * @listButtonComp Component for the button contained in the expanded
 * version of the list item
 * @onListButtonClicked Function run when the listButtonComp is clicked
 */
interface Props {
  items: OrganisationData[];
  listButtonComp: React.ReactNode;
  onListButtonClicked: (selectedOrg: OrganisationData) => void;
  userLocation?: Location.LocationObject;
  style?: object;
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
  userLocation,
  onListButtonClicked,
}: Props) {

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={items}
        renderItem={({ index, item }) => (
          <ExpandableOrgListItem
            userLocation={userLocation}
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
    backgroundColor: "#F3F3F3",
    borderRadius: 30,
  },
});
// End of File
