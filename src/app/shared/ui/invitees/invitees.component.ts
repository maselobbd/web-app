import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { EventDetails } from '../../data-access/models/eventDetails.model';
import { InviteeFilters, InviteeInformation } from '../../data-access/models/inviteeInformation.model';
import { ImagePaths } from '../../../admin/enums/imagePaths';
import { MatDialog } from '@angular/material/dialog';
import { CategoryBreakdownTitles } from '../../enums/categories';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { DialogDimensions } from '../../enums/dialogDimensions';
import { EventInvitees, GroupedBursars } from '../../../admin/data-access/models/eventInvitees.model';
import { ButtonAction } from '../../enums/buttonAction';
import { EditEventInviteesComponent } from '../../../admin/ui/edit-event-invitees/edit-event-invitees.component';
import { EventUpdate } from '../../../admin/data-access/models/eventUpdate.model';

@Component({
  selector: 'app-invitees',
  templateUrl: './invitees.component.html',
  styleUrl: './invitees.component.scss'
})
export class InviteesComponent implements OnInit{
  @Input() event!: EventDetails;
  @Input() inviteeFilters?: InviteeFilters;
  @Input() isPreview: boolean = false;
  @Input() bursars: EventInvitees[] = [];
  @Output() newInvitees = new EventEmitter<EventUpdate>();
  inviteeNumbers: number = 0;
  details!: InviteeInformation[];
  readonly buttonActions = ButtonAction;
  readonly dialog = inject(MatDialog);
  rsvpSelectedValue: string = CategoryBreakdownTitles.FILTER_DEFAULT;
  universitySelectedValue: string = CategoryBreakdownTitles.FILTER_DEFAULT;
  dietaryRequirementSelectedValue: string = CategoryBreakdownTitles.FILTER_DEFAULT;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.details = this.event.invitees ?? [];
    this.inviteeNumbers = this.details.length;
    
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      maxWidth: DialogDimensions.MAXWIDTH,
      maxHeight: DialogDimensions.MAXHEIGHT,
      width: DialogDimensions.WIDTH_FIFTY,
      data: {filters: this.inviteeFilters,
        selectedValues: {
        rsvp: this.rsvpSelectedValue,
        university: this.universitySelectedValue,
        dietaryRequirement: this.dietaryRequirementSelectedValue
      }
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.rsvpSelectedValue = result.rsvp;
        this.universitySelectedValue = result.university;
        this.dietaryRequirementSelectedValue = result.dietaryRequirement;
        this.filter({searchTerm:this.rsvpSelectedValue, searchType:'rsvp'});
        this.filter({searchTerm:this.universitySelectedValue, searchType:'university'});
        this.filter({searchTerm:this.dietaryRequirementSelectedValue, searchType:'dietaryRequirement'});
      }
    });
  }

  filter(term: {searchTerm:string, searchType:string}): void {
    const lowerCaseTerm = term.searchTerm.toLowerCase().trim();
    if (!this.event?.invitees || !lowerCaseTerm) return;

    const originalDetailsList = term.searchType === 'rsvp' ? this.event.invitees : this.details;
    let filteredDetails: InviteeInformation[] = [];
    const otherFilters = this.rsvpSelectedValue !== CategoryBreakdownTitles.FILTER_DEFAULT || 
                        this.universitySelectedValue !== CategoryBreakdownTitles.FILTER_DEFAULT;

    if (lowerCaseTerm === CategoryBreakdownTitles.FILTER_DEFAULT.toLowerCase()) {
      switch (term.searchType) {
        case 'rsvp':
          filteredDetails = this.event.invitees ?? [];
          break;
        case 'university':
          filteredDetails = otherFilters ? originalDetailsList : this.event.invitees ?? [];
          break;
        case 'dietaryRequirement':
          filteredDetails = otherFilters ? originalDetailsList : this.event.invitees ?? [];
          break;
      }
    } else {
      const propertyMap: Record<string, keyof InviteeInformation> = {
        'rsvp': 'rsvp',
        'university': 'universityName', 
        'dietaryRequirement': 'dietaryRequirements'
      };

      const property = propertyMap[term.searchType as keyof typeof propertyMap];
      filteredDetails = originalDetailsList.filter(
        (invitee: InviteeInformation) => {
          const value = invitee[property];
          return value && typeof value === "string" && 
           value.toLowerCase().includes(lowerCaseTerm);
        }
      );
    }

    this.details = [...filteredDetails];
    this.cdr.detectChanges();
  }

  openAddInviteesDialog(): void {
    const dialogRef = this.dialog.open(EditEventInviteesComponent, {
      maxWidth: DialogDimensions.MAXWIDTH,
      maxHeight: DialogDimensions.MAXHEIGHT,
      data: {
        bursars: this.bursars,
        invitees: this.details,
        isPreview: this.isPreview
      },
    });

    dialogRef.afterClosed().subscribe(eventUpdates=> {
      if (eventUpdates!== undefined) {
        this.newInvitees.emit(eventUpdates);
      }
    });
  }
}
