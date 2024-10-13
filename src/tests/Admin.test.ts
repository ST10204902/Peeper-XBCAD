
import { Admin } from '../databaseModels/databaseClasses/Admin';
import { AdminType } from '../databaseModels/enums';
import { AdminData } from '../databaseModels/AdminData';

// Describe block for grouping relatest tests for the Admin class
describe('Admin Class', () => {
  // Test case to check if Admin class initializes properties correctly
  it('should initialize properties correctly', () => {
    // Create a mock AdminData object with sample data
    const adminData: AdminData = {
      admin_id: '1',
      email: 'admin@example.com',
      adminType: AdminType.SuperAdmin,
      viewableStudents: ['student1', 'student2']
    };

    // Initialize an Admin object with the mock data
    const admin = new Admin(adminData);

    // Assertions to verify that the properties 
    // of the Admin instance match the mock data
    expect(admin.admin_id).toBe(adminData.admin_id);
    expect(admin.email).toBe(adminData.email);
    expect(admin.adminType).toBe(adminData.adminType);
    expect(admin.viewableStudents).toEqual(adminData.viewableStudents);
  });
});