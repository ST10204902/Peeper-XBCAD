import { useState, useEffect, useRef } from "react";
import * as ExpoLocation from "expo-location";
import { SessionLog } from "../databaseModels/databaseClasses/SessionLog";
import { LocationLog } from "../databaseModels/databaseClasses/LocationLog";
import { Student } from "../databaseModels/databaseClasses/Student";
import { Organisation } from "../databaseModels/databaseClasses/Organisation";
import { Viewport } from "../databaseModels/databaseClasses/Viewport";
import { useCurrentStudent } from "./useCurrentStudent";
import { DatabaseUtility } from "../databaseModels/databaseClasses/DatabaseUtility";
import { clearTrackingNotification, requestNotificationPermissions, showOrUpdateTrackingNotification } from "../services/trackingNotification";
import { trackingStartTimeState, trackingState } from "../atoms/atoms";
import { useRecoilState } from "recoil";
import { useSetRecoilState } from "recoil";

export function useLocationTracking() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tracking, setTracking] = useRecoilState(trackingState);
  const setTrackingStartTime = useSetRecoilState(trackingStartTimeState);
  const startTimeRef = useRef<number>(0);

  const { currentStudent, error, updateCurrentStudent } = useCurrentStudent();

  const locationSubscriptionRef = useRef<any>(null);
  const sessionLogRef = useRef<SessionLog | null>(null);
  const studentRef = useRef<Student | null>(null);
  const orgNameRef = useRef<string>("");
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startTracking = async (organisation: Organisation) => {
    console.log("Starting tracking called");
    console.log("organisation being tracked: ", organisation.orgName);
    if (tracking.isTracking) {
      setErrorMsg("Tracking already in progress");
      return;
    }

    if (!currentStudent) {
      setErrorMsg("No student data found while starting tracking");
      return;
    }

    try {
      // Request permissions
      let { status: foregroundStatus } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let { status: backgroundStatus } = await ExpoLocation.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== "granted") {
        setErrorMsg("Permission to access background location was denied");
        return;
      }

      const startTime = Date.now();
      startTimeRef.current = startTime;
      setTrackingStartTime(startTime); // Set the shared start time
      // Set tracking status
      setTracking({ isTracking: true, organizationName: organisation.orgName });
      orgNameRef.current = organisation.orgName;

      // Create session log
      const newSessionID = DatabaseUtility.generateUniqueId();
      const newSessionLog = new SessionLog({
        sessionLog_id: newSessionID,
        orgID: organisation.org_id,
        sessionStartTime: new Date().toISOString(),
        sessionEndTime: new Date().toISOString(),
        locationLogs: [],
        viewport: { low: { latitude: 0, longitude: 0 }, high: { latitude: 0, longitude: 0 } },
      });

      // Update student's location data
      currentStudent.locationData[newSessionID] = newSessionLog;
      sessionLogRef.current = newSessionLog;
      studentRef.current = currentStudent;

      // Save to database
      await updateCurrentStudent({ locationData: currentStudent.locationData });
      console.log("Session log saved to student");

      // Start location tracking
      locationSubscriptionRef.current = await ExpoLocation.watchPositionAsync(
        { accuracy: ExpoLocation.Accuracy.High, timeInterval: 5000, distanceInterval: 0 },
        handleLocationUpdate
      );

      // Request notification permissions
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
        console.log("Notification permissions not granted");
      }

        // Show initial notification with 0 elapsed time
      await showOrUpdateTrackingNotification(organisation.orgName, 0);

   
    } catch (error) {
      setErrorMsg("Error starting tracking: ${error}");
      console.error(error);
    }
  };

  const stopTracking = async () => {
    console.log("Stopping tracking called");

    const currentSessionLog = sessionLogRef.current;
    const currentStudent = studentRef.current;

    if (!currentSessionLog || !currentStudent) {
      return;
    }

    try {
      // Finalize session log
      currentSessionLog.sessionEndTime = new Date().toISOString();
      const boundingBox = Viewport.calculateBoundingBox(currentSessionLog.locationLogs);
      currentSessionLog.viewport.high = boundingBox.high;
      currentSessionLog.viewport.low = boundingBox.low;

      // Update student's location data
      currentStudent.locationData[currentSessionLog.sessionLog_id] = currentSessionLog;

      // Save to database
      await updateCurrentStudent({ locationData: currentStudent.locationData });
      console.log("Session log saved to student while stopping tracking");

      // Clean up location subscription
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
        locationSubscriptionRef.current = null;
      }


      // Clear notification
      await clearTrackingNotification();

      await clearTrackingNotification();
    if (locationSubscriptionRef.current) {
      await locationSubscriptionRef.current.remove();
    }
    setTracking({ isTracking: false, organizationName: "" });
    setTrackingStartTime(0);

      // Clear notification timer
      if (notificationTimerRef.current) {
        clearInterval(notificationTimerRef.current);
        notificationTimerRef.current = null;
      }

      sessionLogRef.current = null; // Reset session log reference
      
    } catch (error) {
      setErrorMsg("Error stopping tracking: ${error}");
      console.error(error);
    }
  };

  function handleLocationUpdate(location: ExpoLocation.LocationObject) {
    console.log("handleLocationUpdate was called");

    const currentSessionLog = sessionLogRef.current;
    const currentStudent = studentRef.current;

    if (!currentSessionLog || !currentStudent) {
      setErrorMsg("No session log or student found while updating location");
      return;
    }

    // Calculate elapsed time from startTimeRef
    const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
    showOrUpdateTrackingNotification(orgNameRef.current, elapsedSeconds);

    const ISOTimeStamp = new Date(location.timestamp).toISOString();
    const newLocationLog = new LocationLog({
      timestamp: ISOTimeStamp,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || 0,
      altitude: location.coords.altitude || 0,
    });

    currentSessionLog.locationLogs.push(newLocationLog);
    currentStudent.locationData[currentSessionLog.sessionLog_id] = currentSessionLog;

    // Save to database
    updateCurrentStudent({ locationData: currentStudent.locationData }).then(() => {
      console.log("New location log saved to student");
    });
  }

  useEffect(() => {
    if (!tracking.isTracking) {
      stopTracking();
      console.log("Tracking stopped");
    }
  }, [tracking.isTracking]);

  useEffect(() => {
    if (errorMsg) {
      console.error("Error during tracking: ${errorMsg}");
      setErrorMsg(null); // Reset error message
    }

    // Clean up when component unmounts
    return () => {
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
      }
      if (notificationTimerRef.current) {
        clearInterval(notificationTimerRef.current);
      }
      clearTrackingNotification();
    };
  }, []);

  return { tracking, startTracking };
}