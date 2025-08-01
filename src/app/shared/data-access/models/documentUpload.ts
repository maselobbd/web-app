import { documentType } from '../../../university-dashboard/enums/DocumentTypes';
import { DocumentStatus } from '../../enums/documentStatus';

export interface DocumentUpload {
  file: any;
  applicationId: number;
  documentStatus: DocumentStatus;
  documentType: string;
  expenseCategory: documentType;
  reason?: string;
  applicationGuid?:string
}