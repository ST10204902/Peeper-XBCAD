import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../styles/colors";

/**
 * EmergencyContacts component renders a screen with emergency contact information.
 * It displays a gradient background with a header and a list of emergency contact numbers.
 *
 * @returns {JSX.Element} The rendered EmergencyContacts component.
 */
const EmergencyContacts = () => {
  const handlePress = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <LinearGradient colors={["#ea4b4b", "#fe7143"]} style={styles.container}>
      <Text style={styles.header}>Safety First 🚨</Text>

      <View style={styles.subContainer}>
        <Text style={styles.subHeader}>EMERGENCY CONTACTS</Text>
        <Text style={styles.description}>Know your emergency numbers!</Text>

        <TouchableOpacity style={styles.contactRow} onPress={() => handlePress("112")}>
          <Text style={styles.contactText}>
            📱 Emergency: <Text style={styles.contactNumber}>112</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactRow} onPress={() => handlePress("10111")}>
          <Text style={styles.contactText}>
            🚔 Police: <Text style={styles.contactNumber}>10111</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactRow} onPress={() => handlePress("10177")}>
          <Text style={styles.contactText}>
            🚑 Ambulance: <Text style={styles.contactNumber}>10177</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.statusPending,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    borderColor: Colors.registerPrimary,
    borderWidth: 2,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.headerText,
    marginBottom: 10,
    fontFamily: "Quittance",
  },
  subContainer: {
    backgroundColor: Colors.pageBackground,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.statusDenied,
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    color: Colors.headerText,
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  contactText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.headerText,
  },
  contactNumber: {
    fontSize: 18,
    color: Colors.statusDenied,
  },
});

export default EmergencyContacts;
