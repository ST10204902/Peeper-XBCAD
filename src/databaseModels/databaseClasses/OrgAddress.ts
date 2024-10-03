// OrgAddress.ts
import { OrgAddressData } from '../OrgAddressData';

export class OrgAddress implements OrgAddressData {
  streetAddress: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;

  constructor(data: OrgAddressData) {
    this.streetAddress = data.streetAddress;
    this.suburb = data.suburb;
    this.city = data.city;
    this.province = data.province;
    this.postalCode = data.postalCode;
  }

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
