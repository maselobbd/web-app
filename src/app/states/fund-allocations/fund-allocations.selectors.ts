import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AllocationsState } from "./fund-allocations.reducer";
import { UniversityAllocationsModel } from "../../admin/data-access/models/universityAllocations-model";

export const selectAllocationsState = createFeatureSelector<AllocationsState>('fundAllocations');

export const selectAllocationsLoading = createSelector(
  selectAllocationsState,
  (allocationsState) => allocationsState.loading
)

export const selectAllocations = (year: number) => createSelector(
  selectAllocationsState,
  (allocationsState) => allocationsState.allocationsByYear[year]
)

export const selectCurrentYear = createSelector(
  selectAllocationsState,
  (state) => state.currentYear
)

export const selectActiveUniversities = (year: number) => createSelector(
  selectAllocationsState,
  (allocationsState) => allocationsState.allocationsByYear[year]?.activeUniversitiesFundAllocationsData
)

export const selectActiveUniversitiesNames = (year: number) => createSelector(
  selectAllocationsState,
  (allocationsState) => allocationsState.allocationsByYear[year]?.activeUniversitiesFundAllocationsData.map((university: UniversityAllocationsModel) => university.universityName)
)

export const selectActiveDepartments = (year: number) => createSelector(
  selectAllocationsState,
  (allocationsState) => allocationsState.allocationsByYear[year]?.activeUniversitiesDepartmentsFundAllocationsData
)

export const selectFundAmounts = (year: number) => createSelector(
  selectAllocationsState,
  (allocationsState) => allocationsState.allocationsByYear[year]?.fundAmounts
)

export const selectValidators = (year: number) => createSelector(
  selectAllocationsState,
  (allocationsState) => allocationsState.allocationsByYear[year]?.fundAllocationValidators
)

export const selectViewIndividualUniversity = createSelector(
  selectAllocationsState,
  (allocationsState) => allocationsState.individualUniversityView.viewIndividualUniversity
)

export const selectUniversityName = createSelector(
  selectAllocationsState,
  (allocationsState) => allocationsState.individualUniversityView.universityName
)
export const selectUniversityToView = createSelector(
  selectAllocationsState,
  (allocationsState) => allocationsState.university
)
export const selectYears = createSelector(
  selectAllocationsState,
  (allocationsState) => allocationsState.years
)

export const selectFundAllocationStep = createSelector(
  selectAllocationsState,
  (allocationsState) => allocationsState.fundAllocationStep
)

export const selectSplitOrAdd = createSelector(
  selectAllocationsState,
  (allocationsState) => allocationsState.splitOrAdd
)

export const selectReallocationUniversities = createSelector(
  selectAllocationsState,
  (allocationsState) => allocationsState.reallocationUniversities
)

export const selectUniversitiesWithCapped = createSelector(
  selectAllocationsState,
  (allocationsState) => allocationsState.universitiesWithCapped
)

export const selectMoveFundsDepartments = createSelector(
  selectAllocationsState,
  (allocationsState) => allocationsState.moveFundsDepartments
)
