// Admin.ts
import { DatabaseUtility } from "../../utils/DatabaseUtility";
import { AdminData } from "../AdminData";
import { AdminType } from "../enums";

export class Admin implements AdminData {
  admin_id: string;
  email: string;
  adminType: AdminType;
  viewableStudents: string[];

  constructor(data: AdminData) {
    this.validateEmail(data.email);
    this.admin_id = data.admin_id;
    this.email = data.email;
    this.adminType = data.adminType;
    this.viewableStudents = data.viewableStudents ?? [];
  }

  private validateEmail(email: string): void {
    if (email === null || email === undefined || email.trim() === "") {
      throw new Error("Email cannot be empty");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
  }

  static async fetchById(admin_id: string): Promise<Admin | null> {
    const data = await DatabaseUtility.getData<AdminData>(`admins/${admin_id}`);
    return data !== null ? new Admin(data) : null;
  }

  async save(): Promise<void> {
    await DatabaseUtility.setData(`admins/${this.admin_id}`, this.toJSON());
  }

  async update(updates: Partial<AdminData>): Promise<void> {
    if (updates.email !== undefined) {
      this.validateEmail(updates.email);
    }
    await DatabaseUtility.updateData(`admins/${this.admin_id}`, updates);
  }

  async delete(): Promise<void> {
    await DatabaseUtility.deleteData(`admins/${this.admin_id}`);
  }

  toJSON(): AdminData {
    return {
      admin_id: this.admin_id,
      email: this.email,
      adminType: this.adminType,
      viewableStudents: this.viewableStudents,
    };
  }
}
