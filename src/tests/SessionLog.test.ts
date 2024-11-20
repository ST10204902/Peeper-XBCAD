import { SessionLog } from "../databaseModels/databaseClasses/SessionLog";
import { SessionLogData } from "../databaseModels/SessionLogData";
import { LocationLog } from "../databaseModels/databaseClasses/LocationLog";
import { Viewport } from "../databaseModels/databaseClasses/Viewport";

describe("SessionLog Class", () => {
  const validLocationLog = {
    timestamp: "2024-03-20T10:00:00.000Z",
    latitude: -33.9,
    longitude: 18.4,
    accuracy: 10,
    altitude: 100,
  };

  const validViewport = {
    low: { latitude: -34.0, longitude: 18.3 },
    high: { latitude: -33.8, longitude: 18.5 },
  };

  const validSessionData: SessionLogData = {
    sessionLog_id: "session123",
    orgID: "org123",
    sessionStartTime: "2024-03-20T10:00:00.000Z",
    sessionEndTime: "2024-03-20T12:00:00.000Z",
    locationLogs: [validLocationLog],
    viewport: validViewport,
  };

  describe("Constructor", () => {
    it("should initialize with complete valid data", () => {
      const sessionLog = new SessionLog(validSessionData);

      expect(sessionLog.sessionLog_id).toBe(validSessionData.sessionLog_id);
      expect(sessionLog.orgID).toBe(validSessionData.orgID);
      expect(sessionLog.sessionStartTime).toBe(validSessionData.sessionStartTime);
      expect(sessionLog.sessionEndTime).toBe(validSessionData.sessionEndTime);
      expect(sessionLog.locationLogs[0]).toBeInstanceOf(LocationLog);
      expect(sessionLog.viewport).toBeInstanceOf(Viewport);
    });

    it("should handle missing orgID with default value", () => {
      const testData: SessionLogData = {
        sessionLog_id: validSessionData.sessionLog_id,
        orgID: "" as string,
        sessionStartTime: validSessionData.sessionStartTime,
        sessionEndTime: validSessionData.sessionEndTime,
        locationLogs: validSessionData.locationLogs,
        viewport: validSessionData.viewport,
      };
      const sessionLog = new SessionLog(testData);
      expect(sessionLog.orgID).toBe("");
    });

    it("should handle empty location logs array", () => {
      const sessionData = { ...validSessionData, locationLogs: [] };
      const sessionLog = new SessionLog(sessionData);
      expect(sessionLog.locationLogs).toEqual([]);
    });

    it("should handle missing location logs with empty array", () => {
      const testData: SessionLogData = {
        sessionLog_id: validSessionData.sessionLog_id,
        orgID: validSessionData.orgID,
        sessionStartTime: validSessionData.sessionStartTime,
        sessionEndTime: validSessionData.sessionEndTime,
        locationLogs: [],
        viewport: validSessionData.viewport,
      };
      const sessionLog = new SessionLog(testData);
      expect(sessionLog.locationLogs).toEqual([]);
    });

    it("should initialize viewport with default values when missing", () => {
      const testData: SessionLogData = {
        sessionLog_id: validSessionData.sessionLog_id,
        orgID: validSessionData.orgID,
        sessionStartTime: validSessionData.sessionStartTime,
        sessionEndTime: validSessionData.sessionEndTime,
        locationLogs: validSessionData.locationLogs,
        viewport: { low: { latitude: 0, longitude: 0 }, high: { latitude: 0, longitude: 0 } },
      };
      const sessionLog = new SessionLog(testData);
      expect(sessionLog.viewport).toBeInstanceOf(Viewport);
      expect(sessionLog.viewport.low).toEqual({ latitude: 0, longitude: 0 });
      expect(sessionLog.viewport.high).toEqual({ latitude: 0, longitude: 0 });
    });
  });

  describe("Data Conversion", () => {
    it("should correctly convert complete session log to JSON", () => {
      const sessionLog = new SessionLog(validSessionData);
      const json = sessionLog.toJSON();

      expect(json).toEqual({
        ...validSessionData,
        locationLogs: [expect.any(Object)],
        viewport: expect.any(Object),
      });
    });

    it("should include empty arrays in JSON output", () => {
      const sessionData = { ...validSessionData, locationLogs: [] };
      const sessionLog = new SessionLog(sessionData);
      const json = sessionLog.toJSON();

      expect(json.locationLogs).toEqual([]);
    });

    it("should properly convert nested LocationLog objects", () => {
      const sessionLog = new SessionLog(validSessionData);
      const json = sessionLog.toJSON();

      expect(json.locationLogs[0]).toEqual(validLocationLog);
    });

    it("should properly convert nested Viewport object", () => {
      const sessionLog = new SessionLog(validSessionData);
      const json = sessionLog.toJSON();

      expect(json.viewport).toEqual(validViewport);
    });

    it("should maintain correct data types in JSON output", () => {
      const sessionLog = new SessionLog(validSessionData);
      const json = sessionLog.toJSON();

      expect(typeof json.sessionLog_id).toBe("string");
      expect(typeof json.orgID).toBe("string");
      expect(typeof json.sessionStartTime).toBe("string");
      expect(typeof json.sessionEndTime).toBe("string");
      expect(Array.isArray(json.locationLogs)).toBe(true);
      expect(typeof json.viewport).toBe("object");
    });
  });
});
