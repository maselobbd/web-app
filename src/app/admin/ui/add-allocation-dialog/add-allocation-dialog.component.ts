import { Component, Inject, OnInit } from '@angular/core';
import { TotalAllocatedService } from '../../data-access/services/total-allocated.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FundAllocationSteps, Actions, FundAllocationButtons } from '../../enums/fundAllocations';
import { UniversityAllocationsModel } from '../../data-access/models/universityAllocations-model';
import { MaxAllocation } from '../../enums/universityMaxAllocationCap';
import { FundAllocationsMessages } from '../../enums/fundAllocationsMessages';
import { UniversityFundsService } from '../../data-access/services/university-funds.service';
import { DepartmentAllocationsModel } from '../../data-access/models/departmentAllocation-model';
import { EntityModel } from '../../data-access/models/invalid-entity-model';
import { PostResponse } from '../../data-access/models/postResponse-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { checkDecimals } from '../../../shared/utils/functions/check_decimals';
import { FundAllocationsTitles } from '../../enums/fundAllocationsTitles';
import { SnackBarDuration } from '../../../shared/enums/snackBarDuration';
import { SnackBarMessage } from '../../../shared/enums/snackBarMessage';
import { reloadComponent } from '../../../shared/utils/functions/reloadComponent';
import { fundConfirm } from "../../../shared/utils/functions/fund-allocation/fundConfirm.function";
import { fundNext } from "../../../shared/utils/functions/fund-allocation/fundNext.function";
import { FundAllocationsDialogModel, MoveFundsDialogModel } from "../../data-access/models/fundAllocations-model";
import { Store } from "@ngrx/store";
import { selectFundAllocationStep, selectSplitOrAdd, selectReallocationUniversities, selectUniversitiesWithCapped, selectMoveFundsDepartments } from "../../../states/fund-allocations/fund-allocations.selectors";
import {
  AllocationOperationsActions,
  AllocationsPageActions
} from "../../../states/fund-allocations/fund-allocations.actions";
import { Observable } from "rxjs";

@Component({
  selector: 'app-add-allocation-dialog',
  templateUrl: './add-allocation-dialog.component.html',
  styleUrls: [
    './add-allocation-dialog.component.scss',
    '../../../shared/utils/styling/fundAllocations.scss'
  ],
})
export class AddAllocationDialogComponent implements OnInit {

  fundAllocationForm!: FormGroup;
  reallocateFundsForm!: FormGroup;
  moveFundsForm!: FormGroup;
  splitFunds: boolean;
  postAllocations: boolean;
  universitiesToSplitMoney: string[];
  allocationMoney!: number;
  allocationsPostResults: PostResponse;
  postResultsError!: string[];
  successfulAllocationsUpdate!: string;
  reallocateFundsInput: boolean;
  fundAllocationSteps: typeof FundAllocationSteps;
  fundAllocationStep$: Observable<number> = this.store.select(selectFundAllocationStep);
  universityToVerify!: UniversityAllocationsModel;
  universityMaxAllocationCap: typeof MaxAllocation;
  universitiesWithCapped$: Observable<EntityModel[]> = this.store.select(selectUniversitiesWithCapped);
  reallocationUniversities$: Observable<EntityModel[]> = this.store.select(selectReallocationUniversities);
  moveFundsDepartments$: Observable<EntityModel[]> = this.store.select(selectMoveFundsDepartments);
  dataToPost!: EntityModel;
  fundAllocationsMessages = FundAllocationsMessages;
  actions = Actions;
  checkDecimals: (amount: number) => number;
  fundAllocationsTitles = FundAllocationsTitles;
  fundAllocationButtons = FundAllocationButtons;
  allocateFundsForm!: FormGroup;
  splitOrAdd$: Observable<boolean> = this.store.select(selectSplitOrAdd);
  unallocatedLess: boolean = false;

  constructor(
    public totalAllocatedService: TotalAllocatedService,
    private universityFundsService: UniversityFundsService,
    private formBuilder: FormBuilder,
    public router: Router,
    public snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<AddAllocationDialogComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: FundAllocationsDialogModel | MoveFundsDialogModel,
  ) {
    this.splitFunds = false;
    this.postAllocations = false;
    this.reallocateFundsInput = false;
    this.universitiesToSplitMoney = [];
    this.allocationMoney = 0;
    this.fundAllocationSteps = FundAllocationSteps;
    this.universityMaxAllocationCap = MaxAllocation;
    this.fundAllocationsMessages = FundAllocationsMessages;
    this.actions = Actions;
    this.allocationsPostResults = {
      message: "",
      exitNumber: 0
    }
    this.checkDecimals = checkDecimals;
  }

  get fundData(): FundAllocationsDialogModel {
    return this.data as FundAllocationsDialogModel;
  }

  get moveFundsData(): MoveFundsDialogModel {
    return this.data as MoveFundsDialogModel;
  }

  ngOnInit(): void {
    this.fundAllocationForm = this.formBuilder.group({
      allocationInput: [
        '',
        [Validators.required, Validators.min(this.fundData.minAmount), Validators.max(this.fundData.maxAmount)],
      ],
      universityCheckboxes: this.formBuilder.array([]),
    });

    this.reallocateFundsForm = this.formBuilder.group({
      fromUniversity: [
        '', Validators.required
      ],
      toUniversity: [
        '', Validators.required
      ],
      reallocateFundsInput: [
        '', [
          Validators.required,
          Validators.min(this.fundData.minAmount),
          Validators.max(this.fundData.maxAmount),
        ]
      ],
      reallocateAll: [""]
    })

    this.moveFundsForm = this.formBuilder.group({
      universityName: [
        this.moveFundsData.action.includes(Actions.MOVE_FUNDS) ? this.moveFundsData.activeUniversity.universityName : ''
      , Validators.required],
      fromDepartment: [
        '', Validators.required
      ],
      toDepartment: [
        '', Validators.required
      ],
      moveFundsInput: [
        '', [
          Validators.required,
          Validators.min(this.moveFundsData.minAmount),
          Validators.max(this.moveFundsData.maxAmount)
        ]
      ],
      moveAll: [""]
    })

    this.allocateFundsForm = this.formBuilder.group({
      university: ["", Validators.required],
      allocateFundsInput: [
        '', [
          Validators.required,
          Validators.min(this.fundData.minAmount),
          Validators.max(this.fundData.maxAmount)
        ]
      ]
    })

    this.fundData.activeUniversities.forEach((uni: string) =>
      this.checkboxesFormArray.push(
        this.formBuilder.group({
          universityName: uni,
          checkBoxValue: this.formBuilder.control(true),
        }),
      ),
    );
  }

  get checkboxesFormArray(): FormArray {
    return this.fundAllocationForm.get('universityCheckboxes') as FormArray;
  }

  onConfirm(): void {
    fundConfirm(this.data.action, this, this.store);
  }

  universitiesCapped(universities: string[], amount: number, fundAllocationStep: number): void {
    this.fundData.activeUniversitiesFundAllocationsData.forEach(
      (university: UniversityAllocationsModel) => (universities.includes(university.universityName) && university.universityTotalAllocated + amount > this.universityMaxAllocationCap.MAX_ALLOCATION && fundAllocationStep > FundAllocationSteps.ALLOCATION_STEP_1) ?
        this.store.dispatch(AllocationOperationsActions.addCappedUniversity({
          university: {
            action: this.fundData.action,
            name: university.universityName,
            amount: (university.universityTotalAllocated + amount) - this.universityMaxAllocationCap.MAX_ALLOCATION,
            year: this.fundData.yearOfStudy
          }
        })) : null
    );
  }

  universitiesWithLess(universities: string[], amount: number): void {
    this.fundData.activeUniversitiesFundAllocationsData.forEach(
      (university: UniversityAllocationsModel) => (universities.includes(university.universityName) && parseFloat((university.universityTotalAllocated - (university.universityTotalApproved + university.universityTotalRequested)).toFixed(2)) < amount) && (this.reallocateFundsForm.get("fromUniversity")?.value.includes(university.universityName)) ?
        this.store.dispatch(AllocationOperationsActions.addReallocationUniversity({
          university: {
            action: this.fundData.action,
            name: university.universityName,
            amount: Math.abs((university.universityTotalAllocated - (university.universityTotalApproved + university.universityTotalRequested))),
            year: this.fundData.yearOfStudy
          }
        })) : null
    );
  }

  departmentsWithLess(departments: string[], amount: number): void {
    this.data.activeUniversitiesDepartmentsFundAllocationsData.forEach(
      (department: DepartmentAllocationsModel) => departments.includes(department.departmentName) && this.moveFundsForm.get("fromDepartment")?.value.includes(department.departmentName) && (amount > parseFloat((department.departmentTotalAllocationAmount - (department.departmentTotalApprovedAmount + department.departmentTotalRequestedAmount)).toFixed(2))) ?
        this.store.dispatch(AllocationOperationsActions.addDepartment({
          department: {
            action: this.data.action,
            name:department.departmentName,
            amount: parseFloat((department.departmentTotalAllocationAmount - (department.departmentTotalApprovedAmount + department.departmentTotalRequestedAmount)).toFixed(2)),
            year: this.data.yearOfStudy
          }
        })) : null
    )
  }

  getUniversitiesToSplitMoney(controlCheckBoxValues: any[]): string[] {
    const universities: string[] = [];
    controlCheckBoxValues.forEach(
      (checkboxValue) => checkboxValue.checkBoxValue ? universities.push(checkboxValue.universityName) : null
    )
    return [...new Set(universities)];
  }

  onInput(): void {
    if (this.data.action === Actions.ADD) {
      this.store.dispatch(AllocationOperationsActions.resetUniversitiesWithCapped());
    } else if (this.data.action === Actions.REALLOCATE) {
      this.store.dispatch(AllocationOperationsActions.resetReallocationUniversities());
    } else if (this.data.action === Actions.MOVE_FUNDS) {
      this.store.dispatch(AllocationOperationsActions.resetMoveFundsDepartments());
    }

    if (this.fundData.action.includes(Actions.ALLOCATE) && this.allocateFundsForm.get('allocateFundsInput')?.valid) {
      this.unallocatedLess = this.allocateFundsForm.get('allocateFundsInput')?.value > this.fundData.unallocatedAmount
      this.filterUniversityAmounts(this.allocateFundsForm.get('university')?.value) + this.allocateFundsForm.get('allocateFundsInput')?.value > this.universityMaxAllocationCap.MAX_ALLOCATION ?
        this.store.dispatch(AllocationOperationsActions.addCappedUniversity({ university: this.allocateFundsForm.get('university')?.value })) : null
    }
  }

  onNext(): void {
    fundNext(this.data.action, this, this.store);
  }

  onBack(): void {
    this.store.dispatch(AllocationOperationsActions.decreaseFundAllocationStep());

    if (this.data.action === Actions.ADD) {
      this.store.dispatch(AllocationOperationsActions.setSplitOrAdd({ setSplitOrAdd: true }));
    }
    if (this.data.action === Actions.ADD || this.data.action === Actions.ALLOCATE) {
      this.store.dispatch(AllocationOperationsActions.resetUniversitiesWithCapped());
    } else if (this.data.action === Actions.REALLOCATE) {
      this.store.dispatch(AllocationOperationsActions.resetReallocationUniversities());
    } else if (this.data.action === Actions.MOVE_FUNDS) {
      this.store.dispatch(AllocationOperationsActions.resetMoveFundsDepartments());
    }
  }

  onCancel(): void {
    this.store.dispatch(AllocationOperationsActions.setFundAllocationStep({ newAllocationStep: 0 }));

    if (this.data.action === Actions.ADD) {
      this.store.dispatch(AllocationOperationsActions.setSplitOrAdd({ setSplitOrAdd: false }));
    }

    if (this.data.action === Actions.ADD || this.data.action === Actions.ALLOCATE) {
      this.store.dispatch(AllocationOperationsActions.resetUniversitiesWithCapped());
    } else if (this.data.action === Actions.REALLOCATE) {
      this.store.dispatch(AllocationOperationsActions.resetReallocationUniversities());
    } else if (this.data.action === Actions.MOVE_FUNDS) {
      this.store.dispatch(AllocationOperationsActions.resetMoveFundsDepartments());
    }
  }

  backToAllocationFunds(): void {
    if (this.data.action === Actions.MOVE_FUNDS) {
      this.router.navigate(['/admin/fundAllocations']);
      this.store.dispatch(AllocationsPageActions.setViewIndividualUniversity({ viewIndividualUniversity: false, universityName: "" }));
    }
    this.dialogRef.close();
    this.universityFundsService.updateView({individualUniversityView:false, universityName: ""});
    this.store.dispatch(AllocationOperationsActions.setFundAllocationStep({ newAllocationStep: 0 }));
    this.store.dispatch(AllocationOperationsActions.setSplitOrAdd({ setSplitOrAdd: false }));
    this.store.dispatch(AllocationsPageActions.resetAllocations());
    this.store.dispatch(AllocationsPageActions.loadYears())
    this.store.dispatch(AllocationsPageActions.loadAllocations({ year: this.data.yearOfStudy }))
  }

  filterUniversityAmounts(universityName: string): number {
    let currentAllocation = 0;
    if (this.data.action !== Actions.MOVE_FUNDS) {
      this.fundData.activeUniversitiesFundAllocationsData.forEach((activeUniversity: UniversityAllocationsModel) => {
        if (universityName.includes(activeUniversity.universityName)) {
          currentAllocation = parseFloat(activeUniversity.universityTotalAllocated.toFixed(2));
        }
      });
    }
    return currentAllocation;
  }

  filterDepartmentAmounts(departmentName: string): number {
    let currentAllocation = 0;
    if (this.data.activeUniversitiesDepartmentsFundAllocationsData) {
      this.data.activeUniversitiesDepartmentsFundAllocationsData.forEach(
        (department: any) => departmentName.includes(department.departmentName) ? currentAllocation = parseFloat(department.departmentTotalAllocationAmount.toFixed(2)) : null
      )
    }
    return currentAllocation
  }

  setInput(event: any, entity: string): void {
    if(event.checked && entity.toLocaleLowerCase() === "departments") {
      this.moveFundsForm.get("moveFundsInput")?.setValue(
        this.filterDepartmentAmounts(this.moveFundsForm.get('fromDepartment')?.value)
      )
      this.moveFundsForm.get("moveFundsInput")?.disable();
    } else {
      this.moveFundsForm.get("moveFundsInput")?.setValue("");
      this.moveFundsForm.get("moveFundsInput")?.enable();
    }

    if(event.checked && entity.toLocaleLowerCase() === "universities") {
      this.reallocateFundsForm.get("reallocateFundsInput")?.setValue(
        this.filterUniversityAmounts(this.reallocateFundsForm.get('fromUniversity')?.value)
      )
      this.reallocateFundsForm.get("reallocateFundsInput")?.disable();
    } else {
      this.reallocateFundsForm.get("reallocateFundsInput")?.setValue("");
      this.reallocateFundsForm.get("reallocateFundsInput")?.enable();
    }
  }

  sendAllocation(dataToPost: EntityModel): void {
    this.totalAllocatedService
        .insertIntoAllocations(JSON.stringify(dataToPost))
        .subscribe((response) => {
          if (response.results) {
            this.allocationsPostResults = response.results;
            this.successfulAllocationsUpdate = this.allocationsPostResults.message;
          } else if(response.errors) {
            this.postResultsError = response.errors;
            this.snackbar.open(SnackBarMessage.ALLOCATION_FAILED, "Dismiss", {duration: SnackBarDuration.DURATION});
            reloadComponent(true,this.router);
          }
        });
  }

  addToTotalFund(totalFundDetails: {amount: number, year: number}): void {
    this.totalAllocatedService.totalFundInsert(totalFundDetails)
    .subscribe(response => {
      if(response.results) {
        this.successfulAllocationsUpdate = response.results.message;
        this.store.dispatch(AllocationOperationsActions.setFundAllocationStep({ newAllocationStep: FundAllocationSteps.SUCCESS }));
      } else if(response.errors) {
        this.postResultsError = response.errors;
        this.snackbar.open(SnackBarMessage.ALLOCATION_FAILED, "Dismiss", {duration: SnackBarDuration.DURATION});
        reloadComponent(true,this.router);
      }
    })
  }
}
