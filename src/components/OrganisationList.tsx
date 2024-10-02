import React from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import OrganisationListItem from "./OrganisationListItem";

interface Organisation {
  orgName: string;
}

interface OrganisationListProps {
  organisations: Organisation[];
}

const OrganisationList: React.FC<OrganisationListProps> = ({ organisations }) => {
  const oddOrEvenArray = organisations.map((_, index) => (index % 2 === 0 ? "even" : "odd"));

  const renderItem = ({ item, index }: { item: Organisation; index: number }) => (
    <OrganisationListItem
      orgName={item.orgName}
      oddOrEven={oddOrEvenArray[index]}
      onPress={() => {
        console.log("Pressed:", item.orgName);
      }}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Organisations List</Text>
      <FlatList data={organisations} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    padding: 15,
    fontWeight: "bold",
    color: "#161616", // White text
    marginBottom: 10,
  },
});

export default OrganisationList;
