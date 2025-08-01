import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FundAllocationsMessages } from '../../enums/fundAllocationsMessages';
import { currentFiscalYear } from '../../../shared/utils/functions/dateUtils';
import {Roles} from "../../../authentication/data-access/models/auth.model";
import { ButtonAction } from "../../../shared/enums/buttonAction";
import { FundAllocationIndividualUniversityComponent } from "../../../shared/ui/fund-allocation-individual-university/fund-allocation-individual-university.component";
import { Router } from '@angular/router';
import { DataService } from '../../../shared/data-access/services/data.service';
import { Store } from '@ngrx/store';
import { AllocationsPageActions } from '../../../states/fund-allocations/fund-allocations.actions';
import { selectActiveDepartments, selectActiveUniversities, selectActiveUniversitiesNames, selectAllocations, selectAllocationsLoading, selectCurrentYear, selectFundAmounts, selectUniversityToView, selectValidators, selectViewIndividualUniversity, selectYears } from '../../../states/fund-allocations/fund-allocations.selectors';
import { take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UniversityAllocationsModel } from '../../data-access/models/universityAllocations-model';

@Component({
  selector: 'app-fund-allocation',
  templateUrl: './fund-allocation.component.html',
  styleUrls: ['./fund-allocation.component.scss', '../../../shared/utils/styling/footer.scss'],
})
export class FundAllocationComponent implements OnInit, AfterViewInit {
  viewIndividualUniversity: boolean;
  totalAmountAllocated: number;
  yearsOfFunding!: number[];
  filterYear!: number;
  currentYear: number = currentFiscalYear();
  yearOfStudyForm!: FormGroup;
  individualUniversityView$ = this.store.select(selectViewIndividualUniversity);
  fundAllocationsMessages: any = FundAllocationsMessages;
  allocatedAmount: number;
  unallocatedAmount: number;
  buttonAction: typeof ButtonAction = ButtonAction;
  title = 'Fund allocation';
  @ViewChild('individualUniversityComponent')
  individualUniversityComponent!: FundAllocationIndividualUniversityComponent;
  loading$ = this.store.select(selectAllocationsLoading);
  fundAmount$ = this.store.select(selectFundAmounts(this.currentYear));
  fundAllocationsValidators$ = this.store.select(selectValidators(this.currentYear));
  activeUniversities$ = this.store.select(selectActiveUniversitiesNames(this.currentYear)) ;
  fundAllocationsModel$ = this.store.select(selectAllocations(this.currentYear));
  activeUniversitiesDepartmentsFundAllocationsData$ = this.store.select(selectActiveDepartments(this.currentYear));
  activeUniversitiesFundAllocationsData$ = this.store.select(selectActiveUniversities(this.currentYear));
  selectedYear$ = this.store.select(selectCurrentYear);
  universityToViewIndividually$: Observable<UniversityAllocationsModel> = this.store.select(selectUniversityToView);

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {
    this.totalAmountAllocated = 0;
    this.viewIndividualUniversity = false;
    this.allocatedAmount = 0;
    this.unallocatedAmount = 0;
    this.updateObservables(this.currentYear);
  }

  openDialogFromChild(): void {
    this.individualUniversityComponent.openDialog('move funds');
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const urlUniversityName = params['university-name'];
      if(urlUniversityName) {
        this.store.dispatch(AllocationsPageActions.setViewIndividualUniversity( { viewIndividualUniversity: true, universityName: urlUniversityName }));
      }
      this.activeUniversitiesDepartmentsFundAllocationsData$.subscribe(data => {
        if(data && urlUniversityName) {
          this.dataService.sendUniversityDepartments(data.filter(department => department.universityName === urlUniversityName));
        }
      });
      this.activeUniversitiesFundAllocationsData$.subscribe(data => {
        if(data && urlUniversityName) {
          const universityToViewIndividually = data.filter(university => university.universityName === urlUniversityName);
          this.dataService.sendUniversityInfo(universityToViewIndividually);
          this.store.dispatch(AllocationsPageActions.setUniversity({university: universityToViewIndividually[0]}))
        }
      });})
    this.loadAllocations(this.currentYear);
    this.loadYears();
    this.yearOfStudyForm = this.formBuilder.group({
      yearOfStudy: [this.currentYear, Validators.required]
    });
    this.filterYear = this.yearOfStudyForm.get('yearOfStudy')?.value;
  }

  ngAfterViewInit(): void {
    this.yearOfStudyForm.get('yearOfStudy')?.valueChanges.subscribe(value => {
      this.updateObservables(value);
    })
  }

  loadAllocations(year: number) {
    this.store.select(selectAllocations(year)).pipe(take(1)).subscribe(data => {
      if(!data) {
        this.store.dispatch(AllocationsPageActions.loadAllocations({ year }));
      }
    })
  }

  updateObservables(year: number) {
    const currentYear: number = year ? year : currentFiscalYear();
    this.loadAllocations(currentYear);
    this.fundAmount$ = this.store.select(selectFundAmounts(currentYear));
    this.fundAllocationsValidators$ = this.store.select(selectValidators(currentYear));
    this.activeUniversities$ = this.store.select(selectActiveUniversitiesNames(currentYear)) ;
    this.fundAllocationsModel$ = this.store.select(selectAllocations(currentYear));
    this.activeUniversitiesDepartmentsFundAllocationsData$ = this.store.select(selectActiveDepartments(currentYear));
    this.activeUniversitiesFundAllocationsData$ = this.store.select(selectActiveUniversities(currentYear));
    this.filterYear = year;
  }

  loadYears() {
    this.store.select(selectYears).pipe(take(1)).subscribe(data => {
      if(data.length === 0) {
        this.store.dispatch(AllocationsPageActions.loadYears());
      }
    });
  }
  protected readonly Roles = Roles;
}
