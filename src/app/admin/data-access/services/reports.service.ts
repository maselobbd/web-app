import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { observe } from '../../../shared/utils/functions/observe.function';
import { IResponse } from '../../../shared/data-access/models/response.models';
import { ReportsData } from '../models/applications-report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }

  getReportsData(): Observable<IResponse<ReportsData>> {

    return observe(this.http.get<ReportsData>('api/reports'));
  }
}
