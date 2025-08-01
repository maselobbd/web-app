import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FundAllocationsTitles } from "../../enums/fundAllocationsTitles";
import { FundAllocationSteps, FundAllocationButtons } from "../../enums/fundAllocations";
import { FormArray, FormGroup } from "@angular/forms";
import { FundAllocationsMessages } from "../../enums/fundAllocationsMessages";
import { FundAllocationsDialogModel, MoveFundsDialogModel } from "../../data-access/models/fundAllocations-model";
import { MaxAllocation } from "../../enums/universityMaxAllocationCap";
import {EntityModel} from "../../data-access/models/invalid-entity-model";

@Component({
  selector: 'app-add-funds',
  templateUrl: './add-funds.component.html',
  styleUrl: './add-funds.component.scss'
})
export class AddFundsComponent {
  @Input() data!: FundAllocationsDialogModel | MoveFundsDialogModel;
  @Input() fundAllocationStep!: number;
  @Input() universityMaxAllocationCap!: typeof MaxAllocation;
  @Input() universitiesWithCapped: EntityModel[] = [];
  @Input() universitiesToSplitMoney: string[] = [];
  @Input() allocationMoney!: number;
  @Input() splitOrAdd: boolean = false;
  @Input() fundAllocationForm!: FormGroup;
  @Output() next = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() allocationMoneyChange = new EventEmitter<number>();
  @Output() addToTotal = new EventEmitter<{ amount: number; year: number }>();
  fundAllocationSteps = FundAllocationSteps;
  fundAllocationMessages = FundAllocationsMessages;
  fundAllocationTitles = FundAllocationsTitles;
  fundAllocationButtons = FundAllocationButtons;

  constructor() {}

  get checkboxesFormArray(): FormArray {
    return this.fundAllocationForm.get('universityCheckboxes') as FormArray;
  }

  handleNext(): void {
    this.next.emit();
  }

  handleBack(): void {
    this.back.emit();
  }

  handleCancel(): void {
    this.cancel.emit();
  }

  handleConfirm(): void {
    this.confirm.emit();
  }

  handleAddToTotal(): void {
    this.addToTotal.emit({
      amount: this.fundAllocationForm.get('allocationInput')?.value,
      year: this.data.yearOfStudy
    });
  }
}
