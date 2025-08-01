import { FileContents } from "../../shared/data-access/models/file-contents.model";

export interface StudentDocumentData {
    matricCertificate: FileContents;
    academicTranscript: FileContents;
    identityDocument: FileContents
    financialStatement: FileContents;
    profilePicture: FileContents;
}