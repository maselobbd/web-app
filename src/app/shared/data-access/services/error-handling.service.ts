import { Injectable } from '@angular/core';
import { ErrorHandler } from '@angular/core';
import { ApplicationInsightsService } from './application-insights.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService extends ErrorHandler {

  constructor(private applicationInsightsService: ApplicationInsightsService) {
    super();
  }

  override handleError(error: Error) {
      if (error) {
        this.applicationInsightsService.logException(error);
      } else return;
  }
}
