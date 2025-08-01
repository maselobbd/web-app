import { AdminDocumentData } from "../../../student/models/downloadedAdminDocumentData.model";
import { StudentDocumentData } from "../../../student/models/downloadedStudentDocumentData.model";
import { EventPhoto, StudentProfilePicture } from "../../../student/models/photo.model";
import { FileContents } from "../../data-access/models/file-contents.model";

export function fileTraverser(downloadedDocuments: AdminDocumentData, fullDocumentName: string): FileContents {
    const documentName = fullDocumentName.split(/[/.]/)[1];
    const fileContents = Object.values(downloadedDocuments).flatMap(files => files).find(file => file.fileName === documentName);
    return fileContents ?? undefined;
}

export function studentFileTraverser(downloadedDocuments: StudentDocumentData | StudentProfilePicture, fullDocumentName: string): FileContents {
    const documentName = fullDocumentName.split(/[/.]/)[1];
    const fileContents = Object.values(downloadedDocuments).filter(Boolean).find(file => file.fileName === documentName);
    return fileContents ?? undefined;
}

export function eventFileTraverser(downloadedDocuments: EventPhoto, fullDocumentName: string): FileContents {
    const documentName = fullDocumentName.split(/[/.]/)[1];
    const fileContents = Object.values(downloadedDocuments).filter(Boolean).find(file => file.fileName === documentName);
    return fileContents ?? undefined;
}