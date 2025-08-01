export interface ApplicationsCount {
  pending: number;
  active: number;
  declined?: number;
  inReview: number;
  invoice: number;
  payment: number;
  emailFailed?: number;
  contract?: number;
  draft?: number;
  FirstApprovalApplications?: number;
  SecondApprovalApplications?: number;
  FinalApprovalApplications?: number;
}
