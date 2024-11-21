import { DatabaseUtility } from "../../utils/DatabaseUtility";
import { AdminData } from "../AdminData";
import { AdminType } from "../enums";

/**
 * @class Admin
 * @implements {AdminData}
 * @description Represents an admin user with methods to validate email, fetch by ID, save, and update admin data.
 */
export class Admin implements AdminData {
  admin_id: string;
  email: string;
  adminType: AdminType;
  viewableStudents: string[];

  /**
   * @constructor
   * @param {AdminData} data - The data to initialize the admin instance
   */
  constructor(data: AdminData) {
    this.validateEmail(data.email);
    this.admin_id = data.admin_id;
    this.email = data.email;
    this.adminType = data.adminType;
    this.viewableStudents = data.viewableStudents ?? [];
  }

  /**
   * @private
   * @method validateEmail
   * @description Validates the email format and throws an error if invalid
   * @param {string} email - The email to validate
   * @throws {Error} If the email is empty or has an invalid format
   * @returns {void}
   */
  private validateEmail(email: string): void {
    if (email === null || email === undefined || email.trim() === "") {
      throw new Error("Email cannot be empty");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
  }

  /**
   * @static
   * @method fetchById
   * @description Fetches an admin by ID from the database
   * @param {string} admin_id - The ID of the admin to fetch
   * @returns {Promise<Admin | null>} The fetched admin instance or null if not found
   */
  static async fetchById(admin_id: string): Promise<Admin | null> {
    const data = await DatabaseUtility.getData<AdminData>(`admins/${admin_id}`);
    return data !== null ? new Admin(data) : null;
  }

  /**
   * @method save
   * @description Saves the current admin instance to the database
   * @returns {Promise<void>}
   */
  async save(): Promise<void> {
    await DatabaseUtility.setData(`admins/${this.admin_id}`, this.toJSON());
  }

  /**
   * @method update
   * @description Updates the admin instance with the provided data
   * @param {Partial<AdminData>} updates - The data to update the admin instance with
   * @returns {Promise<void>}
   */
  async update(updates: Partial<AdminData>): Promise<void> {
    if (updates.email !== undefined) {
      this.validateEmail(updates.email);
    }
    Object.assign(this, updates);
    await this.save();
  }

  async delete(): Promise<void> {
    await DatabaseUtility.deleteData(`admins/${this.admin_id}`);
  }

  /**
   * @method toJSON
   * @description Converts the admin instance to a JSON object
   * @returns {AdminData} The JSON representation of the admin instance
   */
  toJSON(): AdminData {
    return {
      admin_id: this.admin_id,
      email: this.email,
      adminType: this.adminType,
      viewableStudents: this.viewableStudents,
    };
  }
}
