import { DatabaseUtility } from "../../utils/DatabaseUtility";
import { OrgRequestData } from "../OrgRequestData";
import { OrgAddress } from "./OrgAddress";
import { ApprovalStatus } from "../enums";
import { onValue } from "firebase/database";

/**
 * @class OrgRequest
 * @implements {OrgRequestData}
 * @description Represents an organization request with properties such as request ID, student IDs, organization ID, name, address, email, phone number, approval status, latitude, and longitude.
 */
export class OrgRequest implements OrgRequestData {
  request_id: string;
  studentIDs: string[];
  org_id: string;
  name: string;
  orgAddress: OrgAddress;
  email?: string;
  phoneNo?: string;
  approvalStatus: ApprovalStatus;
  orgLatitude: number;
  orgLongitude: number;

  /**
   * @constructor
   * @param {OrgRequestData} data - The data to initialize the organization request instance
   */
  constructor(data: OrgRequestData) {
    this.request_id = data.request_id;
    this.studentIDs = data.studentIDs;
    this.org_id = data.org_id;
    this.name = data.name;
    this.orgAddress = new OrgAddress(data.orgAddress);
    this.email = data.email;
    this.phoneNo = data.phoneNo;
    this.approvalStatus = data.approvalStatus;
    this.orgLatitude = data.orgLatitude;
    this.orgLongitude = data.orgLongitude;
  }

  /**
   * @static
   * @method fetchById
   * @description Fetches an organization request by ID from the database
   * @param {string} request_id - The ID of the organization request to fetch
   * @returns {Promise<OrgRequest | null>} The fetched organization request instance or null if not found
   */
  static async fetchById(request_id: string): Promise<OrgRequest | null> {
    const data = await DatabaseUtility.getData<OrgRequestData>(`orgRequests/${request_id}`);
    return data ? new OrgRequest(data) : null;
  }

  /**
   * @method save
   * @description Saves the current organization request instance to the database
   * @returns {Promise<void>}
   */
  async save(): Promise<void> {
    await DatabaseUtility.setData(`orgRequests/${this.request_id}`, this.toJSON());
  }

  /**
   * @method update
   * @description Updates the organization request instance with the provided data
   * @param {Partial<OrgRequestData>} updates - The data to update the organization request instance with
   * @returns {Promise<void>}
   */
  async update(updates: Partial<OrgRequestData>): Promise<void> {
    await DatabaseUtility.updateData(`orgRequests/${this.request_id}`, updates);
  }

  /**
   * @method delete
   * @description Deletes the organization request instance from the database
   * @returns {Promise<void>}
   */
  async delete(): Promise<void> {
    await DatabaseUtility.deleteData(`orgRequests/${this.request_id}`);
  }

  static async getAllOrgRequests(): Promise<OrgRequest[]> {
    const data = await DatabaseUtility.getAllData<OrgRequestData>(`orgRequests`);
    return data.map(requestData => new OrgRequest(requestData));
  }

  /**
   * @method listenToRequestsByStudentId
   * @description Sets up a listener for organization requests by a specific student ID
   * @param {string} studentId - The ID of the student to listen for requests
   * @param {(requests: OrgRequest[]) => void} callback - The callback function to handle the requests
   * @returns {() => void} A function to unsubscribe from the listener
   */
  static listenToRequestsByStudentId(
    studentNumber: string,
    callback: (requests: OrgRequest[]) => void,
  ): () => void {
    const dbRef = DatabaseUtility.getRef("orgRequests");

    const unsubscribe = onValue(dbRef, snapshot => {
      const requests: OrgRequest[] = [];
      snapshot.forEach(childSnapshot => {
        const data = childSnapshot.val() as OrgRequestData;
        if (Array.isArray(data.studentIDs) && data.studentIDs.includes(studentNumber)) {
          requests.push(new OrgRequest(data));
        }
      });
      callback(requests);
    });

    // Return the unsubscribe function
    return () => unsubscribe();
  }

  /**
   * @method toJSON
   * @description Converts the organization request instance to a JSON object
   * @returns {OrgRequestData} The JSON representation of the organization request instance
   */
  toJSON(): OrgRequestData {
    return {
      request_id: this.request_id,
      studentIDs: this.studentIDs,
      org_id: this.org_id,
      name: this.name,
      orgAddress: this.orgAddress.toJSON(),
      email: this.email,
      phoneNo: this.phoneNo,
      approvalStatus: this.approvalStatus,
      orgLatitude: this.orgLatitude,
      orgLongitude: this.orgLongitude,
    };
  }
}
