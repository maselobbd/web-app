import { Component, inject, OnInit } from '@angular/core';
import { DialogTitles } from '../../../shared/enums/dialog-titles';
import { EventLocationTypes, EventsMessages, EventsTitles, LocationStatus } from '../../enums/eventsMessages';
import { ButtonAction } from '../../../shared/enums/buttonAction';
import { EventDetails } from '../../../shared/data-access/models/eventDetails.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { endAfterStartValidator, endTimeAfterStartTimeValidator, notInPastValidator, timeNotInPastValidator } from '../../../shared/utils/validators/eventFormValidators';
import { Locations } from '../../data-access/models/location.model';
import { EventLocation } from '../../../shared/data-access/models/location.model';
import { formatDateTime } from '../../../shared/utils/functions/formatDateTime.function';
import { LoaderService } from '../../../shared/data-access/services/loader.service';
import { EventFormValues, EventUpdate } from '../../data-access/models/eventUpdate.model';

@Component({
  selector: 'app-edit-event-details',
  templateUrl: './edit-event-details.component.html',
  styleUrls: [
    './edit-event-details.component.scss',
    '../../../shared/utils/styling/forms.scss',
    '../../../shared/utils/styling/footer.scss']
})
export class EditEventDetailsComponent implements OnInit{
  isEdit: boolean = true;
  event!: EventDetails;
  eventForm!: FormGroup;
  isLoading: boolean = false;
  readonly DialogTitles = DialogTitles;
  readonly EventsMessages = EventsMessages;
  locationTypes: typeof EventLocationTypes = EventLocationTypes;
  readonly ButtonAction = ButtonAction;
  back: boolean = false;
  locations: Locations[] = [];
  eventTypes: string[] = [];
  formattedStartDate!: Date;
  formattedEndDate!: Date;
  physicalLocations!: EventLocation[];
  originalFormValue!: EventFormValues;

  data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<EditEventDetailsComponent>);

  constructor(
    private fb: FormBuilder,
    private loader: LoaderService,
  ) {}

  ngOnInit(): void {
    this.getCurrentEventDetails();
    this.handleLocationTypeChange();

    this.loader.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  getCurrentEventDetails() {
    if (!!this.data) {
      const dbStartDate: Date = new Date(this.data.startDate);
      const dbEndDate: Date = new Date(this.data.endDate);
      const startDate = new Date(dbStartDate);
      const endDate = new Date(dbEndDate);
      
      const startTime = this.formatTime(dbStartDate);
      const endTime = this.formatTime(dbEndDate);
      
      const physicalLocationNames = this.data.allLocations?.map((loc: EventLocation) => loc.location) || [];
      let eventLocationType = this.determineLocationTypePreselection(physicalLocationNames);
      const meetingUrl = this.getMeetingUrl(this.data.allLocations);
      
      this.eventForm = this.fb.group({
        startDate: [startDate, [
          Validators.required, notInPastValidator
        ]],
        endDate: [endDate, Validators.required],
        startTime: [startTime, [Validators.required, timeNotInPastValidator]],
        endTime: [endTime, [Validators.required, endTimeAfterStartTimeValidator]],
        eventLocationType: [eventLocationType, Validators.required],
        physicalLocations: this.fb.array([]),
        meetingUrl: [meetingUrl, [
          RxwebValidators.required({
            conditionalExpression: () =>
              this.eventForm?.get('eventLocationType')?.value === this.locationTypes.ONLINE ||
              this.eventForm?.get('eventLocationType')?.value === this.locationTypes.BOTH
          }),
          RxwebValidators.url()
        ]],
        startDateTime: [this.data.startDate],
        endDateTime: [this.data.endDate],
      }, {
        validators: [
          endAfterStartValidator(),
          endTimeAfterStartTimeValidator(),
          timeNotInPastValidator()
        ]
      });

      this.eventForm.valueChanges.subscribe(() => {
        this.updateDateTimeFields();
      });

      this.setupPhysicalLocations(this.data.allLocations);
      this.eventTypes = this.data.eventTypes || [];
      this.originalFormValue = this.eventForm.getRawValue();
    }
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  determineLocationTypePreselection(physicalLocationNames: string[]): string {
    const hasOnlineMeeting = physicalLocationNames.includes(EventsTitles.ONLINE_MEETING_CHECK);
    const hasOtherLocations = physicalLocationNames.some(location => location !== EventsTitles.ONLINE_MEETING_CHECK);

    if (hasOnlineMeeting && !hasOtherLocations) return this.locationTypes.ONLINE;
    if (hasOnlineMeeting && hasOtherLocations) return this.locationTypes.BOTH;
    return this.locationTypes.PHYSICAL;
  }

  getMeetingUrl(locations: EventLocation[]): string {
    for (let location of locations) {
      if (location.location === EventsTitles.ONLINE_MEETING_CHECK) {
        return location.meetingUrl;
      }
    }
    return '';
  }

  setupPhysicalLocations(locations: EventLocation[]): void {
    const physicalLocationsArray = this.eventForm.get('physicalLocations') as FormArray;
    physicalLocationsArray.clear();

    for (let location of locations) {
      if (location.location !== EventsTitles.ONLINE_MEETING_CHECK) {
        physicalLocationsArray.push(this.createAddressFormWithData(location));
      } else {
        physicalLocationsArray.push(this.createOnlineLocationForm());
      }
    }
  }

  updateDateTimeFields(): void {
    const { startDateTime, endDateTime } = formatDateTime(
      this.eventForm.get('startDate')?.value,
      this.eventForm.get('endDate')?.value,
      this.eventForm.get('startTime')?.value,
      this.eventForm.get('endTime')?.value
    );
    this.eventForm.patchValue({
      startDateTime,
      endDateTime
    }, { emitEvent: false });
  }

  createAddressForm(): FormGroup {
    return this.fb.group({
      locationName: ['', Validators.required],
      addressLineOne: [''],
      addressLineTwo: ['', Validators.required],
      suburb: ['', Validators.required],
      city: ['', Validators.required],
      code: ['', [
        Validators.required,
        Validators.pattern(/^\d+$/)
      ]]
    });
  }

  createAddressFormWithData(location: EventLocation): FormGroup {
    if (location.location === EventsTitles.ONLINE_MEETING_CHECK) {
      return this.createOnlineLocationForm();
    }

    return this.fb.group({
      locationName: [location.location || '', Validators.required],
      addressLineOne: [location.address?.addressLine1 || ''],
      addressLineTwo: [location.address?.addressLine2 || '', Validators.required],
      suburb: [location.address?.suburb || '', Validators.required],
      city: [location.address?.city || '', Validators.required],
      code: [location.address?.code || '', [
        Validators.required,
        Validators.pattern(/^\d+$/)
      ]]
    });
  }
  
  createOnlineLocationForm(): FormGroup {
    return this.fb.group({
      locationName: [EventsTitles.ONLINE_MEETING_CHECK, Validators.required],
      addressLineOne: ['N/A'],
      addressLineTwo: ['N/A'],
      suburb: ['N/A'],
      city: ['N/A'],
      code: ['N/A']
    });
  }

  handleLocationTypeChange() {
    this.eventForm.get('eventLocationType')?.valueChanges.subscribe(value => {
      const locations = this.eventForm.get('physicalLocations') as FormArray;
      if (value === this.locationTypes.ONLINE) {
        locations.push(this.createOnlineLocationForm());
      } else if (value === this.locationTypes.PHYSICAL || value === this.locationTypes.BOTH) {
        this.eventForm.get('meetingUrl')?.markAsUntouched();
        const filtered = locations.controls.filter(control =>
          control.get('locationName')?.value !== EventsTitles.ONLINE_MEETING_CHECK
        );
        locations.clear();
        filtered.forEach(control => locations.push(control));
        if (locations.length === 0) {
          locations.push(this.createAddressForm());
        }
      }
    });
  }

  getChangedFields(original: EventFormValues, current: EventFormValues): EventUpdate {
    const changed: EventUpdate = { isCancelled: false };
    const controls = this.eventForm.controls;

    if (controls['startDate']?.dirty || controls['startTime']?.dirty || current['startDateTime'] !== original['startDateTime']) {
      changed.startDate = current['startDateTime'];
    }
    
    if (controls['endDate']?.dirty || controls['endTime']?.dirty || current['endDateTime'] !== original['endDateTime']) {
      changed.endDate = current['endDateTime'];
    }

    if (controls['meetingUrl']?.dirty) {
      changed.meetingUrl = current['meetingUrl'];
    }

    if (controls['eventLocationType']?.dirty && original.eventLocationType !== current.eventLocationType) {
      changed.locations = this.getUpdatedLocationsForTypeChange(original, current);
      changed.meetingUrl = this.getMeetingUrlForLocationType(current.eventLocationType, current.meetingUrl);
    } else if (controls['physicalLocations'] && current.eventLocationType === original.eventLocationType) {
      const locationChanges = this.getPhysicalLocationChanges(original.physicalLocations, current.physicalLocations);
      if (locationChanges.length > 0) {
        changed.locations = locationChanges;
      }
    }

    return changed;
  }

  private getUpdatedLocationsForTypeChange(original: EventFormValues, current: EventFormValues): Locations[] {
    const locations = current.physicalLocations;
    const originalLocations = original.physicalLocations;

    switch (current.eventLocationType) {
      case this.locationTypes.ONLINE:
        return [
          ...locations
            .filter(loc => loc.locationName === EventsTitles.ONLINE_MEETING_CHECK)
            .map(loc => ({ ...loc, locationStatus: LocationStatus.CONFIRMED })),
          ...originalLocations
            .filter(loc => loc.locationName !== EventsTitles.ONLINE_MEETING_CHECK)
            .map(loc => ({ ...loc, locationStatus: LocationStatus.REVOKED }))
        ];

      case this.locationTypes.PHYSICAL:
        return [...this.getPhysicalLocationChanges(originalLocations, locations),
          ...originalLocations
            .filter(loc => loc.locationName === EventsTitles.ONLINE_MEETING_CHECK)
            .map(loc => ({ ...loc, locationStatus: LocationStatus.REVOKED }))
        ];

      case this.locationTypes.BOTH:
        let physicalLocations = locations.filter(loc => loc.locationName !== EventsTitles.ONLINE_MEETING_CHECK);
        physicalLocations = this.getPhysicalLocationChanges(originalLocations, physicalLocations);
        
        const hasOnline = locations.some(loc => loc.locationName === EventsTitles.ONLINE_MEETING_CHECK);
        
        if (!hasOnline) {
          physicalLocations.push({
            ...this.createOnlineLocationForm().getRawValue(),
            locationStatus: LocationStatus.CONFIRMED
          });
        }
        
        return physicalLocations;

      default:
        return [];
    }
  }

  private getMeetingUrlForLocationType(locationType: string, meetingUrl: string): string {
    switch (locationType) {
      case this.locationTypes.BOTH:
        return meetingUrl;
      case this.locationTypes.PHYSICAL:
        return 'N/A';
      default:
        return meetingUrl;
    }
  }

  private getPhysicalLocationChanges(originalLocations: Locations[], currentLocations: Locations[]): Locations[] {
    const changedLocations: Locations[] = [];
    const currentFormArray = this.eventForm.get('physicalLocations') as FormArray;

    currentFormArray.controls.forEach(control => {
      if (control.dirty) {
        const location = control.getRawValue() as Locations;
        changedLocations.push({ ...location, locationStatus: LocationStatus.CONFIRMED });
      }
    });

    originalLocations.forEach(originalLoc => {
      const isStillPresent = currentLocations.some(currentLoc => 
        originalLoc.locationName === currentLoc.locationName &&
        originalLoc.addressLineOne === currentLoc.addressLineOne &&
        originalLoc.addressLineTwo === currentLoc.addressLineTwo &&
        originalLoc.suburb === currentLoc.suburb &&
        originalLoc.city === currentLoc.city &&
        originalLoc.code === currentLoc.code
      );

      if (!isStillPresent) {
        changedLocations.push({ ...originalLoc, locationStatus: LocationStatus.REVOKED });
      }
    });

    return changedLocations;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpdate(): void {
    const currentValue = this.eventForm.getRawValue();
    if (this.eventForm.valid) {
      const changedFields = this.getChangedFields(this.originalFormValue, currentValue);

      if (Object.keys(changedFields).length > 1) {
        this.dialogRef.close(changedFields);
      } else {
        this.dialogRef.close();
      }
    }
  }
}
