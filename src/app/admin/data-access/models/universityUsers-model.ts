import { DepartmentType } from "../../../shared/data-access/models/universityProfiles.model";
import { HodAccount } from "./hod-account.model";

export interface IUni {
    universityName: string;
    departments: IDepartment[];
  }
  
  export interface IDepartment {
    departmentInfo: DepartmentType;
    hodAccounts: HodAccount[];
  }
  