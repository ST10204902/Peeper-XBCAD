// Organisation.ts
import { DatabaseUtility } from './DatabaseUtility';
import { OrganisationData } from '../OrganisationData';
import { OrgAddress } from './OrgAddress';

export class Organisation implements OrganisationData {
  org_id: string;
  orgName: string;
  orgAddress: OrgAddress;
  orgEmail: string;
  orgPhoneNo: string;
  orgLatitude: number;
  orgLongitude: number;

  constructor(data: OrganisationData) {
    this.org_id = data.org_id;
    this.orgName = data.orgName;
    this.orgAddress = new OrgAddress(data.orgAddress);
    this.orgEmail = data.orgEmail;
    this.orgPhoneNo = data.orgPhoneNo;
    this.orgLatitude = data.orgLatitude;
    this.orgLongitude = data.orgLongitude;
  }

  static async fetchById(org_id: string): Promise<Organisation | null> {
    const data = await DatabaseUtility.getData<OrganisationData>(`organisations/${org_id}`);
    return data ? new Organisation(data) : null;
  }

  async save(): Promise<void> {
    await DatabaseUtility.setData(`organisations/${this.org_id}`, this.toJSON());
  }

  async update(updates: Partial<OrganisationData>): Promise<void> {
    await DatabaseUtility.updateData(`organisations/${this.org_id}`, updates);
  }

  async delete(): Promise<void> {
    await DatabaseUtility.deleteData(`organisations/${this.org_id}`);
  }

  static async getAllOrganisations(): Promise<Organisation[]> {
    const data = await DatabaseUtility.getAllData<OrganisationData>('organisations');
    return data.map((org) => new Organisation(org));
  }

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
