import { createReducer, on } from "@ngrx/store";
import { AllocationsPageActions, AllocationsAPIActions, AllocationOperationsActions } from "./fund-allocations.actions";
import { FundAllocationsModel } from "../../admin/data-access/models/fundAllocations-model";
import { currentFiscalYear } from "../../shared/utils/functions/dateUtils";
import { UniversityAllocationsModel } from "../../admin/data-access/models/universityAllocations-model";
import { EntityModel } from "../../admin/data-access/models/invalid-entity-model";

export interface AllocationsState {
  loading: boolean,
  allocationsByYear: {[year: number] : FundAllocationsModel},
  currentYear: number,
  individualUniversityView: { viewIndividualUniversity: boolean; universityName: string },
  university: UniversityAllocationsModel,
  years: number[],
  error: string,
  fundAllocationStep: number,
  splitOrAdd: boolean,
  reallocationUniversities: EntityModel[]
  universitiesWithCapped: EntityModel[],
  moveFundsDepartments: EntityModel[]
}

const initialState: AllocationsState = {
  loading: true,
  allocationsByYear: {},
  individualUniversityView: { viewIndividualUniversity: false, universityName: "" },
  currentYear: currentFiscalYear(),
  university: {
        universityName: "",
        universityTotalRequested: 0,
        universityTotalApproved: 0,
        universityTotalAllocated: 0
      },
  years: [],
  error: "",
  fundAllocationStep: 0,
  splitOrAdd: false,
  reallocationUniversities: [],
  universitiesWithCapped: [],
  moveFundsDepartments: []
}

export const allocationsReducer = createReducer(
  initialState,
  on(AllocationsPageActions.loadAllocations,
    (state) => ({
      ...state,
      loading: true
  })),
  on(AllocationsAPIActions.allocationsLoadedSuccess,
    (state, {year, allocations}) => ({
      ...state,
      loading: false,
      allocationsByYear: {
        ...state.allocationsByYear,
        [year] : allocations
      },
      currentYear: year
  })),
  on(AllocationsAPIActions.allocationsLoadedFail, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AllocationsPageActions.setViewIndividualUniversity, (state, { viewIndividualUniversity, universityName }) => ({
    ...state,
    loading: false,
    individualUniversityView: {
      viewIndividualUniversity: viewIndividualUniversity,
      universityName: universityName
    }
  })),
  on(AllocationsPageActions.setUniversity, (state, { university }) => ({
    ...state,
    loading: false,
    university: university
  })),
  on(AllocationsPageActions.loadYears, (state) => ({
    ...state,
    loading: true,
  })),
  on(AllocationsAPIActions.yearsLoadedSuccess, (state, { years }) => ({
    ...state,
    loading: false,
    years
  })),

  on(AllocationsAPIActions.allocationsLoadedFail, (state, { error }) => ({
    ...state,
      loading: false,
      error
  })),

  on(AllocationOperationsActions.decreaseFundAllocationStep,
    (state) => ({
      ...state,
      fundAllocationStep: state.fundAllocationStep - 1
  })),

  on(AllocationOperationsActions.increaseFundAllocationStep,
    (state) => ({
      ...state,
      fundAllocationStep: state.fundAllocationStep + 1
  })),

  on(AllocationOperationsActions.setFundAllocationStep,
    (state, {newAllocationStep}) => ({
      ...state,
      fundAllocationStep: newAllocationStep
  })),

  on(AllocationOperationsActions.setSplitOrAdd,
    (state, {setSplitOrAdd}) => ({
      ...state,
      splitOrAdd: setSplitOrAdd
  })),

  on(AllocationOperationsActions.resetReallocationUniversities,
    (state) => ({
      ...state,
      reallocationUniversities: []
  })),

  on(AllocationOperationsActions.addReallocationUniversity,
    (state, {university}) => ({
      ...state,
      reallocationUniversities: [...state.reallocationUniversities, university]
  })),

  on(AllocationOperationsActions.resetUniversitiesWithCapped,
    (state) => ({
      ...state,
      universitiesWithCapped: []
  })),

  on(AllocationOperationsActions.addCappedUniversity,
    (state, {university}) => ({
      ...state,
      universitiesWithCapped: [...state.universitiesWithCapped, university]
  })),

  on(AllocationOperationsActions.resetMoveFundsDepartments,
    (state) => ({
      ...state,
      moveFundsDepartments: []
  })),

  on(AllocationOperationsActions.addDepartment,
    (state, {department}) => ({
      ...state,
      moveFundsDepartments: [...state.moveFundsDepartments, department]
  })),

  on(AllocationsPageActions.resetAllocations,
    () => initialState
  )
)
