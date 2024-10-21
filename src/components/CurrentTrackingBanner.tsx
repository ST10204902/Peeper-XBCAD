import {
  Button,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TrackingBackground from "../assets/TrackingBackground";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"; // Using only setState for elapsedTime
import { elapsed_time, isTrackingState } from "../atoms/atoms";
import { useEffect } from "react";

/**
 * Component responsible for displaying the current tracking session to the user.
 * Displays the time elapsed and organisation name for which the user is tracking.
 * Also allows the user to stop tracking.
 * @returns A created CurrentTrackingBanner Component
 */
const CurrentTrackingBanner = () => {
  const [isTracking, setIsTracking] = useRecoilState(isTrackingState);
  const setElapsedTime = useSetRecoilState(elapsed_time); // Only setElapsedTime is needed here

  // Start or stop the timer when tracking starts or stops
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isTracking) {
      // Clear any existing timer before starting a new one
      clearInterval(timer);

      // Start the timer
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      // Clear the timer and reset elapsed time when tracking stops
      clearInterval(timer);
      setElapsedTime(0); // Reset timer when tracking stops
    }

    // Cleanup interval when the component unmounts or isTracking changes
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isTracking, setElapsedTime]);

  if (!isTracking) {
    return null; // Don't render the component if tracking is not active
  }

  return (
    <SafeAreaView style={styles.root_container}>
      <TrackingBackground />
      <View style={styles.text_container}>
        <Text style={styles.header}> Tracking Your Location </Text>
        <View style={styles.details_container}>
          <Text style={styles.org_name}>{"organisationName"}</Text>
          <ElapsedTimeDisplay />
        </View>
      </View>
      <Pressable
        style={styles.stop_button}
        onPress={() => setIsTracking(false)}
      >
        <ImageBackground
          style={styles.button_image}
          source={require("../assets/stop_tracking_button.png")}
        />
      </Pressable>
    </SafeAreaView>
  );
};

/**
 * A separate component that only displays the elapsed time.
 * This component will only re-render when `elapsedTime` changes.
 */
const ElapsedTimeDisplay = () => {
  const elapsedTime = useRecoilValue(elapsed_time); // Use Recoil to subscribe to elapsedTime

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return (
      <Text>{`${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
      ).padStart(2, "0")}`}</Text>
    );
  };

  return <Text style={styles.elapsed_time}> {formatTime(elapsedTime)} </Text>;
};

const styles = StyleSheet.create({
  root_container: {
    paddingTop: Platform.OS === "ios" ? 50 : 0,
    display: "flex",
    paddingBottom: 20,
    paddingHorizontal: 30,
    flexDirection: "row",
    borderBottomStartRadius: 35,
    borderBottomEndRadius: 35,
    backgroundColor: "white",
    marginBottom: -30,
    elevation: 100,
  },
  text_container: {
    flexDirection: "column",
    gap: 6,
  },
  details_container: {
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  org_name: {
    fontFamily: "Rany-Bold",
    color: "#565656",
    fontSize: 17,
  },
  elapsed_time: {
    marginEnd: 5,
    fontFamily: "Rany-Bold",
    color: "#565656",
    fontSize: 17,
  },
  header: {
    fontFamily: "Quittance",
    fontSize: 18,
  },
  stop_button: {
    height: "100%",
    flex: 1,
  },
  button_image: {
    objectFit: "contain",
    flex: 1,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  background: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default CurrentTrackingBanner;
