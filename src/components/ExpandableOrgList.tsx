import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { OrganisationData } from "../databaseModels/OrganisationData";
import ExpandableOrgListItem from "./ExpandableOrgListItem";
import { useTheme } from "../styles/ThemeContext";
import { lightTheme, darkTheme } from "../styles/themes";
import { Organisation } from "../databaseModels/databaseClasses/Organisation";
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
  onListButtonClicked: (selectedOrg: OrganisationData) => void;
  userLocation?: { coords: { latitude: number; longitude: number } };
  style?: object;
  testID?: string;
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
  testID,
}: Props) {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={[styles.listContainer, { backgroundColor: theme.orgListOdd }]} testID={testID}>
      <FlatList
        data={items}
        renderItem={({ index, item }) => (
          <ExpandableOrgListItem
            orgData={item}
            orgAddress={item.orgAddress}
            oddOrEven={index % 2 === 0 ? "even" : "odd"}
            listButton={React.cloneElement(listButtonComp as React.ReactElement, {
              onPress: () => onListButtonClicked(item),
              testID: "list-button",
            })}
            index={index}
            totalItems={items.length}
            testID={`org-list-item-${index}`}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    borderRadius: 30,
  },
});
// End of File
