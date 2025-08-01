import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from '../../shared/data-access/models/response.models';
import { observe } from '../../shared/utils/functions/observe.function';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor(private http:HttpClient) {

   }
   getAddress(streetAddress:string):Observable<IResponse<any>> {
    const countryCode = 'ZA';
    return observe(this.http.get<any>(`api/location?streetAddress=${streetAddress}&countrySet=${countryCode}`));
  }
}
