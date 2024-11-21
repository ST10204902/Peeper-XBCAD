// This file defines Recoil atoms for managing state in the application

import { atom } from "recoil";

// Atom to manage the tracking state
export const trackingState = atom({
  key: "isTrackingState", // Unique ID for this atom
  default: {
    isTracking: false, // Boolean for tracking status
    organizationName: "", // String for organization name
  },
});

/**
 * Recoil state used to keep track of the elapsed time in seconds
 */
export const elapsed_time = atom({
  key: "elapsed_time", // Unique ID for this atom
  default: 0, // Default value for elapsed time
});

// Atom to manage the tracking start time
export const trackingStartTimeState = atom({
  key: "trackingStartTimeState", // Unique ID for this atom
  default: 0, // Default value for tracking start time
});
