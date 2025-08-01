import { Ranks } from "../../../authentication/data-access/models/auth.model";
import { ExpenseCategory } from "./expenseCategory-model";

export interface uploadFileDialogData {
    title: string;
    message: string;
    buttonLabel: string;
    currentStep: string;
    candidateFullName: string;
    applicationGuid: string;
    applicationId: number;
    documentType: string;
    expenseCategories?: ExpenseCategory[];
    totalAllocation: number;
    rank: Ranks;
    requestedChange?: string;
}