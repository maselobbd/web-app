export interface BursaryFund {
  id: string;
  name: string;
  logo: string;
  fundAllocation: number ;
  activeBursaries: number;
  applications: number;
}

export interface FundSpending {
  name: string;
  amount: number;
  color: string;
}

export interface UniversitySpending {
  name: string;
  amount: number;
}

import { Injectable } from '@angular/core';
import { observe } from '../../../shared/utils/functions/observe.function';
import { HttpClient } from '@angular/common/http';
import { currentFiscalYear } from '../../../shared/utils/functions/dateUtils';
import { IResponse } from '../../../shared/data-access/models/response.models';
import { Observable } from 'rxjs';
import { AdminLandingReport } from '../models/admin-landing-report.model';

@Injectable({
  providedIn: 'root',
})
export class BursaryService {
  constructor(private http: HttpClient) {}

  getBursaries(): Observable<AdminLandingReport> {
    let bursaryTypes = ['Ukukhula', 'BBD'];
    return this.http.get<AdminLandingReport>(`api/bursaries-summary`, {
      params: {
        bursaryTypes: bursaryTypes,
        year: currentFiscalYear()
      }
    });
  }
} 