/**
 * This file defines the OrganisationData interface and imports the OrgAddressData interface
 */

import { OrgAddressData } from "./OrgAddressData";

/**
 * OrganisationData interface represents the structure of an organization's data
 */
export interface OrganisationData {
  /** Unique identifier for the organization */
  org_id: string;
  /** Name of the organization */
  orgName: string;
  /** Address of the organization, represented by OrgAddressData interface */
  orgAddress: OrgAddressData;
  /** Email address of the organization */
  orgEmail: string;
  /** Phone number of the organization */
  orgPhoneNo: string;
  /** Latitude coordinate of the organization's location */
  orgLatitude: number;
  /** Longitude coordinate of the organization's location */
  orgLongitude: number;
}
