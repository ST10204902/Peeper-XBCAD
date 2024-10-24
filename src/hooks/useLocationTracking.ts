import { useState, useEffect, useRef } from "react";
import * as ExpoLocation from "expo-location";
import { SessionLog } from "../databaseModels/databaseClasses/SessionLog";
import { LocationLog } from "../databaseModels/databaseClasses/LocationLog";
import { Student } from "../databaseModels/databaseClasses/Student";
import { Organisation } from "../databaseModels/databaseClasses/Organisation";
import { LocationLogData } from "../databaseModels/LocationLogData";
import { Viewport } from "../databaseModels/databaseClasses/Viewport";
import { useRecoilState } from "recoil";
import { trackingState } from "../atoms/atoms";
import { useStudent } from "./useStudent";
import { DatabaseUtility } from "../databaseModels/databaseClasses/DatabaseUtility";

//-----------------------------------------------------------//
//                          HOOKS                            //
//-----------------------------------------------------------//
/**
 * Custom hook for tracking a student's location and saving it to the database.
 * @returns An object containing the tracking state and methods.
 */
export function useLocationTracking() {
  //-----------------------------------------------------------//
  //                          STATES                           //
  //-----------------------------------------------------------//

  // Error message state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tracking, setTracking] = useRecoilState(trackingState); // Recoil state for tracking status
  const { currentStudent, setCurrentStudent, error } = useStudent(); // Custom hook to fetch student data
  //-----------------------------------------------------------//
  //                          REFS                             //
  //-----------------------------------------------------------//

  // Store subscription reference for cleanup
  const locationSubscriptionRef = useRef<any>(null);
  // Ref to hold the latest session log
  const sessionLogRef = useRef<SessionLog | null>(null);
  // Ref to store the current student
  const studentRef = useRef<Student | null>(null);

  //-----------------------------------------------------------//
  //                          METHODS                          //
  //-----------------------------------------------------------//
  const startTracking = async (organisation: Organisation) => {
    console.log("Starting tracking called");

    // Prevent multiple tracking sessions from starting simultaneously
    if (tracking.isTracking) {
      setErrorMsg("Tracking already in progress");
      return;
    }

    // Ensure student data is available
    if (!currentStudent) {
      setErrorMsg("No student data found while starting tracking");
      return;
    }
    try {
      // Request foreground location permissions
      let { status: foregroundStatus } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Request background location permissions
      let { status: backgroundStatus } = await ExpoLocation.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== "granted") {
        setErrorMsg("Permission to access background location was denied");
        return;
      }

      // Set tracking status to active
      setTracking({ isTracking: true, organizationName: organisation.orgName });

      // Create and initialize a new session log
      const newSessionID = DatabaseUtility.generateUniqueId();
      const newSessionLog = new SessionLog({
        sessionLog_id: newSessionID,
        orgID: organisation.org_id,
        sessionStartTime: new Date().toISOString(),
        sessionEndTime: new Date().toISOString(), // Will be updated when tracking stops, important for calculating session duration while tracking
        locationLogs: [],
        viewport: { low: { latitude: 0, longitude: 0 }, high: { latitude: 0, longitude: 0 } },
      });

      // Save the session log to the student object
      currentStudent.locationData[newSessionID] = newSessionLog;

      // Save session and student references
      sessionLogRef.current = newSessionLog;
      studentRef.current = currentStudent;

      // Persist session log to the database
      setCurrentStudent(currentStudent).then(() => {
        console.log("Session log saved to student");
      });

      // Start tracking the location every 5 seconds (this will be changed to use background location tracking)
      locationSubscriptionRef.current = await ExpoLocation.watchPositionAsync(
        { accuracy: ExpoLocation.Accuracy.High, timeInterval: 5000, distanceInterval: 0 },
        handleLocationUpdate
      );
    } catch (error) {
      throw new Error(`Error starting tracking: ${error}`);
    }
  };

  // Stop location tracking
  //-----------------------------------------------------------//
  const stopTracking = async () => {
    console.log("Stopping tracking called");

    const currentSessionLog = sessionLogRef.current;
    const currentStudent = studentRef.current;

    // Ensure there is a session log and student data to work with
    if (!currentSessionLog || !currentStudent) {
      return;
    }
    try {
      // Finalize the session log with an end time
      currentSessionLog.sessionEndTime = new Date().toISOString();

      // Calculate the bounding box for the session
      const boundingBox = Viewport.calculateBoundingBox(currentSessionLog.locationLogs);

      // Set the calculated viewport for the session
      currentSessionLog.viewport.high = boundingBox.high;
      currentSessionLog.viewport.low = boundingBox.low;

      // Update the student's location data with the finalized session log
      currentStudent.locationData[currentSessionLog.sessionLog_id] = currentSessionLog;

      // Persist updated session log to the database
      await currentStudent.save().then(() => {
        console.log("Session log saved to student while stopping tracking");
      });

      // Clean up location subscription if it's active
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
        locationSubscriptionRef.current = null;
      }

      const sessionLogToReturn = JSON.parse(
        JSON.stringify(sessionLogRef.current)
      ) as typeof sessionLogRef.current;
      sessionLogRef.current = null; // Reset session log reference

      return sessionLogToReturn;
    } catch (error) {
      throw new Error(`Error stopping tracking: ${error}`);
    } finally {
      return sessionLogRef.current;
    }
  };

  // Handle location updates during tracking
  //-----------------------------------------------------------//
  function handleLocationUpdate(location: ExpoLocation.LocationObject) {
    console.log("handleLocationUpdate was called");

    const currentSessionLog = sessionLogRef.current;
    const currentStudent = studentRef.current;

    // Ensure session log and student are available
    if (!currentSessionLog || !currentStudent) {
      setErrorMsg("No session log or student found while updating location");
      return;
    }

    // Create a new location log based on the update
    const ISOTimeStamp = new Date(location.timestamp).toISOString();
    const newLocationLog = new LocationLog({
      timestamp: ISOTimeStamp,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || 0,
      altitude: location.coords.altitude || 0,
    });

    // Add location log to the session and update the student's location data
    currentSessionLog.locationLogs.push(newLocationLog);
    currentStudent.locationData[currentSessionLog.sessionLog_id] = currentSessionLog;

    // Persist new location log to the database
    currentStudent.save().then(() => {
      console.log("New location log saved to student");
    });
  }

  // Cleanup logic when component unmounts or tracking stops
  useEffect(() => {
    if (tracking.isTracking) {
      console.log("Tracking in progress...");
    } else {
      stopTracking();
    }

    if (errorMsg) {
        console.error(`Error during tracking: ${errorMsg}`);
        setErrorMsg(null); // Reset error message
    }

    // Clean up location tracking when component unmounts or isTracking changes
    return () => {
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove(); // Remove location subscription
      }
    };
  }, [tracking, errorMsg]);

  // Return tracking state and methods
  return { tracking, startTracking, stopTracking, errorMsg };
}

//------------------------***EOF***-----------------------------//
