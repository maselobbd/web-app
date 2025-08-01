import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Universities } from '../models/universities-model';
import { IResponse } from '../../../shared/data-access/models/response.models';
import { observe } from '../../../shared/utils/functions/observe.function';
import { FilterDetails } from '../models/filterDetails-model';

@Injectable({
  providedIn: 'root',
})
export class UniversitiesService {
  constructor(private http: HttpClient) {}

  getUniversities(
    filters?: FilterDetails,
  ): Observable<IResponse<Universities[]>> {
    let params = new HttpParams();
    if (filters?.university) {
      params = params.set('university', filters.university);
    }
    return observe(
      this.http.get<Universities[]>(`api/universitiesWithApplications`, {
        params,
      }),
    );
  }

  getUniversitiesWithActiveBursaries(): Observable<IResponse<Universities[]>> {
    return observe(
      this.http.get<Universities[]>(`api/universitiesActiveBursaries`),
    );
  }

  getUniversity(
    filters?: FilterDetails,
  ): Observable<IResponse<Universities[]>> {
    let params = new HttpParams();
    if (filters?.university) {
      params = params.set('university', filters.university);
    }
    return observe(
      this.http.get<Universities[]>(`api/universitiesActiveBursaries`, {
        params,
      }),
    );
  }

  getUnivisityIdByName(name: string): Observable<IResponse<any>> {
    return observe(this.http.get<any>(`api/universityId/?name=${name}`));
  }

  getNumberApplicationsFromUniversity(): Observable<IResponse<any>> {
    return observe(this.http.get<any>(`api/numberOfApplicationFromUniversity`));
  }

  toogleUniversity(university: string, status: string): Observable<IResponse<number[]>> {
    return observe(this.http.put<number[]>(`api/updateUniversityStatus`,{university,status}));
  }
}
