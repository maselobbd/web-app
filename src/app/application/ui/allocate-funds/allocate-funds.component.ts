import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { AbstractControl, FormArray, FormGroup, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { createMessageType } from '../../utils/minMaxRequestedAmount';
import { Application } from '../../data-access/models/application.model';
import { DataService } from '../../../shared/data-access/services/data.service';
import { AllocationUsageService } from '../../../shared/data-access/services/allocation-usage.service';
import { ApplicationInsightsService } from '../../../shared/data-access/services/application-insights.service';
import { RouteNames } from '../../../shared/enums/routeNames';
import { Router } from '@angular/router';

@Component({
  selector: 'app-allocate-funds',
  templateUrl: './allocate-funds.component.html',
  styleUrls: [
    './allocate-funds.component.scss',
    '../../../shared/utils/styling/fundAllocations.scss',
  ],
})
export class AllocateFundsComponent implements OnDestroy {
  private ngUnsubscribe: Subject<void>;

  @Input() applications!: FormArray;
  @Output() outputAmountExceeded = new EventEmitter<boolean>();
  @Input() allocationMinimum!: number;
  @Input() allocationMaximum!: number;

  newAllocationsTotal!: number;
  newAllocations!: number[];
  countAllocatedApplications: number = 0;
  requestedAmount!: number;
  minAllocation!: number;
  allocationValue!: number;
  @Input()
  error!: string;
  minWarningMessage!: string;
  maxWarningMessage!: string;

  timesFormFieldVisited: number;
  applicationsFieldVisits: any;

  amountExceeded: boolean = false;

  constructor(
    private sharedataService: DataService,
    private applicationInsights: ApplicationInsightsService,
    private router: Router,
  ) {
    this.requestedAmount = 0;
    this.ngUnsubscribe = new Subject<void>();
    this.timesFormFieldVisited = 0;
    this.applicationsFieldVisits = {};
  }
  ngOnInit(): void {
    this.sharedataService.data$.subscribe((data: any) => {
      if (data) {
        let allocationModel = data[0];
        this.allocationMinimum = allocationModel.minimumPerStudent;
        this.allocationMaximum = allocationModel.maximumPerStudent;
      }
    });
    this.check();
    const messageType = createMessageType(
      this.allocationMinimum,
      this.allocationMaximum,
    );
    this.minWarningMessage = messageType.MIN_WARNING;
    this.maxWarningMessage = messageType.MAX_WARNING;
    this.applicationInsights.logPageView(RouteNames.HOD_APPLICATIONS, this.router.url);
  }

  getFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  check(): void {
    this.newAllocations = this.applications.controls.map((applicant) => {
      const rawValue = applicant.get('amount')?.getRawValue();
      const parsedValue = parseFloat(rawValue);
      return isNaN(parsedValue) ? 0 : parsedValue;
    });

    this.newAllocationsTotal = this.newAllocations.reduce(
      (acc, currentValue) => {
        return acc + (isNaN(currentValue) ? 0 : currentValue);
      },
      0,
    );
  }
  hasAmountBeenExceeded(event: boolean) {
    this.amountExceeded = event;
    if (event) {
      this.outputAmountExceeded.emit(!this.amountExceeded);
    }
  }

  onInputChange() {
    this.check();
  }
}
