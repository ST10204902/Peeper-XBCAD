import { onValue } from "@firebase/database";
import { DatabaseUtility } from "../../utils/DatabaseUtility";
import { OrganisationData } from "../OrganisationData";
import { OrgAddress } from "./OrgAddress";

/**
 * @class Organisation
 * @implements {OrganisationData}
 * @description Represents an organization with properties such as name, address, email, phone number, latitude, and longitude.
 */
export class Organisation implements OrganisationData {
  org_id: string;
  orgName: string;
  orgAddress: OrgAddress;
  orgEmail: string;
  orgPhoneNo: string;
  orgLatitude: number;
  orgLongitude: number;
  distance?: string;

  /**
   * @constructor
   * @param {OrganisationData} data - The data to initialize the organization instance
   */
  constructor(data: OrganisationData) {
    this.org_id = data.org_id;
    this.orgName = data.orgName;
    this.orgAddress = new OrgAddress(data.orgAddress);
    this.orgEmail = data.orgEmail;
    this.orgPhoneNo = data.orgPhoneNo;
    this.orgLatitude = data.orgLatitude;
    this.orgLongitude = data.orgLongitude;
  }

  /**
   * @static
   * @method fetchById
   * @description Fetches an organization by ID from the database
   * @param {string} org_id - The ID of the organization to fetch
   * @returns {Promise<Organisation | null>} The fetched organization instance or null if not found
   */
  static async fetchById(org_id: string): Promise<Organisation | null> {
    const data = await DatabaseUtility.getData<OrganisationData>(`organisations/${org_id}`);
    return data ? new Organisation(data) : null;
  }

  /**
   * @method save
   * @description Saves the current organization instance to the database
   * @returns {Promise<void>}
   */
  async save(): Promise<void> {
    await DatabaseUtility.setData(`organisations/${this.org_id}`, this.toJSON());
  }

  /**
   * @method update
   * @description Updates the organization instance with the provided data
   * @param {Partial<OrganisationData>} updates - The data to update the organization instance with
   * @returns {Promise<void>}
   */
  async update(updates: Partial<OrganisationData>): Promise<void> {
    await DatabaseUtility.updateData(`organisations/${this.org_id}`, updates);
  }

  /**
   * @method delete
   * @description Deletes the organization instance from the database
   * @returns {Promise<void>}
   */
  async delete(): Promise<void> {
    await DatabaseUtility.deleteData(`organisations/${this.org_id}`);
  }

  /**
   * @static
   * @method getAllOrganisations
   * @description Fetches all organizations from the database
   * @returns {Promise<Organisation[]>} An array of all fetched organization instances
   */
  static async getAllOrganisations(): Promise<Organisation[]> {
    const data = await DatabaseUtility.getAllData<OrganisationData>("organisations");
    return data.map(orgData => new Organisation(orgData));
  }

  /**
   * @static
   * @method listenToAllOrganisations
   * @description Listens to all organizations in the database
   * @param {(organisations: Organisation[]) => void} callback - The callback function to call with the fetched organizations
   * @returns {() => void} The unsubscribe function to stop listening to organizations
   */
  static listenToAllOrganisations(callback: (organisations: Organisation[]) => void): () => void {
    const ref = DatabaseUtility.getRef("organisations");
    const unsubscribe = onValue(
      ref,
      snapshot => {
        const orgs: Organisation[] = [];
        snapshot.forEach(childSnapshot => {
          const data = childSnapshot.val() as OrganisationData;
          orgs.push(new Organisation(data));
        });
        callback(orgs);
      },
      error => {
        console.error("Error listening to organisations:", error);
      },
    );
    // Return the unsubscribe function
    return () => unsubscribe();
  }

  static async getStudentsOrgs(orgIds: string[]): Promise<Organisation[]> {
    const orgs = await Promise.all(
      orgIds.map(async orgId => {
        const org = await Organisation.fetchById(orgId);
        return org;
      }),
    );
    return orgs.filter((org): org is Organisation => org !== null);
  }

  /**
   * @method toJSON
   * @description Converts the organization instance to a JSON object
   * @returns {OrganisationData} The JSON representation of the organization instance
   */
  toJSON(): OrganisationData {
    return {
      org_id: this.org_id,
      orgName: this.orgName,
      orgAddress: this.orgAddress.toJSON(),
      orgEmail: this.orgEmail,
      orgPhoneNo: this.orgPhoneNo,
      orgLatitude: this.orgLatitude,
      orgLongitude: this.orgLongitude,
    };
  }
}
