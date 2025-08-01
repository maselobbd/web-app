import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { InvoiceComponent } from '../invoice/invoice.component';
import { uploadFileDialogData } from '../../data-access/models/uploadDialogData-model';
import { ExpenseCategory } from '../../data-access/models/expenseCategory-model';
import { ViewDocumentComponent } from '../view-document/view-document.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { InvoiceDataService } from '../../../university-dashboard/data-access/services/invoice-data.service';
import { StudentService } from '../../data-access/services/student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileDownloadService } from '../../../university-dashboard/data-access/services/file-download-service.service';
import { dataUrl } from '../../enums/dataURIs';
import { AdminService } from '../../../admin/data-access/services/admin.service';
import { fileDialog } from '../../data-access/models/fileDialog.model';
import { Ranks } from '../../../authentication/data-access/models/auth.model';
import { DialogResults } from '../../enums/dialogResults';
import { DialogDimensions } from '../../enums/dialogDimensions';
@Component({
  selector: 'app-upload-multiple-files-dialog',
  templateUrl: './upload-multiple-files-dialog.component.html',
  styleUrl: './upload-multiple-files-dialog.component.scss',
})
export class UploadMultipleFilesDialogComponent {
  title: string = '';
  message: string = '';
  totalAllocation: number = 0;
  applicationGuid: string = '';
  action: string = 'Submit invoices';
  uploadForm!: FormGroup;
  currentTab: string = '';
  expenseCategories!: ExpenseCategory[];
  files: { [key: string]: any } = {};
  uploadFileDialogData!: uploadFileDialogData;
  enableSubmitButton: boolean = false;
  router: any;
  ranksEnum: typeof Ranks = Ranks;

  constructor(
    public dialogRef: MatDialogRef<UploadMultipleFilesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private breakpointObserver: BreakpointObserver,
    private invoiceDataService: InvoiceDataService,
    private studentService: StudentService,
    private snackBar: MatSnackBar,
    private fileDownloadService: FileDownloadService,
  ) {
    this.uploadFileDialogData = data.uploadDialogData;
    this.getDocuments();
  }
  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      tuition: [''],
      accommodation: [''],
      meals: [''],
      other: [''],
    });
  }
  closeDialog(): void {
    this.dialogRef.close(false);
  }
 
  onSubmit(isSaveForLater: boolean) {
      this.dialogRef.close({
        dialogActionResult: DialogResults.APPROVE,
        file: this.files,
        fileStatus: {
          isSaveForLater: isSaveForLater,
          hasRequestedChanges: false,
        },
      } as fileDialog);
  }

  getExpenseType(expense: number) {
    switch (expense) {
      case 1:
        return 'tuition';
      case 2:
        return 'accommodation';
      case 3:
        return 'meals';
      case 4:
        return 'other';
      default:
        return 'other';
    }
  }
  uploadFile(expense: ExpenseCategory) {
    const uploadDialog = this.dialog.open(InvoiceComponent, {
      width: '42.25rem',
      height: 'max-content',
      disableClose: true,
      data: {
        fieldLabel: this.uploadFileDialogData.currentStep,
        currentStep: this.uploadFileDialogData.currentStep,
        title: 'Upload ' + this.uploadFileDialogData.currentStep,
        fullName: this.uploadFileDialogData.candidateFullName,
        message: 'Please select files to upload',
        applicationId: this.uploadFileDialogData.applicationGuid,
        expenseCategory: expense,
      },
    });

    uploadDialog.afterClosed().subscribe((result) => {
      if (result) {
        if (expense.category == result.documentType) {
          const documentName = result.documentType;
          this.files[documentName] = result;
          expense.isUploaded = true;
        }
      }
    });
  }

  getDocuments() {
    this.studentService
      .getApplicationAdminDocuments(
        this.uploadFileDialogData.applicationGuid,
        this.uploadFileDialogData.currentStep,
        this.uploadFileDialogData.currentStep === 'Invoice'
          ? 'In Review'
          : 'Approved',
      )
      .subscribe((data) => {
        if (data.results) {
          data.results.forEach((result: any) => {
            const expenseType = this.getExpenseType(result.expenseCategoryId);
            this.files[expenseType] = result.documentBlobName;

            const expenseCategory =
              this.uploadFileDialogData.expenseCategories?.find(
                (category: any) => category.category === expenseType,
              );

            if (expenseCategory) {
              expenseCategory.isUploaded = true;
            }
          });
        }
      });
  }
  enableSaveForLater() {
    return !(Object.keys(this.files)?.length > 0);
  }
  enableSubmit(): boolean {
    return (
      !this.files ||
      !this.uploadFileDialogData?.expenseCategories ||
      Object.keys(this.files)?.length !==
        this.uploadFileDialogData.expenseCategories.length
    );
  }
  viewFile(expense: ExpenseCategory) {
    const safeUrl: SafeResourceUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(
        this.files[expense.category].fileLocation ||
          this.files[expense.category],
      );

    if (typeof this.files[expense.category] == 'object')
      return this.openDialogView(safeUrl, expense);

    this.fileDownloadService
      .getFileByName(this.files[expense.category])
      .subscribe((data) => {
        const fileSource = this.sanitizer.bypassSecurityTrustResourceUrl(
          dataUrl[data.fileExtention as keyof typeof dataUrl] + data.base64,
        );

        this.openDialogView(fileSource, expense);
      });
  }

  openDialogView(safeUrl: SafeResourceUrl, expense: ExpenseCategory) {
    const viewDialog = this.dialog.open(ViewDocumentComponent, {
      maxWidth: DialogDimensions.MAXWIDTH,
      maxHeight: DialogDimensions.MAXHEIGHT,
      width: DialogDimensions.WIDTH_EIGHTY,
      height: DialogDimensions.HEIGHT_EIGHTY,
      data: {
        url: safeUrl,
        expense: expense,
        blob: this.files[expense.category].fileLocation,
        tab: this.uploadFileDialogData.currentStep.toLowerCase(),
      },
    });
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait])
      .subscribe((result) => {
        if (result.matches) {
          viewDialog.updateSize('99vw', '80vh');
        } else {
          viewDialog.updateSize('60vw', '70vh');
        }
      });
    viewDialog.afterClosed().subscribe((result) => {
      if (result) {
        delete this.files[result.category];
        expense.isUploaded = false;
        this.invoiceDataService
          .deleteInvoice(
            this.uploadFileDialogData.applicationId,
            expense.category,
          )
          .subscribe((data) => {
            if (data.results) {
              this.snackBar.open('Invoice deleted successfully', 'Close', {
                duration: 3000,
              });
            }
            if (data.errors) {
              this.snackBar.open('Invoice not uploaded', 'Close', {
                duration: 3000,
              });
            }
          });
      }
    });
  }
  RequestChanges() {
    this.dialogRef.close({
      dialogActionResult: DialogResults.REQUEST_CHANGES,
      file: this.files,
      fileStatus: {
        isSaveForLater: false,
        hasRequestedChanges: true,
      },
    } as fileDialog);
  }
  hasRequestedChange() {
    return this.uploadFileDialogData.requestedChange && this.uploadFileDialogData.requestedChange !== '';
  }
  hasFiles():boolean{
    return Object.keys(this.files).length > 0;
  }
}
