// This is the student class
import { DatabaseUtility } from "./DatabaseUtility";
import { StudentData } from "../StudentData";
import { SessionLogData } from "../SessionLogData";
import { SessionLog } from "./SessionLog";
import { Viewport } from "./Viewport";
import { LocationLog } from "./LocationLog";

export class Student implements StudentData {
  student_id: string;
  studentNumber: string;
  email: string;
  profilePhotoURL?: string;
  activeOrgs: string[];
  locationData: {
    [sessionLog_id: string]: SessionLog;
  };

  constructor(data: StudentData) {
    this.student_id = data.student_id ?? "";
    this.studentNumber = data.studentNumber ?? "";
    this.email = data.email ?? "";
    this.profilePhotoURL = data.profilePhotoURL ?? "";
    this.activeOrgs = data.activeOrgs ?? [];
    this.locationData = {};

    Object.entries(data.locationData).forEach(([key, value]) => {
      if (typeof value === 'object') {
        this.locationData[key] = new SessionLog({
          orgID: value.orgID ?? "",
          sessionStartTime: value.sessionStartTime || "",
          sessionEndTime: value.sessionEndTime || "",
          sessionLog_id: value.sessionLog_id || key,
          viewport: new Viewport(value.viewport),
          locationLogs: value.locationLogs.map((log: any) => new LocationLog(log))
        });
      } else {
        console.error("Error: locationData is not an object");
      }
    });
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
