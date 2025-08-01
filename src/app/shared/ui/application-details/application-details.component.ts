import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UserStore } from '../../data-access/stores/user.store';
import { DataService } from '../../data-access/services/data.service';
import { UploadMultipleFilesDialogComponent } from '../upload-multiple-files-dialog/upload-multiple-files-dialog.component';
import { uploadFileDialogData } from '../../data-access/models/uploadDialogData-model';
import { FundSpreadDetailsComponent } from '../fund-spread-details/fund-spread-details.component';
import { DecisionActions } from '../../../university-dashboard/enums/application-actions';
import { StudentService } from '../../../shared/data-access/services/student.service';
import { ExpensesModel } from '../../../university-dashboard/data-access/models/expenses-model';
import { ExpenseCategory } from '../../data-access/models/expenseCategory-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StudentDocument } from '../../data-access/models/studentDocument.models';
import { Ranks, Roles } from '../../../authentication/data-access/models/auth.model';
import { DialogResults } from '../../enums/dialogResults';
import { DialogType } from '../../enums/dialogType';
import { ConfirmAction } from '../../data-access/models/confirmAction.model';
import { DialogMessage } from '../../enums/dialogMessages';
import { DocumentStatus } from '../../enums/documentStatus';
import { SnackBarMessage } from '../../enums/snackBarMessage';
import { SnackBarDuration } from '../../enums/snackBarDuration';
import { getEnumValue } from '../../utils/functions/getEnumValue.function';
import { ButtonAction } from '../../enums/buttonAction';
import { fileDialog } from '../../data-access/models/fileDialog.model';
import { savedFileStatus } from '../../data-access/models/savedFilesStatus.model';
import { getDocumentStatus } from '../../utils/functions/getDocumentStatus.function';
import { checkCategory } from '../../utils/functions/getDocumentCategory.function';
import { AdminService } from '../../../admin/data-access/services/admin.service';
import { getApplicationStatus } from '../../utils/functions/getApplicationStatus.function';
import { DocumentUpload } from '../../data-access/models/documentUpload';
import { DialogTitles } from '../../enums/dialog-titles';
import { DynamicDialogComponentComponent } from '../dynamic-dialog-component/dynamic-dialog-component.component';
import { hasTimePassed } from '../../utils/functions/timePassed.function';
import { ExpensesService } from "../../data-access/services/expenses.service";
import { AppState } from '../../../states/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.scss'],
})
export class ApplicationDetailsComponent implements OnInit {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private userStore: UserStore,
    private dataService: DataService,
    private studentService: StudentService,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private sharedDataService: DataService,
    private expensesService: ExpensesService,
     private store: Store<AppState>, 
  ) {}

  @Input() application: any;
  @Input() role!: Roles;
  @Input() currentTab: string = '';
  @Input() index!:number
  @Input() applicationArrayLength!:number
  @ViewChild(MatCheckboxChange) checkbox!: MatCheckboxChange;
  @Output() triggerStateReload: EventEmitter<boolean> = new EventEmitter<boolean>();
  invoiceTab: string = '';
  checkedInvoices: string[] = [];
  checkboxValue: boolean = false;
  userRole!: Roles;
  universityName: string = '';
  otherInput: string = '';
  isFundSpread: boolean = false;
  decisionActions: any = DecisionActions;
  uploadDialogData!: uploadFileDialogData;
  fundSpread: boolean = false;
  fundSpreadApplicationId!: number;
  moreDetails: string = '';
  uploadButtonMessages: { [key: string]: string } = {
    upload: 'Upload',
    loading: 'Loading',
    viewInvoice: 'View Invoice',
    noInvoiceRequired: 'No invoice required',
  };
  expenseCategories: ExpenseCategory[] = [];
  uploadedInvoice: StudentDocument | undefined = undefined;
  displayedColumns: string[] = ['bursarFullName', 'bursaryAmount', 'status', 'actions'];
  rolesEnum: typeof Roles = Roles;
  administrativeRoles = [this.rolesEnum.admin];
  tabsToNavigateToSmallDetailsPage = ['Pending', 'Pending Info', 'Draft'];
  userRank!: Ranks;
  ranksEnum: typeof Ranks = Ranks;
  tabsToGetExpenseCategory = [
    DocumentStatus.INVOICE,
    DocumentStatus.PAYMENT,
    DocumentStatus.CONTRACT,
  ];
  showDetailsButton = [DocumentStatus.INVOICE, DocumentStatus.PAYMENT];
  buttonAction: typeof ButtonAction = ButtonAction;
  showNudgeButton : boolean = false;

  ngOnInit(): void {
    this.userStore.get().subscribe((user) => {
      this.userRole = Roles[user.role as keyof typeof Roles];
      this.userRank = Ranks[user.rank as keyof typeof Ranks];
    });
    const onAdminPaymentOrInvoice =
      this.tabsToGetExpenseCategory.includes(getEnumValue(this.currentTab)) &&
      this.userRole === this.rolesEnum.admin;
    if (onAdminPaymentOrInvoice) {
      this.setExpenseCategory();
    }

    if (
      this.showDetailsButton.includes(getEnumValue(this.currentTab)) &&
      this.userRole === this.rolesEnum.admin
    ) {
      this.moreDetails = 'details';
    }
    if (
      this.userRole === this.rolesEnum.admin &&
      this.currentTab === 'Contract'
    ) {
      this.getStudentExpense();
    }
    const isAwaitingApproval = [DocumentStatus.AWAITING_EXEC_APPROVAL,DocumentStatus.AWAITING_FINANCE_APPROVAL].includes(this.application.status);
    const isAdmin = this.userRole === this.rolesEnum.admin;
    const isTimePassed = hasTimePassed(this.application.lastEmailSentTime, 7);

    if (((isAwaitingApproval && isTimePassed) || !this.application.lastEmailSentTime)&& isAdmin) {
      this.showNudgeButton = true;
    }
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate;
  }

  setExpenseCategory() {
    const expenseKeys: (keyof ExpensesModel)[] = [
      'accommodation',
      'tuition',
      'meals',
      'other',
    ];
    expenseKeys.forEach((key) => {
      if (this.application[key] === undefined) return;
      const amount = this.application[key] || 0;
      if (amount && amount > 0) {
        this.expenseCategories.push({
          category: key,
          amount: amount,
          isUploaded: false,
        });
      }
    });
  }
  openAdminFileUploadDialog() {
    const dialogRef = this.dialog.open(UploadMultipleFilesDialogComponent, {
      width: '42.25rem',
      height: 'max-content',
      data: {
        uploadDialogData: {
          candidateFullName: this.application.fullName,
          applicationGuid: this.application.applicationGuid,
          applicationId: this.application.applicationId,
          message:
            this.userRank === Ranks.assistant_admin
              ? DialogMessage.UPLOAD_DOCUMENTS_MESSAGE
              : '',
          currentStep: this.currentTab,
          documentType: this.currentTab,
          title:
            this.userRank === Ranks.assistant_admin
              ? 'Upload ' + this.currentTab + ': ' + this.application.fullName
              : 'View ' + this.currentTab + ': ' + this.application.fullName,
          buttonLabel: ButtonAction.SUBMIT+' '+this.currentTab.toLowerCase() + '/s',
          totalAllocation: this.application.amount,
          expenseCategories: this.expenseCategories,
          rank: this.userRank,
          requestedChange: this.application.changeRequested,
        } as uploadFileDialogData,
      },
    });
    dialogRef.afterClosed().subscribe((dialogResult: fileDialog) => {
      if (dialogResult.dialogActionResult === DialogResults.APPROVE) {
        if (this.userRank === Ranks.assistant_admin || this.userRank === Ranks.chief_admin) {
          this.uploadOrConfirmDocuments(
            dialogResult.fileStatus,
            dialogResult.file,
          );
        } else {
          this.studentService
            .openConfirmDialog(
              DialogMessage.APPROVE_INVOICES_TITLE,
              DialogMessage.APPROVE_INVOICES_MESSAGE,
            )
            .subscribe((result: ConfirmAction) => {
              if (result.confirmed) {
                this.uploadOrConfirmDocuments(
                  dialogResult.fileStatus,
                  dialogResult.file,
                );
              }
            });
        }
      } else if (
        dialogResult.dialogActionResult === DialogResults.REQUEST_CHANGES
      ) {
        this.studentService
          .openConfirmDialog(
            DialogMessage.REQUEST_CHANGES_TITLE,
            DialogMessage.REQUEST_CHANGES_MESSAGE,
            DialogType.CONFIRM_WITH_INPUT,
          )
          .subscribe((result: ConfirmAction) => {
            if (result.confirmed) {
              this.uploadOrConfirmDocuments(
                dialogResult.fileStatus,
                dialogResult.file,
                result.reason,
              );
            }
          });
      }
    });
  }
  navigateToDetailsPage(applicationGuid: any) {
    this.dataService.updateCurrentTab(this.currentTab);
    if (this.tabsToNavigateToSmallDetailsPage.includes(this.currentTab)) {
      this.administrativeRoles.includes(this.userRole)
        ? this.router.navigate(['/admin/details', applicationGuid])
        : this.router.navigate(['/dashboard/details', applicationGuid]);
    } else {
      this.userRole === this.rolesEnum.admin
        ? this.router.navigate(['/admin/studentDetails', applicationGuid])
        : this.router.navigate(['/dashboard/studentDetails', applicationGuid]);
    }
  }

  navigateToEmailFailed(applicationGuid: any) {
    this.router.navigate(['/admin/EmailFailed', applicationGuid]);
  }

  spreadFundsDialog(applicationId: number): void {
    const isRenewal = this.getCurrentStatus() === DocumentStatus.PENDING_RENEWAL;
    const dialogRef = this.dialog.open(FundSpreadDetailsComponent, {
      width: '45rem',
      minHeight: '22rem',
      disableClose: true,
      data: {
        fieldLabel: this.currentTab,
        applicationId: applicationId,
        application: this.application,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
         this.expensesService.postExpense(
          result.accommodation, result.tuition, result.meals, result.other, result.reason,
          result.applicationId, DocumentStatus.CONTRACT, this.application.applicationGuid, isRenewal
        )
        .subscribe((expenseData) => {
          if (expenseData) {
            this.snackBar.open('Funds successfully posted!', 'Dismiss', {
              duration: SnackBarDuration.DURATION
            });
            this.triggerDashboardReload();
          } else {
            this.snackBar.open(SnackBarMessage.FAILURE, 'Dismiss', {
              duration: SnackBarDuration.DURATION
            });
          }
        });
      }
    })
  }

  getStudentExpense(): any {
    this.isFundSpread = this.expenseCategories.length > 0 ? true : false;
  }
  confirmAction(): void {
   const isRenewal = this.getCurrentStatus() === DocumentStatus.PENDING_RENEWAL;
   const dialogRef =  this.dialog.open(DynamicDialogComponentComponent, {
      data: {
        dialogHeader: DialogTitles.CONFIRM_CONTRACT,
        dialogContent: DialogMessage.CONTRACT_MESSAGE,
        confirmButtonLabel: 'Upload Contract',
        applicationGuid:this.application.applicationGuid
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.studentService
        .uploadAdminDocuments([
          {
            file: result,
            applicationId: this.application.applicationId,
            documentStatus: DocumentStatus.INVOICE,
            documentType: 'contract',
            expenseCategory: checkCategory('contract'),
            applicationGuid: this.application.applicationGuid,
          } as DocumentUpload,
        ])
        .subscribe((response) => {
          if (!response.errors) {
          this.triggerDashboardReload();
          } else{
            this.snackBar.open(SnackBarMessage.FAILURE, 'Dismiss', {
              duration: SnackBarDuration.DURATION
            });
          }
        });
      }
    })
  }
  uploadOrConfirmDocuments(
    fileStatus: savedFileStatus,
    files: any,
    reason?: string,
) {
    const singleInvoiceFile =
        files['tuition'] ||
        files['accommodation'] ||
        files['meals'] ||
        files['other'];

    const singleFile = (typeof singleInvoiceFile === 'string') ? singleInvoiceFile : '';
    const hasNewDocuments = Object.values(files).some(file => (file as { fileLocation?: string }).fileLocation !== undefined);
    const noNewFiles = singleFile.includes('students') && !hasNewDocuments;

    if (noNewFiles) {
        this.handleNoNewFiles(fileStatus, files, reason);
        return;
    }

    const uploadFiles = this.getUploadFiles(files, fileStatus, reason);

    if (uploadFiles.length > 0) {
        this.studentService.uploadAdminDocuments(uploadFiles).subscribe(result => {
            if (!result.errors) {
                this.triggerDashboardReload();
                this.snackBar.open(SnackBarMessage.SUCCESS,SnackBarMessage.CLOSE,{
                  duration:SnackBarDuration.DURATION
                })
            }else{
              this.snackBar.open(SnackBarMessage.FAILURE,SnackBarMessage.CLOSE,{
                duration:SnackBarDuration.DURATION
              })
            }
        });
    } else {
        this.snackBar.open(SnackBarMessage.NO_FILES, SnackBarMessage.CLOSE, {
            duration: SnackBarDuration.DURATION,
        });
    }
}

private handleNoNewFiles(fileStatus: savedFileStatus, files: any, reason?: string) {
    if (fileStatus.isSaveForLater) {
        this.snackBar.open(SnackBarMessage.SAVED_FILE, 'Close', {
            duration: SnackBarDuration.DURATION,
        });
        return;
    }

    const reConfirmFiles = Object.keys(files).map(key => {
        const file = files[key];
        const tab = this.currentTab === DocumentStatus.PAYMENT
            ? DocumentStatus.PAYMENT
            : DocumentStatus.INVOICE;

        return {
            file: file,
            applicationId: this.application.applicationId,
            documentStatus: getDocumentStatus({
                isSaveForLater: fileStatus.isSaveForLater,
                hasRequestedChanges: fileStatus.hasRequestedChanges,
            }, this.userRank, file.documentType, this.currentTab === DocumentStatus.PAYMENT,this.application.invoiceStatus) as DocumentStatus,
            documentType: tab,
            expenseCategory: checkCategory(key),
            applicationGuid:this.application.applicationGuid,
            reason: reason,
        } as DocumentUpload;
    });

    this.studentService.uploadAdminDocuments(reConfirmFiles).subscribe(result => {
      if (!result.errors) {
          this.triggerDashboardReload();
          this.snackBar.open(SnackBarMessage.SUCCESS, SnackBarMessage.CLOSE, {
            duration: SnackBarDuration.DURATION,
        });
      }else{
         this.snackBar.open(SnackBarMessage.SUCCESS, SnackBarMessage.CLOSE, {
            duration: SnackBarDuration.DURATION,})
      }
    });
}

private getUploadFiles(files: any, fileStatus: savedFileStatus, reason?: string) {
    return Object.keys(files)
        .filter(fileKey => (files[fileKey] as { fileLocation?: string }).fileLocation !== undefined)
        .map(fileKey => {
            const file = files[fileKey];
            return {
                file: file,
                applicationId: this.application.applicationId,
                documentStatus: getDocumentStatus(fileStatus, this.userRank, this.currentTab,this.currentTab === DocumentStatus.PAYMENT,getEnumValue(this.application?.invoiceStatus)),
                documentType: this.currentTab,
                expenseCategory: checkCategory(file.documentType),
                reason: reason,
            } as DocumentUpload;
        });
}

  getCurrentStatus() {
    return getApplicationStatus(this.application, this.currentTab);
  }

  showUploadFilesButton() {
    switch (this.userRank) {
      case Ranks.admin_officer:
        return this.application.invoiceStatus === DocumentStatus.AWAITING_EXEC_APPROVAL;
      case Ranks.assistant_admin:
        return (
          this.application.invoiceStatus === DocumentStatus.INVALID ||
          this.application.invoiceStatus === DocumentStatus.IN_REVIEW ||
          this.application.invoiceStatus === DocumentStatus.PENDING
        );
      case Ranks.senior_admin:
        return this.application.invoiceStatus === DocumentStatus.AWAITING_FINANCE_APPROVAL;
      case Ranks.chief_admin:
        return true;
        default:
          return false;
    }
  }

  showInvoiceWarning(){
    return this.application.changeRequested&& this.application?.changeRequested !== '';
  }

  resendExecutiveEmail() {
    this.adminService.sendEmailEmailToExec(this.application.applicationGuid)
    .subscribe((data) => {
      if (!data.errors) {
        this.showNudgeButton = false;
        this.snackBar.open(SnackBarMessage.SUCCESS, SnackBarMessage.CLOSE, {
          duration: SnackBarDuration.DURATION
      });
      }else{
       this.snackBar.open(SnackBarMessage.FAILURE, SnackBarMessage.CLOSE, {
          duration: SnackBarDuration.DURATION})
      }
  })};

  isAwaitingFundDistribution(): boolean
  {
    return this.application.invoiceStatus === 'Awaiting fund distribution'
  }

   triggerDashboardReload() {
    this.triggerStateReload.emit(true);
    }
}
