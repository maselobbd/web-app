import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dropdown-dialog',
  templateUrl: './dropdown-dialog.component.html',
  styleUrl: './dropdown-dialog.component.scss'
})
export class DropdownDialogComponent {
  selectedOptions: { [key: string]: string } = {};

  constructor(
    public dialogRef: MatDialogRef<DropdownDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
title: any; dropdowns: { label: string, options: string[], key: string, default: string }[] 
}
  ) {
    data.dropdowns.forEach(dropdown => {
      this.selectedOptions[dropdown.key] = dropdown.default;
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.selectedOptions);
  }
  isSubmitEnabled(): boolean {
    return this.data.dropdowns.every(dropdown => 
      this.selectedOptions[dropdown.key]
    );
  }
}
