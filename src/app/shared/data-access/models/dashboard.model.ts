import { Details } from "../../../admin/data-access/models/details-model"
export interface dashboardDataModel {
  details:{
    inReview: Details[],
    contract?:Details[],
    provisionalContract?:Details[],
    active: Details[],
    provisionalActive: Details[],
    onboarded?: Details[],
    pending: Details[],
    emailFailed?: Details[],
    invoice: Details[],
    provisionalInvoice: Details[],
    payment:Details[],
    provisionalPayment:Details[],
    declined?: Details[]
    saved?: Details[],
    invoiceAwaitingExecutiveApproval:Details[],
    applicationAwaitingExecutiveApproval: Details[],
    applicationAwaitingFinanceApproval: Details[],
    applicationAwaitingFundDistribution: Details[],
    invoiceAwaitingFinanceApproval:Details[],
    pendingRenewal:Details[],
    invoiceAwaitingFundDistribute: Details[],
  } | null
}
