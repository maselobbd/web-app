import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IResponse } from "../models/response.models";
import { observe } from "../../utils/functions/observe.function";

@Injectable({
  providedIn: 'root',
})
export class SystemConfigurationService {
  constructor(private http: HttpClient) {}

   getApplicationConfiguration(
    configType:string
    ): Observable<IResponse<boolean>> {
      return observe(
        this.http.get<boolean>(
          `/api/getConfig?configType=${configType}`,
        ),
      );
    }

    setApplicationConfiguration(configType:string): Observable<IResponse<boolean>> {
        return observe(
          this.http.post<boolean>(
            `/api/getConfig`,configType
          ),
        );
      }
}