import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogTitles } from '../../../shared/enums/dialog-titles';
import { ButtonAction } from '../../../shared/enums/buttonAction';
import { ErrorMessages } from '../../../admin/enums/errorMessages';
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { status } from "../../../shared/enums/statusEnum";
import { RejectionDialog } from "../../../admin/data-access/models/rejectionDialog-model";

@Component({
  selector: 'app-reject-student',
  templateUrl: './reject-student.component.html',
  styleUrls: ['./reject-student.component.scss', '../../../shared/ui/dynamic-dialog-component/dynamic-dialog-component.component.scss'],
})
export class RejectStudentComponent implements OnInit {
  errorMessages = ErrorMessages;
  contractFailedTitle = DialogTitles.CONTRACT_FAILED;
  amendBursaryAmountTitle = DialogTitles.AMEND_BURSARY_AMOUNT;
  applicationDeclineTitle = DialogTitles.DECLINE_APPLICATION;
  terminateBursaryTitle = DialogTitles.TERMINATE_BURSARY;
  confirmButton = ButtonAction.CONFIRM;
  cancelButton = ButtonAction.CANCEL;
  applicationStatusForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<RejectStudentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RejectionDialog,
    private formBuilder: FormBuilder,
  ) {
    this.applicationStatusForm = this.formBuilder.group({
      declineReason: ['', [
        RxwebValidators.required({
          conditionalExpression: () => this.data.dialogHeader === this.applicationDeclineTitle
        })
      ]],
      motivation: ['', [
        RxwebValidators.required({
          conditionalExpression: () =>
            this.applicationStatusForm.get('declineReason')?.value === status.OTHER ||
            this.applicationStatusForm.get('terminateReason')?.value === status.OTHER
        })
      ]],
      amendedAmount: ['', [
          Validators.min(data.minAmount ?? 0),
          Validators.max(data.maxAmount ?? 0),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
          RxwebValidators.required({
            conditionalExpression: () => this.data.dialogHeader === this.amendBursaryAmountTitle
          })
      ]],
      terminateReason: ['', [
        RxwebValidators.required({
          conditionalExpression: () => this.data.dialogHeader === this.terminateBursaryTitle
        })
      ]]
    });
  }

  ngOnInit(): void {
    this.updateMotivationValidator('declineReason');
    this.updateMotivationValidator('terminateReason');
  }

  get declineReason() {
    return this.applicationStatusForm.get('declineReason');
  }

  get motivation() {
    return this.applicationStatusForm.get('motivation');
  }

  rejectStudent(): void {
    this.dialogRef.close(this.applicationStatusForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  isButtonDisabled(): boolean {
    const { dialogHeader } = this.data;
    const form = this.applicationStatusForm;
    const amendedAmount = form.get('amendedAmount')?.value;
    const declineReason = form.get('declineReason')?.value;
    const motivation = form.get('motivation')?.value;

    if (dialogHeader === this.amendBursaryAmountTitle) {
      return !amendedAmount || !form.valid;
    }

    if (
      (dialogHeader === this.contractFailedTitle || dialogHeader === this.applicationDeclineTitle) &&
      (!declineReason || (declineReason === status.OTHER && !motivation))
    ) {
      return true;
    }
    return !form.valid;
  }

  updateMotivationValidator(formControl: string): void {
    this.applicationStatusForm.get(formControl)?.valueChanges.subscribe(value => {
      const motivationControl = this.applicationStatusForm.get('motivation');
      if (value === status.OTHER) {
        motivationControl?.setValidators([Validators.required]);
      } else {
        motivationControl?.clearValidators();
        motivationControl?.setValue('');
      }
      motivationControl?.updateValueAndValidity();
    });
  }

  protected readonly status = status;
}
