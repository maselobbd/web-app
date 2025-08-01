import { FormControl } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";

export interface Student {
  studentId: number;
  firstName: string;
  lastName: string;
  Email: string;
  University: string;
  Faculty: string;
  applicationId: number;
  applicationStatusHistoryDate: Date;
  canRequest:boolean;
  bursaryType:string;
}

export type ValidationValues = {
  formControlValue: number;
  formControl: FormControl;
  selectionChange: MatSelectChange;
}
