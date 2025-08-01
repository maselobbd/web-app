import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  mergeMap,
  map,
  catchError,
  withLatestFrom,
  tap,
  debounceTime,
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {
  dashboardData,
  dashboardCardData,
  dashboardDataSuccess,
  dashboardCardDataSuccess,
  dashboardDataFailure,
  dashboardCardDataFailure,
} from './dashboard.action';
import { DetailsService } from '../../admin/data-access/services/details.service';
import { UserStore } from '../../shared/data-access/stores/user.store';
import { AllocationUsageService } from '../../shared/data-access/services/allocation-usage.service';
import { DataService } from '../../shared/data-access/services/data.service';
import { Store } from '@ngrx/store';
import { Roles } from '../../authentication/data-access/models/auth.model';
import { currentFiscalYear } from '../../shared/utils/functions/dateUtils';
import { selectViewType } from './dashboard.selector';
import { AppState } from '../app.state';

@Injectable()
export class DashboardEffects {
  private readonly administrativeRoles = [Roles.admin, Roles.finance];

  constructor(
    private actions$: Actions,
    private shareDataService: DataService,
    private dataService: DetailsService,
    private userStore: UserStore,
    private allocationService: AllocationUsageService,
    private store: Store<AppState>,
  ) {}

  loadDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardData),
      debounceTime(10),
      withLatestFrom(
        this.store.select(selectViewType),
        this.userStore.get(),
        this.shareDataService.date$,
        this.shareDataService.getUniversity$,
      ),
      mergeMap(
        ([action, currentViewType, user, currentDate, universityData]) => {
          const viewType = action.viewType || currentViewType;
          const role = Roles[user.role as keyof typeof Roles];
          const university = universityData?.university || '';
          const year = action.date || currentDate || currentFiscalYear();
          if (this.administrativeRoles.includes(role)) {
            return this.dataService
              .getUniversityCardData(year, false, university, '', viewType)
              .pipe(
                map((data) => dashboardDataSuccess({ payload: data.results })),
                catchError((error) => of(dashboardDataFailure({ error }))),
              );
          }
          return this.dataService
            .getDashboardData(year, university, user?.department || '')
            .pipe(
              map((data) => dashboardDataSuccess({ payload: data.results })),
              catchError((error) => of(dashboardDataFailure({ error }))),
            );
        },
      ),
    ),
  );

  loadDashboardCardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardCardData),
      withLatestFrom(
        this.store.select(selectViewType),
        this.userStore.get(),
        this.shareDataService.getUniversity$,
        this.shareDataService.date$,
      ),
      mergeMap(([_, currentViewType, user, universityData, currentYear]) => {
        const role = Roles[user.role as keyof typeof Roles];
        const university = universityData?.university || user.university;
        const year = currentYear || currentFiscalYear();
        const department = user?.department || '';
        const faculty = user?.faculty || '';

        if (
          this.administrativeRoles.includes(role) &&
          currentViewType === 'all'
        ) {
          return this.allocationService
            .getAllAllocationsForUniversity(university, year)
            .pipe(
              map((data) =>
                dashboardCardDataSuccess({ payload: data.results }),
              ),
              catchError((error) => of(dashboardCardDataFailure({ error }))),
            );
        }

        return this.allocationService
          .getAllocationsForDepartment(
            university,
            department,
            faculty,
            year.toString(),
          )
          .pipe(
            map((data) => dashboardCardDataSuccess({ payload: data.results })),
            catchError((error) => of(dashboardCardDataFailure({ error }))),
          );
      }),
    ),
  );

  handleError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(dashboardDataFailure, dashboardCardDataFailure),
        tap(({ error }) => {
        }),
      ),
    { dispatch: false },
  );
}
