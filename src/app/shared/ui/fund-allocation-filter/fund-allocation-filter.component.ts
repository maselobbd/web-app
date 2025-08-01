import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { FundAllocationsMessages } from '../../../admin/enums/fundAllocationsMessages';
import { currentFiscalYear } from '../../../shared/utils/functions/dateUtils';
import { AdminService } from '../../../admin/data-access/services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UniversityFundsService } from '../../../admin/data-access/services/university-funds.service';
import { reloadComponent } from '../../utils/functions/reloadComponent';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AllocationsPageActions } from '../../../states/fund-allocations/fund-allocations.actions';
import { Observable } from 'rxjs';
import { selectViewIndividualUniversity, selectYears } from '../../../states/fund-allocations/fund-allocations.selectors';

@Component({
  selector: 'app-fund-allocation-filter',
  templateUrl: './fund-allocation-filter.component.html',
  styleUrls: ['./fund-allocation-filter.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class FundAllocationFilterComponent implements OnInit {
  yearsOfFunding: number[] = [];
  @Output() selectionChange = new EventEmitter<MatSelectChange>();
  @Output() filterEmission = new EventEmitter<{yearsOfFunding: number[], viewIndividualUniversity: boolean}>();
  @Input() title!: string;
  yearOfStudyForm!: FormGroup;
  currentYear: number;
  fundAllocationsMessages: any = FundAllocationsMessages;
  selected!: number;
  viewIndividualUniversity$: Observable<boolean> = this.store.select(selectViewIndividualUniversity);
  universityName!: string;
  years$: Observable<number[]> = this.store.select(selectYears);

  constructor(
    private controlContainer: ControlContainer,
    private snackbar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
  )
  {
    this.currentYear = currentFiscalYear();
  }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.universityName = param["universityName"];
    });
    this.yearOfStudyForm = <FormGroup>(
      this.controlContainer.control
    );
    this.getYearsOfFunding();
  }

  onSelectionChange(event: MatSelectChange) {
    this.selectionChange.emit(event);
  }

  getYearsOfFunding(): void {
      this.years$.subscribe((data) => {
        if (data) {
          this.yearsOfFunding = data;
          this.yearsOfFunding = [...this.yearsOfFunding, this.yearsOfFunding[this.yearsOfFunding.length - 1] + 1];
          this.yearsOfFunding.sort((a, b) => (b < a ? 1 : -1));
        } else if (!data) {
          this.snackbar.open(
            this.fundAllocationsMessages.GENERIC_ERROR,
            'Dismiss',
            { duration: 3000 },
          );
          reloadComponent(true,this.router);
        }
      });
    }
}
