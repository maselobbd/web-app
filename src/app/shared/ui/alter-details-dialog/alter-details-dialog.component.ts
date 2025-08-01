import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alter-details-dialog',
  templateUrl: './alter-details-dialog.component.html',
  styleUrl: './alter-details-dialog.component.scss'
})
export class AlterDetailsDialogComponent {

  title = 'Edit personal information';
  label='';
  detailsForm!: FormGroup;
  constructor(private dialogRef: MatDialogRef<AlterDetailsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detailsForm = new FormGroup({
      contactNumber: new FormControl(this.data.contactNumber, [Validators.required, Validators.maxLength(13)]),
      address: new FormControl(this.data.address, [Validators.required]),
      suburb: new FormControl(this.data.suburb, [Validators.required]),
      city: new FormControl(this.data.city, [Validators.required]),
      code: new FormControl(this.data.code, [Validators.required]),
      email: new FormControl(this.data.email, [Validators.required, Validators.email]),
    });
  } 


  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.detailsForm);
  }
}
