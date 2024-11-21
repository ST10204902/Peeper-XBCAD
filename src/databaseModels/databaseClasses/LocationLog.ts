import { LocationLogData } from "../LocationLogData";

/**
 * @class LocationLog
 * @implements {LocationLogData}
 * @description Represents a location log with properties such as timestamp, latitude, longitude, accuracy, and altitude.
 */
export class LocationLog implements LocationLogData {
  timestamp: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number;

  /**
   * @constructor
   * @param {Partial<LocationLogData>} data - The data to initialize the location log instance
   */
  constructor(data: Partial<LocationLogData>) {
    this.timestamp =
      data.timestamp !== null && data.timestamp !== undefined && data.timestamp !== ""
        ? data.timestamp
        : new Date().toISOString();

    this.latitude =
      data.latitude !== null && data.latitude !== undefined && !Number.isNaN(data.latitude)
        ? data.latitude
        : 0;

    this.longitude =
      data.longitude !== null && data.longitude !== undefined && !Number.isNaN(data.longitude)
        ? data.longitude
        : 0;

    this.accuracy =
      data.accuracy !== null && data.accuracy !== undefined && !Number.isNaN(data.accuracy)
        ? data.accuracy
        : 0;

    this.altitude =
      data.altitude !== null && data.altitude !== undefined && !Number.isNaN(data.altitude)
        ? data.altitude
        : 0;
  }

  /**
   * @method toJSON
   * @description Converts the location log instance to a JSON object
   * @returns {LocationLogData} The JSON representation of the location log instance
   */
  toJSON(): LocationLogData {
    return {
      timestamp: this.timestamp,
      latitude: this.latitude,
      longitude: this.longitude,
      accuracy: this.accuracy,
      altitude: this.altitude,
    };
  }
}
