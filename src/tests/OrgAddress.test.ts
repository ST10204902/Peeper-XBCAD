import { OrgAddress } from "../databaseModels/databaseClasses/OrgAddress";
import { OrgAddressData } from "../databaseModels/OrgAddressData";

describe("OrgAddress Class", () => {
  const validOrgAddressData: OrgAddressData = {
    streetAddress: "123 Test Street",
    suburb: "Test Suburb",
    city: "Test City",
    province: "Test Province",
    postalCode: "12345",
  };

  describe("Constructor", () => {
    it("should initialize with complete valid data", () => {
      const orgAddress = new OrgAddress(validOrgAddressData);

      expect(orgAddress.streetAddress).toBe(validOrgAddressData.streetAddress);
      expect(orgAddress.suburb).toBe(validOrgAddressData.suburb);
      expect(orgAddress.city).toBe(validOrgAddressData.city);
      expect(orgAddress.province).toBe(validOrgAddressData.province);
      expect(orgAddress.postalCode).toBe(validOrgAddressData.postalCode);
    });

    it("should handle empty strings", () => {
      const emptyData: OrgAddressData = {
        streetAddress: "",
        suburb: "",
        city: "",
        province: "",
        postalCode: "",
      };

      const orgAddress = new OrgAddress(emptyData);
      expect(orgAddress.streetAddress).toBe("");
      expect(orgAddress.suburb).toBe("");
      expect(orgAddress.city).toBe("");
      expect(orgAddress.province).toBe("");
      expect(orgAddress.postalCode).toBe("");
    });

    it("should handle whitespace strings", () => {
      const whitespaceData: OrgAddressData = {
        streetAddress: "  ",
        suburb: "  ",
        city: "  ",
        province: "  ",
        postalCode: "  ",
      };

      const orgAddress = new OrgAddress(whitespaceData);
      expect(orgAddress.streetAddress).toBe("  ");
      expect(orgAddress.suburb).toBe("  ");
      expect(orgAddress.city).toBe("  ");
      expect(orgAddress.province).toBe("  ");
      expect(orgAddress.postalCode).toBe("  ");
    });

    it("should handle special characters in address fields", () => {
      const specialCharsData: OrgAddressData = {
        streetAddress: "123/A Test Street #2",
        suburb: "O'Connor's Suburb",
        city: "St. John's",
        province: "Prince Edward's-Land",
        postalCode: "A1B 2C3",
      };

      const orgAddress = new OrgAddress(specialCharsData);
      expect(orgAddress.streetAddress).toBe(specialCharsData.streetAddress);
      expect(orgAddress.suburb).toBe(specialCharsData.suburb);
      expect(orgAddress.city).toBe(specialCharsData.city);
      expect(orgAddress.province).toBe(specialCharsData.province);
      expect(orgAddress.postalCode).toBe(specialCharsData.postalCode);
    });
  });

  describe("Data Conversion", () => {
    it("should correctly convert to JSON", () => {
      const orgAddress = new OrgAddress(validOrgAddressData);
      const json = orgAddress.toJSON();

      expect(json).toEqual(validOrgAddressData);
    });

    it("should maintain data types in JSON output", () => {
      const orgAddress = new OrgAddress(validOrgAddressData);
      const json = orgAddress.toJSON();

      expect(typeof json.streetAddress).toBe("string");
      expect(typeof json.suburb).toBe("string");
      expect(typeof json.city).toBe("string");
      expect(typeof json.province).toBe("string");
      expect(typeof json.postalCode).toBe("string");
    });

    it("should handle empty data in JSON conversion", () => {
      const emptyData: OrgAddressData = {
        streetAddress: "",
        suburb: "",
        city: "",
        province: "",
        postalCode: "",
      };

      const orgAddress = new OrgAddress(emptyData);
      const json = orgAddress.toJSON();

      expect(json).toEqual(emptyData);
    });

    it("should preserve whitespace in JSON conversion", () => {
      const whitespaceData: OrgAddressData = {
        streetAddress: "  123  Street  ",
        suburb: " Test  Suburb ",
        city: "  Test  City  ",
        province: " Test  Province ",
        postalCode: " 12345 ",
      };

      const orgAddress = new OrgAddress(whitespaceData);
      const json = orgAddress.toJSON();

      expect(json).toEqual(whitespaceData);
    });
  });
});
