import { Injectable } from '@angular/core';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { AppSettingsService } from './app-settings.service';
import { hasValidResults } from '../../utils/functions/checkData.function';
@Injectable({
  providedIn: 'root'
})
export class ApplicationInsightsService {

  appInsights!: ApplicationInsights;

  constructor(private appService: AppSettingsService) {
    this.appService.getApplicationSettings().subscribe(
      connectionString => {
        if(hasValidResults(connectionString)) {
          this.laodApplicationInsights(connectionString.results?.appInsights);
        }
      }
    )
  }

  laodApplicationInsights(connectionString: string | undefined): void {
    this.appInsights = new ApplicationInsights({ config: {
    connectionString: connectionString ? connectionString : "",
    enableAutoRouteTracking: true
    } });
    if(this.appInsights) {
      this.appInsights.loadAppInsights()
    } else return;
  }

  logPageView(name?: string, url?: string) {
    if (this.appInsights) {
      this.appInsights.trackPageView({
      name: name,
      uri: url
    });
    } else return;
  } 

  logException(exception: Error, severityLevel?: number) {
    if(this.appInsights) {
      this.appInsights.trackException({ exception: exception, severityLevel: severityLevel })
    } else return;
  }
}
