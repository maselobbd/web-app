import { DialogTitles } from "../../../shared/enums/dialog-titles";
import { DialogMessage } from "../../../shared/enums/dialogMessages";

export interface RejectionDialog {
  dialogHeader: DialogTitles;
  dialogContent: DialogMessage;
  applicationGuid: string;
  declinedReasons: string[];
  minAmount: number;
  maxAmount: number;
}
