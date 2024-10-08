
import { Admin } from '../databaseModels/databaseClasses/Admin';
import { AdminType } from '../databaseModels/enums';
import { AdminData } from '../databaseModels/AdminData';

describe('Admin Class', () => {
  it('should initialize properties correctly', () => {
    const adminData: AdminData = {
      admin_id: '1',
      email: 'admin@example.com',
      adminType: AdminType.SuperAdmin,
      viewableStudents: ['student1', 'student2']
    };

    const admin = new Admin(adminData);

    expect(admin.admin_id).toBe(adminData.admin_id);
    expect(admin.email).toBe(adminData.email);
    expect(admin.adminType).toBe(adminData.adminType);
    expect(admin.viewableStudents).toEqual(adminData.viewableStudents);
  });
});