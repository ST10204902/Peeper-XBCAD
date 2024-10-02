interface SessionLog {
  sessionLog_id: string;
  orgID: string;
  sessionStartTime: string; // ISO 8601 datetime
  sessionEndTime: string; // ISO 8601 datetime
  locationLogs: LocationLog[];
  viewport: Viewport;
}
