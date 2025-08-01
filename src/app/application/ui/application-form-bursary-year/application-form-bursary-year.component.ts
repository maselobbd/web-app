import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApplicationInsightsService } from '../../../shared/data-access/services/application-insights.service';
import { RouteNames } from '../../../shared/enums/routeNames';
import { Router } from '@angular/router';
import { currentFiscalYear } from '../../../shared/utils/functions/dateUtils';

@Component({
  selector: 'app-application-form-bursary-year',
  templateUrl: './application-form-bursary-year.component.html',
  styleUrl: './application-form-bursary-year.component.scss',
})
export class ApplicationFormBursaryYearComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private applicationInsights: ApplicationInsightsService,
    private router: Router
  ) {}

  years: number[] = [];
  @Input() year!: string;
  @Input() enableYearSelection!: boolean;
  @Input() errorMessage!:string;
  @Output() yearSelected = new EventEmitter<number>();
  applicationFormyear!: FormGroup;
  ngOnInit(): void {
    this.applicationFormyear = this.formBuilder.group({
      year: [this.year, Validators.required],
    });
    this.getYears();
    this.applicationFormyear.get('year')?.setValue(parseInt(this.year));
    if (this.year) {
      this.yearSelected.emit(parseInt(this.year));
    }
    this.applicationInsights.logPageView(RouteNames.HOD_APPLICATIONS, this.router.url);
  }
  getYears(): void {
    const nowYear = (new Date()).getFullYear();
    const fiscalYear = currentFiscalYear();
    if (nowYear > fiscalYear) {
      this.years = [fiscalYear, fiscalYear + 1];
    } else {
      this.years = [ fiscalYear ]
    }
  }
}
