import { useState, useEffect, useRef } from 'react';
import * as ExpoLocation from 'expo-location';
import { SessionLog } from '../databaseModels/databaseClasses/SessionLog';
import { LocationLog } from '../databaseModels/databaseClasses/LocationLog';
import { Student } from '../databaseModels/databaseClasses/Student';
import { Organisation } from '../databaseModels/databaseClasses/Organisation';
import { LocationLogData } from '../databaseModels/LocationLogData';
import { Viewport } from '../databaseModels/databaseClasses/Viewport';

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

    // Tracking state
    const [isTracking, setIsTracking] = useState(false); 
    // Error message state
    const [errorMsg, setErrorMsg] = useState<string | null>(null); 
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
    const startTracking = async (student: Student, organisation: Organisation) => {
        console.log('Starting tracking called');

        // Prevent multiple tracking sessions from starting simultaneously
        if (isTracking) {
            setErrorMsg('Tracking already in progress');
            return;
        }

        // Request foreground location permissions
        let { status: foregroundStatus } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (foregroundStatus !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        // Request background location permissions
        let { status: backgroundStatus } = await ExpoLocation.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
            setErrorMsg('Permission to access background location was denied');
            return;
        }

        // Enable tracking
        setIsTracking(true);

        // Create and initialize a new session log
        const newSessionID = generateUniqueId();
        const newSessionLog = new SessionLog({
            sessionLog_id: newSessionID,
            orgID: organisation.org_id,
            sessionStartTime: new Date().toISOString(),
            sessionEndTime: '',
            locationLogs: [],
            viewport: { low: { latitude: 0, longitude: 0 }, high: { latitude: 0, longitude: 0 } }
        });

        // Save the session log to the student object
        student.locationData[newSessionID] = newSessionLog;

        // Save session and student references
        sessionLogRef.current = newSessionLog;
        studentRef.current = student;

        // Persist session log to the database
        await student.save().then(() => {
            console.log('Session log saved to student');
        });

        // Start tracking the location every 5 seconds (this will be changed to use background location tracking)
        locationSubscriptionRef.current = await ExpoLocation.watchPositionAsync(
            { accuracy: ExpoLocation.Accuracy.High, timeInterval: 5000, distanceInterval: 0 },
            handleLocationUpdate
        );
    };

    // Stop location tracking
    //-----------------------------------------------------------//
    const stopTracking = async () => {
        console.log('Stopping tracking called');

        const currentSessionLog = sessionLogRef.current;
        const currentStudent = studentRef.current;

        // Ensure there is a session log and student data to work with
        if (!currentSessionLog || !currentStudent) {
            setErrorMsg('No session log or student found while stopping tracking');
            return;
        }

        // Disable tracking
        setIsTracking(false);

        // Finalize the session log with an end time
        currentSessionLog.sessionEndTime = new Date().toISOString();

        // Calculate the bounding box for the session
        const boundingBox = calculateBoundingBox(currentSessionLog.locationLogs);

        // Set the calculated viewport for the session
        currentSessionLog.viewport.high = boundingBox.high;
        currentSessionLog.viewport.low = boundingBox.low;

        // Update the student's location data with the finalized session log
        currentStudent.locationData[currentSessionLog.sessionLog_id] = currentSessionLog;

        // Persist updated session log to the database
        await currentStudent.save().then(() => {
            console.log('Session log saved to student while stopping tracking');
        });

        // Clean up location subscription if it's active
        if (locationSubscriptionRef.current) {
            locationSubscriptionRef.current.remove();
            locationSubscriptionRef.current = null;
        }

        const sessionLogToReturn = JSON.parse(JSON.stringify(sessionLogRef.current)) as typeof sessionLogRef.current;
        sessionLogRef.current = null; // Reset session log reference

        return sessionLogToReturn;
    };

    // Handle location updates during tracking
    //-----------------------------------------------------------//
    function handleLocationUpdate(location: ExpoLocation.LocationObject) {
        console.log('handleLocationUpdate was called');

        const currentSessionLog = sessionLogRef.current;
        const currentStudent = studentRef.current;

        // Ensure session log and student are available
        if (!currentSessionLog || !currentStudent) {
            console.log('No session log or student found while updating location');
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
            console.log('New location log saved to student');
        });
    }

    // Cleanup logic when component unmounts or tracking stops
    useEffect(() => {
        if (isTracking) {
            console.log('Tracking in progress...');
        }

        // Clean up location tracking when component unmounts or isTracking changes
        return () => {
            if (locationSubscriptionRef.current) {
                locationSubscriptionRef.current.remove(); // Remove location subscription
            }
        };
    }, [isTracking]);

    // Return tracking state and methods
    return { isTracking, startTracking, stopTracking, errorMsg };
}

//-----------------------------------------------------------//
//                          HELPERS                          //
//-----------------------------------------------------------//

// Helper function to calculate bounding box
//-----------------------------------------------------------//
function calculateBoundingBox(locationLogs: LocationLogData[]) {
    let minLatSoFar = 90;
    let minlngSoFar = 180;
    let maxLatSoFar = -90;
    let maxLngSoFar = -180;

    // Iterate through location logs to determine bounds
    locationLogs.forEach((log) => {
        if (log.latitude < minLatSoFar) minLatSoFar = log.latitude;
        if (log.latitude > maxLatSoFar) maxLatSoFar = log.latitude;
        if (log.longitude < minlngSoFar) minlngSoFar = log.longitude;
        if (log.longitude > maxLngSoFar) maxLngSoFar = log.longitude;
    });

    // Define viewport boundaries
    let viewport = new Viewport();
    viewport.low.latitude = minLatSoFar;
    viewport.low.longitude = minlngSoFar;
    viewport.high.latitude = maxLatSoFar;
    viewport.high.longitude = maxLngSoFar;

    return viewport;
}

// Helper function to generate a unique ID
//-----------------------------------------------------------//
function generateUniqueId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
//------------------------***EOF***-----------------------------//