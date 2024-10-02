import { View, FlatList, StyleSheet } from "react-native";
import { Organisation } from "../models/Organisation";
import ExpandableOrgListItem from "./ExpandableOrgListItem";

interface Props {
  items: Organisation[];
}

export default function ExpandableOrgList({ items }: Props) {
  return (
    <View>
      <FlatList
        style={styles.listContainer}
        data={items}
        renderItem={({ item }) => (
          <ExpandableOrgListItem orgName={item.orgName} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Add styles here
  listContainer: {
    marginTop: 100,
  },
});
