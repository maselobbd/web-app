import { Component, inject, OnInit } from '@angular/core';
import { DialogTitles } from '../../../shared/enums/dialog-titles';
import { ButtonAction } from '../../../shared/enums/buttonAction';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventsMessages } from '../../enums/eventsMessages';
import { EventInvitees, GroupedBursars } from '../../data-access/models/eventInvitees.model';
import { InviteeInformation } from '../../../shared/data-access/models/inviteeInformation.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventUpdate } from '../../data-access/models/eventUpdate.model';

@Component({
  selector: 'app-edit-event-invitees',
  templateUrl: './edit-event-invitees.component.html',
  styleUrls: ['./edit-event-invitees.component.scss',
  '../../../shared/utils/styling/forms.scss',
    '../../../shared/utils/styling/footer.scss']
})
export class EditEventInviteesComponent implements OnInit {
  eventForm!: FormGroup;
  isPreview: boolean = false;
  bursars: EventInvitees[] = [];
  currentInvitees: InviteeInformation[] = [];
  groupedBursars: GroupedBursars[] = [];
  selectedBursars: EventInvitees[] = [];
  selectedBursarIds: number[] = [];
  dialogMessages: typeof EventsMessages = EventsMessages;
  
  readonly dialogTitles = DialogTitles;
  readonly buttonActions = ButtonAction;
  data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<EditEventInviteesComponent>);
  
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({invitees: [[]]});

    if (this.data) {
      this.isPreview = this.data.isPreview;
      this.bursars = this.data.bursars ?? [];
      this.currentInvitees = this.data.invitees ?? []; 
    }
    this.groupBursarsByTier(this.bursars);
  }

  onSearch(searchTerm: string): void {
    const lowerTerm = searchTerm.toLowerCase();
    if (!searchTerm.trim()) {
      this.groupBursarsByTier(this.bursars);
      return;
    }
    const filtered = this.bursars.filter(b =>
      b.name.toLowerCase().includes(lowerTerm) ||
      b.surname.toLowerCase().includes(lowerTerm)
    );
    this.groupBursarsByTier(filtered);
  }

  groupBursarsByTier(bursars: EventInvitees[]) {
    const grouped = new Map<number, EventInvitees[]>();
    bursars.forEach((bursar) => {
      if (!grouped.has(bursar.tier)) {
        grouped.set(bursar.tier, []);
      }
      grouped.get(bursar.tier)!.push(bursar);
    });
    this.groupedBursars = Array.from(grouped.entries())
      .map(([tier, bursars]) => ({
        tier,
        bursars,
      }));
  }

  private syncSelectedBursarsToForm(): void {
    const inviteesArray = Array.from(this.selectedBursars);
    this.eventForm.patchValue({ invitees: inviteesArray }, { emitEvent: false });
  }

  onBursarSelected(bursar: EventInvitees) {
    const updatedBursar: EventInvitees = { ...bursar, inviteCategory: 'Tier' };
    this.selectedBursars.push(updatedBursar)
    this.selectedBursarIds.push(updatedBursar.studentId);
    this.syncSelectedBursarsToForm();
  }

  onBursarDeselected(bursar: EventInvitees) {
    this.selectedBursars = this.selectedBursars.filter(selectedBursar => selectedBursar !== bursar);
    this.selectedBursarIds = this.selectedBursarIds.filter(id => id !== bursar.studentId)
    this.syncSelectedBursarsToForm();
  }

  clearSelectedBursars(tier: number): void {
    this.selectedBursars = this.selectedBursars.filter(bursar => bursar.tier !== tier);
    this.selectedBursarIds = this.selectedBursars.map(bursar => bursar.studentId);
    this.syncSelectedBursarsToForm();
  }

  onUpdate() {
    const invitees = this.eventForm.getRawValue();
    const eventUpdates: EventUpdate = {invitees: invitees.invitees, isCancelled: false}
    if (this.eventForm.valid) {
      this.dialogRef.close(eventUpdates);
    } else {
      this.dialogRef.close();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
