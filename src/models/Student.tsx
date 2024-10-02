import { SessionLog } from "./SessionLog";

export interface Student {
  student_id: string;
  studentNumber: string;
  email: string;
  profilePhotoURL?: string;
  activeOrgs: string[];
  locationData: {
    [sessionLog_id: string]: SessionLog;
  };
}
