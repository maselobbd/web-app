import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from '../models/response.models';
import { Application } from '../../../application/data-access/models/application.model';
import { observe } from '../../utils/functions/observe.function';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  constructor(private http: HttpClient) {}

  postExpense(
    accommodation: number,
    tuition: number,
    meals: number,
    other: number,
    otherDescription: string,
    applicationId: number,
    status: string,
    applicationGuid: string,
    isRenewal: boolean
  ): Observable<IResponse<Application[]>> {
    const body = { accommodation, tuition, meals, other, otherDescription, applicationId, status, applicationGuid, isRenewal };
    return observe(
      this.http.post<Application[]>(`api/insertExpense`, body),
    );
  }

  getStudentExpenses(applicationId: number): Observable<IResponse<any>> {
    return observe(
      this.http.get<any>(`api/studentExpense/?applicationId=${applicationId}`),
    );
  }
}
