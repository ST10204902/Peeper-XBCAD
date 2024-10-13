import { SessionLogData } from "./SessionLogData";

export interface StudentData {
  student_id: string;
  studentNumber: string;
  email: string;
  profilePhotoURL?: string;
  activeOrgs: string[];
  locationData: {
    [sessionLog_id: string]: SessionLogData;
  };
}
