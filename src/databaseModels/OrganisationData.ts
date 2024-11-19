import { OrgAddressData } from "./OrgAddressData";

export interface OrganisationData {
  org_id: string;
  orgName: string;
  orgAddress: OrgAddressData;
  orgEmail: string;
  orgPhoneNo: string;
  orgLatitude: number;
  orgLongitude: number;
}
