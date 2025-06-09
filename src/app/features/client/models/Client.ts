import { AreaCodes } from "../../areacodes/models/AreaCodes";

export interface Client {
  id?: string;
  CompanyName: string;
  ClientGroup: string;
  IsActive: boolean;
  Address: string;
  AreaCode: string;
  Telephone: string;
  Fax: string;
  WebURL: string;
  CompanyLogo: string;
  isDeleted: boolean;
  claimsManager?: string;
}
