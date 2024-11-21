import { DatabaseUtility } from "../../utils/DatabaseUtility";
import { StudentData } from "../StudentData";
import { SessionLogData } from "../SessionLogData";
import { SessionLog } from "./SessionLog";

/**
 * @class Student
 * @implements {StudentData}
 * @description Represents a student with properties such as student ID, student number, email, profile photo ID, active organizations, location data, and dark mode preference.
 */
export class Student implements StudentData {
  student_id: string;
  studentNumber: string;
  email: string;
  profilePhotoId?: string;
  activeOrgs: string[];
  locationData: {
    [sessionLog_id: string]: SessionLog;
  };
  darkMode: boolean;

  /**
   * @constructor
   * @param {StudentData} data - The data to initialize the student instance
   */
  constructor(data: StudentData) {
    this.student_id = data.student_id ?? "";
    this.studentNumber = data.studentNumber ?? "";
    this.email = data.email ?? "";
    this.profilePhotoId = data.profilePhotoId ?? ""; // Initialize with default value
    this.activeOrgs = data.activeOrgs ?? [];
    this.locationData = {};
    this.darkMode = data.darkMode ?? false;

    for (const key in data.locationData) {
      if (Object.prototype.hasOwnProperty.call(data.locationData, key)) {
        const sessionLogData = data.locationData[key];
        this.locationData[key] = new SessionLog(sessionLogData);
      }
    }
  }

  /**
   * Fetches a student by ID from the database
   * @static
   * @param {string} student_id - The ID of the student to fetch
   * @returns {Promise<Student | null>} The fetched student instance or null if not found
   */
  static async fetchById(student_id: string): Promise<Student | null> {
    const data = await DatabaseUtility.getData<StudentData>(`students/${student_id}`);
    return data ? new Student(data) : null;
  }

  /**
   * Saves the current student instance to the database
   * @returns {Promise<void>}
   */
  async save(): Promise<void> {
    const data = this.toJSON();
    await DatabaseUtility.setData(`students/${this.student_id}`, data);
  }

  /**
   * Updates the current student instance with the provided updates
   * @param {Partial<StudentData>} updates - The updates to apply to the student
   * @returns {Promise<void>}
   */
  async update(updates: Partial<StudentData>): Promise<void> {
    await DatabaseUtility.updateData(`students/${this.student_id}`, updates);
  }

  /**
   * Deletes the current student instance from the database
   * @returns {Promise<void>}
   */
  async delete(): Promise<void> {
    await DatabaseUtility.deleteData(`students/${this.student_id}`);
  }

  /**
   * Converts the student instance to a JSON representation
   * @returns {StudentData} The JSON representation of the student
   */
  toJSON(): StudentData {
    const locationDataJSON: { [sessionLog_id: string]: SessionLogData } = {};
    for (const key in this.locationData) {
      if (Object.prototype.hasOwnProperty.call(this.locationData, key)) {
        locationDataJSON[key] = this.locationData[key].toJSON();
      }
    }

    return {
      student_id: this.student_id,
      studentNumber: this.studentNumber,
      email: this.email,
      profilePhotoId: this.profilePhotoId,
      activeOrgs: this.activeOrgs ?? [],
      locationData: locationDataJSON,
      darkMode: this.darkMode,
    };
  }
}
