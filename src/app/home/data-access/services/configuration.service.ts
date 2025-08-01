import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from '../../../shared/data-access/models/response.models';
import { observe } from '../../../shared/utils/functions/observe.function';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private http: HttpClient) { }

  getMaintenanceValue(configType: string): Observable<IResponse<boolean>> {
    return observe(this.http.get<boolean>(`api/maintenance?maintenance=${configType}`));
  }
}
