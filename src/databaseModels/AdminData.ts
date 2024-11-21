/**
 * @interface AdminData
 * @description Represents the data structure for an admin user.
 *
 * @property {string} admin_id - The unique identifier for the admin
 * @property {string} email - The email address of the admin
 * @property {number} adminType - The type of admin (assumed to be an ENUM)
 * @property {string[]} viewableStudents - An array of student IDs that the admin can view
 */
export interface AdminData {
  admin_id: string;
  email: string;
  adminType: number; // Assuming this is an ENUM
  viewableStudents: string[];
}
