import { AreaCodes } from "../../areacodes/models/AreaCodes";

export interface Client {
 Id?: number;
  Name: string;
  ClaimsManager: string;
  GroupName: string;
  AreaCode: AreaCodes;
  Telephone: string;
  isDeleted?: boolean;
    IsActive: boolean;
  
  
}
