export enum Approvers {
    assistant_admin = 'HR',
    admin_officer = 'Executive',
    chief_admin = 'Executive',
    senior_admin = 'Director',
    student = 'Student',
    no_rank = 'HOD'
}

export enum ApplicationHistoryStatusMessages {
    contract = 'Status: Contract',
    pendingInfo = 'Status: Pending student info',
    inReview = 'Status: In Review',
    payment = 'Status: Payment',
    applicationSubmitted = 'Application submitted',
    studentInfoSubmitted = 'Student info submitted',
    acceptedByHR = 'Accepted by HR',
    acceptedByExec = 'Accepted by Executive',
    acceptedApproved = 'Accepted: Approved',
    invoice = 'Status: Invoice',
    invoicesUploaded = 'invoices uploaded',
    acceptedInv = 'Accepted: approved',
    paymentsSubmitted = 'proof of payments submitted',
    active = 'Status: Active',
    contractUploaded = 'Contract uploaded',
    awaitingFundDistribution = 'Status: Awaiting Fund Distribution'
}
