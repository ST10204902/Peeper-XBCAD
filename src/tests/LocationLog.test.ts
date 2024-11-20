import { LocationLog } from "../databaseModels/databaseClasses/LocationLog";
import { LocationLogData } from "../databaseModels/LocationLogData";

describe("LocationLog Class", () => {
  const validTimestamp = "2024-03-20T10:00:00.000Z";
  describe("Constructor", () => {
    it("should initialize with complete valid data", () => {
      const logData: LocationLogData = {
        timestamp: validTimestamp,
        latitude: 40.7128,
        longitude: -74.006,
        accuracy: 10,
        altitude: 100,
      };

      const locationLog = new LocationLog(logData);

      expect(locationLog.timestamp).toBe(logData.timestamp);
      expect(locationLog.latitude).toBe(logData.latitude);
      expect(locationLog.longitude).toBe(logData.longitude);
      expect(locationLog.accuracy).toBe(logData.accuracy);
      expect(locationLog.altitude).toBe(logData.altitude);
    });

    it("should handle missing timestamp by using current time", () => {
      const logData: Partial<LocationLogData> = {
        latitude: 40.7128,
        longitude: -74.006,
        accuracy: 10,
        altitude: 100,
      };

      const beforeCreate = new Date();
      const locationLog = new LocationLog(logData);
      const afterCreate = new Date();

      const logTimestamp = new Date(locationLog.timestamp);
      expect(logTimestamp.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(logTimestamp.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });

    it("should handle empty timestamp string", () => {
      const logData: LocationLogData = {
        timestamp: "",
        latitude: 40.7128,
        longitude: -74.006,
        accuracy: 10,
        altitude: 100,
      };

      const locationLog = new LocationLog(logData);
      expect(locationLog.timestamp).not.toBe("");
      expect(new Date(locationLog.timestamp)).toBeInstanceOf(Date);
    });

    it("should handle null or undefined coordinates with defaults", () => {
      const logData: Partial<LocationLogData> = {
        timestamp: validTimestamp,
      };

      const locationLog = new LocationLog(logData);

      expect(locationLog.latitude).toBe(0);
      expect(locationLog.longitude).toBe(0);
      expect(locationLog.accuracy).toBe(0);
      expect(locationLog.altitude).toBe(0);
    });

    it("should handle NaN values in coordinates", () => {
      const logData: LocationLogData = {
        timestamp: validTimestamp,
        latitude: NaN,
        longitude: NaN,
        accuracy: NaN,
        altitude: NaN,
      };

      const locationLog = new LocationLog(logData);

      expect(locationLog.latitude).toBe(0);
      expect(locationLog.longitude).toBe(0);
      expect(locationLog.accuracy).toBe(0);
      expect(locationLog.altitude).toBe(0);
    });
  });

  describe("toJSON", () => {
    it("should correctly convert complete location log to JSON", () => {
      const logData: LocationLogData = {
        timestamp: validTimestamp,
        latitude: 40.7128,
        longitude: -74.006,
        accuracy: 10,
        altitude: 100,
      };

      const locationLog = new LocationLog(logData);
      const json = locationLog.toJSON();

      expect(json).toEqual(logData);
    });

    it("should include default values in JSON output", () => {
      const locationLog = new LocationLog({});
      const json = locationLog.toJSON();

      expect(json).toEqual({
        timestamp: expect.any(String),
        latitude: 0,
        longitude: 0,
        accuracy: 0,
        altitude: 0,
      });
    });

    it("should maintain data types in JSON output", () => {
      const logData: LocationLogData = {
        timestamp: validTimestamp,
        latitude: 40.7128,
        longitude: -74.006,
        accuracy: 10,
        altitude: 100,
      };

      const locationLog = new LocationLog(logData);
      const json = locationLog.toJSON();

      expect(typeof json.timestamp).toBe("string");
      expect(typeof json.latitude).toBe("number");
      expect(typeof json.longitude).toBe("number");
      expect(typeof json.accuracy).toBe("number");
      expect(typeof json.altitude).toBe("number");
    });
  });
});
