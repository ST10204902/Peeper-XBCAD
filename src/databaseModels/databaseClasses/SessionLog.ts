// SessionLog.ts
import { SessionLogData } from "../SessionLogData";
import { LocationLog } from "./LocationLog";
import { Viewport } from "./Viewport";

export class SessionLog implements SessionLogData {
  sessionLog_id: string;
  orgID: string;
  sessionStartTime: string;
  sessionEndTime: string;
  locationLogs: LocationLog[];
  viewport: Viewport;

  constructor(data: SessionLogData) {
    this.sessionLog_id = data.sessionLog_id;
    this.orgID = data.orgID;
    this.sessionStartTime = data.sessionStartTime;
    this.sessionEndTime = data.sessionEndTime;
     // Check if locationLogs exists and is an array
    this.locationLogs = Array.isArray(data.locationLogs) 
    ? data.locationLogs.map((log) => new LocationLog(log)) 
    :[] ;  // Default to an empty array if it's undefined or not an array
     // Safeguard against undefined viewport
    this.viewport = data.viewport ? new Viewport(data.viewport) : new Viewport({ low: { latitude: 0, longitude: 0 }, high: { latitude: 0, longitude: 0 } });
  }

  toJSON(): SessionLogData {
    return {
      sessionLog_id: this.sessionLog_id,
      orgID: this.orgID,
      sessionStartTime: this.sessionStartTime,
      sessionEndTime: this.sessionEndTime,
      locationLogs: this.locationLogs.map((log) => log.toJSON()),
      viewport: this.viewport.toJSON(),
    };
  }
}
