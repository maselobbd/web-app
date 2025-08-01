import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExpenseCategory } from '../../data-access/models/expenseCategory-model';

@Component({
  selector: 'app-remove-document-dialog',
  templateUrl: './remove-document-dialog.component.html',
  styleUrl: './remove-document-dialog.component.scss'
})
export class RemoveDocumentDialogComponent {
    expense!: ExpenseCategory
    documentType!: string
    constructor(private dialogRef: MatDialogRef<RemoveDocumentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
      this.expense=data.expense
      this.documentType=data.documentType
    }

    closeDialog(): void {
      this.dialogRef.close();
    }
    confirm(){
      this.dialogRef.close(this.expense);
    }

}
