/**
 * This file defines the SessionLogData interface and imports the LocationLogData and ViewportData interfaces
 */

import { LocationLogData } from "./LocationLogData";
import { ViewportData } from "./ViewportData";

/**
 * SessionLogData interface represents the structure of a session log
 */
export interface SessionLogData {
  /** Unique identifier for the session log */
  sessionLog_id: string;
  /** Unique identifier for the organization */
  orgID: string;
  /** ISO 8601 datetime format for the session start time */
  sessionStartTime: string;
  /** ISO 8601 datetime format for the session end time */
  sessionEndTime: string;
  /** Array of location logs, represented by LocationLogData interface */
  locationLogs: LocationLogData[];
  /** Viewport data of the session, represented by ViewportData interface */
  viewport: ViewportData;
}
