import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse } from '../../../shared/data-access/models/response.models';
import { Observable } from 'rxjs/internal/Observable';
import { observe } from '../../../shared/utils/functions/observe.function';
import { DataToPost } from '../models/dataToPost-model';
import { ReallocationsModel } from '../models/reallocations.model';

@Injectable({
  providedIn: 'root',
})
export class TotalAllocatedService {
  constructor(private http: HttpClient) {}

  

  insertIntoAllocations(
    data: string,
  ): Observable<IResponse<{ message: string, exitNumber: number }>> {
    return observe(
      this.http.post<{ message: string, exitNumber: number }>(
        '/api/university-allocations',
        data,
      ),
    );
  }

  moveFunds( data: string) : Observable<IResponse<{ message: string, exitNumber: number }>> {
    return observe(
      this.http.post<{ message: string, exitNumber: number }>('/api/move-department-funds', data)
    )
  }

  reallocationsInsert(reallocation: ReallocationsModel): Observable<IResponse<{ message: string, exitNumber: number }>> {
    return observe(
      this.http.post<{ message: string, exitNumber: number }>("/api/reallocations-history", reallocation)
    )
  }

  totalFundInsert(totalFundDetails: {amount: number, year: number}): Observable<IResponse<{message: string, totalFundInsertResponse: number[]}>> {
    return observe(
      this.http.post<{message: string, totalFundInsertResponse: number[]}>("/api/add-to-fund", totalFundDetails)
    )
  }
}
