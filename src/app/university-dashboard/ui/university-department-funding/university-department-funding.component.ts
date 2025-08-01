import { Component, OnInit } from '@angular/core';
import { UserStore } from '../../../shared/data-access/stores/user.store';
import { hasValidResults } from '../../../shared/utils/functions/checkData.function';
import { UserAttributes } from '../../../authentication/data-access/models/auth.model';
import { HodAccountsService } from '../../../admin/data-access/services/hod-accounts.service';
import { DepartmentAllocationsModel } from '../../../admin/data-access/models/departmentAllocation-model';
import { MatSelectChange } from '@angular/material/select';
import { UniversityAllocationsModel } from '../../../admin/data-access/models/universityAllocations-model';
import { FundAllocationDataService } from '../../../admin/data-access/services/fund-allocation-data.service';
import { FundAllocationsModel } from '../../../admin/data-access/models/fundAllocations-model';
import { currentFiscalYear } from '../../../shared/utils/functions/dateUtils';

@Component({
  selector: 'app-university-department-funding',
  templateUrl: './university-department-funding.component.html',
  styleUrl: './university-department-funding.component.scss',
})
export class UniversityDepartmentFundingComponent implements OnInit {
  userDetails!: UserAttributes;
  departments!: DepartmentAllocationsModel[];
  selectedYear: number = 0;
  title = 'My funding';
  fundAllocationsModel!: FundAllocationsModel;
  activeUniversitiesFundAllocationsData!: UniversityAllocationsModel[];
  yearsOfFunding: number[] = [];
  currentYear: number = currentFiscalYear();
  viewIndividualUniversity: any;

  constructor(
    private userStore: UserStore,
    private accountService: HodAccountsService,
    private fundAllocationDataService: FundAllocationDataService,
  ) {
    this.userStore.get().subscribe((user) => {
      this.userDetails = user;
    });
  }
  ngOnInit(): void {
    this.getActiveUniversitiesInfo(
      this.userDetails.university,
      this.currentYear,
      this.userDetails.faculty
    );
    this.getDepartments(this.currentYear);
  }

  getDepartments(year: number): void {
    if (this.userDetails) {
      this.accountService
        .getDepartmentsAllocations(
          this.userDetails.university,
          this.userDetails.faculty,
          year,
        )
        .subscribe((data) => {
          if (hasValidResults(data)) {
            this.departments = data.results;
          }
        });
    }
  }
  filter(event: MatSelectChange): void {
    this.getDepartments(event.value);
    this.getActiveUniversitiesInfo(this.userDetails.university, event.value,this.userDetails.faculty);
  }

  getActiveUniversitiesInfo(universityName: string, year: number,faculty:string): void {
    this.fundAllocationDataService
      .getDeanUniversitiesFundAllocations(universityName, year,faculty)
      .subscribe((data) => {
        if (hasValidResults(data)) {
          this.activeUniversitiesFundAllocationsData = (
            data.results?.activeUniversitiesFundAllocationsData ?? []
          ).filter(
            (university) =>
              university.universityName === this.userDetails.university,
          );
        }
      });
  }

  receiveFilterEmission(event: {yearsOfFunding: number[], viewIndividualUniversity: boolean}): void {
    if(event) {
      this.yearsOfFunding = event.yearsOfFunding,
      this.viewIndividualUniversity = event.yearsOfFunding
    }
  }
}
