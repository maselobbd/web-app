import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from '../../../shared/data-access/models/response.models';
import { observe } from '../../../shared/utils/functions/observe.function';
import { Application } from '../models/application.model';
import { UserStore } from '../../../shared/data-access/stores/user.store';
@Injectable({
  providedIn: 'root',
})
export class applicationService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient, private userStore: UserStore) {
    this.userStore.get().subscribe((user) => {
        this.userRole=user.role

    });
  }
  private universitiesUrl = '/api/universities';
  private applicationsUrl = '/api/applications';
  private degreesUrl = '/api/degrees';
  private incompleteApplicationsUrl = '/api/incompleteApplications';
  private bursaryYearsUrl = '/api/bursaryYears';
  private racesUrl = '/api/races';
  private renewalApplicationsUrl = '/api/applicationDueForRenewal';
  userRole: string = '';
  getUniversities(): Observable<IResponse<string[]>> {
    return observe(this.http.get<string[]>(this.universitiesUrl));
  }
  postApplication(data: Application[]): Observable<IResponse<number[]>> {
    return observe(
      this.http.post<number[]>(this.applicationsUrl, data, this.httpOptions),
    );
  }
  checkExistingStatus(data:Application[]):Observable<IResponse<Application[]>> {
    return observe(this.http.post<Application[]>(`/api/checkExistingApplication`, data,this.httpOptions)
  ); 
  }
  deleteApplication(applicationId: number) {
    return observe(
      this.http.delete<number>(`${this.applicationsUrl}/?id=${applicationId}`),
    );
  }
  getDegrees(): Observable<IResponse<string[]>> {
    return observe(this.http.get<string[]>(this.degreesUrl));
  }
  getAvailableBursaryYears(): Observable<IResponse<number[]>> {
    return observe(this.http.get<number[]>(this.bursaryYearsUrl));
  }
  getRaces(): Observable<IResponse<string[]>> {
    return observe(this.http.get<string[]>(this.racesUrl));
  }
  getApplications(isRenewal?:boolean) {
    if(isRenewal)
    {
      return observe(
        this.http.get<Application[]>(this.renewalApplicationsUrl, this.httpOptions),
      );
    }
      return observe(
        this.http.get<Application[]>(this.incompleteApplicationsUrl, this.httpOptions),
      );
  }

  getNumberOfApplications(): Observable<IResponse<number>> {
    return observe(this.http.get<number>(`api/numberOfApplications`));
  }

  updateApplication(
    applicationGuid: string,
    form: FormData
  ): Observable<IResponse<Application[]>> {
    const body = {
      applicationGuid,
       form
    };
    return observe(
      this.http.put<Application[]>(`api/updateApplications`, body),
    );
  }

  checkUser(email: string): Observable<IResponse<boolean>> {
    return observe(this.http.get<boolean>('api/check-user', {params: {email: email}}))
  }

  onboard(application:FormData): Observable<IResponse<string>> {
    return observe(this.http.post<string>('api/onboard', application));
  }
}
