import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TrackingBackground from "../assets/TrackingBackground";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { elapsed_time, trackingStartTimeState } from "../atoms/atoms";
import { useEffect } from "react";
import { useTheme } from "../styles/ThemeContext";
import { darkTheme, lightTheme } from "../styles/themes";
import { Colors } from "../styles/colors";
import stopTrackingIcon from "../assets/stop_tracking_button.png";
import { useLocationTracking } from "../hooks/useLocationTracking";

/**
 * @component CurrentTrackingBanner
 * @description A banner component that displays and manages the current tracking state
 * for time tracking functionality. Shows active tracking status and provides stop functionality.
 * Uses Recoil for state management and includes an auto-updating elapsed time display.
 *
 * @requires useTheme - Theme context hook for dark/light mode
 * @requires Recoil - State management library
 * @requires React Native SafeAreaView
 *
 * @state {Object} trackingAtom - Recoil state containing tracking status
 * @state {boolean} trackingAtom.isTracking - Whether tracking is currently active
 * @state {string} trackingAtom.organizationName - Name of organization being tracked
 * @state {number} startTime - Timestamp when tracking started
 * @state {number} elapsedTime - Seconds elapsed since tracking started
 *
 * @function handleStopTracking - Async function to stop tracking and clear notifications
 *
 * @effect Timer Effect - Manages interval for updating elapsed time while tracking is active
 *
 * @returns {JSX.Element|null} Returns the tracking banner when active, null when inactive
 *
 * @example
 * <CurrentTrackingBanner />
 */
const CurrentTrackingBanner = () => {
  const { tracking, stopTracking } = useLocationTracking();
  const startTime = useRecoilValue(trackingStartTimeState);
  const setElapsedTime = useSetRecoilState(elapsed_time);
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleStopTracking = async () => {
    await stopTracking();
    setElapsedTime(0);
  };

  // Start or stop the timer when tracking starts or stops
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (tracking.isTracking && startTime > 0) {
      intervalId = setInterval(() => {
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        setElapsedTime(elapsedSeconds);
      }, 1000);
    }

    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [tracking.isTracking, startTime, setElapsedTime]);

  if (!tracking.isTracking) {
    return null;
  }

  return (
    <SafeAreaView style={styles.root_container}>
      <TrackingBackground />
      <View style={styles.text_container}>
        <Text style={[styles.header, { color: theme.fontRegular }]}>Tracking Your Location</Text>
        <View style={styles.details_container}>
          <Text
            style={[styles.org_name, { color: theme.fontRegular }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {tracking.organizationName}
          </Text>
          <ElapsedTimeDisplay />
        </View>
      </View>
      <Pressable style={styles.stop_button} onPress={handleStopTracking}>
        <Image source={stopTrackingIcon} style={styles.button_image} />
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
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <Text style={[styles.elapsed_time, { color: theme.fontRegular }]}>
      {formatTime(elapsedTime)}
    </Text>
  );
};

const styles = StyleSheet.create({
  root_container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    color: Colors.pageBackground,
    zIndex: 1000,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 0,
    paddingBottom: Platform.OS === "ios" ? 12 : 20,
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
    fontFamily: "Quittance",
    marginBottom: Platform.OS === "ios" ? 4 : 2,
  },
  org_name: {
    fontSize: 17,
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
    fontFamily: "Rany-Medium",
  },
});

export default CurrentTrackingBanner;
