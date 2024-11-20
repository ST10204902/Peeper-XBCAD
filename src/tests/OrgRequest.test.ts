import { OrgRequest } from "../databaseModels/databaseClasses/OrgRequest";
import { OrgRequestData } from "../databaseModels/OrgRequestData";
import { DatabaseUtility } from "../utils/DatabaseUtility";
import { OrgAddress } from "../databaseModels/databaseClasses/OrgAddress";
import { ApprovalStatus } from "../databaseModels/enums";
import { onValue, DataSnapshot } from "firebase/database";

// Mock Firebase modules
jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  get: jest.fn(),
  onValue: jest.fn(),
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

interface MockDataSnapshot extends Partial<DataSnapshot> {
  val: () => OrgRequestData;
}

describe("OrgRequest Class", () => {
  const validOrgAddress = {
    streetAddress: "123 Test St",
    suburb: "Test Suburb",
    city: "Test City",
    province: "Test Province",
    postalCode: "12345",
  };

  const validOrgRequestData: OrgRequestData = {
    request_id: "req123",
    studentIDs: ["student1", "student2"],
    org_id: "org123",
    name: "Test Organisation",
    orgAddress: validOrgAddress,
    email: "org@test.com",
    phoneNo: "1234567890",
    approvalStatus: ApprovalStatus.Pending,
    orgLatitude: -33.9,
    orgLongitude: 18.4,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Constructor", () => {
    it("should initialize with valid data", () => {
      const request = new OrgRequest(validOrgRequestData);

      expect(request.request_id).toBe(validOrgRequestData.request_id);
      expect(request.studentIDs).toEqual(validOrgRequestData.studentIDs);
      expect(request.org_id).toBe(validOrgRequestData.org_id);
      expect(request.name).toBe(validOrgRequestData.name);
      expect(request.orgAddress).toBeInstanceOf(OrgAddress);
      expect(request.email).toBe(validOrgRequestData.email);
      expect(request.phoneNo).toBe(validOrgRequestData.phoneNo);
      expect(request.approvalStatus).toBe(validOrgRequestData.approvalStatus);
      expect(request.orgLatitude).toBe(validOrgRequestData.orgLatitude);
      expect(request.orgLongitude).toBe(validOrgRequestData.orgLongitude);
    });

    it("should properly initialize OrgAddress instance", () => {
      const request = new OrgRequest(validOrgRequestData);
      expect(request.orgAddress.streetAddress).toBe(validOrgAddress.streetAddress);
      expect(request.orgAddress.suburb).toBe(validOrgAddress.suburb);
      expect(request.orgAddress.city).toBe(validOrgAddress.city);
    });
  });

  describe("CRUD Operations", () => {
    it("should fetch request by ID", async () => {
      (DatabaseUtility.getData as jest.Mock).mockResolvedValue(validOrgRequestData);

      const request = await OrgRequest.fetchById("req123");
      expect(request).toBeInstanceOf(OrgRequest);
      expect(request?.request_id).toBe("req123");
      expect(DatabaseUtility.getData).toHaveBeenCalledWith("orgRequests/req123");
    });

    it("should return null when fetching non-existent request", async () => {
      (DatabaseUtility.getData as jest.Mock).mockResolvedValue(null);

      const request = await OrgRequest.fetchById("nonexistent");
      expect(request).toBeNull();
    });

    it("should save request data", async () => {
      const request = new OrgRequest(validOrgRequestData);
      await request.save();

      expect(DatabaseUtility.setData).toHaveBeenCalledWith(
        `orgRequests/${request.request_id}`,
        request.toJSON(),
      );
    });

    it("should update request data", async () => {
      const request = new OrgRequest(validOrgRequestData);
      const updates = { approvalStatus: ApprovalStatus.Approved };

      await request.update(updates);
      expect(DatabaseUtility.updateData).toHaveBeenCalledWith(
        `orgRequests/${request.request_id}`,
        updates,
      );
    });

    it("should delete request data", async () => {
      const request = new OrgRequest(validOrgRequestData);
      await request.delete();

      expect(DatabaseUtility.deleteData).toHaveBeenCalledWith(`orgRequests/${request.request_id}`);
    });
  });

  describe("Static Methods", () => {
    it("should get all org requests", async () => {
      const requestDataArray = [
        validOrgRequestData,
        { ...validOrgRequestData, request_id: "req456" },
      ];
      (DatabaseUtility.getAllData as jest.Mock).mockResolvedValue(requestDataArray);

      const requests = await OrgRequest.getAllOrgRequests();
      expect(requests).toHaveLength(2);
      expect(requests[0]).toBeInstanceOf(OrgRequest);
      expect(DatabaseUtility.getAllData).toHaveBeenCalledWith("orgRequests");
    });

    it("should set up listener for student's requests", () => {
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();
      const studentNumber = "student1";

      (onValue as jest.Mock).mockImplementation((ref, callback) => {
        callback({
          forEach: (fn: (item: MockDataSnapshot) => void) => {
            fn({ val: () => validOrgRequestData });
          },
        });
        return mockUnsubscribe;
      });

      const unsubscribe = OrgRequest.listenToRequestsByStudentId(studentNumber, mockCallback);

      expect(mockCallback).toHaveBeenCalled();
      expect(typeof unsubscribe).toBe("function");

      // Test unsubscribe
      unsubscribe();
      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });

  describe("Data Conversion", () => {
    it("should correctly convert to JSON", () => {
      const request = new OrgRequest(validOrgRequestData);
      const json = request.toJSON();

      expect(json).toEqual({
        ...validOrgRequestData,
        orgAddress: expect.any(Object),
      });
      expect(json.orgAddress).toEqual(validOrgAddress);
    });
  });
});
