import { LocationLogData } from "../LocationLogData";
import { ViewportData } from "../ViewportData";

export class Viewport implements ViewportData {
  low: { latitude: number; longitude: number };
  high: { latitude: number; longitude: number };

  constructor(
    data: ViewportData = {
      low: { latitude: 0, longitude: 0 },
      high: { latitude: 0, longitude: 0 },
    },
  ) {
    this.low = data.low;
    this.high = data.high;
  }

  toJSON(): ViewportData {
    return {
      low: this.low,
      high: this.high,
    };
  }

  // Helper function to calculate bounding box
  //-----------------------------------------------------------//
  static calculateBoundingBox(locationLogs: LocationLogData[]): Viewport {
    let minLatSoFar = 90;
    let minlngSoFar = 180;
    let maxLatSoFar = -90;
    let maxLngSoFar = -180;

    // Iterate through location logs to determine bounds
    locationLogs.forEach(log => {
      if (log.latitude < minLatSoFar) minLatSoFar = log.latitude;
      if (log.latitude > maxLatSoFar) maxLatSoFar = log.latitude;
      if (log.longitude < minlngSoFar) minlngSoFar = log.longitude;
      if (log.longitude > maxLngSoFar) maxLngSoFar = log.longitude;
    });

    // Define viewport boundaries
    const viewport = new Viewport();
    viewport.low.latitude = minLatSoFar;
    viewport.low.longitude = minlngSoFar;
    viewport.high.latitude = maxLatSoFar;
    viewport.high.longitude = maxLngSoFar;

    return viewport;
  }
}
