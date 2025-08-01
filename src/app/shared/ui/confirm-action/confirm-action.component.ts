import { AfterContentChecked, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { DialogType } from '../../enums/dialogType';

@Component({
  selector: 'app-confirm-action',
  templateUrl: './confirm-action.component.html',
  styleUrl: './confirm-action.component.scss'
})
export class ConfirmActionComponent implements AfterContentChecked {
  dialogTitle: string = '';
  dialogContent: string = '';
  inputFormGroup!: FormGroup;
  dialogType: DialogType
  dialogTypeEnum: typeof DialogType = DialogType
  
  constructor(private dialogRef: MatDialogRef<ConfirmActionComponent>,  @Inject(MAT_DIALOG_DATA) public data: any,private formBuilder:  FormBuilder, private cdr: ChangeDetectorRef) {
    this.dialogTitle = data.title;
    this.dialogContent = data.message;
    this.dialogType = data.dialogType;
    this.inputFormGroup = this.formBuilder.group({
      input: ['', RxwebValidators.required({conditionalExpression: () => this.dialogType == DialogType.CONFIRM_WITH_INPUT})],
    });
    
  }
  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }
  cancel() {
    this.dialogRef.close({confirmed:false, reason:''});
  }
  confirm() {
    this.dialogRef.close({ confirmed: true, reason:this.inputFormGroup.get('input')?.value});
  }
}
