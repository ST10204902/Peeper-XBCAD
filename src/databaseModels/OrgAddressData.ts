/**
 * This file defines the OrgAddressData interface
 */

/**
 * OrgAddressData interface represents the structure of an organization's address data
 */
export interface OrgAddressData {
  /** Street address of the organization */
  streetAddress: string;
  /** Suburb where the organization is located */
  suburb: string;
  /** City where the organization is located */
  city: string;
  /** Province where the organization is located */
  province: string;
  /** Postal code of the organization's address */
  postalCode: string;
}
