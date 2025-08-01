import { DocumentStatus } from "../../enums/documentStatus";

export function getApplicationStatus(application: { invoiceStatus: string; status: string; }, currentTab: string) {
    const { invoiceStatus, status } = application;
  
    const statusMap = {
      'Contract in progress': () => 
        !invoiceStatus && status === DocumentStatus.APPROVED,
      'Payment in progress': () => 
        invoiceStatus === DocumentStatus.IN_REVIEW,
      'Invoice in review': () => 
        invoiceStatus === DocumentStatus.PENDING && status === DocumentStatus.APPROVED,
      'Final approver': () => 
        status === 'Awaiting finance approval' || invoiceStatus === 'Awaiting finance approval',
      'Second approver': () => 
        status === 'Awaiting executive approval' || invoiceStatus === 'Awaiting executive approval',
    };
  
    for (const [statusMessage, condition] of Object.entries(statusMap)) {
      if (condition()) {
        return statusMessage;
      }
    }
  
    return currentTab === DocumentStatus.INVOICE
      ? invoiceStatus
      : status;
  }

export function getConsolidatedApplicationStatus(status: string) {  
  const statusMap = {
    'Contract in progress': () => 
      status === DocumentStatus.APPROVED,
    'Payment in progress': () => 
      status === DocumentStatus.PAYMENT,
    'Invoice in review': () => 
      status === DocumentStatus.APPROVED,
    'Final approver': () => 
      status === 'Awaiting finance approval',
    'Second approver': () => 
      status === 'Awaiting executive approval',
  };

  for (const [statusMessage, condition] of Object.entries(statusMap)) {
    if (condition()) {
      return statusMessage;
    }
  } 

  return status;
}
