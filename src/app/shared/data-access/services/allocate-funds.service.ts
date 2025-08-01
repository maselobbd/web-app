import { Injectable } from '@angular/core';
import { Candidate } from '../models/candidate.models';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { observe } from '../../utils/functions/observe.function';
import { IResponse } from '../models/response.models';
import { Application } from '../../../application/data-access/models/application.model';

@Injectable({
  providedIn: 'root',
})
export class AllocateFundsService {
  constructor(private http: HttpClient) {}

  private candidatesUrl = '/api/candidates';

  httpOptions = new HttpHeaders({ 'Content-Type': 'application/json' });

  getCandidates(): Observable<IResponse<Application[]>> {
    return observe(this.http.get<Application[]>(this.candidatesUrl));
  }
}
