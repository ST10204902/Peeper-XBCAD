import { Admin } from "../databaseModels/databaseClasses/Admin";
import { AdminType } from "../databaseModels/enums";
import { AdminData } from "../databaseModels/AdminData";
import { DatabaseUtility } from "../utils/DatabaseUtility";

// Mock the DatabaseUtility
jest.mock("../utils/DatabaseUtility");

// Describe block for grouping relatest tests for the Admin class
describe("Admin Class", () => {
  // Valid admin data for testing
  const validAdminData: AdminData = {
    admin_id: "1",
    email: "admin@example.com",
    adminType: AdminType.SuperAdmin,
    viewableStudents: ["student1", "student2"],
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("Constructor", () => {
    it("should initialize properties correctly", () => {
      const admin = new Admin(validAdminData);

      expect(admin.admin_id).toBe(validAdminData.admin_id);
      expect(admin.email).toBe(validAdminData.email);
      expect(admin.adminType).toBe(validAdminData.adminType);
      expect(admin.viewableStudents).toEqual(validAdminData.viewableStudents);
    });

    it("should handle empty viewableStudents array", () => {
      const adminData = { ...validAdminData, viewableStudents: [] };
      const admin = new Admin(adminData);
      expect(admin.viewableStudents).toEqual([]);
    });

    it("should validate email format", () => {
      const invalidData: AdminData = {
        ...validAdminData,
        email: "invalid-email",
      };
      expect(() => new Admin(invalidData)).toThrow("Invalid email format");
    });

    it("should accept valid email formats", () => {
      const validEmails = ["test@example.com", "user.name@domain.com", "user+label@domain.co.uk"];

      validEmails.forEach(email => {
        expect(() => new Admin({ ...validAdminData, email })).not.toThrow();
      });
    });
  });

  describe("CRUD Operations", () => {
    it("should fetch admin by ID", async () => {
      (DatabaseUtility.getData as jest.Mock).mockResolvedValue(validAdminData);

      const admin = await Admin.fetchById("1");
      expect(admin).toBeInstanceOf(Admin);
      expect(admin?.admin_id).toBe("1");
      expect(DatabaseUtility.getData).toHaveBeenCalledWith("admins/1");
    });

    it("should return null when fetching non-existent admin", async () => {
      (DatabaseUtility.getData as jest.Mock).mockResolvedValue(null);

      const admin = await Admin.fetchById("nonexistent");
      expect(admin).toBeNull();
    });

    it("should save admin data", async () => {
      const admin = new Admin(validAdminData);
      await admin.save();

      expect(DatabaseUtility.setData).toHaveBeenCalledWith(
        `admins/${admin.admin_id}`,
        admin.toJSON(),
      );
    });

    it("should update admin data", async () => {
      const admin = new Admin(validAdminData);
      const updates = { email: "newemail@example.com" };

      await admin.update(updates);
      expect(DatabaseUtility.updateData).toHaveBeenCalledWith(`admins/${admin.admin_id}`, updates);
    });

    it("should validate email during update", async () => {
      const admin = new Admin(validAdminData);
      const updates = { email: "invalid-email" };

      await expect(admin.update(updates)).rejects.toThrow("Invalid email format");
    });

    it("should delete admin data", async () => {
      const admin = new Admin(validAdminData);
      await admin.delete();

      expect(DatabaseUtility.deleteData).toHaveBeenCalledWith(`admins/${admin.admin_id}`);
    });
  });

  describe("Data Conversion", () => {
    it("should correctly convert to JSON", () => {
      const admin = new Admin(validAdminData);
      const json = admin.toJSON();

      expect(json).toEqual(validAdminData);
    });
  });
});
