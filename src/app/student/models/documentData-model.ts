import { studentDocument } from "./document-model";

export interface DocumentData {
    contract: studentDocument[];
    invoice: studentDocument[];
    payments: studentDocument[];
}