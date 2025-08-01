import { DepartmentAllocationsModel } from "./departmentAllocation-model";
import { UniversityAllocationsModel } from "./universityAllocations-model";
import {Actions} from "../../enums/fundAllocations";

export interface FundAllocationsModel {
  activeUniversitiesDepartmentsFundAllocationsData: DepartmentAllocationsModel[],
  activeUniversitiesFundAllocationsData: UniversityAllocationsModel[],
  fundAmounts: FundAmounts ,
  fundAllocationValidators: FundAllocationsValidators
}

export interface FundAmounts {
  fundTotal: number,
  totalAllocated: number,
  unallocatedAmount: number
}

export interface FundAllocationsValidators {
  minAmount: number,
  maxAmount: number,
}

export interface IndividualUniversityToViewData {
  individualUniversityView: boolean, universityName: string
}

export interface FundAllocationsDialogModel {
  action: Actions;
  activeUniversities: string[];
  activeUniversitiesDepartmentsFundAllocationsData: DepartmentAllocationsModel[];
  activeUniversitiesFundAllocationsData: UniversityAllocationsModel[];
  unallocatedAmount: number;
  yearOfStudy: number;
  minAmount: number;
  maxAmount: number;
}

export interface MoveFundsDialogModel {
  action: Actions;
  activeDepartmentNames: string[]
  activeUniversitiesDepartmentsFundAllocationsData: DepartmentAllocationsModel[];
  activeUniversity: UniversityAllocationsModel;
  yearOfStudy: number;
  minAmount: number;
  maxAmount: number;
}
