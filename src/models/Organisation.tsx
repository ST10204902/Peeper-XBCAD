import { OrgAddress } from "./OrgAddress";

export interface Organisation {
  org_id: string;
  orgName: string;
  orgAddress: OrgAddress;
  orgEmail: string;
  orgPhoneNo: string;
  orgLatitude: number;
  orgLongitude: number;
}
