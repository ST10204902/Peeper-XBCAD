import {
  Button,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TrackingBackground from "../assets/TrackingBackground";
import { SessionLogData } from "../databaseModels/SessionLogData";

interface Props {
  isTracking: boolean;
  onStopTracking: (sessionToLog: SessionLogData) => void;
  organisationName: string;
}

export default function CurrentTrackingBanner({
  isTracking,
  onStopTracking,
  organisationName,
}: Props) {
  // Don't render the component if not tracking
  if (!isTracking) {
    return null;
  }

  return (
    <SafeAreaView style={styles.root_container}>
      <TrackingBackground />

      <View style={styles.text_container}>
        <Text style={styles.header}> Tracking Your Location </Text>
        <View style={styles.details_container}>
          <Text style={styles.org_name}>{organisationName}</Text>
          <Text style={styles.elapsed_time}> 26:45 </Text>
        </View>
      </View>
      <Pressable style={styles.stop_button}>
        <ImageBackground
          style={styles.button_image}
          source={require("../assets/stop_tracking_button.png")}
        />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root_container: {
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
