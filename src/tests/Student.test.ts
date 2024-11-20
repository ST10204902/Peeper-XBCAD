import { Student } from "../databaseModels/databaseClasses/Student";
import { StudentData } from "../databaseModels/StudentData";
import { DatabaseUtility } from "../utils/DatabaseUtility";
import { SessionLog } from "../databaseModels/databaseClasses/SessionLog";
import { LocationLog } from "../databaseModels/databaseClasses/LocationLog";

// Mock Firebase modules
jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  get: jest.fn(),
}));

// Mock Firebase config
jest.mock("../firebase/firebaseConfig", () => ({
  app: {},
  database: {},
  firebaseConfig: {
    apiKey: "mock-api-key",
    authDomain: "mock-auth-domain",
    databaseURL: "mock-database-url",
    projectId: "mock-project-id",
    storageBucket: "mock-storage-bucket",
    messagingSenderId: "mock-sender-id",
    appId: "mock-app-id",
    measurementId: "mock-measurement-id",
  },
}));

// Mock the DatabaseUtility
jest.mock("../utils/DatabaseUtility");

describe("Student Class", () => {
  const validLocationLog = {
    timestamp: "2024-03-20T10:00:00.000Z",
    latitude: -33.9,
    longitude: 18.4,
    accuracy: 10,
    altitude: 100,
  };

  const validSessionLog = {
    sessionLog_id: "session123",
    orgID: "org123",
    sessionStartTime: "2024-03-20T10:00:00.000Z",
    sessionEndTime: "2024-03-20T12:00:00.000Z",
    locationLogs: [validLocationLog],
    viewport: {
      low: { latitude: -34.0, longitude: 18.3 },
      high: { latitude: -33.8, longitude: 18.5 },
    },
  };

  const validStudentData: StudentData = {
    student_id: "student123",
    studentNumber: "ST123456",
    email: "student@example.com",
    profilePhotoId: "avatar_1",
    activeOrgs: ["org123", "org456"],
    locationData: {
      session123: validSessionLog,
    },
    darkMode: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Constructor", () => {
    it("should initialize with complete valid data", () => {
      const student = new Student(validStudentData);

      expect(student.student_id).toBe(validStudentData.student_id);
      expect(student.studentNumber).toBe(validStudentData.studentNumber);
      expect(student.email).toBe(validStudentData.email);
      expect(student.profilePhotoId).toBe(validStudentData.profilePhotoId);
      expect(student.activeOrgs).toEqual(validStudentData.activeOrgs);
      expect(student.darkMode).toBe(validStudentData.darkMode);
    });

    it("should initialize SessionLog instances for location data", () => {
      const student = new Student(validStudentData);
      const sessionLog = student.locationData.session123;

      expect(sessionLog).toBeInstanceOf(SessionLog);
      expect(sessionLog.locationLogs[0]).toBeInstanceOf(LocationLog);
    });

    it("should handle missing optional fields", () => {
      const minimalData: StudentData = {
        student_id: "student123",
        studentNumber: "ST123456",
        email: "student@example.com",
        activeOrgs: [],
        locationData: {},
        darkMode: false,
      };

      const student = new Student(minimalData);
      expect(student.profilePhotoId).toBe("");
      expect(student.activeOrgs).toEqual([]);
      expect(Object.keys(student.locationData)).toHaveLength(0);
    });

    it("should handle empty location data", () => {
      const studentData = { ...validStudentData, locationData: {} };
      const student = new Student(studentData);
      expect(Object.keys(student.locationData)).toHaveLength(0);
    });
  });

  describe("CRUD Operations", () => {
    it("should fetch student by ID", async () => {
      (DatabaseUtility.getData as jest.Mock).mockResolvedValue(validStudentData);

      const student = await Student.fetchById("student123");
      expect(student).toBeInstanceOf(Student);
      expect(student?.student_id).toBe("student123");
      expect(DatabaseUtility.getData).toHaveBeenCalledWith("students/student123");
    });

    it("should return null when fetching non-existent student", async () => {
      (DatabaseUtility.getData as jest.Mock).mockResolvedValue(null);

      const student = await Student.fetchById("nonexistent");
      expect(student).toBeNull();
    });

    it("should save student data", async () => {
      const student = new Student(validStudentData);
      await student.save();

      expect(DatabaseUtility.setData).toHaveBeenCalledWith(
        `students/${student.student_id}`,
        student.toJSON(),
      );
    });

    it("should update student data", async () => {
      const student = new Student(validStudentData);
      const updates = { email: "newemail@example.com" };

      await student.update(updates);
      expect(DatabaseUtility.updateData).toHaveBeenCalledWith(
        `students/${student.student_id}`,
        updates,
      );
    });

    it("should delete student data", async () => {
      const student = new Student(validStudentData);
      await student.delete();

      expect(DatabaseUtility.deleteData).toHaveBeenCalledWith(`students/${student.student_id}`);
    });
  });

  describe("Data Conversion", () => {
    it("should correctly convert to JSON", () => {
      const student = new Student(validStudentData);
      const json = student.toJSON();

      expect(json).toEqual({
        ...validStudentData,
        locationData: expect.any(Object),
      });
    });

    it("should properly convert nested SessionLog objects", () => {
      const student = new Student(validStudentData);
      const json = student.toJSON();

      expect(json.locationData.session123).toEqual(
        expect.objectContaining({
          sessionLog_id: validSessionLog.sessionLog_id,
          orgID: validSessionLog.orgID,
          sessionStartTime: validSessionLog.sessionStartTime,
          sessionEndTime: validSessionLog.sessionEndTime,
        }),
      );
    });

    it("should maintain correct data types in JSON output", () => {
      const student = new Student(validStudentData);
      const json = student.toJSON();

      expect(typeof json.student_id).toBe("string");
      expect(typeof json.email).toBe("string");
      expect(Array.isArray(json.activeOrgs)).toBe(true);
      expect(typeof json.darkMode).toBe("boolean");
      expect(typeof json.locationData).toBe("object");
    });
  });
});
