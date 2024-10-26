import {
  Button,
  Image,
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
import {
  elapsed_time,
  trackingStartTimeState,
  trackingState,
} from "../atoms/atoms";
import { useEffect } from "react";
import { clearTrackingNotification } from "../services/trackingNotification";
import { useTheme } from "../styles/ThemeContext";
import { darkTheme, lightTheme } from "../styles/themes";

/**
 * Component responsible for displaying the current tracking session to the user.
 * Displays the time elapsed and organisation name for which the user is tracking.
 * Also allows the user to stop tracking.
 * @returns A created CurrentTrackingBanner Component
 */
const CurrentTrackingBanner = () => {
  const [trackingAtom, setTrackingAtom] = useRecoilState(trackingState);
  const startTime = useRecoilValue(trackingStartTimeState);
  const setElapsedTime = useSetRecoilState(elapsed_time); // Only setElapsedTime is needed here
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;  

  const handleStopTracking = async () => {
    await clearTrackingNotification();
    setTrackingAtom({ isTracking: false, organizationName: "" });
    setElapsedTime(0);
  };

  // Start or stop the timer when tracking starts or stops
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (trackingAtom.isTracking && startTime > 0) {
      intervalId = setInterval(() => {
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        setElapsedTime(elapsedSeconds);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [trackingAtom.isTracking, startTime, setElapsedTime]);

  if (!trackingAtom.isTracking) {
    return null;
  }

  return (
    <SafeAreaView style={styles.root_container}>
      <TrackingBackground />
      <View style={styles.text_container}>
        <Text style={[styles.header, { color: theme.fontRegular }]}>Tracking Your Location</Text>
        <View style={styles.details_container}>
          <Text style={[styles.org_name, { color: theme.fontRegular }]} numberOfLines={1} ellipsizeMode="tail">
            {trackingAtom.organizationName}
          </Text>
          <ElapsedTimeDisplay />
        </View>
      </View>
      <Pressable style={styles.stop_button} onPress={handleStopTracking}>
        <Image
          source={require("../assets/stop_tracking_button.png")}
          style={styles.button_image}
        />
      </Pressable>
    </SafeAreaView>
  );
};

/**
 * A separate component that only displays the elapsed time.
 * This component will only re-render when elapsedTime changes.
 */
const ElapsedTimeDisplay = () => {
  const elapsedTime = useRecoilValue(elapsed_time);
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;  

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return <Text style={[styles.elapsed_time, { color: theme.fontRegular }]}>{formatTime(elapsedTime)}</Text>;
};

const styles = StyleSheet.create({
  root_container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    color: "f9f9f9",
    zIndex: 1000,
    paddingTop: Platform.OS === "ios" ? 60 : 5,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  text_container: {
    flexDirection: "column",
    justifyContent: "center",
    paddingTop: Platform.OS === "ios" ? 8 : 0,
  },
  details_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 4 : 0,
  },
  header: {
    fontSize: 19,
    fontWeight: "600",
    color: "#000000",
    fontFamily: "Quittance",
    marginBottom: Platform.OS === "ios" ? 4 : 2,
  },
  org_name: {
    fontSize: 17,
    color: "#000000",
    fontFamily: "Rany-Medium",
  },
  stop_button: {},
  button_image: {
    minWidth: 50,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  elapsed_time: {
    fontSize: 17,
    color: "#000000",
    fontFamily: "Rany-Medium",
  },
});

export default CurrentTrackingBanner;
