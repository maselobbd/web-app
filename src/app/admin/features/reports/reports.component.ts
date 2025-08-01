import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ReportsService } from '../../data-access/services/reports.service';
import { hasValidResults } from '../../../shared/utils/functions/checkData.function';
import { MatSnackBar } from '@angular/material/snack-bar';
import { currentFiscalYear } from '../../../shared/utils/functions/dateUtils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarDuration } from '../../../shared/enums/snackBarDuration';
import { SnackBarMessage } from '../../../shared/enums/snackBarMessage';
import { CategoryBreakdownTitles } from '../../../shared/enums/categories';
import { getStudentsAndFundsData, getUniversitiesAllocationSpentData, getActiveStudents, getActiveRaces, getPredictedSpending } from '../../../shared/utils/functions/reports.function';
import { AllAllocationAndSpending, AmountData, RatioPerRace, ReportsCategoryBreakDown, ReportsData, UpdateChartData } from '../../data-access/models/applications-report.model';
import { DetailsService } from '../../data-access/services/details.service';
import { ExcelService } from '../../../shared/data-access/services/excel.service';
import { PredictedSpending } from '../../data-access/models/applications-report.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: [
    './reports.component.scss',
    '../../../shared/utils/styling/footer.scss',
  ]
})
export class ReportsComponent implements OnInit, AfterViewInit {

  reportsData!: ReportsData;
  year: number = currentFiscalYear();
  selectedValue: string | number = CategoryBreakdownTitles.FILTER_DEFAULT;
  filterItems: (string | number)[] = [];
  chosenFilterValue!: number | string;
  filterForm!: FormGroup;
  reportsCategoryBreakdown!: ReportsCategoryBreakDown;
  reportsCategoryBreakdownUniversity!: AllAllocationAndSpending;
  reportsStudentsFundedPerUniversity!: { activeStudents: AmountData[] };
  reportsRacesFundedPerUniversity!: { activeRaces: RatioPerRace[] };
  reportFileName: string = "";
  predictedSpending!: PredictedSpending;

  constructor(
    private reportsService: ReportsService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private detailsService: DetailsService,
    private excelService: ExcelService,
    private _snackBar: MatSnackBar,
    ) {}
    
    ngOnInit(): void {
      
      this.filterForm = this.formBuilder.group({
        financialYear: [CategoryBreakdownTitles.FILTER_DEFAULT, Validators.required]
      });
      this.reportsService.getReportsData().subscribe(data => {
      if(hasValidResults(data)) {
        const filterValue: (string | number) = this.filterForm.get("financialYear")?.value;
        this.reportsData = data.results as ReportsData;
        if(this.reportsData?.distinctYears) this.filterItems =  this.reportsData?.distinctYears;
        this.filterItems.sort();
        this.filterItems.unshift(CategoryBreakdownTitles.FILTER_DEFAULT);
        this.reportsCategoryBreakdown = getStudentsAndFundsData(this.reportsData.allocationStudentRace, filterValue);
        this.reportsCategoryBreakdownUniversity = getUniversitiesAllocationSpentData(this.reportsData.universitiesAllocationSpentData, filterValue);
        this.reportsStudentsFundedPerUniversity = getActiveStudents(this.reportsData.universitiesActiveStudents, filterValue);
        this.reportsRacesFundedPerUniversity = getActiveRaces(this.reportsData.universitiesActiveRaces, filterValue);
        this.predictedSpending = this.reportsData.predictedSpending;
      } else if (data.errors) {
        this.snackBar.open(
          SnackBarMessage.REPORTS_FAILED, 
          SnackBarMessage.CLOSE, 
          { duration: SnackBarDuration.DURATION });
      }
    })
    this.reportFileName = `${this.filterForm.get('financialYear')?.value}_Applications`
  }

  ngAfterViewInit(): void {
    this.filterForm.get('financialYear')?.valueChanges.subscribe(value => {
      this.reportsCategoryBreakdown = {...getStudentsAndFundsData(this.reportsData.allocationStudentRace, value)};
      this.reportsCategoryBreakdownUniversity = {...getUniversitiesAllocationSpentData(this.reportsData.universitiesAllocationSpentData, value)};
      this.reportsStudentsFundedPerUniversity = { ...getActiveStudents(this.reportsData.universitiesActiveStudents, value) };
      this.reportsRacesFundedPerUniversity = { ...getActiveRaces(this.reportsData.universitiesActiveRaces, value) };
      this.reportFileName = `${value}_Applications`;
      this.predictedSpending = { ...getPredictedSpending(this.reportsData, value) };
    });
  }

  generateReport(filename: string): void {
    this.detailsService.getApplicationsReport(this.filterForm.get("financialYear")?.value).subscribe((data) => {
      if (
        data.results &&
        data.results.length > 0 &&
        data.results.every((element) => element)
      ) {
        this.excelService.generateExcel(data.results, filename);
      } else {
        this._snackBar.open(
          SnackBarMessage.REPORT_GENERATION_FAILED,
          SnackBarMessage.CLOSE,
          {
            duration: SnackBarDuration.DURATION,
          },
        );
      }
    });
  }
}