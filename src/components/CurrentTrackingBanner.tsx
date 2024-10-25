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
import { elapsed_time, trackingStartTimeState, trackingState } from "../atoms/atoms";
import { useEffect } from "react";
import { clearTrackingNotification } from "../services/trackingNotification";

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

  const handleStopTracking = async () => {
    await clearTrackingNotification();
    setTrackingAtom({ isTracking: false, organizationName: "" });
    setElapsedTime(0);
  };

  // Start or stop the timer when tracking starts or stops
  useEffect(() => {
    let frameId: number;

    if (trackingAtom.isTracking && startTime > 0) {
      const updateTimer = () => {
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        setElapsedTime(elapsedSeconds);
        frameId = requestAnimationFrame(updateTimer);
      };
      frameId = requestAnimationFrame(updateTimer);
    } else {
      setElapsedTime(0);
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [trackingAtom.isTracking, startTime]);

  if (!trackingAtom.isTracking) {
    return null; // Don't render the component if tracking is not active
  }

  return (
    <SafeAreaView style={styles.root_container}>
      <TrackingBackground />
      <View style={styles.text_container}>
        <Text style={styles.header}> Tracking Your Location </Text>
        <View style={styles.details_container}>
          <Text
            style={styles.org_name}
            numberOfLines={1} // Limit to one line
            ellipsizeMode="tail"
          >
            {trackingAtom.organizationName}
          </Text>
          <ElapsedTimeDisplay />
        </View>
      </View>
      <Pressable
        style={styles.stop_button}
        onPress={handleStopTracking}
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
 * This component will only re-render when elapsedTime changes.
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
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  text_container: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 8 : 0,
  },
  details_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 4 : 0,
  },
  header: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: Platform.OS === 'ios' ? 4 : 2,
  },
  org_name: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  stop_button: {
    position: 'absolute',
    right: 16,
    top: Platform.OS === 'ios' ? 12 : 8,
    width: 24,
    height: 24,
  },
  button_image: {
    width: '100%',
    height: '100%',
  },
  elapsed_time: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default CurrentTrackingBanner;