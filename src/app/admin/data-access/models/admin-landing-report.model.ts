export interface AdminLandingReport {
  finalSummary: FinalSummary[]
  spendingByUniversity: SpendingByUniversity
}

export interface FinalSummary {
  id: string
  name: string
  fundAllocation: number
  activeBursaries: number
  applications: number
  fundSpending: FundSpending[]
  fundSpendingTotal: FundSpendingTotal,
  logo: string
}

export interface FundSpending {
  label: string
  amount: number
}

export interface FundSpendingTotal {
  total: number
}

export interface SpendingByUniversity {
  total: number
}
