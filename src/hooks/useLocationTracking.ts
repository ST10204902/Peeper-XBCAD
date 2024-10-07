import { useState, useEffect, useRef } from 'react';
import * as ExpoLocation from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { SessionLog } from '../databaseModels/databaseClasses/SessionLog';
import { SessionLogData } from '../databaseModels/SessionLogData';
import { LocationLogData } from '../databaseModels/LocationLogData';
import { LocationLog } from '../databaseModels/databaseClasses/LocationLog';
import { Student } from '../databaseModels/databaseClasses/Student';
import { Organisation } from '../databaseModels/databaseClasses/Organisation';
import { DatabaseUtility } from '../databaseModels/databaseClasses/DatabaseUtility';
import { Platform } from 'react-native';
import { useUser } from "@clerk/clerk-expo";
import { Viewport } from '../databaseModels/databaseClasses/Viewport';
import { ViewportData } from '../databaseModels/ViewportData';

const LOCATION_TASK_NAME = 'background-location-task';
export function useLocationTracking() {
    const [isTracking, setIsTracking] = useState(false);
    const [sessionLog, setSessionLog] = useState<SessionLog | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const locationSubscriptionRef = useRef<any>(null); // Store subscription reference for cleanup


    const startTracking = async (student: Student, organisation: Organisation) => {
        console.log('Starting tracking called');

        // request permissions
        let { status: foregroundStatus } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (foregroundStatus !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
            }

        let { status: backgroundStatus } = await ExpoLocation.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
            setErrorMsg('Permission to access background location was denied');
            return;
        }

        // create a new session log
        const newSessionID = generateUniqueId();
         // Initialize a new SessionLog
        const newSessionLog = new SessionLog({
            sessionLog_id: newSessionID,
            orgID: organisation.org_id,
            sessionStartTime: new Date().toISOString(),
            sessionEndTime: '',
            locationLogs: [],
            viewport: {
                low: { latitude: 0, longitude: 0 },
                high: { latitude: 0, longitude: 0 },
            },
        });

        // Save the session log to the database
        student.locationData[newSessionID] = newSessionLog;

        await student.save();
        console.log('Session log saved to student');
        
        // set the state variables
        setSessionLog(newSessionLog);
        setIsTracking(true);

        // start simulating tracking by subscribing to location get updates

        // Start tracking the location every 5 seconds
        locationSubscriptionRef.current = await ExpoLocation.watchPositionAsync(
            { accuracy: ExpoLocation.Accuracy.High, timeInterval: 5000, distanceInterval: 0 },
            handleLocationUpdate // This function will be called when location updates occur
        );

    }


    const stopTracking = async (student: Student) => {
        console.log('Stopping tracking called');
        // get the current session log
        const currentSessionLog = sessionLog;
        if (!currentSessionLog) {
            return;
        }


        // Add session end time and calculate viewport (bounding box)
        currentSessionLog.sessionEndTime = new Date().toISOString();
        currentSessionLog.viewport = calculateBoundingBox(currentSessionLog.locationLogs);

         // Save updated session log to the student model
        student.locationData[currentSessionLog.sessionLog_id] = currentSessionLog;
        await student.save();

        // Clean up location subscription
        if (locationSubscriptionRef.current) {
            locationSubscriptionRef.current.remove();
            locationSubscriptionRef.current = null;
        }

        // Reset state to stop tracking
        setSessionLog(null);
        setIsTracking(false);


    }

    function handleLocationUpdate(location: ExpoLocation.LocationObject) {
        console.log('handleLocationUpdate was called');
        const currentSessionLog = sessionLog;
        if (!currentSessionLog) {
            return;
        }

        // Log the new location information in the session log
        const ISOTimeStamp = new Date(location.timestamp).toISOString();
        const newLocationLog = new LocationLog({
            timestamp: ISOTimeStamp,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy || 0,
            altitude: location.coords.altitude || 0,
        });

        currentSessionLog.locationLogs.push(newLocationLog);
        setSessionLog(currentSessionLog);
    }


    // create an event that simulates location updates on a 5 second interval for testing
     // Simulate tracking updates for testing purposes (triggering location update every 5 seconds)
     useEffect(() => {
        if (isTracking) {
            // Use ExpoLocation watchPositionAsync or mock data here if needed for testing
            console.log("Tracking in progress...");
        }

        // Cleanup function to stop tracking when component unmounts or tracking is stopped
        return () => {
            if (locationSubscriptionRef.current) {
                locationSubscriptionRef.current.remove(); // Remove location subscription
            }
        };
    }, [isTracking]);

    return { isTracking, startTracking, stopTracking, errorMsg };
}


// Helper function to calculate bounding box
function calculateBoundingBox(locationLogs: LocationLogData[]) {
    let minLat = Infinity;
    let minLng = Infinity;
    let maxLat = -Infinity;
    let maxLng = -Infinity;
  
    locationLogs.forEach((log) => {
      if (log.latitude < minLat) minLat = log.latitude;
      if (log.latitude > maxLat) maxLat = log.latitude;
      if (log.longitude < minLng) minLng = log.longitude;
      if (log.longitude > maxLng) maxLng = log.longitude;
    });
  
    return {
      low: { latitude: minLat, longitude: minLng },
      high: { latitude: maxLat, longitude: maxLng },
    } as Viewport;
  }

  // Helper function to generate a unique ID

function generateUniqueId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}