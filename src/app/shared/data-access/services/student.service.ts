import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { UniversityStudentDetails } from '../../../university-dashboard/data-access/models/student-details-model';
import { observe } from '../../utils/functions/observe.function';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IResponse } from '../models/response.models';
import { QuestionnaireResponse } from '../models/questionnaireResponse.model';
import { DocumentData } from '../../../student/models/documentData-model';
import { StudentUser } from '../models/studentUser.model';
import { FormGroup } from '@angular/forms';
import { UploadFile } from '../models/fileupload.model';
import { DocumentStatus } from '../../enums/documentStatus';
import { MatDialog } from '@angular/material/dialog';
import { DialogType } from '../../enums/dialogType';
import { ConfirmAction } from '../models/confirmAction.model';
import { ConfirmActionComponent } from '../../ui/confirm-action/confirm-action.component';
import { DocumentUpload } from '../models/documentUpload';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient,private dialog: MatDialog,) {}

  httpOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  getStudentDetailsByGuid(
    applicationGuid: string,
  ): Observable<IResponse<UniversityStudentDetails>> {
    return observe(
      this.http.get<UniversityStudentDetails>(
        `/api/studentInformationById/?id=${applicationGuid}`,
      ),
    );
  }
  confirmDocument(
    applicationId: number,
    status: string,
  ): Observable<IResponse<any>> {
    return observe(
      this.http.post<any>(`api/confirmDocument`, { applicationId, status }),
    );
  }
  getApprovedStudentDetailsById(
    id: Number,
  ): Observable<IResponse<UniversityStudentDetails>> {
    return observe(
      this.http.get<UniversityStudentDetails>(
        `/api/approvedstudentInformationById/?id=${id}`,
      ),
    );
  }

  getStudentAdminDocuments(
    applicationguid: string,
    year: number,
    userRole: string
  ): Observable<IResponse<DocumentData>> {
    return observe(
      this.http.get<DocumentData>('api/student-documents', {
        params: {
          applicationguid,
          year,
          userRole
        },
      }),
    );
  }

  getApplicationAdminDocuments(
    applicationGuid: string,
    documentType: string,
    status: string,
  ): Observable<IResponse<any>> {
    return observe(
      this.http.get<any>('api/application-documents', {
        params: {
          applicationGuid,
          documentType,
          status,
        },
      }),
    );
  }

  uploadAdminDocuments(
    documents: DocumentUpload[]
  ): Observable<IResponse<any>> {
    return this.http.post<any>('api/upload-admin-documents', {
     documents
    });
  }

  getExpenses(): Observable<IResponse<any>> {
    return observe(this.http.get<any>('api/expense-types'));
  }

  getStudentExpenses(): Observable<IResponse<any>> {
    return observe(this.http.get<any>('api/student-expense-types'));
  }

  getQuestionnaireResponses(
    applicationId: string,
  ): Observable<IResponse<QuestionnaireResponse[]>> {
    return observe(
      this.http.get<QuestionnaireResponse[]>('api/questionnaire-responses', {
        params: {
          applicationId,
        },
      }),
    );
  }
  
  getStudentQuestionnaireResponses(
    applicationId: string,
  ): Observable<IResponse<QuestionnaireResponse[]>> {
    return observe(
      this.http.get<QuestionnaireResponse[]>('api/student-questionnaire-responses', {
        params: {
          applicationId,
        },
      }),
    );
  }
  nudgeStudents(): Observable<IResponse<any>> {
    return observe(this.http.get<any>(`api/studentToNudgeList`, {}));
  }

  nudgeStudentsAllStudents(): Observable<IResponse<any>> {
    return observe(
      this.http.post<any>(
        `api/nudgeStudents`,
        { isTimer: false },
      ),
    );
  }

  getAverages(applicationGuid: string): Observable<IResponse<any>> {
    return observe(this.http.get<any>(`api/averages?applicationGuid=${applicationGuid}`))
  }

  getStudentDocs(
    applicationguid: string,
    year: number
  ): Observable<IResponse<DocumentData>> {
    return observe(
      this.http.get<DocumentData>('api/student-docs', {
        params: {
          applicationguid,
          year
        },
      }),
    );
  }
 
  updateStudentDetails(updatedData: any , applicationGuid: string): Observable<IResponse<any>> {
   Object.assign(updatedData, {applicationGuid: applicationGuid })
    return observe(
      this.http.put<DocumentData>('api/updateApplications', updatedData
    ))
  }
  updateDocumentStatus(applicationId: number,reason:string,status: DocumentStatus , ): Observable<IResponse<any>> {
    return observe(this.http.put<DocumentData>('api/updateDocumentStatus', {status, applicationId}))
  }

  updateStudentDetailsAfterProfileUpdate(
    profileUpdateForm: FormGroup, 
    applicationGuidDetailsForm: FormGroup
  ): Observable<IResponse<any>> {
    return observe(this.http.put<any>("api/student-details-update", {
      profileUpdateForm: profileUpdateForm,
      applicationGuidDetailsForm: applicationGuidDetailsForm
    }))
  }

  uploadStudentPhoto(studentId:number,file:any): Observable<IResponse<any>> {
    return observe(
      this.http.post<any>('api/upload_student_photo', {studentId,file}),
    );
  }

  openConfirmDialog(
    title: string,
    message: string,
    dialogType: DialogType = DialogType.CONFIRM
  ): Observable<ConfirmAction> {
    const dialogRef = this.dialog.open(ConfirmActionComponent, {
      data: {
        title,
        message,
        dialogType,
      },
    });
    return dialogRef.afterClosed();
  }

  studentDocumentsYears(): Observable<IResponse<number[]>> {
    return observe(
      this.http.get<[]>('api/student-docs-years'),
    );
  }
}
