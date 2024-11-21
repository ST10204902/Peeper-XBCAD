import { useState, useEffect, useRef, useCallback } from "react";
import * as ExpoLocation from "expo-location";
import { SessionLog } from "../databaseModels/databaseClasses/SessionLog";
import { LocationLog } from "../databaseModels/databaseClasses/LocationLog";
import { Student } from "../databaseModels/databaseClasses/Student";
import { Organisation } from "../databaseModels/databaseClasses/Organisation";
import { Viewport } from "../databaseModels/databaseClasses/Viewport";
import { useCurrentStudent } from "./useCurrentStudent";
import { DatabaseUtility } from "../utils/DatabaseUtility";
import {
  clearTrackingNotification,
  requestNotificationPermissions,
  showOrUpdateTrackingNotification,
} from "../services/trackingNotification";
import { trackingState, trackingStartTimeState } from "../atoms/atoms";
import { useRecoilState, useSetRecoilState } from "recoil";

type LocationSubscription = {
  remove: () => void;
};

/**
 * Custom hook to manage location tracking
 * @returns {Object} An object containing the error message, tracking state, and functions to start and stop tracking
 */
export function useLocationTracking() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tracking, setTracking] = useRecoilState(trackingState);
  const setStartTime = useSetRecoilState(trackingStartTimeState);
  const { currentStudent: student, updateCurrentStudent } = useCurrentStudent();

  const locationSubscriptionRef = useRef<LocationSubscription | null>(null);
  const sessionLogRef = useRef<SessionLog | null>(null);
  const studentRef = useRef<Student | null>(null);
  const orgNameRef = useRef<string>("");
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedTimeRef = useRef<number>(0);

  /**
   * Handles location updates
   * @param {ExpoLocation.LocationObject} location - The location object
   */
  const handleLocationUpdate = useCallback(
    (location: ExpoLocation.LocationObject) => {
      // eslint-disable-next-line no-console
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
        accuracy: location.coords.accuracy ?? 0,
        altitude: location.coords.altitude ?? 0,
      });

      currentSessionLog.locationLogs.push(newLocationLog);
      currentStudent.locationData[currentSessionLog.sessionLog_id] = currentSessionLog;

      // Save to database
      updateCurrentStudent({ locationData: currentStudent.locationData }).then(() => {
        // eslint-disable-next-line no-console
        console.log("New location log saved to student");
      });
    },
    [updateCurrentStudent],
  );

  const stopTracking = useCallback(async () => {
    // eslint-disable-next-line no-console
    console.log("Stopping tracking called");

    try {
      const currentSessionLog = sessionLogRef.current;
      const currentStudent = studentRef.current;

      if (!currentSessionLog || !currentStudent) {
        return;
      }

      currentSessionLog.sessionEndTime = new Date().toISOString();
      const boundingBox = Viewport.calculateBoundingBox(currentSessionLog.locationLogs);
      currentSessionLog.viewport.high = boundingBox.high;
      currentSessionLog.viewport.low = boundingBox.low;

      currentStudent.locationData[currentSessionLog.sessionLog_id] = currentSessionLog;

      await updateCurrentStudent({ locationData: currentStudent.locationData });
      // eslint-disable-next-line no-console
      console.log("Session log saved to student while stopping tracking");

      if (locationSubscriptionRef.current !== null) {
        locationSubscriptionRef.current.remove();
        locationSubscriptionRef.current = null;
      }

      await clearTrackingNotification();

      if (notificationTimerRef.current !== null) {
        clearInterval(notificationTimerRef.current);
        notificationTimerRef.current = null;
      }

      sessionLogRef.current = null;
      setTracking({ isTracking: false, organizationName: "" });
    } catch (trackingError) {
      setErrorMsg(`Error stopping tracking: ${trackingError}`);
      console.error(trackingError);
    }

    setTracking({ isTracking: false, organizationName: "" });
  }, [setTracking, updateCurrentStudent]);

  const startTracking = async (organisation: Organisation) => {
    // eslint-disable-next-line no-console
    console.log("Starting tracking called");
    // eslint-disable-next-line no-console
    console.log("organisation being tracked: ", organisation.orgName);
    if (tracking.isTracking) {
      setErrorMsg("Tracking already in progress");
      return;
    }

    if (!student) {
      setErrorMsg("No student data found while starting tracking");
      return;
    }

    try {
      const { status: foregroundStatus } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const { status: backgroundStatus } = await ExpoLocation.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== "granted") {
        setErrorMsg("Permission to access background location was denied");
        return;
      }

      setTracking({ isTracking: true, organizationName: organisation.orgName });
      orgNameRef.current = organisation.orgName;

      const newSessionID = DatabaseUtility.generateUniqueId();
      const newSessionLog = new SessionLog({
        sessionLog_id: newSessionID,
        orgID: organisation.org_id,
        sessionStartTime: new Date().toISOString(),
        sessionEndTime: new Date().toISOString(),
        locationLogs: [],
        viewport: { low: { latitude: 0, longitude: 0 }, high: { latitude: 0, longitude: 0 } },
      });

      student.locationData[newSessionID] = newSessionLog;
      sessionLogRef.current = newSessionLog;
      studentRef.current = student;

      await updateCurrentStudent({ locationData: student.locationData });
      // eslint-disable-next-line no-console
      console.log("Session log saved to student");

      locationSubscriptionRef.current = await ExpoLocation.watchPositionAsync(
        { accuracy: ExpoLocation.Accuracy.Balanced, timeInterval: 5000, distanceInterval: 0 },
        handleLocationUpdate,
      );

      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
        // eslint-disable-next-line no-console
        console.log("Notification permissions not granted");
      }

      elapsedTimeRef.current = 0;
      const now = Date.now();
      setStartTime(now);

      await showOrUpdateTrackingNotification(organisation.orgName, elapsedTimeRef.current);

      notificationTimerRef.current = setInterval(() => {
        elapsedTimeRef.current += 1;
        showOrUpdateTrackingNotification(organisation.orgName, elapsedTimeRef.current);
      }, 1000);
    } catch (startError) {
      setStartTime(0);
      setTracking({ isTracking: false, organizationName: "" });
      setErrorMsg(`Error starting tracking: ${startError}`);
      console.error(startError);
    }
  };

  useEffect(() => {
    if (
      !tracking.isTracking &&
      (locationSubscriptionRef.current !== null || sessionLogRef.current !== null)
    ) {
      stopTracking();
    }
  }, [tracking.isTracking, stopTracking]);

  useEffect(() => {
    if (errorMsg !== null && errorMsg !== "") {
      console.error(`Error during tracking: ${errorMsg}`);
      setErrorMsg(null);
    }

    return () => {
      if (locationSubscriptionRef.current !== null) {
        locationSubscriptionRef.current.remove();
      }
      if (notificationTimerRef.current !== null) {
        clearInterval(notificationTimerRef.current);
      }
      clearTrackingNotification();
    };
  }, [errorMsg]);

  return { tracking, startTracking };
}
