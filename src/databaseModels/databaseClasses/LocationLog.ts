import { LocationLogData } from '../LocationLogData';

export class LocationLog implements LocationLogData {
  timestamp: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number;

  constructor(data: LocationLogData) {
    this.timestamp = data.timestamp;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.accuracy = data.accuracy;
    this.altitude = data.altitude;
  }

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