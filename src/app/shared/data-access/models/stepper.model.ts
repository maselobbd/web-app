import { FormGroup } from "@angular/forms";

export interface StepData {
  label: string;
  description: string;
  formGroup: FormGroup;
  completed: () => boolean;
}
