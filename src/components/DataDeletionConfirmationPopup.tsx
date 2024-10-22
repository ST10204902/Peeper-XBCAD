import { StyleSheet, Text, View } from "react-native";
import { Student } from "../databaseModels/databaseClasses/Student";
import SearchBarComponent from "./GeneralInputComponent";
import CustomButton from "./CustomButton";
import { useState } from "react";

interface Props {
  studentNumber: string;
  onConfirmation: () => void;
  onCancel: () => void;
}

export default function DataDeletionConfirmationPopup({
  studentNumber,
  onConfirmation,
  onCancel,
}: Props) {
  // Hook for managing the state of the confirmation input entered by the user
  const [confirmationInput, setConfirmationInput] = useState("");
  // Hook for managing the visibility of the error message indicating that the student numbers don't match
  const [hasError, setHasError] = useState(false);

  // Don't render if student number is null or empty
  if (!studentNumber) {
    console.error(
      "DataDeletionConfirmationPopup: Student number was null or empty"
    );
    return null;
  }

  const handleConfirm = () => {
    if (confirmationInput.toUpperCase() === studentNumber.toUpperCase()) {
      onConfirmation();
    } else {
      setHasError(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>ARE YOU SURE?</Text>
        <Text style={styles.message}>
          Please type your student number to confirm:
        </Text>
        <Text style={styles.studentNumber}>{studentNumber.toUpperCase()}</Text>
        <SearchBarComponent
          FGColor="#000000"
          placeHolderColor="#808080"
          placeholderText="STXXXXXXXX"
          labelText=""
          onSearchInputChange={setConfirmationInput}
        />

        {hasError ? (
          <Text style={styles.error_text}>Student Numbers do not match</Text>
        ) : null}

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Confirm"
            onPress={handleConfirm}
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  body: {
    color: "#161616",
    width: "95%",
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: "#161616",
    marginBottom: 20,
    fontFamily: "Quittance", // Change font if needed
  },
  message: {
    fontFamily: "Rany-Regular",
    fontSize: 16,
  },
  studentNumber: {
    fontSize: 25,
    fontFamily: "Inter-Black",
    color: "#161616",
    marginBottom: -24,
  },
  error_text: {
    fontFamily: "Rany-Bold",
    marginTop: 5,
    fontSize: 14,
    color: "#EC4E4B",
  },
  buttonContainer: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    marginTop: 25,
  },
});
