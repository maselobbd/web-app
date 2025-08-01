import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AllocationUsageService } from '../../../shared/data-access/services/allocation-usage.service';
import { totalApprovedTotalAllocationRatio } from '../../../shared/enums/tresholdRatio';
@Component({
  selector: 'app-allocation-details',
  templateUrl: './allocation-details.component.html',
  styleUrl: './allocation-details.component.scss',
})
export class AllocationDetailsComponent implements OnChanges {
  public dividerWidth: number = 0;
  remainingAmount: number;
  requestedApprovedToTotalRatio: number;
  requestedAmountToTotalRatio: number;
  noAllocationsMessage: string = '';
  totalRequested: number;
  requestedAmount!: number;
  allocationModel: any;
  @Input() university: string = '';

  constructor(private allocationUsageService: AllocationUsageService) {
    this.remainingAmount = 0;
    this.requestedAmountToTotalRatio = 0;
    this.requestedApprovedToTotalRatio = 0;
    this.totalRequested = 0;
    this.allocationModel = {};
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['university'].previousValue !== changes['university'].currentValue
    ) {
      this.getAllocations(changes['university'].currentValue);
    }
  }

  updateBarValues(requested: number): void {
    this.remainingAmount =
      this.allocationModel.totalAllocation -
      (this.allocationModel.approvedAmount + requested);

    this.requestedApprovedToTotalRatio =
      ((requested + this.allocationModel.approvedAmount) /
        this.allocationModel.totalAllocation) *
      100;
    if (!this.requestedApprovedToTotalRatio) {
      this.requestedApprovedToTotalRatio = 0;
    } else {
      this.requestedAmountToTotalRatio =
        (requested / this.allocationModel.totalAllocation) * 100;
    }
  }

  getAllocations(university: string): void {
    this.allocationUsageService
      .getAllocationsForUniversity(university)
      .subscribe((data) => {
        if (data.results) {
          this.allocationModel = data.results;
          if (!this.allocationModel.requestedAmount) {
            this.totalRequested = 0;
          } else {
            this.totalRequested = this.allocationModel.requestedAmount;
          }
          if (!this.allocationModel.requestedAmount) {
            this.requestedAmount = 0;
          } else {
            this.requestedAmount = this.allocationModel.requestedAmount;
          }
          this.updateBarValues(this.totalRequested);
        } else if (data.errors) {
          this.noAllocationsMessage = 'No Allocations found';
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
      this.allocationModel.approvedAmount > this.allocationModel.totalAllocation
    ) {
      this.dividerWidth = 1.1;
      return `100%`;
    }
    this.dividerWidth =
      this.allocationModel.approvedAmount /
      this.allocationModel.totalAllocation;
    return `${this.dividerWidth * 100}%`;
  }
}
