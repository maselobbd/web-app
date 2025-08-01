import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AllocationModel } from '../models/allocation.models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observe } from '../../utils/functions/observe.function';
import { IResponse } from '../models/response.models';

@Injectable({
  providedIn: 'root',
})
export class AllocationUsageService {
  constructor(private http: HttpClient) {}

  httpOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  getAllocations(): Observable<IResponse<AllocationModel>> {
    return observe(this.http.get<AllocationModel>('/api/allocations'));
  }
  getAllocationsForUniversity(
    university: string,
  ): Observable<IResponse<AllocationModel>> {
    return observe(
      this.http.get<AllocationModel>(
        `/api/allocationsForUniversity/?university=${encodeURIComponent(university)}`,
      ),
    );
  }
  getAllAllocationsForUniversity( university: string,year:number
  ): Observable<IResponse<AllocationModel>> {
    return observe(
      this.http.get<AllocationModel>(
        `/api/allocationsForUniversity/?university=${encodeURIComponent(university)}&year=${encodeURIComponent(String(year))}`,
      ),
    );
  }
  getAllocationsForDepartment(
    university: string,
    department: string,
    faculty: string,
    year:string
  ): Observable<IResponse<any>> {
    const body = { university, department, faculty, year };
    return observe(
      this.http.get<any>(
        `/api/allocationsForUniversityHOD/?${new URLSearchParams(body)}`,
      ),
    );
  }
  checkDepartment(
    department: string,
    faculty: string,
    university: string,
  ): Observable<IResponse<boolean>> {
    const body = { university, department, faculty };
    return observe(
      this.http.get<boolean>(
        `/api/checkValidDepartment/?${new URLSearchParams(body)}`,
      ),
    );
  }
}
