import { ViewportData } from '../ViewportData';

export class Viewport implements ViewportData {
  low: { latitude: number; longitude: number };
  high: { latitude: number; longitude: number };

  constructor(data: ViewportData = { low: { latitude: 0, longitude: 0 }, high: { latitude: 0, longitude: 0 } }) {
    this.low = data.low;
    this.high = data.high;
  }

  toJSON(): ViewportData {
    return {
      low: this.low,
      high: this.high,
    };
  }
}