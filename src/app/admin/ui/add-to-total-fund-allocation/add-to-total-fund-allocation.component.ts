import { Component, Input, OnChanges, OnInit, SimpleChanges, } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddAllocationDialogComponent } from '../add-allocation-dialog/add-allocation-dialog.component';
import { UniversityAllocationsModel } from '../../data-access/models/universityAllocations-model';
import { DepartmentAllocationsModel } from '../../data-access/models/departmentAllocation-model';
import { FormGroup } from '@angular/forms';
import { Actions } from "../../enums/fundAllocations";
import { currentFiscalYear } from '../../../shared/utils/functions/dateUtils';
import { FundAllocationsValidators, FundAmounts } from '../../data-access/models/fundAllocations-model';

@Component({
  selector: 'app-add-to-total-fund-allocation',
  templateUrl: './add-to-total-fund-allocation.component.html',
  styleUrl: './add-to-total-fund-allocation.component.scss',
})
export class AddToTotalFundAllocationComponent implements OnInit, OnChanges {

  @Input()
  activeUniversitiesFundAllocationsData: UniversityAllocationsModel[] | null = [];
  @Input()
  activeUniversitiesDepartmentsFundAllocationsData: DepartmentAllocationsModel[] | null = [];
  @Input()
  activeUniversities: string[] | null = [];
  @Input()
  yearOfStudyForm!: FormGroup;
  @Input()
  filterYear!: number;
  @Input()
  fundAmounts: FundAmounts | null = {
  totalAllocated: 0,
    unallocatedAmount: 0,
    fundTotal: 0
  }
  @Input()
  fundAllocationsValidators: FundAllocationsValidators | null = {
    minAmount: 0,
    maxAmount: 0
  }

  totalAmountAllocated: number = 0 ;
  currentDate: Date;
  currentYear: number;
  allocatedAmount: number = 0;
  unallocatedAmount: number = 0;
  actions = Actions;

  constructor(
     private dialog: MatDialog,
    ) {
    this.currentDate = new Date();
    this.currentYear = currentFiscalYear();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.hasOwnProperty('fundAmounts')) {
      const fundAmountChanges = changes['fundAmounts'];
      if(!fundAmountChanges.firstChange) {
        this.fundAmounts = changes['fundAmounts'].currentValue;
        this.totalAmountAllocated = this.fundAmounts && this.fundAmounts.fundTotal ? this.fundAmounts.fundTotal : 0;
        this.unallocatedAmount = this.fundAmounts && this.fundAmounts.unallocatedAmount ? this.fundAmounts.unallocatedAmount : 0;
        this.allocatedAmount = this.fundAmounts && this.fundAmounts.totalAllocated ? this.fundAmounts.totalAllocated : 0;
      }
    }
  }

  ngOnInit(): void {
    if(this.fundAmounts) {
      this.totalAmountAllocated = this.fundAmounts.fundTotal || 0;
      this.unallocatedAmount = this.fundAmounts.unallocatedAmount || 0;
      this.allocatedAmount = this.fundAmounts.totalAllocated || 0;
    }
  }

  openDialog(action: string): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      action: action,
      activeUniversitiesFundAllocationsData: this.activeUniversitiesFundAllocationsData,
      activeUniversitiesDepartmentsFundAllocationsData: this.activeUniversitiesDepartmentsFundAllocationsData,
      activeUniversities: [...new Set(this.activeUniversities)],
      yearOfStudy: this.yearOfStudyForm.get('yearOfStudy')?.value ? this.yearOfStudyForm.get('yearOfStudy')?.value : null,
      unallocatedAmount: this.unallocatedAmount,
      minAmount: this.fundAllocationsValidators?.minAmount || 0,
      maxAmount: this.fundAllocationsValidators?.maxAmount || 0,
    };

    this.dialog.open(AddAllocationDialogComponent, dialogConfig);
  }
}
