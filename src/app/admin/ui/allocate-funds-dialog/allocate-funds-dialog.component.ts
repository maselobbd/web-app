import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { FundAllocationButtons, FundAllocationSteps } from "../../enums/fundAllocations";
import { FundAllocationsMessages } from "../../enums/fundAllocationsMessages";
import { FundAllocationsTitles } from "../../enums/fundAllocationsTitles";
import { FundAllocationsDialogModel, MoveFundsDialogModel } from "../../data-access/models/fundAllocations-model";
import { EntityModel } from "../../data-access/models/invalid-entity-model";

@Component({
  selector: 'app-allocate-funds-dialog',
  templateUrl: './allocate-funds-dialog.component.html',
  styleUrl: './allocate-funds-dialog.component.scss'
})
export class AllocateFundsDialogComponent {
  @Input() data!: FundAllocationsDialogModel | MoveFundsDialogModel;
  @Input() checkDecimals!: (amount: number) => number;
  @Input() fundAllocationStep!: number;
  @Input() universitiesWithCapped: EntityModel[] = [];
  @Input() unallocatedLess: boolean = false;
  @Input() allocateFundsForm!: FormGroup;
  @Input() filterUniversityAmounts!: (universityName: string) => number;
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
}
