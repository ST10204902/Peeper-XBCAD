/**
 * This file defines the ViewportData interface
 */

/**
 * ViewportData interface represents the structure of viewport data
 */
export interface ViewportData {
  low: {
    /** Latitude coordinate of the lower bound of the viewport */
    latitude: number;
    /** Longitude coordinate of the lower bound of the viewport */
    longitude: number;
  };
  high: {
    /** Latitude coordinate of the upper bound of the viewport */
    latitude: number;
    /** Longitude coordinate of the upper bound of the viewport */
    longitude: number;
  };
}
