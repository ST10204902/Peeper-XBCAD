/**
 * This file defines the StudentData interface and imports the SessionLogData interface
 */

import { SessionLogData } from "./SessionLogData";

/**
 * StudentData interface represents the structure of a student's data
 */
export interface StudentData {
  /** Unique identifier for the student */
  student_id: string;
  /** Student number */
  studentNumber: string;
  /** Email address of the student */
  email: string;
  /** Optional profile photo ID of the student */
  profilePhotoId?: string;
  /** Array of active organization IDs the student is associated with */
  activeOrgs: string[];
  /** Object containing session log data, keyed by session log ID */
  locationData: {
    [sessionLog_id: string]: SessionLogData;
  };
  /** Boolean indicating if dark mode is enabled for the student */
  darkMode: boolean;
}
