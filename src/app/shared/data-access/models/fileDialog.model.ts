import { DialogResults } from "../../enums/dialogResults";
import { savedFileStatus } from "./savedFilesStatus.model";

export interface fileDialog{
    dialogActionResult: DialogResults,
    file: any,
    fileStatus: savedFileStatus,
}