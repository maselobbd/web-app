import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Application } from '../../data-access/models/application.model';
import { FormBuilder, FormControl, FormArray, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ButtonAction } from '../../../shared/enums/buttonAction';
import { ErrorMessages } from '../../enums/messages';
import { DialogMessage } from '../../../shared/enums/dialogMessages';
import { DialogTitles } from '../../../shared/enums/dialog-titles';

@Component({
  selector: 'app-renew-application-dialog',
  templateUrl: './renew-application-dialog.component.html',
  styleUrl: './renew-application-dialog.component.scss',
})
export class RenewApplicationDialogComponent {
  applicant!: Application;
  renewApplicationForm!: FormArray;
  yearsOfStudy = ["2nd", "3rd", "4th", "Honours", "Masters", "Phd"];
  buttonAction = ButtonAction;
  errorMessages=ErrorMessages;
  dialogMessages=DialogMessage;
  dialogTitles= DialogTitles;
  @ViewChild(MatStepper) stepper!: MatStepper;

  constructor(
    private dialogRef: MatDialogRef<RenewApplicationDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private fb: FormBuilder,
  ) {
    this.applicant = data.applicant;

    this.renewApplicationForm = this.fb.array([
      this.fb.group({
        amount: new FormControl(this.applicant.amount, [
          RxwebValidators.required({
            conditionalExpression: () => this.stepper.selectedIndex === 2
          }),
          RxwebValidators.minNumber({ value: this.data.minAmount, conditionalExpression: () => this.stepper.selectedIndex === 2 }),
          RxwebValidators.maxNumber({ value: this.data.maxAmount, conditionalExpression: () => this.stepper.selectedIndex === 2 })
        ]),
        yearOfStudy: new FormControl(this.applicant.yearOfStudy, [
          RxwebValidators.required({
            conditionalExpression: () => this.stepper.selectedIndex === 1
          })
        ]),
        name: new FormControl(this.applicant.name)
      }),
    ]);
  }

  submit() {
  this.dialogRef.close(this.renewApplicationForm.getRawValue())
  }

  close() {
    this.dialogRef.close();
  }

  get amountFormGroup() {
    return this.renewApplicationForm.at(0) as FormGroup;
  }

  get yearOfStudyFormGroup() {
    return this.renewApplicationForm.at(0) as FormGroup;
  }
}
