import { Injectable } from '@angular/core';
import { IResponse } from '../models/response.models';
import { Observable } from 'rxjs';
import { observe } from '../../utils/functions/observe.function';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  constructor(
    private http: HttpClient,
  ) { }

  getApplicationSettings(): Observable<IResponse<{appInsights: string}>> {
    return observe(this.http.get<{appInsights: string}>("api/config", {params: {config: "appInsights"}}))
  }
}
