import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#334FD7",
    padding: 20,
  },
  headingContainer: {
    alignSelf: "flex-start", // Align to the left
    marginBottom: 15, // Add space below the heading
    marginTop: 90, // Add space above the heading
  },
  inputContainer: {
    width: "100%", // Ensure the input takes the full width
    marginBottom: 40, // Add space below the input
  },
  buttonContainer: {
    width: "80%", // Ensure the button takes the full width
    marginBottom: 0, // Add space below the button
  },
  hyperlinkContainer: {
    width: "100%", // Ensure the hyperlink takes the full width
  },
});

export default styles;
