import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BursaryApplicationsService } from '../../../admin/data-access/services/bursaryApplications.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadFile } from '../../data-access/models/fileupload.model';
import { AdminService } from '../../../admin/data-access/services/admin.service';
import { UserStore } from '../../data-access/stores/user.store';
import { ExpenseCategory } from '../../data-access/models/expenseCategory-model';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
})
export class InvoiceComponent {
  @Input() applicationId!: number;
  bulkApplicationsId!: UploadFile[];
  file!: UploadFile;
  router: any;
  userRole: string | undefined;
  currentStep!: string;
  title: string = '';
  fullName: string = '';
  message: string = '';
  expenseCategory!: ExpenseCategory;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bursaryService: BursaryApplicationsService,
    private _snackBar: MatSnackBar,
    private adminService: AdminService,
    private userStore: UserStore,
    private dialogRef: MatDialogRef<InvoiceComponent>,
  ) {
    this.applicationId = data.applicationId;
    this.expenseCategory = data.expenseCategory;
    this.currentStep = data.currentStep;
    this.title = data.title;
    this.fullName = data.fullName;
    this.message = data.message;
    this.userStore.get().subscribe((user) => {
      this.userRole = user.role;
    });
  }
  
  getButtonLabel(): string {
    if (this.currentStep === 'Invoice') {
      return 'Add invoice';
    } else {
      return 'Add payment';
    }
  }
  addFile($event: any) {
    this.file = $event;
  }

  Cancel() {
    this.dialogRef.close();
  }
  addInvoice() {
    this.dialogRef.close(this.file);
  }
}
