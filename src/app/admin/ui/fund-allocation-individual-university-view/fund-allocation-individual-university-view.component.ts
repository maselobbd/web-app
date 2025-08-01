import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UniversityAllocationsModel } from '../../data-access/models/universityAllocations-model';
import { DataService } from '../../../shared/data-access/services/data.service';
import { DepartmentAllocationsModel } from '../../data-access/models/departmentAllocation-model';
import { FundAllocationsMessages } from '../../enums/fundAllocationsMessages';
import { checkDecimals } from '../../../shared/utils/functions/check_decimals';
import { Store } from '@ngrx/store';
import { AllocationsPageActions } from '../../../states/fund-allocations/fund-allocations.actions';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fund-allocation-individual-university-view',
  templateUrl: './fund-allocation-individual-university-view.component.html',
  styleUrl: './fund-allocation-individual-university-view.component.scss'
})
export class FundAllocationIndividualUniversityViewComponent implements OnInit, AfterViewInit, OnChanges {

  @Input()
  activeUniversitiesFundAllocationsData: UniversityAllocationsModel[] | null = [];
  @Input()
  activeUniversitiesDepartmentsFundAllocationsData: DepartmentAllocationsModel[] | null = [];

  viewIndividualUniversity!: boolean;
  dividerWidth: number;
  highestUniversityAllocation: number;
  matProgressBarSectionWidth!: string;
  universityDepartmentsData: any[];
  fundAllocationsMessages: any = FundAllocationsMessages;
  checkDecimals: any;

  constructor (
    private dataService: DataService,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.dividerWidth = 0;
    this.highestUniversityAllocation = 0;
    this.universityDepartmentsData = [];
    this.checkDecimals = checkDecimals;
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty("activeUniversitiesFundAllocationsData")) {

      if(changes["activeUniversitiesFundAllocationsData"] && changes["activeUniversitiesFundAllocationsData"].currentValue && changes["activeUniversitiesFundAllocationsData"].currentValue.length > 0) { 
        this.highestUniversityAllocation = Math.max(...changes["activeUniversitiesFundAllocationsData"].currentValue.map((university: UniversityAllocationsModel) => university.universityTotalAllocated))
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.activeUniversitiesFundAllocationsData) {
      this.activeUniversitiesFundAllocationsData.map(
      universityData => universityData ?  universityData.universityTotalAllocated : 0
      );
    }
  }

  requestedAmountToTotalRatio(requestedAmount: number, totalAllocation: number): string {

    if (requestedAmount && totalAllocation) {
      return `${(requestedAmount / totalAllocation) * 100}`;
    }
    return '0';
  }

  approvedAmountToTotalRatio(approvedAmount: number, totalAllocation: number): string {

    !approvedAmount ? approvedAmount = 0 : null;
    !totalAllocation ? totalAllocation = 0: null;

    if (
      ((approvedAmount / totalAllocation) <= (1000 / totalAllocation)) ||
      !approvedAmount
    ) {
      return '0.7rem';
    } else if (
      approvedAmount > totalAllocation
    ) {
      this.dividerWidth = 1.1;
      return `100%`;
    }
    this.dividerWidth =
      approvedAmount / totalAllocation;
    return `${this.dividerWidth * 100}%`;
  }

  viewIndividualUniversityFunds(university: UniversityAllocationsModel): void {
    this.filterUniversities(university);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { ['university-name']: university.universityName },
      queryParamsHandling: 'merge',
    });
    this.store.dispatch(AllocationsPageActions.setViewIndividualUniversity({ viewIndividualUniversity: true, universityName: university.universityName }))
  }

  progressBarSectionWidth(universityAllocation: number): string {
    if ( universityAllocation && universityAllocation > 0) {
      return `${(universityAllocation / this.highestUniversityAllocation) * 100}%`
    }
    return "0"
  }

  filterUniversities(university: UniversityAllocationsModel ): void {

    this.store.dispatch(AllocationsPageActions.setUniversity({ university: university }));

    if (this.activeUniversitiesFundAllocationsData) {
      this.activeUniversitiesDepartmentsFundAllocationsData?.forEach(
        universityDeparmentInfo => universityDeparmentInfo.universityName.includes(university.universityName) ? this.universityDepartmentsData.push(universityDeparmentInfo) : null
      );
      this.dataService.sendUniversityDepartments(this.universityDepartmentsData);
    }
  }
}
