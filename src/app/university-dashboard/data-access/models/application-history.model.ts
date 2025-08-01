export interface ApplicationHistory {
  applicationStatusHistoryId: number
  userId: string
  applicationId: number
  applicationGuid: string
  status: string
  fromDate: string
  ToDate: string
  Approver: {
    nameRole: string
    email: string
    role: string
    rank: string
  } | string
  type: string
}