import MyMaths from "../utils/MyMaths";
import { Student } from "../databaseModels/databaseClasses/Student";
import { StudentData } from "../databaseModels/StudentData";

describe("MyMaths", () => {
  describe("calculateTotalLoggedHours", () => {
    it("should calculate total hours correctly for multiple sessions", () => {
      // Create mock student data with multiple sessions
      const mockStudentData: StudentData = {
        student_id: "test123",
        studentNumber: "ST123",
        email: "test@example.com",
        activeOrgs: [],
        locationData: {
          session1: {
            sessionLog_id: "session1",
            orgID: "org1",
            sessionStartTime: "2024-03-20T10:00:00.000Z",
            sessionEndTime: "2024-03-20T12:00:00.000Z",
            locationLogs: [],
            viewport: {
              low: { latitude: 0, longitude: 0 },
              high: { latitude: 0, longitude: 0 },
            },
          },
          session2: {
            sessionLog_id: "session2",
            orgID: "org1",
            sessionStartTime: "2024-03-20T14:00:00.000Z",
            sessionEndTime: "2024-03-20T17:00:00.000Z",
            locationLogs: [],
            viewport: {
              low: { latitude: 0, longitude: 0 },
              high: { latitude: 0, longitude: 0 },
            },
          },
        },
        darkMode: false,
      };

      const student = new Student(mockStudentData);
      const totalHours = MyMaths.calculateTotalLoggedHours(student);

      // First session: 2 hours, Second session: 3 hours
      expect(totalHours).toBe(5);
    });

    it("should return 0 for student with no sessions", () => {
      const mockStudentData: StudentData = {
        student_id: "test123",
        studentNumber: "ST123",
        email: "test@example.com",
        activeOrgs: [],
        locationData: {},
        darkMode: false,
      };

      const student = new Student(mockStudentData);
      const totalHours = MyMaths.calculateTotalLoggedHours(student);
      expect(totalHours).toBe(0);
    });

    it("should handle sessions with missing end time", () => {
      const mockStudentData: StudentData = {
        student_id: "test123",
        studentNumber: "ST123",
        email: "test@example.com",
        activeOrgs: [],
        locationData: {
          session1: {
            sessionLog_id: "session1",
            orgID: "org1",
            sessionStartTime: "2024-03-20T10:00:00.000Z",
            sessionEndTime: "2024-03-20T10:00:00.000Z", // Same as start time
            locationLogs: [],
            viewport: {
              low: { latitude: 0, longitude: 0 },
              high: { latitude: 0, longitude: 0 },
            },
          },
        },
        darkMode: false,
      };

      const student = new Student(mockStudentData);
      const totalHours = MyMaths.calculateTotalLoggedHours(student);
      expect(totalHours).toBe(0);
    });
  });

  describe("haversineDistance", () => {
    it("should calculate distance between two points correctly", () => {
      // Test coordinates (New York to Los Angeles, approximate)
      const nyLat = 40.7128;
      const nyLon = -74.006;
      const laLat = 34.0522;
      const laLon = -118.2437;

      const distance = MyMaths.haversineDistance(nyLat, nyLon, laLat, laLon);

      // Expected distance is approximately 3935 km
      expect(distance).toBeCloseTo(3935, -2); // Using -2 as precision to allow for small variations
    });

    it("should return 0 for same coordinates", () => {
      const lat = 40.7128;
      const lon = -74.006;

      const distance = MyMaths.haversineDistance(lat, lon, lat, lon);
      expect(distance).toBe(0);
    });

    it("should handle antipodal points", () => {
      // Points on opposite sides of the Earth
      const distance = MyMaths.haversineDistance(0, 0, 0, 180);

      // Should be approximately half the Earth's circumference (20015 km)
      expect(distance).toBeCloseTo(20015, -1);
    });
  });
});
