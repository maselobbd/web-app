import {AppState} from '../app.state'
import { createSelector } from '@ngrx/store';

export const selectDashboardState= (state: AppState) => state.dashboard;

export const selectDashboardData = createSelector(
    selectDashboardState,
    (state) => state.dashboardDataSuccess
);
export const selectDashboardCardData = createSelector(
    selectDashboardState,
    (state) => state.dashboardCardDataSuccess
);

export const selectViewType = createSelector(
    selectDashboardState,
    (state) => state.viewType
);

export const selectDashboardError = createSelector(
    selectDashboardState,
    (state) => state.error
);
