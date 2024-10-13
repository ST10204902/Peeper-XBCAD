import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const EmergencyContacts = () => {
  return (
    <LinearGradient colors={['#ea4b4b', '#fe7143']} style={styles.container}>
      <Text style={styles.header}>
      safety First 🚨
      </Text>
      
      <View style={styles.subContainer}>
        <Text style={styles.subHeader}>EMERGENCY CONTACTS</Text>
        <Text style={styles.description}>Know your emergency numbers!</Text>

        <View style={styles.contactRow}>
          <Text style={styles.contactText}>📱 Emergency: <Text style={styles.contactNumber}>112</Text></Text>
        </View>

        <View style={styles.contactRow}>
          <Text style={styles.contactText}>🚔 Police: <Text style={styles.contactNumber}>10111</Text></Text>
        </View>

        <View style={styles.contactRow}>
          <Text style={styles.contactText}>🚑 Ambulance: <Text style={styles.contactNumber}>10177</Text></Text>
        </View>
      </View>
    </LinearGradient>
  );
}; 

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF4500',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: '#00AFFF',
    borderWidth: 2,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    fontFamily: "Quittance"
  },
  icon: {
    width: 20,
    height: 20,
  },
  subContainer: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    color: '#000',
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  contactIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  contactText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  contactNumber: {
    fontSize: 18,
    color: '#FF0000',
  },
});

export default EmergencyContacts;
