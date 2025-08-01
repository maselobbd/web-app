import { Injectable } from '@angular/core';
import { HodAccount } from '../models/hod-account.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { observe } from '../../../shared/utils/functions/observe.function';
import { IResponse } from '../../../shared/data-access/models/response.models';
import { Faculty } from '../models/faculties-model';
import { IUni } from '../models/universityUsers-model';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class HodAccountsService {
  private applicationsSubject: BehaviorSubject<HodAccount[]> = new BehaviorSubject<HodAccount[]>([
 
  ]);

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<IResponse<HodAccount[]>>  {

    return observe(this.http.get<HodAccount[]>(`api/users`),);
  }
  editAccount(id:string,updatedAccount: HodAccount, originalAccount: HodAccount, profile: string): Observable<IResponse<{success: boolean}>> {
    const body={
      oid:id, customAttributes:updatedAccount, applicationGuidDetailsForm:originalAccount, updatedProfile:profile
     }
    return observe(this.http.put<{success: boolean}>(`api/user/`, body));
  }

  deleteAccount(id: string,emailAddress:string): Observable<IResponse<{ success: boolean }>> {
    return observe(this.http.put<{ success: boolean }>(`api/deleteUser/?id=${id}&&email=${emailAddress}`, {}));
  }
  sendEmail(invitationForm: {data: FormGroup}) {
    
    const url = `api/sendEmail/`;
    return observe(this.http.post(url, invitationForm));
  }
  
  addUniversity(university: string, faculty: String): Observable<IResponse<any>> {
    const body = {
      university: university,
      faculty: faculty
    }
    return observe(this.http.post<HodAccount>(`api/addUniversity`, body));
  }
  getFaculties(): Observable<IResponse<Faculty[]>> {
   return observe(this.http.get<Faculty[]>(`api/faculties`));
  }
  addDepartment(addDepartmentObject: {
    university: string,
    department: string,
    faculty: string,
    newFaculty: string,
  }): Observable<IResponse<any>> {
  
   return observe(this.http.post(`api/addDepartment`, addDepartmentObject));
  }
  getDepartmentsAndUniversity():Observable<IResponse<any>> {
    return observe(this.http.get<IUni[]>(`api/getDepartmentsAndUniversity`));
  }
  getDepartments(universityName:string="",facultyName:string=""):Observable<IResponse<any>> {
    return observe(this.http.get<any>(`api/universityDepartments?universityName=${universityName}&facultyName=${facultyName}`));
  }
  
  getDepartmentsAllocations(universityName:string,facultyName:string,year:number):Observable<IResponse<any>> {
    return observe(this.http.get<any>(`api/universityDepartmentsAmount?universityName=${universityName}&facultyName=${facultyName}&year=${year}`));
  }
}
