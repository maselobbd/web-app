import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../shared/data-access/services/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStore } from '../../../shared/data-access/stores/user.store';
import { MatDialog } from '@angular/material/dialog';
import { RejectStudentComponent } from '../reject-student/reject-student.component';
import { DecisionActions } from '../../enums/application-actions';
import { ViewDocumentsComponent } from '../view-documents/view-documents.component';
import { QuestionnaireResponse } from '../../../shared/data-access/models/questionnaireResponse.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DocumentData } from '../../../student/models/documentData-model';
import { FileDownloadService } from '../../data-access/services/file-download-service.service';
import { hasFundDistribution } from '../../../shared/utils/functions/checkFundDistribution.function';
import { UniversityStudentDetails } from '../../data-access/models/student-details-model';
import {
  Ranks,
  Roles,
} from '../../../authentication/data-access/models/auth.model';
import { DocumentStatus } from '../../../shared/enums/documentStatus';
import { SnackBarMessage } from '../../../shared/enums/snackBarMessage';
import { SnackBarDuration } from '../../../shared/enums/snackBarDuration';
import { DialogMessage } from '../../../shared/enums/dialogMessages';
import { ConfirmActionComponent } from '../../../shared/ui/confirm-action/confirm-action.component';
import { ConfirmAction } from '../../../shared/data-access/models/confirmAction.model';
import { DialogType } from '../../../shared/enums/dialogType';
import { ButtonAction } from '../../../shared/enums/buttonAction';
import { hasValidResults } from '../../../shared/utils/functions/checkData.function';
import { getEnumValue } from '../../../shared/utils/functions/getEnumValue.function';
import { DataService } from '../../../shared/data-access/services/data.service';
import { ApplicationInsightsService } from '../../../shared/data-access/services/application-insights.service';
import { RouteNames } from '../../../shared/enums/routeNames';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { DialogTitles } from '../../../shared/enums/dialog-titles';
import { DynamicDialogComponentComponent } from '../../../shared/ui/dynamic-dialog-component/dynamic-dialog-component.component';
import { AdminService } from '../../../admin/data-access/services/admin.service';
import { getSUDocumentStatus } from '../../../shared/utils/functions/suApplicationStatusUpdate.function';
import { reloadComponent } from '../../../shared/utils/functions/reloadComponent';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { revertAction } from '../../../shared/data-access/models/revertAction.model';
import { currentFiscalYear } from '../../../shared/utils/functions/dateUtils';
import { formatApplicationStatusHistory, formatInvoiceStatusHistory } from '../../../shared/utils/functions/formatApplicationHistory.function';
import { expenseCategory } from '../../enums/expenseCategory.model';
import { UploadProfilePictureComponent } from '../../../shared/ui/upload-profile-picture/upload-profile-picture.component';
import { FileContents } from '../../../shared/data-access/models/file-contents.model';
import { documentTypeName } from '../../enums/documentType.model';
import { ButtonActionsBuilder } from '../../../shared/utils/helper-classes/button-builder.class';
import { Application } from '../../../application/data-access/models/application.model';
import { RenewApplicationDialogComponent } from '../../../application/ui/renew-application-dialog/renew-application-dialog.component';
import { applicationService } from '../../../application/data-access/services/application.service';
import { DOC_CATEGORIES } from '../../enums/document-identifiers';

import { AdminDocumentData } from '../../../student/models/downloadedAdminDocumentData.model';
import { fileTraverser } from '../../../shared/utils/functions/traverseDownloadedFiles.function';
import { dashboardData } from '../../../states/dashboard/dashboard.action';
import { Store } from '@ngrx/store';
import { AppState } from '../../../states/app.state';
import { selectViewType } from '../../../states/dashboard/dashboard.selector';
import { combineLatest, take } from 'rxjs';
import { DialogDimensions } from '../../../shared/enums/dialogDimensions';
@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss', '../../../shared/utils/styling/sharedStudentDetails.scss', '../../../shared/utils/styling/footer.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class StudentDetailsComponent implements OnInit {
  student!: UniversityStudentDetails;
  applicationGuid: string = '';
  role!: string;
  userRoles!: Roles;
  isAdmin = false;
  administrativeRole = [Roles.admin, Roles.finance];
  showActions: boolean = false;
  decisionActions: any = DecisionActions;
  documentTypes!: any;
  showDocumentations: boolean;
  documents: any[] = [];
  currentTab: string = '';

  expenses: any;
  questionnaireResponses: QuestionnaireResponse[];
  isFundSpread: boolean = false;
  averages: any = {
    matric: 0,
    academicRecord: 0,
  };
  studentDocuments?: DocumentData;
  downloadedAdminDocuments?: AdminDocumentData;
  administrativeRoles: string[] = ['admin'];
  documentsStatus: typeof DocumentStatus = DocumentStatus;
  userRank!: Ranks;
  ranksEnum: typeof Ranks = Ranks;
  adminDocumentStatus = [
    DocumentStatus.APPROVED,
    DocumentStatus.AWAITING_FUND_DISTRIBUTION,
    DocumentStatus.IN_REVIEW,
    DocumentStatus.AWAITING_EXEC_APPROVAL,
    DocumentStatus.AWAITING_FINANCE_APPROVAL,
    DocumentStatus.PENDING_RENEWAL
  ];
  showApplicationActions!: boolean;
  applicationStatus!: DocumentStatus;
  groupedApplicationHistories: any = []
  expenseCategory = expenseCategory
  menuItems=[];
  buttonLabel= ButtonAction.VIEW;
  deletableDocTypes = new Map<string, number>();
  averageGrade: number= -1;
  viewtype: string = '';
  date: number = currentFiscalYear();
  studentFullname: string = '';
  declinedReasons!: string[];

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private userStore: UserStore,
    public dialog: MatDialog,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private fileDownloadService: FileDownloadService,
    private sharedDataService: DataService,
    private applicationInsights: ApplicationInsightsService,
    private adminService: AdminService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private applicationService: applicationService,
    private store: Store<AppState>,
  ) {
    this.userStore.get().subscribe((user) => {
      this.role = user.role;
      this.userRank = Ranks[user.rank as keyof typeof Ranks];
      this.userRoles = Roles[user.role as keyof typeof Roles];
      this.isAdmin = this.administrativeRole.includes(this.userRoles);
    });
    this.showDocumentations = false;
    this.questionnaireResponses = [];

    this.matIconRegistry.addSvgIcon(
      `revert`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/revert_icon.svg")
    )
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.applicationGuid = params['id'];
      this.getStudentDetails(this.applicationGuid);
      this.adminService.getDeclinedReasons().subscribe((data) => {
        if (hasValidResults(data)) {
          this.declinedReasons = data.results!;
        }
      });
    });
    this.store.select(selectViewType).pipe(take(1)).subscribe((viewType) => {
      this.viewtype = viewType
    })
    this.applicationInsights.logPageView(RouteNames.STUDENT_DETAILS, this.router.url);
  }

  getStudentDetails(applicationGuid: string): void {
    this.studentService
      .getStudentDetailsByGuid(applicationGuid)
      .subscribe((data) => {
        if (data.results) {
          this.student = data.results;
          this.studentFullname = `${this.student.name} ${this.student.surname}`;
          this.showActions =
            this.administrativeRoles.includes(this.role) &&
            ((!this.student.invoiceStatus && !this.fundDistributed() && this.student.status !== DocumentStatus.REJECTED) || this.showApplicationActions ||
              (this.student.invoiceStatus === this.documentsStatus.AWAITING_FINANCE_APPROVAL && (
                  this.userRank === this.ranksEnum.senior_admin ||
                  this.userRank === this.ranksEnum.admin_officer ||
                  this.userRank === this.ranksEnum.chief_admin)
              ));
          this.showApplicationActions =
            this.student.status === DocumentStatus.IN_REVIEW ||
            this.student.status === DocumentStatus.PENDING_RENEWAL ||
            this.isExecApprover() ||
            this.isFinApprover() ||
            this.isSUApprover()
          this.checkStudentExpense();
          this.groupedApplicationHistories = [...formatApplicationStatusHistory(this.student.ApplicationHistory, this.studentFullname),...formatApplicationStatusHistory(this.student.detailsUpdates!, this.studentFullname),
            ...formatApplicationStatusHistory(this.student.fundDistribution!, this.studentFullname),
            ...formatInvoiceStatusHistory(this.student.InvoiceHistory!), ...formatApplicationStatusHistory(this.student.documentsUpdate!, this.studentFullname)
          ].sort((applicationHistoryA, applicationHistoryB) => (new Date(applicationHistoryA.fromDate) < new Date(applicationHistoryB.fromDate) ? -1 : 1));
          this.studentDocuments = this.student.AdminDocuments;
          this.downloadedAdminDocuments = this.student.DownloadedAdminDocuments;
          this.updateShowDocumentationsFlag();
        } else {
          this.displayError(`${SnackBarMessage.FAILURE} ${data.errors}`);
        }
      });
  }


  goBack() {
    if(this.userRoles === Roles.admin&& (this.viewtype !== 'all' && this.viewtype !== ''))
    {
      this.router.navigate(['/admin/dashboard'], {
        queryParams: { viewType: this.viewtype, university: this.student.university },
        state: { fromStudentDetails: true }
      });
    }
    else{
      window.history.back();
    }
  }
  declineApplication(): void {
  const dialogRef =  this.dialog.open(RejectStudentComponent, {
      data: {
        dialogHeader:DialogTitles.DECLINE_APPLICATION,
        dialogContent:DialogMessage.DECLINED_APPLICATION_MESSAGE,
        applicationGuid: this.applicationGuid,
        declinedReasons: this.declinedReasons
      },
    });
    dialogRef.afterClosed().subscribe((result)=>{
      this.adminService
      .rejectApplication(
        DocumentStatus.REJECTED,
        this.applicationGuid,
       result.declineReason,
        result.motivation,
      )
      .subscribe((data) => {
        reloadComponent(true,this.router);
         this.triggerDashboardReload();
      });
    })
  }

  terminateBursary(): void {
    const dialogRef = this.dialog.open(RejectStudentComponent, {
      data: {
        dialogHeader: DialogTitles.TERMINATE_BURSARY,
        dialogContent: DialogMessage.TERMINATE_BURSARY_MESSAGE,
        applicationGuid: this.applicationGuid,
        declinedReasons: this.declinedReasons
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.adminService.terminateBursary(
        DocumentStatus.TERMINATED,
        this.applicationGuid,
        result.terminateReason,
        result.motivation
      ).subscribe((data) => {
        reloadComponent(true, this.router);
        this.triggerDashboardReload();
      });
    })
  }

  setStatus(status: string) {
    switch (status) {
      case 'Pending':
        return 'Pending invoice';
      case 'Approved':
        return 'Bursary Active';
      case 'In Review':
        return 'Pending payment';
      default:
        return '';
    }
  }
  getStatus(): DocumentStatus {
    this.applicationStatus = getEnumValue(this.student.status);
    if(this.applicationStatus === DocumentStatus.PENDING_RENEWAL)
      return DocumentStatus.AWAITING_EXEC_APPROVAL;

    switch (this.userRank) {
      case Ranks.assistant_admin:
        return DocumentStatus.AWAITING_EXEC_APPROVAL;
      case Ranks.admin_officer:
        return DocumentStatus.AWAITING_FINANCE_APPROVAL;
      case Ranks.senior_admin:
        return DocumentStatus.APPROVED ;
      case Ranks.chief_admin:
        return getSUDocumentStatus(this.applicationStatus,true)
      default:
        return DocumentStatus.IN_REVIEW;
    }
  }

  confirmAction(): void {
    const status = this.getStatus();
    const isRenewal = this.applicationStatus === DocumentStatus.PENDING_RENEWAL;

    const dialogRef = this.dialog.open(DynamicDialogComponentComponent, {
      data: {
        dialogHeader: DialogTitles.ACCEPT_APPLICATION,
        dialogContent: DialogMessage.ACCEPT_APPLICATION_MESSAGE,
        applicationGuid: this.applicationGuid
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminService
          .updateApplicationStatus(status, this.applicationGuid, isRenewal)
          .subscribe((data) => {
            if (data.results) {
                reloadComponent(true, this.router);
                this.triggerDashboardReload();
            } else if (data.errors) {
              this.displayError(`${SnackBarMessage.FAILURE} ${data.errors}`);
            }
          }
        );
      }
    });
  }
  amendBursaryAmount(): void {
   const dialogRef= this.dialog.open(RejectStudentComponent, {
      data:{
        dialogHeader :DialogTitles.AMEND_BURSARY_AMOUNT,
        dialogContent: DialogMessage.AMEND_BURSARY_AMOUNT_MESSAGE,
        minAmount: this.student.minAmount,
        maxAmount: this.student.maxAmount
      }
    });
  dialogRef.afterClosed().subscribe((result)=>{
    if(result){
        this.adminService.updateBursaryAmount(this.applicationGuid,result.amendedAmount)
          .subscribe((data) => {
            if (data.results) {
              reloadComponent(true,this.router);
              this.triggerDashboardReload();
              this.snackbar.open(SnackBarMessage.SUCCESS,"",{duration:SnackBarDuration.DURATION})
            } else if (data.errors) {
              this.displayError(`${SnackBarMessage.FAILURE} ${data.errors}`);
            }
          });
      }
    })
}

  openFileDialog(data:FileContents,document:string,documentType:string,enableAmend?:boolean){
    const viewDialog = this.dialog.open(ViewDocumentsComponent, {
      maxWidth: DialogDimensions.MAXWIDTH,
      maxHeight: DialogDimensions.MAXHEIGHT,
      width: DialogDimensions.WIDTH_EIGHTY,
      height: DialogDimensions.HEIGHT_EIGHTY,
      data: {
        documentUrl: document,
        documentName: `${this.student ? this.studentFullname : null} ${documentType}`,
        ...data,
        menuItems: this.getButtonActions(documentType,enableAmend)
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

    viewDialog.afterClosed().subscribe((res:{action:DecisionActions,file:string})=>{
      if(!res.action) return;
      this.openConfirmDialog(res.action).then((result:ConfirmAction)=>{
        if(!result.confirmed) return;
        let updateResultMessage;

        if(res.action === DecisionActions.DELETE)
          {
            this.adminService.updateDocument({previousFile:document,reasonForUpdate:result.reason,actionToPerfom:res.action,documentType:documentType,applicationGuid:this.applicationGuid}).subscribe((deleteResult)=>{
              if(!deleteResult.errors)
              {
                reloadComponent(true,this.router);
                updateResultMessage = SnackBarMessage.SUCCESS;
              }else{
                updateResultMessage = SnackBarMessage.FAILURE;
              }
              this.snackbar.open(
                updateResultMessage,
                'Dismiss',
                {
                  duration:SnackBarDuration.DURATION,
                },
              );
            })
          }else{
              const fileDialogRef =this.dialog.open(UploadProfilePictureComponent, {
                maxWidth: DialogDimensions.MAXWIDTH,
                maxHeight: DialogDimensions.MAXHEIGHT,
                width: DialogDimensions.WIDTH_FIFTY,
                data: {student:this.student, title:`${res.action} ${documentType} document`, documentType:documentType}
              });

              fileDialogRef.afterClosed().subscribe((stageUploadresult:{file:'',documentType:''})=>{
                this.adminService.updateDocument({previousFile:document,newFile:stageUploadresult.file,reasonForUpdate:result.reason,actionToPerfom:res.action,documentType:documentType,applicationGuid:this.applicationGuid}).subscribe((data)=>{
                  let message;
                  if(!data.errors)
                  {
                    reloadComponent(true,this.router);
                    message=SnackBarMessage.SUCCESS;
                  }else
                  {
                    message=SnackBarMessage.FAILURE;
                  }
                  this.snackbar.open(
                    message,
                    'Dismiss',
                    {
                      duration:SnackBarDuration.DURATION,
                    },
                  );
                })
              })
            }
      });
    })
  }

  openConfirmDialog(res: string): Promise<ConfirmAction> {
    const dialogRef = this.dialog.open(ConfirmActionComponent, {
      data: {
        maxWidth: DialogDimensions.MAXWIDTH,
        maxHeight: DialogDimensions.MAXHEIGHT,
        width: DialogDimensions.WIDTH_FIFTY,
        title: `${res} document`,
        message: `Are you sure you want to ${res.toLowerCase()} this document?`,
        dialogType: DialogType.CONFIRM_WITH_INPUT
      }
    });

    return new Promise((resolve) => {
      dialogRef.afterClosed().subscribe((result: ConfirmAction) => {
        resolve(result);
      });
    });
  }

  checkStudentExpense() {
    this.isFundSpread =
      this.student.tuition ||
      this.student.meals ||
      this.student.accommodation ||
      this.student.other
        ? true
        : false;
  }
  navigateToEditDetails() {
    this.router.navigate(['/dashboard/editDetails', this.applicationGuid]);
  }
  fundDistributed(): boolean {
    return hasFundDistribution(this.student);
  }

  isExecApprover(): boolean {
    return (
      this.student.status === DocumentStatus.AWAITING_EXEC_APPROVAL &&
      this.userRank === this.ranksEnum.admin_officer
    );
  }
  isFinApprover(): boolean {
    return (
      this.student.status === DocumentStatus.AWAITING_FINANCE_APPROVAL &&
      this.userRank === this.ranksEnum.senior_admin
    );
  }
  isSUApprover():boolean{
    return((this.student.status === DocumentStatus.AWAITING_FINANCE_APPROVAL ||
    this.student.status === DocumentStatus.AWAITING_EXEC_APPROVAL ||
    this.student.status === DocumentStatus.IN_REVIEW) && this.userRank === this.ranksEnum.chief_admin)
  }
  getApplicationActionLabel(): string {
    return this.userRank === this.ranksEnum.assistant_admin ||
      this.userRank === this.ranksEnum.admin_officer
      ? ButtonAction.ACCEPT_APPLICATION
      : ButtonAction.APPROVE_APPLICATION;
  }

   revertApplication(): void
  {
    const dialogRef = this.dialog.open(DynamicDialogComponentComponent, {
      data: {
        dialogHeader: DialogTitles.REVERT_APPLICATION,
        dialogContent: DialogMessage.REVERT_APPLICATION_MESSAGE,
        confirmButtonLabel: ButtonAction.NEXT,
        currentStage: this.student.status
      },
    })
    dialogRef.afterClosed().subscribe((result: revertAction) => {
      if (!result) return;

      const confirmDialogRef = this.dialog.open(ConfirmActionComponent, {
        data: {
          title: DialogTitles.CONFIRM_APPLICATION_REVERT,
          message: DialogMessage.CONFIRM_REVERT_APPLICATION_MESSAGE,
        },
      });

      confirmDialogRef.afterClosed().subscribe((confirmResult: ConfirmAction) => {
        if (confirmResult.confirmed) {
          this.triggerRevert(result);
        }
      });
    });
  }
  triggerRevert(result:revertAction):void
  {
    this.adminService.revertApplication(result).subscribe(
      (data)=>{
          if (hasValidResults(data)) {
            this.snackbar.open(SnackBarMessage.SUCCESS, '', {
              duration: SnackBarDuration.DURATION,
            });
            reloadComponent(true, this.router)
          } else {
            this.displayError(`${SnackBarMessage.FAILURE} ${data.errors}`);
          }
      }
    )
  }

  viewSelected(documentCategory: keyof DocumentData,expenseCategory: string,event:number)
  {
    const docs= this.studentDocuments![documentCategory]?.filter((type)=>type.expenseCategory === expenseCategory.toLocaleLowerCase());
    const documentFullName= docs[event].documentBlobName;
    let fileData: FileContents;
    if (!this.downloadedAdminDocuments) {
      return;
    }

    fileData = fileTraverser(this.downloadedAdminDocuments, documentFullName);
    this.openFileDialog(fileData,docs[event].documentBlobName,expenseCategory);
  }

  getButtonActions(docType: string,enableAmend:boolean=true): ButtonAction[] {
    const deletableDocTypeValue = this.deletableDocTypes.get(docType);
    const isAdminRole = this.administrativeRoles.includes(this.role);
    const isActiveBursar = this.student.invoiceStatus === DocumentStatus.APPROVED;
    const enableAdminDelete = isAdminRole && deletableDocTypeValue && deletableDocTypeValue > 1 || false;

    const builder = new ButtonActionsBuilder()
        .addActionIf(() => true, ButtonAction.DOWNLOAD)
        .addActionIf(() => isAdminRole, ButtonAction.UPDATE)
        .addActionIf(() => enableAmend&& docType === documentTypeName.CONTRACT, ButtonAction.AMEND)
        .addActionIf(() => enableAdminDelete && !isActiveBursar, ButtonAction.DELETE);
    return builder.build().getActions();
  }

  renewApplication(renew:UniversityStudentDetails)
  {
    const renewApplication = {
      id: 1,
      name: renew.name,
      surname: '',
      email: renew.email,
      university: renew.university,
      amount: renew.amount,
      yearOfFunding: 0,
      complete: false,
      applicationId: this.student.applicationId,
      faculty: renew.faculty,
      department: '',
      race: 'Black',
      degreeName: this.student.degree,
      gender: 'Prefer not to say',
      gradeAverage: this.averageGrade,
      title: '',
      motivation: '',
      applicationGuid: this.applicationGuid,
      isRenewal:true,
      yearOfStudy:''
    } as Application
    const applicants:Application[]=[]
    const dialogRef = this.dialog.open(RenewApplicationDialogComponent,
      {
        maxWidth: DialogDimensions.MAXWIDTH,
        maxHeight: DialogDimensions.MAXHEIGHT,
        width: DialogDimensions.WIDTH_FIFTY,
        data:
        {
          applicant:renewApplication,
          minAmount:this.student.minAmount,
          maxAmount:this.student.maxAmount
        }
      }
    )

    dialogRef.afterClosed().subscribe((value)=>{
      renewApplication.yearOfStudy = value[0].yearOfStudy
      renewApplication.amount = value[0].amount
      applicants.push(renewApplication)
      this.applicationService.postApplication(applicants).subscribe((result)=>
      {
        if(hasValidResults(result)){
          reloadComponent(true,this.router);
        }
      })

    })
  }
  private updateShowDocumentationsFlag(): void {
    if (this.studentDocuments) {
      const hasContracts = this.studentDocuments[DOC_CATEGORIES.CONTRACT] && this.studentDocuments[DOC_CATEGORIES.CONTRACT].length > 0;
      const hasInvoices = this.studentDocuments[DOC_CATEGORIES.INVOICE] && this.studentDocuments[DOC_CATEGORIES.INVOICE].length > 0;
      const hasPayments = this.studentDocuments[DOC_CATEGORIES.PAYMENT] && this.studentDocuments[DOC_CATEGORIES.PAYMENT].length > 0;

      this.showDocumentations = hasContracts || hasInvoices || hasPayments;
    } else {
      this.showDocumentations = false;
    }

  }
   displayError(error: string): void {
    this.snackbar.open(error, '', {
      duration: SnackBarDuration.DURATION,
    });
  }
  triggerDashboardReload() {
  combineLatest([
      this.store.select(selectViewType).pipe(take(1)),
      this.sharedDataService.date$.pipe(take(1))
    ]).subscribe(([viewType, date]) => {
      this.store.dispatch(dashboardData({ viewType, date }));
    });
    }

  navigateToDashboard(viewType: string, university: string) {
    this.router.navigate(['/admin/dashboard'], {
      queryParams: { viewType, university },
      state: { fromStudentDetails: true }
    });
  }

  protected readonly ButtonAction = ButtonAction;
}
