import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import { EventInvitees } from "../../data-access/models/eventInvitees.model";
import { InviteeInformation } from '../../../shared/data-access/models/inviteeInformation.model';

@Component({
  selector: 'app-bursar-tiers',
  templateUrl: './bursar-tiers.component.html',
  styleUrl: './bursar-tiers.component.scss'
})
export class BursarTiersComponent {
  displayedColumns: string[] = ['bursarName', 'universityName', 'bursarSelection'];
  @Input() bursars: EventInvitees[] = [];
  @Input() tier!: number;
  @Input() isPreview: boolean = false;
  @Input() selectedIds: number[] = [];
  @Input() currentInvitees: InviteeInformation[] = [];
  @Output() bursarSelected = new EventEmitter<EventInvitees>();
  @Output() bursarDeselected = new EventEmitter<EventInvitees>();
  @Output() clearSelectedBursars = new EventEmitter<number>();
  openTiers = new Set<number>();

  isAllSelected(): boolean {
    return this.bursars.every(row => this.selectedIds.includes(row.studentId));
  }

  isInCurrentInvitees(row: EventInvitees): boolean {
    return this.currentInvitees.some(invitee => invitee.studentId === row.studentId);
  }

  toggleAll(): void {
    if (this.isAllSelected()) {
      this.clearSelectedBursars.emit(this.tier);
    } else {
      this.bursars.forEach(row => {
        if (!this.selectedIds.includes(row.studentId)) {
          this.bursarSelected.emit(row);
        }
      });
    }
  }

  toggleRow(row: EventInvitees): void {
    if (this.selectedIds.includes(row.studentId)) {
      this.bursarDeselected.emit(row);
    } else {
      this.bursarSelected.emit(row);
    }
  }

  isSelected(row: EventInvitees): boolean {
    if (!this.isPreview && this.isInCurrentInvitees(row)) {
      return true;
    }
    return this.selectedIds?.includes(row.studentId);
  }

  onPanelOpened(tier: number): void {
    this.openTiers.add(tier);
  }

  onPanelClosed(tier: number): void {
    this.openTiers.delete(tier);
  }
}
