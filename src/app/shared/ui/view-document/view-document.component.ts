import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { RemoveDocumentDialogComponent } from '../remove-document-dialog/remove-document-dialog.component';
import { ExpenseCategory } from '../../data-access/models/expenseCategory-model';
import { FileDownloadService } from '../../../university-dashboard/data-access/services/file-download-service.service';

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrl: './view-document.component.scss',
})
export class ViewDocumentComponent {
  file: any;
  expense!: ExpenseCategory;
  blob: any;
  currentTab!: string;
  constructor(
    public dialogRef: MatDialogRef<ViewDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private fileDownloadService: FileDownloadService,
  ) {
    this.file = data.url.changingThisBreaksApplicationSecurity
    this.expense = data.expense;
    this.blob = data.blob;
    this.currentTab = data.tab;
  }
  close() {
    this.dialogRef.close();
  }
  download() {
    this.fileDownloadService.downloadFile(
      this.data.url.changingThisBreaksApplicationSecurity,
    );
  }
  remove() {
    const deleteFileDialog = this.dialog.open(RemoveDocumentDialogComponent, {
      data: {
        expense: this.expense,
        documentType: this.currentTab,
       },
    });
    deleteFileDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.expense = result;
        this.dialogRef.close(this.expense);
      }
    });
  }
}
