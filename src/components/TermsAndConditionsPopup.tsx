import { useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from "react-native";
import CustomButton from "./CustomButton";
import TermsAndConditionsScreen from "../screens/settings/TermsAndConditionsScreen";
import { ScrollView } from "react-native-gesture-handler";
import { Colors } from "../styles/colors";

interface Props {
  onAccept: () => void;
}

/**
 * TermsAndConditionsPopup component displays a scrollable Terms and Conditions document, requiring users to read through it before accepting.
 * The component enables the "Accept" button only after the user has scrolled to the bottom, indicating they have reviewed the document.
 * If the user tries to accept before scrolling to the bottom, an error message prompts them to finish reading.
 *
 * @component
 * @param {Function} onAccept - Callback function triggered when the user successfully accepts the terms and conditions.
 * @returns {JSX.Element} The rendered terms and conditions popup component.
 *
 * @example
 * <TermsAndConditionsPopup onAccept={handleAccept} />
 *
 * @remarks
 * - Displays the Terms and Conditions content inside a scrollable view.
 * - Automatically enables the "Accept" button when the user reaches the bottom of the document.
 * - Shows an error message if the user attempts to accept without fully scrolling.
 *
 * @function handleScroll
 * - Checks if the user has scrolled to the bottom of the document and enables the "Accept" button accordingly.
 *
 * @function handleAcceptFailed
 * - Displays an error message if the user tries to accept without reading through the document.
 *
 * @state {boolean} isAccepted - Indicates if the user has scrolled to the bottom and can accept the terms.
 * @state {boolean} hasError - Indicates if an error message should be shown when the user attempts to accept prematurely.
 */
export default function TermsAndConditionsPopup({ onAccept }: Props) {
  const [isAccepted, setIsAccepted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isAtBottom && !isAccepted) {
      setIsAccepted(true);
      setHasError(false);
    }
  };

  const handleAcceptFailed = () => {
    setHasError(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
          <TermsAndConditionsScreen />
        </ScrollView>
        <Text style={styles.explanation}>
          By pressing Accept, you agree to our terms and conditions.
        </Text>
        <View style={styles.button_container}>
          <CustomButton
            onPress={isAccepted ? onAccept : handleAcceptFailed}
            title="Accept"
            textColor={Colors.termsText}
            buttonColor={isAccepted ? "#A4DB51" : "#C8E2A1"}
            fontFamily="Quittance"
            textSize={20}
          />
          {hasError ? (
            <Text style={styles.error_text}>Read to the bottom of our Ts & Cs to Accept</Text>
          ) : null}
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
    backgroundColor: Colors.termsModalBackground,
    zIndex: 1000,
  },
  body: {
    color: Colors.termsText,
    width: "95%",
    backgroundColor: Colors.termsBodyBackground,
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 26,
    borderRadius: 20,
    height: "90%",
    gap: 20,
  },
  explanation: {
    paddingHorizontal: 20,
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Rany-Medium",
  },
  button_container: {
    width: "70%",
    alignSelf: "center",
  },
  error_text: {
    marginTop: 3,
    fontFamily: "Rany-Bold",
    fontSize: 14,
    color: Colors.termsError,
    textAlign: "center",
  },
});
