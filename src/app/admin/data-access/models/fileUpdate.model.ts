export interface FileUpdate{
    file?:string,
    newFile?:string,
    documentType:string,
    previousFile:string,
    reasonForUpdate:string,
    actionToPerfom:string,
    applicationGuid:string
}