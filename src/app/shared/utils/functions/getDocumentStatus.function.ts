import { Ranks } from '../../../authentication/data-access/models/auth.model';
import { savedFileStatus } from '../../data-access/models/savedFilesStatus.model';
import { DocumentStatus } from '../../enums/documentStatus';
import { getSUDocumentStatus } from './suApplicationStatusUpdate.function';

export function getDocumentStatus(
  fileStatus: savedFileStatus,
  rank: Ranks,
  documentType: string,
  isPayment: boolean = false,
  invoiceStatus?: DocumentStatus,
): DocumentStatus {
  switch (rank) {
    case Ranks.assistant_admin:
      return handleAssistantAdmin(fileStatus, isPayment, documentType);

    case Ranks.admin_officer:
      return handleAdminOfficer(fileStatus);

    case Ranks.chief_admin:
      return handleChiefAdmin(fileStatus, isPayment, invoiceStatus);

    default:
      return handleDefault(fileStatus);
  }
}

function handleAssistantAdmin(fileStatus: savedFileStatus, isPayment: boolean, documentType: string): DocumentStatus {
  if (fileStatus.isSaveForLater) {
    return DocumentStatus.PENDING;
  }
  return isPayment ? DocumentStatus.APPROVED : DocumentStatus.IN_REVIEW ;
}

function handleAdminOfficer(fileStatus: savedFileStatus): DocumentStatus {
  return fileStatus.hasRequestedChanges
    ? DocumentStatus.PENDING
    : DocumentStatus.APPROVED;
}

function handleChiefAdmin(fileStatus: savedFileStatus, isPayment: boolean, invoiceStatus?: DocumentStatus): DocumentStatus {
  if (fileStatus.isSaveForLater) {
    return invoiceStatus!;
  }
  if(fileStatus.hasRequestedChanges)
  {
    return DocumentStatus.PENDING
  }
  return isPayment ? DocumentStatus.APPROVED : getSUDocumentStatus(invoiceStatus!,false,true);
}

function handleDefault(fileStatus: savedFileStatus): DocumentStatus {
  return fileStatus.hasRequestedChanges
    ? DocumentStatus.PENDING
    : DocumentStatus.IN_REVIEW;
}
