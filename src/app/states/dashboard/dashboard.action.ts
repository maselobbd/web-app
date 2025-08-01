import { createAction, props } from '@ngrx/store';

export const updateFilter = createAction('[Dashboard] Update Filter');
export const dashboardData = createAction('[Dashboard] Get Dashboard Data', props<{ viewType?: string, date?: number }>());
export const dashboardCardData = createAction('[Dashboard] Get Dashboard Card Data');
export const dashboardDataSuccess = createAction('[Dashboard] Get Dashboard Data Success', props<{ payload: any }>());
export const dashboardCardDataSuccess = createAction('[Dashboard] Get Dashboard Card Data Success', props<{ payload: any }>());
export const dashboardDataFailure = createAction('[Dashboard] Get Dashboard Data Failure', props<{ error: any }>());
export const dashboardCardDataFailure = createAction('[Dashboard] Get Dashboard Card Data Failure', props<{ error: any }>());
export const updateDashboardState = createAction(
  '[Component] Update State',
  props<{ dashboardDataSuccess: any; dashboardCardDataSuccess: any }>()
);
export const setViewType = createAction('[Dashboard] Set View Type', props<{ viewType: string }>());

// Define the type for each action
export type DashboardAction =
  | ReturnType<typeof updateFilter>
  | ReturnType<typeof dashboardData>
  | ReturnType<typeof dashboardCardData>
  | ReturnType<typeof dashboardDataFailure>
  | ReturnType<typeof dashboardCardDataFailure>;
