import React from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import CustomButton from "./CustomButton"; // Assuming your CustomButton is in the same folder

interface TrackingPopupProps {
  visible: boolean; // Controls visibility of the popup
  onStartTracking: () => void; // Callback for the "Start Tracking" button
  onCancel: () => void; // Callback for the "Cancel" button
}

const TrackingPopup: React.FC<TrackingPopupProps> = ({ visible, onStartTracking, onCancel }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.popup}>
          <Text style={styles.title}>START TRACKING?</Text>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Start Tracking"
              onPress={onStartTracking}
              textColor="#161616"
              buttonColor="#A4DB51" // Green color
              fontFamily="Rany-Medium"
              textSize={16}
              addFlex={true}
            />
            <CustomButton
              title="Cancel"
              onPress={onCancel}
              textColor="#161616"
              buttonColor="#EC4E4B" // Red color
              fontFamily="Rany-Medium"
              textSize={16}
              addFlex={true}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
  },
  popup: {
    width: "95%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#161616",
    marginBottom: 20,
    fontFamily: "Quittance", // Change font if needed
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 10,
    gap: 10,
  },
});

export default TrackingPopup;
