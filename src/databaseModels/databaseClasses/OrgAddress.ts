import { OrgAddressData } from "../OrgAddressData";

/**
 * @class OrgAddress
 * @implements {OrgAddressData}
 * @description Represents an organization's address with properties such as street address, suburb, city, province, and postal code.
 */
export class OrgAddress implements OrgAddressData {
  streetAddress: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;

  /**
   * @constructor
   * @param {OrgAddressData} data - The data to initialize the organization address instance
   */
  constructor(data: OrgAddressData) {
    this.streetAddress = data.streetAddress;
    this.suburb = data.suburb;
    this.city = data.city;
    this.province = data.province;
    this.postalCode = data.postalCode;
  }

  /**
   * @method toJSON
   * @description Converts the organization address instance to a JSON object
   * @returns {OrgAddressData} The JSON representation of the organization address instance
   */
  toJSON(): OrgAddressData {
    return {
      streetAddress: this.streetAddress,
      suburb: this.suburb,
      city: this.city,
      province: this.province,
      postalCode: this.postalCode,
    };
  }
}
