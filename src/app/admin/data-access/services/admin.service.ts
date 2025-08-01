import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from '../../../shared/data-access/models/response.models';
import { Details } from '../models/details-model';
import { observe } from '../../../shared/utils/functions/observe.function';
import { UploadFile } from '../../../shared/data-access/models/fileupload.model';
import { UniversityDetails } from '../models/university-details.model';
import { DepartmentStatus } from '../models/departmentStatus.enum';
import { revertAction } from '../../../shared/data-access/models/revertAction.model';
import { FileUpdate } from '../models/fileUpdate.model';
import {EmailResponse} from '../../../shared/data-access/models/emailResponse.model';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  uploadPayment(file: any, applicationId: number, doctype: number = 3) {
    const body = { file, applicationId, doctype };

    return observe(this.http.post(`api/uploadPayment`, body));
  }
  uploadPayments(file: UploadFile[]) {
    return observe(this.http.post(`api/uploadPayments`, file));
  }

  getDetails(): Observable<IResponse<Details[]>> {
    return observe(this.http.get<Details[]>(`/api/activeBursariesInfo`));
  }

  sendEmailEmailToExec(
    applicationGuid: string,
  ): Observable<IResponse<EmailResponse>> {
    const body = { applicationGuid };
    return observe(this.http.post<EmailResponse>(`api/sendEmailToExecutive`, body));
  }

  updateApplicationStatus(
    status: string,
    applicationGuid: string,
    isRenewal?:boolean
  ): Observable<IResponse<number[]>> {
    const body = { status, applicationGuid, isRenewal };
    return observe(
      this.http.post<number[]>(`api/update-student-application-status`, body),
    );
  }

  rejectApplication(
    status: string,
    applicationGuid: string,
    reason: string,
    motivation: string,
  ): Observable<IResponse<{ name: string; email: string }>> {
    const body = { status, applicationGuid, reason, motivation };
    return observe(
      this.http.post<{ name: string; email: string }>(
        `api/reject-student-application`,
        body,
      ),
    );
  }

  updateInvoiceForApplicationStatus(
    status: string,
    applicationGuid: string,
  ): Observable<IResponse<number[]>> {
    const body = { status, applicationGuid };
    return observe(this.http.post<number[]>(`api/contract-signed`, body));
  }

  updateBursaryAmount(
    applicationGuid: string,
    newAmount: number,
  ): Observable<IResponse<string[]>> {
    const body = { applicationGuid, newAmount };
    return observe(
      this.http.put<string[]>(
        `api/updateApplicationAmount?applicationGuid=${applicationGuid}&newAmount=${newAmount}`,
        body,
      ),
    );
  }

  getYearsOfFunding(): Observable<IResponse<number[]>> {
    return observe(this.http.get<number[]>('api/funding-years'));
  }

  getStudentYearsOfFunding(): Observable<IResponse<number[]>> {
    return observe(this.http.get<number[]>('api/student-funding-years'));
  }
  emailFailedApplication(applicationGuid: string):Observable<IResponse<any>>  {
    const body = { applicationGuid };
    return observe(
      this.http.post<any>(`api/emailFailedStudentApplication`, body),
    );
  }
  getUniversityCardData(year: number,isWarmUp:boolean = false,viewTypeFlag:string) {
    return observe(
      this.http.get<any>(`api/university-card-data/?year=${year}&viewTypeFlag=${viewTypeFlag}&isWarmUp=${isWarmUp}`),
    );
  }
  getAllUniversities(): Observable<IResponse<UniversityDetails[]>> {
    return observe(this.http.get<UniversityDetails[]>('api/universities'));
  }
  updateUniversityDepartment(oldDepartmentName: any, newDepartmentName: string, universityToUpdate: string):Observable<IResponse<any>> {
    const body={
     oldDepartmentName,
     newDepartmentName,
     universityToUpdate
    }
    return observe(this.http.put(`api/updateUniversityDepartment`, body));
  }
  deleteUniversityDepartment(departmentName: string, universityName: string, facultyName: string) {
    const status=DepartmentStatus.DELETE
    const body = {
      departmentName,
      universityName,
      facultyName,
      status
    };
    return observe(this.http.put(`api/updateUniversityDepartmentStatus`, body));
  }
  toogleUniversityDepartment(departmentName: string, universityName: string,facultyName: string,enabled:boolean) {
    const status=enabled? DepartmentStatus.DISABLED: DepartmentStatus.ACTIVE
    const body = {
      departmentName,
      universityName,
      facultyName,
      status
    };
    return observe(this.http.put(`api/updateUniversityDepartmentStatus`, body));
  }
  updateUserDetails(userId: string, customAttributes: FormGroup, applicationGuidDetailsForm: FormGroup, profile: string): Observable<IResponse<{success: boolean}>> {
    const body = {
      oid: userId,
      customAttributes: customAttributes,
      applicationGuidDetailsForm: applicationGuidDetailsForm,
      updatedProfile: profile
    };
    return this.http.put(`api/user`, body, );
  }

  createUser( customAttributes: any): Observable<IResponse<{status: number}>> {
    return observe(this.http.post<{status: number}>(`api/createAdminUser`,customAttributes, ));
  }

  revertApplication(revertApplication: revertAction) {
    return observe(this.http.post<{status:number}>(`api/revertApplication`, revertApplication))
  }

  updateDocument(data:FileUpdate) {
    return observe(this.http.post<{status:number}>(`api/update-student-document`, data))
  }

  getEmailLastSent(applicationGuid: string): Observable<IResponse<boolean>> {
    return observe(this.http.get<boolean>(`api/getLastEmailSentTime?applicationGuid=${applicationGuid}`));
  }

  getDeclinedReasons(): Observable<IResponse<string[]>> {
    return observe(this.http.get<string[]>(`api/get-declined-reasons`));
  }

  terminateBursary(
    status: string,
    applicationGuid: string,
    reason: string,
    motivation: string,
  ): Observable<IResponse<{ name: string; email: string }>> {
    const body = { status, applicationGuid, reason, motivation };
    return observe(this.http.post<{ name: string; email: string }>(`api/student-terminate-bursary`, body));
  }
}
