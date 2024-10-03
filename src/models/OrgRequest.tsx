import { OrgAddress } from "./OrgAddress";

export interface OrgRequest {
  request_id: string;
  studentID: string;
  org_id: string;
  name: string;
  orgAddress: OrgAddress;
  email?: string;
  phoneNo?: string;
  approvalStatus: number; // Assuming this is an ENUM
}
