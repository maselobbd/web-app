import { AddAllocationDialogComponent } from "../../../../admin/ui/add-allocation-dialog/add-allocation-dialog.component";
import { FundAllocationSteps, Actions } from "../../../../admin/enums/fundAllocations";
import { Store } from "@ngrx/store";
import { selectFundAllocationStep, selectSplitOrAdd } from "../../../../states/fund-allocations/fund-allocations.selectors";
import { take, combineLatestWith } from "rxjs";
import { AllocationOperationsActions } from "../../../../states/fund-allocations/fund-allocations.actions";

export function fundNext(action: string, context: AddAllocationDialogComponent, store: Store): void {
  store.select(selectFundAllocationStep).pipe(combineLatestWith(
    store.select(selectSplitOrAdd), context.reallocationUniversities$, context.universitiesWithCapped$, context.moveFundsDepartments$),
    take(1)).subscribe(([fundAllocationStep, splitOrAdd, reallocationUniversities, universitiesWithCapped, moveFundsDepartments]) => {
    if (splitOrAdd && fundAllocationStep === FundAllocationSteps.ALLOCATION_STEP_2) {
      store.dispatch(AllocationOperationsActions.setSplitOrAdd({ setSplitOrAdd: false }));
    }
    fundAllocationStep > FundAllocationSteps.ALLOCATION_STEP_1 ? store.dispatch(AllocationOperationsActions.resetUniversitiesWithCapped()) : null;

    switch (action) {
      case Actions.ADD:
        handleAddFunds(context, fundAllocationStep);
        break;
      case Actions.REALLOCATE:
        handleReallocateFunds(context, fundAllocationStep);
        store.dispatch(AllocationOperationsActions.resetReallocationUniversities())
        break;
      case Actions.MOVE_FUNDS:
        handleMoveFunds(context);
        store.dispatch(AllocationOperationsActions.resetMoveFundsDepartments());
        break;
      case Actions.ALLOCATE:
        handleAllocateFunds(context, fundAllocationStep, store);
        break;
    }

    if (
      (reallocationUniversities.length > 0 && fundAllocationStep > FundAllocationSteps.ALLOCATION_STEP_1) ||
      ((universitiesWithCapped.length > 0 && fundAllocationStep > FundAllocationSteps.ALLOCATION_STEP_1) ||
        (universitiesWithCapped.length > 0 && context.data.action.includes(Actions.ALLOCATE))) ||
      (moveFundsDepartments.length > 0 && fundAllocationStep > FundAllocationSteps.ALLOCATION_STEP_1) ||
      (context.unallocatedLess && universitiesWithCapped.length === 0)
    ) {
      store.dispatch(AllocationOperationsActions.decreaseFundAllocationStep());
    }
    store.dispatch(AllocationOperationsActions.increaseFundAllocationStep());
  });
}

function handleAddFunds(context: AddAllocationDialogComponent, fundAllocationStep: number): void {
  context.universitiesToSplitMoney = context.getUniversitiesToSplitMoney(context.fundAllocationForm.get("universityCheckboxes")?.value);

  context.allocationMoney =
    context.fundAllocationForm.get('allocationInput')?.value /
    context.universitiesToSplitMoney.length;
  context.universitiesCapped(context.universitiesToSplitMoney, context.allocationMoney, fundAllocationStep);
}

function handleReallocateFunds(context: AddAllocationDialogComponent, fundAllocationStep: number): void {
  const amount = context.reallocateFundsForm.get("reallocateFundsInput")?.value;
  if (amount && fundAllocationStep) {
    context.universitiesToSplitMoney = [
      context.reallocateFundsForm.get("fromUniversity")?.value,
      context.reallocateFundsForm.get("toUniversity")?.value
    ];
    context.allocationMoney = amount;
    context.universitiesWithLess(context.universitiesToSplitMoney, amount);
  }
}

function handleMoveFunds(context: AddAllocationDialogComponent): void {
  const amount = context.moveFundsForm.get("moveFundsInput")?.value;
  if (amount) {
    const departments = [
      context.moveFundsForm.get("fromDepartment")?.value,
      context.moveFundsForm.get("toDepartment")?.value
    ];
    context.departmentsWithLess(departments, amount);
  }
}

function handleAllocateFunds(context: AddAllocationDialogComponent, fundAllocationStep: number, store: Store): void {
  if (context.allocateFundsForm.get('allocateFundsInput')?.valid) {
    context.unallocatedLess = context.allocateFundsForm.get('allocateFundsInput')?.value > context.fundData.unallocatedAmount
    context.filterUniversityAmounts(context.allocateFundsForm.get('university')?.value) + context.allocateFundsForm.get('allocateFundsInput')?.value > context.universityMaxAllocationCap.MAX_ALLOCATION ?
      store.dispatch(AllocationOperationsActions.addCappedUniversity({ university: context.allocateFundsForm.get('university')?.value })) : null
  }

  if (fundAllocationStep > FundAllocationSteps.ALLOCATION_STEP_1 && context.allocateFundsForm.get("allocateFundsInput")?.valid) {
    context.unallocatedLess = context.allocateFundsForm.get("allocateFundsInput")?.value > context.fundData.unallocatedAmount;
  }
}
