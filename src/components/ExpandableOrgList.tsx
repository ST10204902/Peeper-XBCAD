import { View, FlatList, StyleSheet } from "react-native";
import { Organisation } from "../models/Organisation";
import ExpandableOrgListItem from "./ExpandableOrgListItem";

interface Props {
  items: Organisation[];
}

export default function ExpandableOrgList({ items }: Props) {
  return (
    <View style={styles.listContainer}>
      <FlatList
        data={items}
        renderItem={({ index, item }) => (
          <ExpandableOrgListItem
            orgName={item.orgName}
            orgAddress={item.orgAddress}
            oddOrEven={index % 2 === 0 ? "even" : "odd"}
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
