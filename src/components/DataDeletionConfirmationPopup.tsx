import { StyleSheet, Text, View } from "react-native";
import SearchBarComponent from "./GeneralInputComponent";
import CustomButton from "./CustomButton";
import { useState } from "react";
import { Colors } from "../styles/colors";

interface Props {
  studentNumber: string;
  onConfirmation: () => void;
  onCancel: () => void;
}

/**
 * DataDeletionConfirmationPopup component handles the confirmation process for data deletion.
 *
 * This component prompts the user to confirm their request for data deletion by entering their
 * student number. If the entered student number matches the one provided via props, the deletion
 * is confirmed. Otherwise, an error message is displayed to the console.
 *
 * @component
 * @returns {JSX.Element} A functional component that renders a popup for confirming data deletion.
 *
 * @example
 * <DataDeletionConfirmationPopup studentNumber="ST10020300" onConfirmation={handleConfirm} onCancel={handleCancel} />
 *
 * @remarks
 * - Takes the student's number as a prop and compares it with the input entered by the user.
 * - Displays an error if the input doesn't match the student's number.
 * - Executes `onConfirmation` when the student number matches, and `onCancel` when the cancellation is chosen.
 *
 * @function
 * @name DataDeletionConfirmationPopup
 *
 * @hook
 * @name useState
 * @description Manages local state for the confirmation input and error message visibility.
 *
 * @param {string} studentNumber - The student's number that must be confirmed by the user.
 * @param {function} onConfirmation - Callback executed when the student number is confirmed.
 * @param {function} onCancel - Callback executed when the user cancels the confirmation.
 *
 * @state {string} confirmationInput - Stores the user's input for confirming the student number.
 * @state {boolean} hasError - Determines if the error message indicating a mismatch in student numbers should be displayed.
 *
 * @throws Will log an error to the console if the student number is null or empty.
 *
 * @callback handleConfirm
 * @description Checks if the input matches the student number and either calls `onConfirmation` or displays an error.
 */
export default function DataDeletionConfirmationPopup({
  studentNumber,
  onConfirmation,
  onCancel,
}: Props) {
  const [confirmationInput, setConfirmationInput] = useState(""); // State of the confirmation input entered by the user
  const [hasError, setHasError] = useState(false); // Visibility of the error message indicating that the student numbers don't match

  // Don't render if student number is null or empty
  if (!studentNumber) {
    console.error("DataDeletionConfirmationPopup: Student number was null or empty");
    return null;
  }

  const handleConfirm = () => {
    if (confirmationInput.toUpperCase() === studentNumber.toUpperCase()) {
      onConfirmation(); // run onConfirmation code
    } else {
      setHasError(true); // show error if failed validation
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>ARE YOU SURE?</Text>
        <Text style={styles.message}>Please type your student number to confirm:</Text>
        <Text style={styles.studentNumber}>{studentNumber.toUpperCase()}</Text>
        <SearchBarComponent
          FGColor={Colors.headerText}
          placeHolderColor="#808080"
          placeholderText="STXXXXXXXX"
          labelText=""
          onSearchInputChange={setConfirmationInput}
        />

        {hasError ? <Text style={styles.error_text}>Student Numbers do not match</Text> : null}

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Confirm"
            onPress={handleConfirm}
            textColor={Colors.headerText}
            buttonColor="#A4DB51"
            fontFamily="Rany-Medium"
            textSize={16}
            addFlex={true}
          />
          <CustomButton
            title="Cancel"
            onPress={onCancel}
            textColor={Colors.headerText}
            buttonColor="#EC4E4B"
            fontFamily="Rany-Medium"
            textSize={16}
            addFlex={true}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.modalBackground,
  },
  body: {
    color: Colors.headerText,
    width: "95%",
    backgroundColor: Colors.termsBodyBackground,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: Colors.headerText,
    marginBottom: 20,
    fontFamily: "Quittance",
  },
  message: {
    fontFamily: "Rany-Regular",
    fontSize: 16,
  },
  studentNumber: {
    fontSize: 25,
    fontFamily: "Inter-Black",
    color: Colors.headerText,
    marginBottom: -24,
  },
  error_text: {
    fontFamily: "Rany-Bold",
    marginTop: 5,
    fontSize: 14,
    color: Colors.termsError,
  },
  buttonContainer: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    marginTop: 25,
  },
});
