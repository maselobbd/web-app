import { FileContents } from "../../shared/data-access/models/file-contents.model";

export interface AdminDocumentData {
    contract: FileContents[];
    invoices: FileContents[];
    payments: FileContents[];
}