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
import { trackingState } from "../atoms/atoms";
import { useRecoilState } from "recoil";

export function useLocationTracking() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tracking, setTracking] = useRecoilState(trackingState);

  const { currentStudent, error, updateCurrentStudent } = useCurrentStudent();

  const locationSubscriptionRef = useRef<any>(null);
  const sessionLogRef = useRef<SessionLog | null>(null);
  const studentRef = useRef<Student | null>(null);
  const orgNameRef = useRef<string>("");
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedTimeRef = useRef<number>(0); // To keep track of elapsed time in seconds

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

      // Start location tracking (keep at 5 seconds for location updates)
      locationSubscriptionRef.current = await ExpoLocation.watchPositionAsync(
        { accuracy: ExpoLocation.Accuracy.High, timeInterval: 5000, distanceInterval: 0 },
        handleLocationUpdate
      );

      // Request notification permissions
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
        console.log("Notification permissions not granted");
      }

      // Reset elapsed time
      elapsedTimeRef.current = 0;
      
      // Show initial notification
      await showOrUpdateTrackingNotification(organisation.orgName, elapsedTimeRef.current);

      // Start notification timer (update every second)
      notificationTimerRef.current = setInterval(() => {
        elapsedTimeRef.current += 1;
        showOrUpdateTrackingNotification(organisation.orgName, elapsedTimeRef.current);
      }, 1000);

    } catch (error) {
      // If anything fails, make sure tracking state is false
      setTracking({ isTracking: false, organizationName: "" });
      setErrorMsg(`Error starting tracking: ${error}`);
      console.error(error);
    }
  };

  const stopTracking = async () => {
    console.log("Stopping tracking called");
    
    try {
      // Finalize session log
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

      // Clear notification timer
      if (notificationTimerRef.current) {
        clearInterval(notificationTimerRef.current);
        notificationTimerRef.current = null;
      }

      sessionLogRef.current = null; // Reset session log reference
      
    } catch (error) {
      setErrorMsg(`Error stopping tracking: ${error}`);
      console.error(error);
    }

    // Move this AFTER cleanup is successful
    setTracking({ isTracking: false, organizationName: "" });
  };

  function handleLocationUpdate(location: ExpoLocation.LocationObject) {
    console.log("handleLocationUpdate was called");

    const currentSessionLog = sessionLogRef.current;
    const currentStudent = studentRef.current;

    if (!currentSessionLog || !currentStudent) {
      setErrorMsg("No session log or student found while updating location");
      return;
    }

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
      if (locationSubscriptionRef.current || sessionLogRef.current) {
        stopTracking();
      }
    }
  }, [tracking.isTracking]);

  useEffect(() => {
    if (errorMsg) {
      console.error(`Error during tracking: ${errorMsg}`);
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

  return { tracking, startTracking };
}
}