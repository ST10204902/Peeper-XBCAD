/**
 * This file defines the LocationLogData interface
 */

/**
 * LocationLogData interface represents the structure of location log data
 */
export interface LocationLogData {
  /** ISO 8601 datetime format for the timestamp of the log */
  timestamp: string;
  /** Latitude coordinate of the location */
  latitude: number;
  /** Longitude coordinate of the location */
  longitude: number;
  /** Accuracy of the location data in meters */
  accuracy: number;
  /** Altitude of the location in meters */
  altitude: number;
}
