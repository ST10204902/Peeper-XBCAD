import { StyleSheet } from "react-native";
import { Colors } from "./colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.loginPrimary,
    paddingHorizontal: 20,
  },
  headingContainer: {
    alignSelf: "flex-start",
    marginBottom: 15,
    marginTop: 40,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "80%",
    marginBottom: 0,
  },
  hyperlinkContainer: {
    width: "100%",
    marginBottom: 20,
  },
});

export default styles;
