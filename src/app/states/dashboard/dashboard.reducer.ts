import { createReducer, on } from "@ngrx/store";
import { dashboardCardDataSuccess, dashboardDataSuccess, setViewType, updateFilter, dashboardDataFailure, dashboardCardDataFailure } from "./dashboard.action";
import { dashboardDataModel } from "../../shared/data-access/models/dashboard.model";
import { AllocationModel } from "../../shared/data-access/models/allocation.models";
import { DashboardDataType, UniversityData } from "../../admin/data-access/models/university-card-info.model";

const initialDashboardState: dashboardDataModel = { details: null };

const initialDashboardCardDataState: AllocationModel | null = null;

export interface DashboardState {
  dashboardDataSuccess: DashboardDataType;
  dashboardCardDataSuccess: AllocationModel | null;
  viewType: string;
  error: any | null;
}

export const initialState: DashboardState = {
  dashboardDataSuccess: { kind: "dashboardDataModel", data: initialDashboardState },
  dashboardCardDataSuccess: initialDashboardCardDataState,
  viewType: '',
  error: null,
};

export const dashboardReducer = createReducer(
  initialState,
  on(updateFilter, (state, action) => {
    return state;
  }),
  on(dashboardDataSuccess, (state, { payload }) => {
    const dashboardData: DashboardDataType =
      Array.isArray(payload)
        ? { kind: "universityData", data: payload }
        : { kind: "dashboardDataModel", data: payload };
    return { ...state, dashboardDataSuccess: dashboardData, error: null };
  }),
  on(dashboardCardDataSuccess, (state, { payload }) => {
    return { ...state, dashboardCardDataSuccess: payload, error: null };
  }),
  on(setViewType, (state, { viewType }) => {
    return { ...state, viewType: viewType }
  }),
  on(dashboardDataFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(dashboardCardDataFailure, (state, { error }) => ({
    ...state,
    error
  }))
);