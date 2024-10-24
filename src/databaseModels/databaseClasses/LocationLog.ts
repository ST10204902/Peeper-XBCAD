import { LocationLogData } from '../LocationLogData';

export class LocationLog implements LocationLogData {
  timestamp: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number;

  constructor(data: Partial<LocationLogData>) {
    this.timestamp = data.timestamp || new Date().toISOString();
    this.latitude = data.latitude || 0;
    this.longitude = data.longitude || 0;
    this.accuracy = data.accuracy || 0;
    this.altitude = data.altitude || 0;
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