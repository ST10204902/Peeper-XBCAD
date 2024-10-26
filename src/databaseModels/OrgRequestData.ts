import { OrgAddressData } from "./OrgAddressData";

export interface OrgRequestData {
  request_id: string;
  studentIDs: string[];
  org_id: string;
  name: string;
  orgAddress: OrgAddressData;
  email?: string;
  phoneNo?: string;
  approvalStatus: number; // Assuming this is an ENUM
  orgLatitude: number;
  orgLongitude: number;
}
