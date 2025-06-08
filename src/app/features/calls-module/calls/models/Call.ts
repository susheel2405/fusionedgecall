import { Client } from "../../../client/models/Client";
export interface Call {
  status: string;
  caseRef: string;
  caseNo: string;
  caseDate: string;
  callerName: string;
  deceasedName: string;
  client: Client;
  type: string;
  funeralDate: string;
  callerFirstName: string;
  callerLastName: string;
  
}
