import { Injectable } from '@angular/core';
import { IResponse } from '../../../shared/data-access/models/response.models';
import { Observable } from 'rxjs/internal/Observable';
import { observe } from '../../../shared/utils/functions/observe.function';
import { HttpClient } from '@angular/common/http';
import { FundAllocationsModel } from '../models/fundAllocations-model';

@Injectable({
  providedIn: 'root',
})
export class FundAllocationDataService {
  constructor(private http: HttpClient) {}
  getActiveUniversitiesFundAllocations(
    year: number,
  ): Observable<IResponse<FundAllocationsModel>> {
    return observe(
      this.http.get<FundAllocationsModel>('/api/fund-allocations-data', {
        params: {
          year: year,
        },
      }),
    );
  }
  getDeanUniversitiesFundAllocations(
    universityName: string,
    year: number,
    faculty:string
  ): Observable<IResponse<FundAllocationsModel>> {
    return observe(
      this.http.get<FundAllocationsModel>('/api/dean-university-fund', {
        params: {
          universityName: universityName,
          year: year,
          faculty:faculty
        },
      }),
    );
  }
}
