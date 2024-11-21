import React from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import CustomButton from "./CustomButton";
import { darkTheme, lightTheme } from "../styles/themes";
import { useTheme } from "../styles/ThemeContext";
import { Colors } from "../styles/colors";

interface TrackingPopupProps {
  visible: boolean;
  onStartTracking: () => void;
  onCancel: () => void;
}

/**
 * @component TrackingPopup
 * @description A modal popup component that prompts the user to start tracking or cancel the action.
 * The styling adapts to the current theme (dark/light mode).
 *
 * @param {Object} props
 * @param {boolean} props.visible - Determines whether the modal is visible
 * @param {Function} props.onStartTracking - Callback function to handle the start tracking action
 * @param {Function} props.onCancel - Callback function to handle the cancel action
 *
 * @returns {JSX.Element} A modal popup with start tracking and cancel buttons
 *
 * @example
 * <TrackingPopup
 *   visible={true}
 *   onStartTracking={() => console.log('Tracking started')}
 *   onCancel={() => console.log('Tracking cancelled')}
 * />
 */
const TrackingPopup: React.FC<TrackingPopupProps> = ({ visible, onStartTracking, onCancel }) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={[styles.popup, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.componentTextColour }]}>START TRACKING?</Text>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Start Tracking"
              onPress={onStartTracking}
              textColor={theme.componentTextColour}
              buttonColor="#A4DB51"
              fontFamily="Rany-Medium"
              textSize={16}
              addFlex={true}
            />
            <CustomButton
              title="Cancel"
              onPress={onCancel}
              textColor={theme.componentTextColour}
              buttonColor="#EC4E4B"
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
    backgroundColor: Colors.modalBackground,
  },
  popup: {
    width: "95%",
    padding: 20,
    backgroundColor: Colors.popupBackground,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: Colors.popupShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.popupText,
    marginBottom: 20,
    fontFamily: "Quittance",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 10,
    gap: 10,
  },
});

export default TrackingPopup;
