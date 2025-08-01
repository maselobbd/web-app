import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../data-access/services/student.service';
import { StudentService as studentSelfService } from '../../../student/services/student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStore } from '../../data-access/stores/user.store';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FileDownloadService } from '../../../university-dashboard/data-access/services/file-download-service.service';
import { documentTypeName } from '../../../university-dashboard/enums/documentType.model';
import { UniversityStudentDetails } from '../../../university-dashboard/data-access/models/student-details-model';
import { ViewDocumentsComponent } from '../../../university-dashboard/ui/view-documents/view-documents.component';
import { assignDocumentBlobNames } from '../../utils/functions/assignBlobName.function';
import { DocumentData } from '../../../student/models/documentData-model';
import { DocumentBlobNames } from '../../../student/models/documentBlobNames.model';
import { StudentUser } from '../../data-access/models/studentUser.model';
import { Router } from '@angular/router';
import { hasValidResults } from '../../utils/functions/checkData.function';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../../../admin/data-access/services/admin.service';
import { CacheService } from '../../data-access/services/cache.service';
import { cacheKeysEnum } from '../../enums/cacheKeysEnum';
import { DialogDimensions } from '../../enums/dialogDimensions';
import { Store } from '@ngrx/store';
import { selectStudentPortalData } from '../../../states/student-portal/student-portal.selectors';

@Component({
  selector: 'app-student-documents',
  templateUrl: './student-documents.component.html',
  styleUrls: ['./student-documents.component.scss', '../../../university-dashboard/ui/student-details/student-details.component.scss','../../utils/styling/sharedStudentDetails.scss'],
})
export class StudentDocumentsComponent implements OnInit {
  student!: UniversityStudentDetails;
  showDocumentations: boolean = false;
  role: string = '';
  applicationGuid: string = '';
  studentDocuments!: DocumentData;
  uploadScreen: boolean = false;
  yearOfStudyForm!: FormGroup;
  docsYears!: number[];
  user!: any;
  studentLoginDetails!: StudentUser;
  studentFullname: string = '';

  averages = {
    matric: 0,
    academicRecord: 0,
  };

  invoiceForTuition!: any;
  paymentForTuition!: any;
  invoiceForMeals!: any;
  paymentForMeals!: any;
  invoiceForAccommodation!: any;
  paymentForAccommodation!: any;
  invoiceForOther!: any;
  paymentForOther!: any;
  contract!: any;
  currentYear!: number;
  filterYear!: number;

  constructor(
    private studentService: StudentService,
    private snackbar: MatSnackBar,
    private userStore: UserStore,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private fileDownloadService: FileDownloadService,
    private router: Router,
    private formBuilder: FormBuilder,
    private studentSelfService:studentSelfService,
    private store: Store
  ) {
    this.userStore.get().subscribe((user) => {
      this.role = user.role;
      this.user = user;
      this.currentYear = (new Date()).getFullYear();
    });
  }

  ngOnInit(): void {
    const { department, faculty, university, email } = this.user;
    this.studentLoginDetails = { emailAddress: email, university, faculty, department };
    this.initializeYearOfStudyForm();
    this.getStudentApplicationGuid(this.studentLoginDetails);
  }

  initializeYearOfStudyForm(): void {
    this.getYearsOfStudy();
    this.yearOfStudyForm = this.formBuilder.group({
      yearOfStudy: [new Date().getFullYear()],
    });
  }

  getStudentApplicationGuid(student: StudentUser): void {
    this.store.select(selectStudentPortalData).subscribe((data) => {
      this.student = data!;
      this.loadStudentDetails(this.student.applicationGuid, this.currentYear);
      this.subscribeToYearChanges();
    })
  }

  loadStudentDetails(applicationGuid: string, year: number): void {
    this.getStudentAverage(applicationGuid);
    this.getStudentAdminDocuments(applicationGuid, year);
  }

  subscribeToYearChanges(): void {
    this.yearOfStudyForm.get('yearOfStudy')?.valueChanges.subscribe((selectedYear) => {
      this.getStudentAdminDocuments(this.student.applicationGuid, selectedYear);
    });
  }

  loadStudentExpenses(): void {
    if (this.role === 'student') {
      this.studentService.getStudentExpenses().subscribe((data) => {
        if (!hasValidResults(data)) {
          this.snackbar.open('Something went wrong', 'Dismiss', { duration: 3000 });
        }
      });
    }
  }

  getStudentInfo(applicationGuid: string): void {
    this.studentSelfService.getStudentInfo(applicationGuid).subscribe((data) => {
      if (hasValidResults(data)) {
        this.student = data.results as UniversityStudentDetails;
        this.studentFullname = `${this.student?.name ?? ''} ${this.student?.surname ?? ''}`
      }
    });
  }

  getStudentAverage(applicationGuid: string): void {
    this.studentService.getAverages(applicationGuid).subscribe((data) => {
      if (hasValidResults(data)) {
        data.results.forEach((average: any) => {
          const description = average['semesterDescription'].toLocaleLowerCase();
          if (description === 'matric') {
            this.averages.matric = average['semesterGradeAverage'];
          } else if (description === 'initial transcript') {
            this.averages.academicRecord = average['semesterGradeAverage'];
          }
        });
      }
    });
  }

  viewDocument(documentName: string, documentType: string = documentTypeName.INVOICE): void {
    const documentUrls = this.getDocumentUrls(documentName, documentType);
    if (!documentUrls || !this.student) return;
    this.fileDownloadService.getFileByName(documentUrls).subscribe((data) => {
      const viewDialog = this.dialog.open(ViewDocumentsComponent, {
        maxWidth: DialogDimensions.MAXWIDTH,
        maxHeight: DialogDimensions.MAXHEIGHT,
        width: DialogDimensions.WIDTH_EIGHTY,
        height: DialogDimensions.HEIGHT_EIGHTY,
        data: {
          documentUrl: documentUrls,
          documentName: `${this.studentFullname ?? ''} ${documentName}`,
          ...data,
        },
      });

      this.breakpointObserver.observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait]).subscribe((result) => {
        viewDialog.updateSize(result.matches ? '99vw' : '60vw', result.matches ? '80vh' : '70vh');
      });
    });
  }

  getDocumentUrls(documentName: string, documentType: string): string | undefined {
    if(!this.filterYear){
      this.filterYear = this.currentYear
    }
    const documents = {
      'Matric Certificate': this.student.matricCertificate,
      'Academic Record': this.currentYear === this.filterYear ? this.student.academicTranscript : '',
      'Proof of Identification': this.student.identityDocument,
      'Financial Statement': this.student.financialStatement,
      Tuition: documentType === documentTypeName.INVOICE ? this.invoiceForTuition : this.paymentForTuition,
      Contract: this.contract,
      Meals: documentType === documentTypeName.INVOICE ? this.invoiceForMeals : this.paymentForMeals,
      Accomodation: documentType === documentTypeName.INVOICE ? this.invoiceForAccommodation : this.paymentForAccommodation,
      Other: documentType === documentTypeName.INVOICE ? this.invoiceForOther : this.paymentForOther,
    };
    return documents[documentName as keyof typeof documents];
  }

  hasDocument(documentName: string): boolean {
    const documents = {
      'Matric Certificate': this.student.matricCertificate,
      'Academic Record': this.student.academicTranscript,
      'Proof of Identification': this.student.identityDocument,
      'Financial Statement': this.student.financialStatement,
    };
    return documents[documentName as keyof typeof documents] ? true : false;
  }

  getStudentAdminDocuments(applicationGuid: string, selectedYear: number): void {
    this.studentService.getStudentDocs(applicationGuid, selectedYear).subscribe((data) => {
      if (hasValidResults(data)) {
        this.studentDocuments = data.results as DocumentData;
        const documentBlobNames = assignDocumentBlobNames(this.studentDocuments);
        this.assignBlobs(documentBlobNames);
        this.showDocumentations =
          this.studentDocuments.contract.length > 0 ||
          this.studentDocuments.invoice.length > 0 ||
          this.studentDocuments.payments.length > 0;
      } else {
        this.snackbar.open('Something went wrong, please try again', '', { duration: 3000 });
      }
    });
  }

  assignBlobs(documentBlobNames: DocumentBlobNames): void {
    this.invoiceForAccommodation = documentBlobNames.invoiceForAccommodation;
    this.invoiceForMeals = documentBlobNames.invoiceForMeals;
    this.invoiceForTuition = documentBlobNames.invoiceForTuition;
    this.invoiceForOther = documentBlobNames.invoiceForOther;
    this.paymentForAccommodation = documentBlobNames.paymentForAccommodation;
    this.paymentForMeals = documentBlobNames.paymentForMeals;
    this.paymentForTuition = documentBlobNames.paymentForTuition;
    this.paymentForOther = documentBlobNames.paymentForOther;
    this.contract = documentBlobNames.contract;
  }

  getYearsOfStudy(): void {
    this.studentService.studentDocumentsYears().subscribe((data) => {
      if (hasValidResults(data)) {
        this.docsYears = data.results ?? [];
      }
    });
  }

  navigateToTranscriptUploads(): void {
    this.router.navigate(['reviews/transcript/', this.applicationGuid]);
  }

  hasBursaryDocuments(): boolean {
    return (
      this.invoiceForAccommodation ||
      this.invoiceForTuition ||
      this.invoiceForMeals ||
      this.invoiceForOther ||
      this.paymentForAccommodation ||
      this.paymentForTuition ||
      this.paymentForMeals ||
      this.paymentForOther ||
      this.contract
    );
  }

  hasPayments(): boolean {
    return (
      this.paymentForAccommodation ||
      this.paymentForTuition ||
      this.paymentForMeals ||
      this.paymentForOther
    );
  }

  hasInvoices(): boolean {
    return (
      this.invoiceForAccommodation ||
      this.invoiceForTuition ||
      this.invoiceForMeals ||
      this.invoiceForOther
    );
  }

  getInvoices(): { label: string; type: string }[] {
    const invoices = [];
    if (this.invoiceForAccommodation) {
      invoices.push({ label: 'Accommodation', type: 'Accomodation' });
    }
    if (this.invoiceForMeals) {
      invoices.push({ label: 'Meals', type: 'Meals' });
    }
    if (this.invoiceForTuition) {
      invoices.push({ label: 'Tuition', type: 'Tuition' });
    }
    if (this.invoiceForOther) {
      invoices.push({ label: `Other (${this.student?.otherDescription})`, type: 'Other' });
    }
    return invoices;
  }

  
  getPayments(): { label: string; type: string }[] {
    const payments = [];
    if (this.paymentForAccommodation) {
      payments.push({ label: 'Accommodation', type: 'Accomodation' });
    }
    if (this.paymentForMeals) {
      payments.push({ label: 'Meals', type: 'Meals' });
    }
    if (this.paymentForTuition) {
      payments.push({ label: 'Tuition', type: 'Tuition' });
    }
    if (this.paymentForOther) {
      payments.push({ label: `Other (${this.student?.otherDescription})`, type: 'Other' });
    }
    return payments;
  }

  getFilterYear(event: any): void {
    if(event.value) {
      this.filterYear = event.value;
    }
  }

}
