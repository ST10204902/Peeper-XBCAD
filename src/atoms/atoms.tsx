import { atom } from "recoil";

/**
 * Recoil state used to keep track of whether the user is currently
 * tracking their location.
 */
export const isTrackingState = atom({
  key: "isTrackingState", // unique ID for this atom
  default: false, // initial state value
});

/**
 * Recoil state used to keep track of the elapsed time in seconds
 */
export const elapsed_time = atom({
  key: "elapsed_time",
  default: 0,
});
