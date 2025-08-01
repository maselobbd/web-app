import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, of } from "rxjs";
import { FundAllocationDataService } from "../../admin/data-access/services/fund-allocation-data.service";
import { AllocationsAPIActions, AllocationsPageActions } from "./fund-allocations.actions";
import { FundAllocationsModel } from "../../admin/data-access/models/fundAllocations-model";
import { AdminService } from "../../admin/data-access/services/admin.service";
import { currentFiscalYear } from "../../shared/utils/functions/dateUtils";

@Injectable()
export class FundAllocationsEffects {

  fiscalYear: number = currentFiscalYear();
  constructor(
    private actions$: Actions,
    private fundAllocationDataService: FundAllocationDataService,
    private adminService: AdminService
  ) {}

  loadAllocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AllocationsPageActions.loadAllocations),
      exhaustMap(({year}) =>
          this.fundAllocationDataService
      .getActiveUniversitiesFundAllocations(year)
      .pipe(map((data) =>
              AllocationsAPIActions.allocationsLoadedSuccess({year: year, allocations: data.results as FundAllocationsModel}),
          ),
          catchError((error) => of(AllocationsAPIActions.allocationsLoadedFail({ error: error.message })))
      ))
    )
  )

  loadYears$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AllocationsPageActions.loadYears),
      exhaustMap(() =>
          this.adminService
      .getYearsOfFunding()
      .pipe(map((data) =>
              AllocationsAPIActions.yearsLoadedSuccess({ years: data.results || [ this.fiscalYear, this.fiscalYear + 1]}),
          ),
          catchError((error) => of(AllocationsAPIActions.allocationsLoadedFail({ error: error.message })))
      ))
    )
  )
}
