import {AfterViewInit, Component, EventEmitter, Input,  OnChanges,  OnInit, Output, SimpleChanges} from '@angular/core';
import { AddAllocationDialogComponent } from '../../../admin/ui/add-allocation-dialog/add-allocation-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { checkDecimals } from '../../utils/functions/check_decimals';
import { FormGroup } from '@angular/forms';
import { DepartmentAllocationsModel } from '../../../admin/data-access/models/departmentAllocation-model';
import { UniversityAllocationsModel } from '../../../admin/data-access/models/universityAllocations-model';
import { DataService } from '../../data-access/services/data.service';
import { UserStore } from '../../data-access/stores/user.store';
import { Roles, UserAttributes } from '../../../authentication/data-access/models/auth.model';
import { currentFiscalYear } from '../../utils/functions/dateUtils';
import { FundAllocationsValidators } from '../../../admin/data-access/models/fundAllocations-model';
import { Store } from '@ngrx/store';
import { AllocationsPageActions } from '../../../states/fund-allocations/fund-allocations.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fund-allocation-individual-university',
  templateUrl: './fund-allocation-individual-university.component.html',
  styleUrls: ['./fund-allocation-individual-university.component.scss', '../../../shared/utils/styling/footer.scss'],
})
export class FundAllocationIndividualUniversityComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() viewIndividualUniversity!: boolean;
  @Input() universityToViewIndividually: UniversityAllocationsModel | null = {
    universityName: "",
    universityTotalAllocated: 0,
    universityTotalApproved: 0,
    universityTotalRequested: 0
  };
  @Input()
  activeUniversitiesDepartmentsFundAllocationsData: DepartmentAllocationsModel[] | null = [];
  allocationsModel: any;
  departmentsForChosenUniverstiy: DepartmentAllocationsModel[];
  yearOfStudy!: number;
  checkDecimals: any;
  @Input() yearOfStudyForm!: FormGroup;
  @Input() filterYear!: number;
  fiscalYear: number = currentFiscalYear();
  userRole!: UserAttributes;
  @Input() activeUniversitiesFundAllocationsData: UniversityAllocationsModel[] | null = [];
  displayValue: any;
  @Output() moveFundsClicked = new EventEmitter<void>();
  Roles = Roles;
  @Input()
  fundAllocationsValidators: FundAllocationsValidators | null = {
    minAmount: 0,
    maxAmount: 0
  }
  universityToViewDepartments!: DepartmentAllocationsModel[] | undefined;
    
  constructor(
    private dialog: MatDialog,
    private userStore: UserStore,
    private router: Router,
    private store: Store,
    private dataService: DataService,
  ) {
    this.departmentsForChosenUniverstiy = [];
    this.checkDecimals = checkDecimals;
  }
  
  ngOnInit(): void {
    this.userStore.get().subscribe((user) => {
      this.userRole = user;
    });
    this.yearOfStudy = this.yearOfStudyForm.get('yearOfStudy')?.value;
    
    if (this.universityToViewIndividually?.universityName) {
      this.universityToViewDepartments = this.activeUniversitiesDepartmentsFundAllocationsData?.filter(
        department => department.universityName === this.universityToViewIndividually?.universityName
      );
      if(this.universityToViewDepartments) this.dataService.sendUniversityDepartments(this.universityToViewDepartments);
    };
    
  }
  
  onBack(): void {
    this.router.navigate(['/admin/fundAllocations']);
    this.store.dispatch(AllocationsPageActions.setViewIndividualUniversity({ viewIndividualUniversity: false, universityName: "" }));
  }
  
  openDialog(action: string): void {
    const dialogConfig = new MatDialogConfig();
    const departments =
    this.universityToViewDepartments?.map(
      (department) => department.departmentName,
    );
    
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      action: action,
      activeUniversitiesDepartmentsFundAllocationsData:
      this.universityToViewDepartments,
      activeUniversity: this.universityToViewIndividually,
      activeDepartmentNames: departments,
      yearOfStudy: this.yearOfStudy,
      minAmount: this.fundAllocationsValidators?.minAmount || 0,
      maxAmount: this.fundAllocationsValidators?.maxAmount || 0,
    };
    
    this.dialog.open(AddAllocationDialogComponent, dialogConfig);
  }
  
  
  
  ngAfterViewInit(): void {
    this.yearOfStudyForm.get('yearOfStudy')?.valueChanges.subscribe(value => {
      this.filterYear = value;
      this.yearOfStudy = value;
    })
  }

    ngOnChanges(changes: SimpleChanges): void {
      if(!changes['firstChange'] && changes.hasOwnProperty('activeUniversitiesDepartmentsFundAllocationsData')) {
        this.activeUniversitiesDepartmentsFundAllocationsData = changes['activeUniversitiesDepartmentsFundAllocationsData'].currentValue;
        this.activeUniversitiesFundAllocationsData = changes['activeUniversitiesFundAllocationsData'].currentValue;

        if (this.universityToViewIndividually?.universityName) {
        this.universityToViewDepartments = this.activeUniversitiesDepartmentsFundAllocationsData?.filter(
          department => department.universityName === this.universityToViewIndividually?.universityName
        );
        if(this.universityToViewDepartments) this.dataService.sendUniversityDepartments(this.universityToViewDepartments);
        this.universityToViewIndividually = this.activeUniversitiesFundAllocationsData?.filter(university => university.universityName === this.universityToViewIndividually?.universityName)[0] || {
          universityName: "",
          universityTotalAllocated: 0,
          universityTotalApproved: 0,
          universityTotalRequested: 0
        }
      }}
    }
    
}
