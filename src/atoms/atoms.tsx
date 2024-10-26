import { atom } from "recoil";

export const trackingState = atom({
  key: "isTrackingState", // unique ID for this atom
  default: {
    isTracking: false, // boolean for tracking status
    organizationName: "", // string for organization name
  },
});

/**
 * Recoil state used to keep track of the elapsed time in seconds
 */
export const elapsed_time = atom({
  key: "elapsed_time",
  default: 0,
});

export const trackingStartTimeState = atom({
  key: "trackingStartTimeState",
  default: 0
});