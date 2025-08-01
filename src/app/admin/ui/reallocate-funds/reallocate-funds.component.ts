import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { FundAllocationButtons, FundAllocationSteps } from "../../enums/fundAllocations";
import { FundAllocationsMessages } from "../../enums/fundAllocationsMessages";
import { FundAllocationsTitles } from "../../enums/fundAllocationsTitles";
import { FundAllocationsDialogModel, MoveFundsDialogModel } from "../../data-access/models/fundAllocations-model";
import { EntityModel } from "../../data-access/models/invalid-entity-model";
import { MaxAllocation } from "../../enums/universityMaxAllocationCap";
import { MatCheckboxChange } from "@angular/material/checkbox";

@Component({
  selector: 'app-reallocate-funds',
  templateUrl: './reallocate-funds.component.html',
  styleUrl: './reallocate-funds.component.scss'
})
export class ReallocateFundsComponent {
  @Input() data!: FundAllocationsDialogModel | MoveFundsDialogModel;
  @Input() checkDecimals!: (amount: number) => number;
  @Input() fundAllocationStep!: number;
  @Input() universityMaxAllocationCap!: typeof MaxAllocation;
  @Input() reallocationUniversities: EntityModel[] = [];
  @Input() reallocateFundsForm!: FormGroup;
  @Input() filterUniversityAmounts!: (universityName: string) => number;
  @Output() setInput = new EventEmitter<{ event: MatCheckboxChange, type: string }>
  @Output() next = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() onInput = new EventEmitter<void>();
  fundAllocationSteps = FundAllocationSteps;
  fundAllocationsMessages = FundAllocationsMessages;
  fundAllocationsTitles = FundAllocationsTitles;
  fundAllocationButtons = FundAllocationButtons;

  constructor() {}

  get fundData(): FundAllocationsDialogModel {
    return this.data as FundAllocationsDialogModel;
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

  handleOnInput(): void {
    this.onInput.emit();
  }

  handleSetInput(event: MatCheckboxChange) {
    this.setInput.emit({ event, type: 'universities' });
  }
}
