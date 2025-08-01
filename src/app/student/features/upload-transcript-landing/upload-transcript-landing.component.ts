import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../shared/data-access/services/data.service';
import { ApplicationInsightsService } from '../../../shared/data-access/services/application-insights.service';
import { RouteNames } from '../../../shared/enums/routeNames';

@Component({
  selector: 'app-upload-transcript-landing',
  templateUrl: './upload-transcript-landing.component.html',
  styleUrls: [
    './upload-transcript-landing.component.scss',
    '../../../home/layout-screen/layout-screen.component.scss'
  ]
})
export class UploadTranscriptLandingComponent implements OnInit {

  personalInfo: any;
  uploadScreen: boolean;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private applicationInsights: ApplicationInsightsService
  ) {
    this.uploadScreen = false;
  }

  ngOnInit(): void {
    this.dataService.setPersonalInfo(this.route.snapshot.paramMap.get('applicationGuid') ?? '');
    this.applicationInsights.logPageView(this.router.url);
  }

  navigateToTranscriptUploads(): void {
    this.uploadScreen = true;
    this.dataService.updateShowTranscriptUpload(true);
  }
}
