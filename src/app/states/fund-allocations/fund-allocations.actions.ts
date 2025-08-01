import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { FundAllocationsModel } from "../../admin/data-access/models/fundAllocations-model";
import { UniversityAllocationsModel } from "../../admin/data-access/models/universityAllocations-model";
import { EntityModel } from "../../admin/data-access/models/invalid-entity-model";

export const AllocationsPageActions = createActionGroup({
  source: 'Allocations Page',
  events: {
    'Load Allocations': props<{year: number}>(),
    'Set viewIndividual University': props<{ viewIndividualUniversity: boolean; universityName: string}>(),
    'Set university': props<{ university: UniversityAllocationsModel }>(),
    'Load Years': emptyProps(),
    'Reset Allocations': emptyProps(),
  }
});


export const AllocationsAPIActions = createActionGroup({
  source: 'Allocations API',
  events: {
    'Allocations Loaded Success': props<{ year: number; allocations: FundAllocationsModel }>(),
    'Allocations Loaded Fail': props<{ error: string }>(),
    'Years Loaded Success': props<{ years: number[] }>(),
  }
})

export const AllocationOperationsActions = createActionGroup({
  source: 'Allocations Dialog',
  events: {
    'Decrease Fund Allocation Step': emptyProps(),
    'Increase Fund Allocation Step': emptyProps(),
    'Set Fund Allocation Step': props<{ newAllocationStep: number }>(),
    'Set splitOrAdd': props<{ setSplitOrAdd: boolean }>(),
    'Reset Reallocation Universities': emptyProps(),
    'Add Reallocation University': props<{ university: EntityModel }>(),
    'Reset UniversitiesWithCapped': emptyProps(),
    'Add Capped University': props<{ university: EntityModel }>(),
    'Reset Move Funds Departments': emptyProps(),
    'Add Department': props<{ department: EntityModel }>()
  }
})
