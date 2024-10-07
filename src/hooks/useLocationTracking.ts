import { useState, useEffect, useRef } from 'react';
import * as ExpoLocation from 'expo-location';
import { SessionLog } from '../databaseModels/databaseClasses/SessionLog';
import { LocationLog } from '../databaseModels/databaseClasses/LocationLog';
import { Student } from '../databaseModels/databaseClasses/Student';
import { Organisation } from '../databaseModels/databaseClasses/Organisation';
import { LocationLogData } from '../databaseModels/LocationLogData';
import { Viewport } from '../databaseModels/databaseClasses/Viewport';

export function useLocationTracking() {
    const [isTracking, setIsTracking] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const locationSubscriptionRef = useRef<any>(null); // Store subscription reference for cleanup
    const sessionLogRef = useRef<SessionLog | null>(null); // Ref to hold the latest session log
    const studentRef = useRef<Student | null>(null);

    const startTracking = async (student: Student, organisation: Organisation) => {
        console.log('Starting tracking called');
        // bad things happen when the user is able to start tracking multiple times
        if (isTracking) {
            setErrorMsg('Tracking already in progress');
            return;
        }

        // Request permissions
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

        // if the permissions are granted, start tracking
        setIsTracking(true);

        // Create a new session log
        const newSessionID = generateUniqueId();
        const newSessionLog = new SessionLog({
            sessionLog_id: newSessionID,
            orgID: organisation.org_id,
            sessionStartTime: new Date().toISOString(),
            sessionEndTime: '',
            locationLogs: [],
            viewport: { low: { latitude: 0, longitude: 0 }, high: { latitude: 0, longitude: 0 } }
        });

        // Save the session log to the database
        student.locationData[newSessionID] = newSessionLog;
        console.log('Current student set: ', student);

        // Save the session log to the ref for future use
        sessionLogRef.current = newSessionLog;
        studentRef.current = student;
        

        await student.save().then(() => {
        console.log('Session log saved to student');
        });

        // Start tracking the location every 5 seconds
        locationSubscriptionRef.current = await ExpoLocation.watchPositionAsync(
            { accuracy: ExpoLocation.Accuracy.High, timeInterval: 5000, distanceInterval: 0 },
            handleLocationUpdate
        );
    };

    const stopTracking = async () => {
        console.log('Stopping tracking called');
       
        const currentSessionLog = sessionLogRef.current;
        if (!currentSessionLog) {
            setErrorMsg('No session log found while stopping tracking');
            return;
        }

        const currentStudent = studentRef.current;
        if (!currentStudent) {
            setErrorMsg('No student found while stopping tracking');
            return;
        }

        // if all the checks pass, stop tracking
        setIsTracking(false);

        // Add session end time and calculate viewport (bounding box)
        currentSessionLog.sessionEndTime = new Date().toISOString();

        // Calculate the bounding box
        const boundingBox = calculateBoundingBox(currentSessionLog.locationLogs);

        // setting the viewport like this cos i don't trust anything anymore
        currentSessionLog.viewport.high = boundingBox.high;
        currentSessionLog.viewport.low = boundingBox.low;

        // Save updated session log to the student model
        currentStudent.locationData[currentSessionLog.sessionLog_id] = currentSessionLog;

        await currentStudent.save().then(() => {
            console.log('Session log saved to student while stopping tracking');
        });

        // Clean up location subscription
        if (locationSubscriptionRef.current) {
            locationSubscriptionRef.current.remove();
            locationSubscriptionRef.current = null;
        }

        const toReturn =  JSON.parse(JSON.stringify(sessionLogRef.current)) as typeof sessionLogRef.current;
        sessionLogRef.current = null; // Reset the session log ref

        return toReturn;
    };

    function handleLocationUpdate(location: ExpoLocation.LocationObject) {
        console.log('handleLocationUpdate was called');

        const currentSessionLog = sessionLogRef.current;
        if (!currentSessionLog) {
            console.log('No session log found while updating location');
            return;
        }
        
        const currentStudent = studentRef.current;
        if (!currentStudent) {
            console.log('Current student not found while updating location');
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

        currentStudent.save().then(() => {
            console.log('New location log saved to student');
        });
    }

    useEffect(() => {
        if (isTracking) {
            console.log('Tracking in progress...');
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
    let minLatSoFar = 90;
    let minlngSoFar = 180;
    let maxLatSoFar = -90;
    let maxLngSoFar = -180;
  
    locationLogs.forEach((log) => {
      if (log.latitude < minLatSoFar) minLatSoFar = log.latitude;
      if (log.latitude > maxLatSoFar) maxLatSoFar = log.latitude;
      if (log.longitude < minlngSoFar) minlngSoFar = log.longitude;
      if (log.longitude > maxLngSoFar) maxLngSoFar = log.longitude;
    });

    //TODO: Add some padding to the viewport
  
    let viewport = new Viewport();
    viewport.low.latitude = minLatSoFar;
    viewport.low.longitude = minlngSoFar;
    viewport.high.latitude = maxLatSoFar;
    viewport.high.longitude = maxLngSoFar;

    return viewport;
  }

  // Helper function to generate a unique ID (chat generated)
function generateUniqueId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}