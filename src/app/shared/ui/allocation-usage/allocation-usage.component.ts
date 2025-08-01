import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AllocationUsageService } from '../../data-access/services/allocation-usage.service';
import { Subject } from 'rxjs';
import { DataService } from '../../data-access/services/data.service';
import { UniversityFundsService } from '../../../admin/data-access/services/university-funds.service';
import { totalApprovedTotalAllocationRatio } from '../../enums/tresholdRatio';
import { checkDecimals } from '../../utils/functions/check_decimals';
import { Roles, UserAttributes } from '../../../authentication/data-access/models/auth.model';
import { UserStore } from '../../data-access/stores/user.store';
import { Router } from '@angular/router';
import { RouteEnum } from '../../enums/routes';
import { AllocationModel } from '../../data-access/models/allocation.models';
import { Store } from '@ngrx/store';
import { selectViewIndividualUniversity } from '../../../states/fund-allocations/fund-allocations.selectors';

@Component({
  selector: 'app-allocation-usage',
  templateUrl: './allocation-usage.component.html',
  styleUrl: './allocation-usage.component.scss',
})
export class AllocationUsageComponent implements OnDestroy, OnInit, OnChanges {
  @Input() error!: string;
  @Input() newAllocationsTotal!: number;
  @Input() departmentAllocationsInfo!: any;
  @Input() allocationModel: AllocationModel;
  @Output() remainingExceeded = new EventEmitter<boolean>();
  @Output() cardLoaded = new EventEmitter<boolean>();
  private ngUnsubscribe = new Subject<void>();
  public breakPoint: number = 0;
  public dividerWidth: number = 0;
  remainingAmount: number;
  requestedApprovedToTotalRatio: number;
  requestedAmountToTotalRatio: number;
  isExpanded = false;
  totalRequested: number;
  requestedAmount!: number;
  viewIndividualUniversity$ = this.store.select(selectViewIndividualUniversity);
  viewingIndividualUniversity: boolean;
  checkDecimals: any;
  userDetails!: UserAttributes;
  rolesEnum: typeof Roles = Roles;
  department!: string;
  Roles = Roles;
  currentRoute!: boolean;
  userRole!: Roles;

  constructor(
    private allocationUsageService: AllocationUsageService,
    private dataService: DataService,
    private universityFundsService: UniversityFundsService,
    private userStore:UserStore,
    private router: Router,
    private store: Store,
  ) {
    this.remainingAmount = 0;
    this.requestedAmountToTotalRatio = 0;
    this.requestedApprovedToTotalRatio = 0;
    this.totalRequested = 0;
    this.allocationModel = {approvedAmount:0,totalAllocation:0,requestedAmount:0};
    this.viewingIndividualUniversity = false;
    this.checkDecimals = checkDecimals;
  }

  updateBarValues(requested: number): void {
    this.remainingAmount =
      this.allocationModel.totalAllocation -
        (this.allocationModel.approvedAmount + requested) || 0;
    this.requestedApprovedToTotalRatio =
      ((requested + this.allocationModel.approvedAmount) /
        this.allocationModel.totalAllocation) *
        100 || 0;
    this.requestedAmountToTotalRatio =
      (requested / this.allocationModel.totalAllocation) * 100 || 0;
    if (this.remainingAmount <= 0) {
      this.remainingExceeded.emit(true);
    } else {
      this.remainingExceeded.emit(false);
    }
    this.cardLoaded.emit(true);
  }
  getAllocations(): void {
    this.allocationUsageService.getAllocations().subscribe((data) => {
      if (data.results) {
        this.allocationModel = data.results;
        this.totalRequested = this.allocationModel.requestedAmount || 0;
        this.requestedAmount = this.allocationModel.requestedAmount || 0;
        this.updateBarValues(this.totalRequested);
      } else if (data.errors) {
        this.error = `Something went wrong, please try again`;
      }
    });
  }
  progressBarMatDivider(): string {
    if (
      this.allocationModel.approvedAmount /
        this.allocationModel.totalAllocation <=
        totalApprovedTotalAllocationRatio.ratio ||
      !this.allocationModel.approvedAmount
    ) {
      return '0.7rem';
    } else if (
      this.checkDecimals(this.allocationModel.approvedAmount) >
      this.checkDecimals(this.allocationModel.totalAllocation)
    ) {
      this.dividerWidth = 1.1;
      return `100%`;
    }
    this.dividerWidth =
      this.allocationModel.approvedAmount /
      this.allocationModel.totalAllocation;
    return `${this.dividerWidth * 100}%`;
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.viewingIndividualUniversity
      ? this.universityFundsService.updateView({individualUniversityView: false, universityName: ""})
      : null;
  }
  ngOnInit(): void {
    this.userStore.get().subscribe((user) => {
      this.userRole = Roles[user.role as keyof typeof Roles];
    });
    this.cardLoaded.emit(false);
    this.viewIndividualUniversity$.subscribe(data => this.viewingIndividualUniversity = data)
    this.dataService.data$.subscribe((data: any) => {
      if (data && !this.viewingIndividualUniversity) {
        this.allocationModel = data[0];
        this.totalRequested = data[1] || 0;
        this.requestedAmount = data[2] || 0;
        this.updateBarValues(this.totalRequested);
      }
    });
    if(this.router.url.includes(RouteEnum.DeanFunds)){
      this.viewingIndividualUniversity= true
    }
   
    if (this.viewingIndividualUniversity) {
      this.totalRequested =
        this.departmentAllocationsInfo.departmentTotalRequestedAmount;
      this.allocationModel.totalAllocation = parseFloat(
        this.departmentAllocationsInfo.departmentTotalAllocationAmount.toFixed(
          2,
        ),
      );
      this.allocationModel.approvedAmount = parseFloat(
        this.departmentAllocationsInfo.departmentTotalApprovedAmount.toFixed(2),
      );
      this.updateBarValues(this.totalRequested);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
      this.totalRequested = this.allocationModel.requestedAmount;
      this.updateBarValues(this.totalRequested);
  }
  toggleIcon() {
    this.isExpanded = !this.isExpanded;
  }
}