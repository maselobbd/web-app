export interface StudentForDocManagement {
  name: string;
  surname: string;
  otherDescription?: string | null;
  invoiceStatus: string | null;
}

export interface DocumentStructure {
  amount?: number;
  documentBlobName: string;
  applicationId: number;
  documentUploadDate: string;
  expenseCategory: string;
  documentType: string;
  fileName: string;
}