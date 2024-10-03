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
    this.locationLogs = data.locationLogs.map((log) => new LocationLog(log));
    this.viewport = new Viewport(data.viewport);
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
