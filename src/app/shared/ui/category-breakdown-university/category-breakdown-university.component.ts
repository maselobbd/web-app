import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AllAllocationAndSpending } from '../../../admin/data-access/models/applications-report.model';


@Component({
  selector: 'app-category-breakdown-university',
  templateUrl: './category-breakdown-university.component.html',
  styleUrls: ['./category-breakdown-university.component.scss', '../category-breakdown/category-breakdown.component.scss']
})
export class CategoryBreakdownUniversityComponent implements OnChanges {

  @Input()
  reportsCategoryBreakdownUniversity!: AllAllocationAndSpending;
  @Input()
  reportsStudentsFundedPerUniversity!: any;
  @Input()
  reportsRacesFundedPerUniversity!: any;

  defaultReportsCategoryBreakdownUniversity!: AllAllocationAndSpending;

  constructor() {
    this.defaultReportsCategoryBreakdownUniversity = {
      totalAllocationByUniversity: [],
      totalAmountUsedByUniversity: []
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const hasAllChildrenDataChanges: boolean = (changes.hasOwnProperty("reportsCategoryBreakdownUniversity") && changes.hasOwnProperty("reportsStudentsFundedPerUniversity") && changes.hasOwnProperty("reportsRacesFundedPerUniversity"))
    const isNotFirstChangeForAll: boolean = !(changes["reportsCategoryBreakdownUniversity"].firstChange && changes["reportsStudentsFundedPerUniversity"].firstChange && changes["reportsRacesFundedPerUniversity"].firstChange)
    if(hasAllChildrenDataChanges) {
      if (isNotFirstChangeForAll) {
        this.reportsCategoryBreakdownUniversity = changes["reportsCategoryBreakdownUniversity"].currentValue;
        this.reportsStudentsFundedPerUniversity = changes["reportsStudentsFundedPerUniversity"].currentValue;
        this.reportsRacesFundedPerUniversity = changes["reportsRacesFundedPerUniversity"].currentValue;
      };
    } 
  } 
}