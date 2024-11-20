import { Viewport } from "../databaseModels/databaseClasses/Viewport";
import { LocationLogData } from "../databaseModels/LocationLogData";

describe("Viewport Class", () => {
  describe("Constructor", () => {
    it("should initialize with provided coordinates", () => {
      const viewportData = {
        low: { latitude: -33.9, longitude: 18.4 },
        high: { latitude: -33.8, longitude: 18.5 },
      };

      const viewport = new Viewport(viewportData);

      expect(viewport.low).toEqual(viewportData.low);
      expect(viewport.high).toEqual(viewportData.high);
    });

    it("should initialize with default values when no data provided", () => {
      const viewport = new Viewport();

      expect(viewport.low).toEqual({ latitude: 0, longitude: 0 });
      expect(viewport.high).toEqual({ latitude: 0, longitude: 0 });
    });
  });

  describe("toJSON", () => {
    it("should correctly convert viewport to JSON", () => {
      const viewportData = {
        low: { latitude: -33.9, longitude: 18.4 },
        high: { latitude: -33.8, longitude: 18.5 },
      };

      const viewport = new Viewport(viewportData);
      const json = viewport.toJSON();

      expect(json).toEqual(viewportData);
    });
  });

  describe("calculateBoundingBox", () => {
    it("should calculate correct bounding box for multiple location logs", () => {
      const locationLogs: LocationLogData[] = [
        {
          timestamp: "2024-03-20T10:00:00.000Z",
          latitude: -33.9,
          longitude: 18.4,
          accuracy: 10,
          altitude: 0,
        },
        {
          timestamp: "2024-03-20T10:01:00.000Z",
          latitude: -33.8,
          longitude: 18.5,
          accuracy: 10,
          altitude: 0,
        },
        {
          timestamp: "2024-03-20T10:02:00.000Z",
          latitude: -33.85,
          longitude: 18.45,
          accuracy: 10,
          altitude: 0,
        },
      ];

      const viewport = Viewport.calculateBoundingBox(locationLogs);

      expect(viewport.low.latitude).toBe(-33.9); // Southernmost point
      expect(viewport.low.longitude).toBe(18.4); // Westernmost point
      expect(viewport.high.latitude).toBe(-33.8); // Northernmost point
      expect(viewport.high.longitude).toBe(18.5); // Easternmost point
    });

    it("should handle single location log", () => {
      const locationLogs: LocationLogData[] = [
        {
          timestamp: "2024-03-20T10:00:00.000Z",
          latitude: -33.9,
          longitude: 18.4,
          accuracy: 10,
          altitude: 0,
        },
      ];

      const viewport = Viewport.calculateBoundingBox(locationLogs);

      expect(viewport.low.latitude).toBe(-33.9);
      expect(viewport.low.longitude).toBe(18.4);
      expect(viewport.high.latitude).toBe(-33.9);
      expect(viewport.high.longitude).toBe(18.4);
    });

    it("should handle empty location logs array", () => {
      const locationLogs: LocationLogData[] = [];

      const viewport = Viewport.calculateBoundingBox(locationLogs);

      // Should return viewport with default values
      expect(viewport.low.latitude).toBe(90); // Initial minLatSoFar
      expect(viewport.low.longitude).toBe(180); // Initial minlngSoFar
      expect(viewport.high.latitude).toBe(-90); // Initial maxLatSoFar
      expect(viewport.high.longitude).toBe(-180); // Initial maxLngSoFar
    });

    it("should handle location logs across the 180th meridian", () => {
      const locationLogs: LocationLogData[] = [
        {
          timestamp: "2024-03-20T10:00:00.000Z",
          latitude: 0,
          longitude: 179,
          accuracy: 10,
          altitude: 0,
        },
        {
          timestamp: "2024-03-20T10:01:00.000Z",
          latitude: 0,
          longitude: -179,
          accuracy: 10,
          altitude: 0,
        },
      ];

      const viewport = Viewport.calculateBoundingBox(locationLogs);

      expect(viewport.low.latitude).toBe(0);
      expect(viewport.low.longitude).toBe(-179);
      expect(viewport.high.latitude).toBe(0);
      expect(viewport.high.longitude).toBe(179);
    });
  });
});
