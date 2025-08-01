import { AllocationModel } from "../../../shared/data-access/models/allocation.models";
import { dashboardDataModel } from "../../../shared/data-access/models/dashboard.model";
import { Details } from "./details-model";

export interface UniversityDetails {
  universityName: string
  activeBursaries: number
  applications: number
  totalAllocationAmount: number
  imageUrl: string;
}

export interface UniversityApplications
{
      inReview: Details[],
      contract?:Details[],
      active: Details[],
      pending: Details[],
      emailFailed?: Details[],
      invoice: Details[],
      payment:Details[], 
      declined?: Details[]
      saved?: Details[],
      invoiceAwaitingExecutiveApproval:Details[],
      applicationAwaitingExecutiveApproval: Details[],
      applicationAwaitingFinanceApproval: Details[],
      invoiceAwaitingFinanceApproval:Details[],
      pendingRenewal:Details[],
      invoiceAwaitingFundDistribute: Details[],
}

export interface UniversityData {
  universityDetails?: UniversityDetails;
  universityApplications?: UniversityApplications;
  allocations?:AllocationModel;
}

export type DashboardDataType =
  | { kind: "dashboardDataModel"; data: dashboardDataModel }
  | { kind: "universityData"; data: UniversityData[] };