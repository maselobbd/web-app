import { AddAllocationDialogComponent } from "../../../../admin/ui/add-allocation-dialog/add-allocation-dialog.component";
import { FundAllocationSteps, Actions } from "../../../../admin/enums/fundAllocations";
import { ReallocationsModel } from "../../../../admin/data-access/models/reallocations.model";
import { reloadComponent } from "../reloadComponent";
import { Store } from "@ngrx/store";
import { selectFundAllocationStep, selectSplitOrAdd } from "../../../../states/fund-allocations/fund-allocations.selectors";
import { AllocationOperationsActions } from "../../../../states/fund-allocations/fund-allocations.actions";
import { combineLatestWith, take } from "rxjs";

export function fundConfirm(action: string, context: AddAllocationDialogComponent, store: Store): void {
  store.select(selectFundAllocationStep).pipe(combineLatestWith(store.select(selectSplitOrAdd)),
    take(1)).subscribe(([fundAllocationStep, splitOrAdd]) => {
    if (action === Actions.MOVE_FUNDS && fundAllocationStep === FundAllocationSteps.CONFIRM_ALLOCATION) {
      handleMoveFunds(context);
    }

    if (action === Actions.ADD || action === Actions.ALLOCATE || action === Actions.REALLOCATE && fundAllocationStep === FundAllocationSteps.CONFIRM_ALLOCATION) {
      handleAllocations(context, action, fundAllocationStep, splitOrAdd, store);
    }

    if ((fundAllocationStep === FundAllocationSteps.CONFIRM_ACTION || fundAllocationStep === FundAllocationSteps.CONFIRM_ALLOCATION) && (action === Actions.REALLOCATE || action === Actions.ADD || action === Actions.MOVE_FUNDS || action === Actions.ALLOCATE)) {
      store.dispatch(AllocationOperationsActions.increaseFundAllocationStep());
    }
  });
}

function handleMoveFunds(context: AddAllocationDialogComponent): void {
  const departmentDataToMoveFunds = [
    {
      universityName: context.moveFundsForm.get("universityName")?.value,
      departmentName: context.moveFundsForm.get("toDepartment")?.value,
      amount: context.moveFundsForm.get("moveFundsInput")?.value,
      year: context.data.yearOfStudy
    },
    {
      universityName: context.moveFundsForm.get("universityName")?.value,
      departmentName: context.moveFundsForm.get("fromDepartment")?.value,
      amount: (0 - context.moveFundsForm.get("moveFundsInput")?.value),
      year: context.data.yearOfStudy
    }
  ];

  for (const department of departmentDataToMoveFunds) {
    if (department) {
      context.totalAllocatedService.moveFunds(JSON.stringify(department)).subscribe(
        data => {
          if (data.results) {
            context.allocationsPostResults = data.results;
            context.successfulAllocationsUpdate = context.allocationsPostResults.message
          } else if (data.errors) {
            context.postResultsError = data.errors;
            context.successfulAllocationsUpdate = context.allocationsPostResults.message
            context.snackbar.open("Moving funds failed, please try again.", "Dismiss", {duration: 3000});
            reloadComponent(true, context.router);
          }
        }
      )
    }
  }

  if (context.allocationsPostResults) {
    const reallocation: ReallocationsModel = {
      university: context.moveFundsForm.get("universityName")?.value,
      entities: "departments",
      to: context.moveFundsForm.get("toDepartment")?.value,
      from: context.moveFundsForm.get("fromDepartment")?.value,
      fromNewAllocation: parseFloat(context.filterDepartmentAmounts(
        context.moveFundsForm.get("fromDepartment")?.value).toFixed(2)) - context.moveFundsForm.get("moveFundsInput")?.value,
      fromOldAllocation: context.filterDepartmentAmounts(context.moveFundsForm.get("fromDepartment")?.value),
      toNewAllocation: context.filterDepartmentAmounts(
        context.moveFundsForm.get("toDepartment")?.value) + context.moveFundsForm.get("moveFundsInput")?.value,
      toOldAllocation: context.filterDepartmentAmounts(
        context.moveFundsForm.get("toDepartment")?.value),
      moneyReallocated: context.moveFundsForm.get("moveFundsInput")?.value
    }
    context.totalAllocatedService.reallocationsInsert(reallocation).subscribe(
      data => {
        if (data.results) {
          context.allocationsPostResults = data.results;
        } else if (data.errors) {
          context.snackbar.open("Moving funds failed, please try again.", "Dismiss", {duration: 3000});
          reloadComponent(true, context.router);
        }
      }
    )
  }
}

function handleAllocations(context: AddAllocationDialogComponent, action: string, fundAllocationStep: number, splitOrAdd: boolean, store: Store): void {
  context.postAllocations = true;
  if (action === Actions.ADD && !splitOrAdd && fundAllocationStep === FundAllocationSteps.CONFIRM_ACTION) {
    store.dispatch(AllocationOperationsActions.setSplitOrAdd({ setSplitOrAdd: true }))
  }

  if (action.includes(Actions.ALLOCATE) && context.allocateFundsForm.valid && fundAllocationStep === FundAllocationSteps.CONFIRM_ALLOCATION) {
    context.dataToPost = {
      action: context.data.action,
      amount: context.allocateFundsForm.get("allocateFundsInput")?.value,
      name: context.allocateFundsForm.get("university")?.value,
      year: context.data.yearOfStudy
    };
    context.sendAllocation(context.dataToPost);
  }

  for (const universityName of context.universitiesToSplitMoney) {
    if (action === Actions.ADD) {
      context.dataToPost = {
        action: context.data.action,
        amount: context.allocationMoney,
        name: universityName,
        year: context.data.yearOfStudy
      };
    } else {
      if (universityName === context.reallocateFundsForm.get("fromUniversity")?.value) {
        context.dataToPost = {
          action: context.data.action,
          amount: (0 - context.allocationMoney),
          name: universityName,
          year: context.data.yearOfStudy
        }
      } else if (universityName === context.reallocateFundsForm.get("toUniversity")?.value) {
        context.dataToPost = {
          action: context.data.action,
          amount: context.allocationMoney,
          name: universityName,
          year: context.data.yearOfStudy
        };
      }
    }
    context.sendAllocation(context.dataToPost);
  }

  if (context.allocationsPostResults && action === Actions.REALLOCATE) {
    const reallocation: ReallocationsModel = {
      entities: "universities",
      to: context.reallocateFundsForm.get("toUniversity")?.value,
      from: context.reallocateFundsForm.get("fromUniversity")?.value,
      fromNewAllocation: parseFloat(context.filterUniversityAmounts(
        context.reallocateFundsForm.get("fromUniversity")?.value).toFixed(2)) - context.reallocateFundsForm.get("reallocateFundsInput")?.value,
      fromOldAllocation: context.filterUniversityAmounts(context.reallocateFundsForm.get("fromUniversity")?.value),
      toNewAllocation: context.filterUniversityAmounts(
        context.reallocateFundsForm.get("toUniversity")?.value) + context.reallocateFundsForm.get("reallocateFundsInput")?.value,
      toOldAllocation: context.filterUniversityAmounts(
        context.reallocateFundsForm.get("toUniversity")?.value),
      moneyReallocated: context.reallocateFundsForm.get("reallocateFundsInput")?.value
    }
    context.totalAllocatedService.reallocationsInsert(reallocation).subscribe(
      data => {
        if (data.results) {
          context.allocationsPostResults = data.results;
        } else if(data.errors) {
          context.snackbar.open("Reallocation failed, please try again.", "Dismiss", {duration: 3000});
          reloadComponent(true, context.router);
        }
      }
    )
  }
}
