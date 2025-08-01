import { DocumentStatus } from "../../enums/documentStatus";

export function getSUDocumentStatus(applicationStatus: DocumentStatus, isApplicationStatus:boolean = false, isInvoiceDocumentType=false): DocumentStatus {
  if(isInvoiceDocumentType) return DocumentStatus.IN_REVIEW
    switch (applicationStatus) {
      case DocumentStatus.AWAITING_EXEC_APPROVAL:
        return DocumentStatus.AWAITING_FINANCE_APPROVAL;
      case DocumentStatus.AWAITING_FINANCE_APPROVAL:
        return isApplicationStatus? DocumentStatus.APPROVED : DocumentStatus.IN_REVIEW;
      default:
        return DocumentStatus.AWAITING_EXEC_APPROVAL;
    }
  }