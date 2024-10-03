// This is the student class
import { DatabaseUtility } from "./DatabaseUtility";
import { StudentData } from "../StudentData";
import { SessionLogData } from "../SessionLogData";
import { SessionLog } from "./SessionLog";

export class Student implements StudentData {
  student_id: string;
  studentNumber: string;
  email: string;
  profilePhotoURL?: string;
  activeOrgs: string[];
  locationData: { [sessionLog_id: string]: SessionLog };

  constructor(data: StudentData) {
    this.student_id = data.student_id;
    this.studentNumber = data.studentNumber || "";
    this.email = data.email || "";
    this.profilePhotoURL = data.profilePhotoURL || ""; // Initialize with default value
    this.activeOrgs = data.activeOrgs || [];
    this.locationData = {};

    if (data.locationData) {
      for (const key in data.locationData) {
        if (data.locationData.hasOwnProperty(key)) {
          this.locationData[key] = new SessionLog(data.locationData[key]);
        }
      }
    }
  }

  static async fetchById(student_id: string): Promise<Student | null> {
    const data = await DatabaseUtility.getData<StudentData>(
      `students/${student_id}`
    );
    return data ? new Student(data) : null;
  }

  async save(): Promise<void> {
    const data = this.toJSON();
    await DatabaseUtility.setData(`students/${this.student_id}`, data);
  }

  async update(updates: Partial<StudentData>): Promise<void> {
    await DatabaseUtility.updateData(`students/${this.student_id}`, updates);
  }

  async delete(): Promise<void> {
    await DatabaseUtility.deleteData(`students/${this.student_id}`);
  }

  toJSON(): StudentData {
    const locationDataJSON: { [sessionLog_id: string]: SessionLogData } = {};
    for (const key in this.locationData) {
      if (this.locationData.hasOwnProperty(key)) {
        locationDataJSON[key] = this.locationData[key].toJSON();
      }
    }

    return {
      student_id: this.student_id,
      studentNumber: this.studentNumber,
      email: this.email,
      profilePhotoURL: this.profilePhotoURL,
      activeOrgs: this.activeOrgs,
      locationData: locationDataJSON,
    };
  }
}
