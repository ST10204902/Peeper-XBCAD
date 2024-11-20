import { Organisation } from "../databaseModels/databaseClasses/Organisation";
import { OrganisationData } from "../databaseModels/OrganisationData";
import { DatabaseUtility } from "../utils/DatabaseUtility";
import { OrgAddress } from "../databaseModels/databaseClasses/OrgAddress";
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
  val: () => OrganisationData;
}

describe("Organisation Class", () => {
  const validOrgAddress = {
    streetAddress: "123 Test St",
    suburb: "Test Suburb",
    city: "Test City",
    province: "Test Province",
    postalCode: "12345",
  };

  const validOrgData: OrganisationData = {
    org_id: "org123",
    orgName: "Test Organisation",
    orgAddress: validOrgAddress,
    orgEmail: "org@test.com",
    orgPhoneNo: "1234567890",
    orgLatitude: -33.9,
    orgLongitude: 18.4,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Constructor", () => {
    it("should initialize with valid data", () => {
      const org = new Organisation(validOrgData);

      expect(org.org_id).toBe(validOrgData.org_id);
      expect(org.orgName).toBe(validOrgData.orgName);
      expect(org.orgAddress).toBeInstanceOf(OrgAddress);
      expect(org.orgEmail).toBe(validOrgData.orgEmail);
      expect(org.orgPhoneNo).toBe(validOrgData.orgPhoneNo);
      expect(org.orgLatitude).toBe(validOrgData.orgLatitude);
      expect(org.orgLongitude).toBe(validOrgData.orgLongitude);
    });

    it("should properly initialize OrgAddress instance", () => {
      const org = new Organisation(validOrgData);
      expect(org.orgAddress.streetAddress).toBe(validOrgAddress.streetAddress);
      expect(org.orgAddress.suburb).toBe(validOrgAddress.suburb);
      expect(org.orgAddress.city).toBe(validOrgAddress.city);
    });
  });

  describe("CRUD Operations", () => {
    it("should fetch organisation by ID", async () => {
      (DatabaseUtility.getData as jest.Mock).mockResolvedValue(validOrgData);

      const org = await Organisation.fetchById("org123");
      expect(org).toBeInstanceOf(Organisation);
      expect(org?.org_id).toBe("org123");
      expect(DatabaseUtility.getData).toHaveBeenCalledWith("organisations/org123");
    });

    it("should return null when fetching non-existent organisation", async () => {
      (DatabaseUtility.getData as jest.Mock).mockResolvedValue(null);

      const org = await Organisation.fetchById("nonexistent");
      expect(org).toBeNull();
    });

    it("should save organisation data", async () => {
      const org = new Organisation(validOrgData);
      await org.save();

      expect(DatabaseUtility.setData).toHaveBeenCalledWith(
        `organisations/${org.org_id}`,
        org.toJSON(),
      );
    });

    it("should update organisation data", async () => {
      const org = new Organisation(validOrgData);
      const updates = { orgName: "Updated Name" };

      await org.update(updates);
      expect(DatabaseUtility.updateData).toHaveBeenCalledWith(
        `organisations/${org.org_id}`,
        updates,
      );
    });

    it("should delete organisation data", async () => {
      const org = new Organisation(validOrgData);
      await org.delete();

      expect(DatabaseUtility.deleteData).toHaveBeenCalledWith(`organisations/${org.org_id}`);
    });
  });

  describe("Static Methods", () => {
    it("should get all organisations", async () => {
      const orgDataArray = [validOrgData, { ...validOrgData, org_id: "org456" }];
      (DatabaseUtility.getAllData as jest.Mock).mockResolvedValue(orgDataArray);

      const orgs = await Organisation.getAllOrganisations();
      expect(orgs).toHaveLength(2);
      expect(orgs[0]).toBeInstanceOf(Organisation);
      expect(DatabaseUtility.getAllData).toHaveBeenCalledWith("organisations");
    });

    it("should get student's organisations", async () => {
      const orgIds = ["org123", "org456"];
      (DatabaseUtility.getData as jest.Mock)
        .mockResolvedValueOnce(validOrgData)
        .mockResolvedValueOnce({ ...validOrgData, org_id: "org456" });

      const orgs = await Organisation.getStudentsOrgs(orgIds);
      expect(orgs).toHaveLength(2);
      expect(orgs[0].org_id).toBe("org123");
      expect(orgs[1].org_id).toBe("org456");
    });

    it("should set up listener for all organisations", () => {
      const mockCallback = jest.fn();
      const mockUnsubscribe = jest.fn();
      (onValue as jest.Mock).mockImplementation((ref, callback) => {
        callback({
          forEach: (fn: (item: MockDataSnapshot) => void) => {
            fn({ val: () => validOrgData });
          },
        });
        return mockUnsubscribe;
      });

      const unsubscribe = Organisation.listenToAllOrganisations(mockCallback);

      expect(mockCallback).toHaveBeenCalled();
      expect(typeof unsubscribe).toBe("function");

      // Test unsubscribe
      unsubscribe();
      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });

  describe("Data Conversion", () => {
    it("should correctly convert to JSON", () => {
      const org = new Organisation(validOrgData);
      const json = org.toJSON();

      expect(json).toEqual({
        ...validOrgData,
        orgAddress: expect.any(Object),
      });
      expect(json.orgAddress).toEqual(validOrgAddress);
    });
  });
});
