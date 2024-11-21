/**
 * This file defines the OrgRequestData interface and imports the OrgAddressData interface
 */

import { OrgAddressData } from "./OrgAddressData";

/**
 * OrgRequestData interface represents the structure of a request made by an organization
 */
export interface OrgRequestData {
  /** Unique identifier for the request */
  request_id: string;
  /** Array of student IDs associated with the request */
  studentIDs: string[];
  /** Unique identifier for the organization making the request */
  org_id: string;
  /** Name of the organization making the request */
  name: string;
  /** Address of the organization, represented by OrgAddressData interface */
  orgAddress: OrgAddressData;
  /** Optional email address of the organization */
  email?: string;
  /** Optional phone number of the organization */
  phoneNo?: string;
  /** Status of the request approval process (Assuming this is an ENUM) */
  approvalStatus: number;
  /** Latitude coordinate of the organization's location */
  orgLatitude: number;
  /** Longitude coordinate of the organization's location */
  orgLongitude: number;
}
