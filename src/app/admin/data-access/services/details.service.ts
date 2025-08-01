import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Details } from '../models/details-model';
import { IResponse } from '../../../shared/data-access/models/response.models';
import { observe } from '../../../shared/utils/functions/observe.function';
import { FilterDetails } from '../models/filterDetails-model';
import { ApplicationsReport } from '../models/applications-report.model';
import { groupedDetails } from '../models/grouped-details.model';
import { BursaryApplications } from '../models/bursaryApplications-model';
import { dashboardDataModel } from '../../../shared/data-access/models/dashboard.model';
import { UniversityData } from '../models/university-card-info.model';

@Injectable({
  providedIn: 'root',
})
export class DetailsService {

  constructor(private http: HttpClient) {}
  getDashboardData(year: number,universityName:string, department?:string) {
    return observe(
      this.http.get<any>(`/api/AllHodData/?year=${year}&universityName=${universityName}&department=${department}`),
    );
  }

  getDetails(filters?: FilterDetails): Observable<IResponse<Details[]>> {
    let params = new HttpParams();
    if (filters?.fullName) {
      params = params.set('fullName', filters.fullName);
    }
    if (filters?.university) {
      params = params.set('university', filters.university);
    }
    if (filters?.year) {
      params = params.set('year', filters.year);
    }
    return observe(
      this.http.get<Details[]>(`/api/activeBursaryApplications`, { params }),
    );
  }

  getApplicationsReport(year: (string | number)): Observable<IResponse<ApplicationsReport[]>> {
    return observe(
      this.http.get<ApplicationsReport[]>(`/api/applications-report?year=${year}`),
    );
  }
  getAdminDashboardData(year: number, university: string, fullName: string) {
    return observe(
      this.http.get<dashboardDataModel>(
        `/api/allAdminData?university=${university}&year=${year}&fullName=${fullName}`,
      ),
    );
  }

  getUniversityCardData(year: number,isWarmUp:boolean = false,university:string,searchName:string,viewTypeFlag:string) {
    return observe(
      this.http.get<UniversityData[] >(`api/university-card-data/?year=${year}&viewTypeFlag=${viewTypeFlag}&isWarmUp=${isWarmUp}`),
    );
  }

  getUniversityDetails(status: string): Observable<IResponse<Details[]>> {
    return observe(
      this.http.get<Details[]>(
        `/api/getHODBursaryApplications/?status=${status}`,
      ),
    );
  }

  getUniversityDetailsByDate(date: any, status: string) {
    return observe(
      this.http.get<Details[]>(
        `/api/hodApplicationsByDate/?status=${status}&date=${date}`,
      ),
    );
  }
}