import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-application-dialog',
  templateUrl: './application-dialog.component.html',
  styleUrl: './application-dialog.component.scss'
})
export class ApplicationDialogComponent {
  dialogTitle: string = '';
  dialogContent: string = '';
  actionButtons={start:'',continue:''};
  constructor(private dialogRef: MatDialogRef<ApplicationDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: any,) { 
    this.dialogTitle = data.title;
    this.dialogContent = data.message;
    this.actionButtons = data.buttonText;
  }
  continueApplication() {
    this.dialogRef.close('continue');
    }
    startNewApplication() {
    this.dialogRef.close('start');
    }
    cancel() {
    this.dialogRef.close('close');
    }
}
