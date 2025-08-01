import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { observe } from '../../../shared/utils/functions/observe.function';
import { IResponse } from '../../../shared/data-access/models/response.models';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private filterState = {
    studentName: '',
    university: '',
    year: '',
  };

  private filterSubject = new BehaviorSubject<any>(this.filterState);
  filter$ = this.filterSubject.asObservable();

  constructor(private http: HttpClient) {}

  updateFilter(filter: any) {
    this.filterSubject.next(filter);
  }

  getBursaryTypes(): Observable<IResponse<string[]>> {
    return observe(this.http.get<string[]>(`/api/bursary-types`));
  }
}
