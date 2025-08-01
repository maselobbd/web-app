import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UserStore } from '../../data-access/stores/user.store';
import { MatDialog } from '@angular/material/dialog';
import { QuestionnaireResponse } from '../../data-access/models/questionnaireResponse.model';
import { FileDownloadService } from '../../../university-dashboard/data-access/services/file-download-service.service';
import { status } from '../../enums/statusEnum';
import { DynamicDialogComponentComponent } from '../dynamic-dialog-component/dynamic-dialog-component.component';
import { Roles } from '../../../authentication/data-access/models/auth.model';
import { FileContents } from '../../data-access/models/file-contents.model';
import { AverageModel } from '../../../university-dashboard/data-access/models/average.model';
import { StudentDocumentData } from '../../../student/models/downloadedStudentDocumentData.model';
import { fileTraverser, studentFileTraverser } from '../../utils/functions/traverseDownloadedFiles.function';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-university-information',
  templateUrl: './university-information.component.html',
  styleUrls: [
    './university-information.component.scss',
    '../../../university-dashboard/ui/student-details/student-details.component.scss',
    '../../utils/styling/sharedStudentDetails.scss'
  ],
})
export class UniversityInformationComponent implements OnInit {

  @Input() student: any;
  @Input() applicationGuid!: string;
  @Input() enableEdit: boolean = false;
  @Input() editDetailsForm: FormGroup = new FormGroup({});
  @Output() openFileDialog = new EventEmitter<{data:FileContents,documentUrl:string,documentType:string,enableAmend:boolean}>();
  @Output() academicRecordAverage = new EventEmitter<number>()
  role: string = '';
  showDocumentations: boolean;
  downloadedStudentDocuments?: StudentDocumentData;
  questionnaireResponses?: QuestionnaireResponse[];
  contract!: any;
  invoiceForMeals!: any;
  invoiceForAccommodation!: any;
  invoiceForTuition!: any;
  invoices!: any[];
  invoiceForOther!: any;
  paymentForMeals!: any;
  paymentForAccommodation!: any;
  paymentForTuition!: any;
  paymentForOther!: any;
  average!: AverageModel[];
  averages: any = {
    matric: 0,
    academicRecord: 0,
  };
  draft = status.DRAFT;
  pending = status.PENDING;
  awaitingStudentResponse = status.AWAITING_STUDENT_RESPONSE;
  emailFailed = status.EMAIL_FAILED;
  gridCols = { xs: 1, sm: 2, md: 4, lg: 6, xl: 8 };

  constructor(
    public dialog: MatDialog,
    private userStore: UserStore,
  ) {
    this.userStore.get().subscribe((user) => {
      this.role = user.role || user.rank;
    });
    this.showDocumentations = false;
  }
  ngOnInit(): void {

    if (this.student.StudentAverages) {
      this.average = this.student.StudentAverages
      this.average.forEach((average: any) => {
        average['semesterDescription'].toLocaleLowerCase() === 'matric'
          ? (this.averages['matric'] = average['semesterGradeAverage'])
          : average['semesterDescription'].toLocaleLowerCase() ===
              'initial transcript'
            ? (this.averages['academicRecord'] =
                average['semesterGradeAverage'])
            : null;
      });
    }
    this.academicRecordAverage.emit(this.averages['academicRecord'])
    if (this.student.QuestionnaireResponses) {
      this.questionnaireResponses = this.student.QuestionnaireResponses;
    }
    this.downloadedStudentDocuments = this.student.DownloadedStudentDocuments;
  }
  getYearOfStudyString(year: number): string {
    if (year) {
      if (year === 1) {
        return '1st year';
      } else if (year === 2) {
        return '2nd year';
      } else if (year === 3) {
        return '3rd year';
      }
      return year.toString();
    } else {
      return '-';
    }
  }

  viewDocument(
    documentName: string,
  ): void {
    const documents: { [key: string]: any } = {
      'Matric Certificate': this.student.matricCertificate,
      'Academic Record': this.student.academicTranscript,
      'Proof of Identification': this.student.identityDocument,
      'Financial Statement': this.student.financialStatement,
    };
    if (!documents[documentName] || !this.student || !this.downloadedStudentDocuments) return;
    const fileData = studentFileTraverser(this.downloadedStudentDocuments, documents[documentName]);
    this.openFileDialog.emit({data:fileData,documentUrl:documents[documentName],documentType:documentName,enableAmend:false});

  }


  isDocumentAvailable(documentName: string): boolean {
    const documentPropertyMap: { [key: string]: string } = {
      'Matric Certificate': 'matricCertificate',
      'Academic Record': 'academicTranscript',
      'Proof of Identification': 'identityDocument',
      'Financial Statement': 'financialStatement',
    };

    const propertyName = documentPropertyMap[documentName];
    if (!propertyName) {
      return false;
    }

    return !!(this.student && this.student[propertyName] && this.downloadedStudentDocuments);
  }

  viewQuestionnaire(): void {
    this.dialog.open(DynamicDialogComponentComponent, {
      data: {
        dialogHeader:`Questionnaire: ${this.student.name} ${this.student.surname}`,
        dialogContent: this.questionnaireResponses,
        studentName: this.student ? `${this.student.name}  ${this.student.surname}` : '',
      },
    });
  }
  
  getAverageGrade(documentName: string): boolean {
    return (
      this.averages &&
      this.averages[documentName] &&
      this.averages[documentName] >= 0
    );
  }

get shouldShowDetails(): boolean {
  return (
    this.student.status.toLowerCase() !== this.emailFailed &&
   this.student.status.toLowerCase() !== this.awaitingStudentResponse
  );
}

get isAdmin(): boolean {
  return this.role === Roles[Roles.admin];
}

get isNonStudentRole(): boolean {
  return this.role !== Roles[Roles.student];
}

get shouldShowQuestionnaire(): boolean {
  return (
    ![this.pending, this.draft, this.awaitingStudentResponse, this.emailFailed].includes(
      this.student.status.toLowerCase()
    ) && [Roles[Roles.admin], Roles[Roles.student]].includes(this.role)
  );
}

}
