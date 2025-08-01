const documentStatusEnum =Object.freeze({
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    REMOVED: "Removed",
    IN_REVIEW: "In Review",
    AWAITING_EXEC_APPROVAL: "Awaiting executive approval",
    AWAITING_FINANCE_APPROVAL: "Awaiting finance approval",
    INVALID: "Invalid",
    PAYMENT:"Payment",
    AWAITING_FUND_DISTRIBUTION:"Awaiting fund distribution",
    CONTRACT: "Contract",
    INVOICE: 'Invoice',
    CUSTOM_AWAITING_INV_EXEC_APPROVAL:"invoiceAwaitingExecutiveApproval",
    CUSTOM_AWAITING_INV_FIN_APPROVAL:"invoiceAwaitingFinanceApproval",
    CUSTOM_AWAITING_APP_FIN_APPROVAL:"applicationAwaitingFinanceApproval",
    CUSTOM_AWAITING_APP_EXEC_APPROVAL:"applicationAwaitingExecutiveApproval"
});

module.exports = {documentStatusEnum}
