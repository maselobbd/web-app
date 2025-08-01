import { Component, OnInit, ViewChild } from '@angular/core';
import { StepperComponent } from "../../../shared/ui/stepper/stepper.component";
import { StepperContext } from "../../../shared/enums/stepperEnum";
import { ButtonAction } from "../../../shared/enums/buttonAction";
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { EventLocationTypes, EventsMessages, EventsTitles, LocationStatus } from "../../enums/eventsMessages";
import { EventsService } from "../../../shared/data-access/services/events.service";
import { Locations } from "../../data-access/models/location.model";
import { EventInvitees, GroupedBursars } from "../../data-access/models/eventInvitees.model";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { reloadComponent } from "../../../shared/utils/functions/reloadComponent";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackBarDuration } from "../../../shared/enums/snackBarDuration";
import { Router } from "@angular/router";
import { notInPastValidator, endAfterStartValidator, endTimeAfterStartTimeValidator, timeNotInPastValidator } from "../../../shared/utils/validators/eventFormValidators";
import { formatDateTime } from "../../../shared/utils/functions/formatDateTime.function";
import { hasValidResults } from "../../../shared/utils/functions/checkData.function";
import { FileData } from "../../../shared/data-access/models/additionalInformationFileData.model";
import { LoaderService } from "../../../shared/data-access/services/loader.service";
import { eventSummaryList } from '../../../states/events/events.action';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-create-events',
  templateUrl: './create-events.component.html',
  styleUrls: [
    './create-events.component.scss',
    '../../../shared/utils/styling/forms.scss',
    '../../../shared/utils/styling/footer.scss'
  ]
})
export class CreateEventsComponent implements OnInit{
  eventForm!: FormGroup
  formTitle: typeof EventsTitles = EventsTitles;
  formMessages: typeof EventsMessages = EventsMessages;
  buttonAction: typeof ButtonAction = ButtonAction;
  locationTypes: typeof EventLocationTypes = EventLocationTypes;
  eventStatuses: string[] = [];
  eventTypes: string[] = [];
  locations: Locations[] = [];
  bursars: EventInvitees[] = [];
  groupedBursars: GroupedBursars[] = [];
  selectedBursars: EventInvitees[] = [];
  selectedBursarIds: number[] = [];
  back: boolean = false;
  eventImageData!: FileData;
  isLoading: boolean = false;

  constructor(
    private eventsService: EventsService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private loader: LoaderService,
    private store: Store
  ) {}

  ngOnInit() {
    this.eventForm = this.fb.group({
      eventName: ['', Validators.required],
      eventType: ['', Validators.required],
      description: ['', Validators.required],
      eventImage: [null],
      startDate: ['', [
        Validators.required, notInPastValidator
      ]],
      endDate: ['', Validators.required],
      startTime: ['', [Validators.required, timeNotInPastValidator]],
      endTime: ['', [Validators.required, endTimeAfterStartTimeValidator]],
      eventLocationType: [this.locationTypes.PHYSICAL, Validators.required],
      physicalLocations: this.fb.array([this.createAddressForm()]),
      meetingUrl: ['', [
        RxwebValidators.required({
          conditionalExpression: () =>
            this.eventForm?.get('eventLocationType')?.value === this.locationTypes.ONLINE ||
            this.eventForm?.get('eventLocationType')?.value === this.locationTypes.BOTH
        }),
        RxwebValidators.url()
      ]],
      dietaryRequirements: [false],
      additionalComments: [false],
      invitees: [[]],
      startDateTime: [''],
      endDateTime: [''],
      eventStatus: [null],
    }, {
      validators: [
        endAfterStartValidator(),
        endTimeAfterStartTimeValidator(),
        timeNotInPastValidator()
      ]
    });

    this.eventsService.getCreateEventsData().subscribe((data) => {
      if (data.results) {
        this.eventStatuses = data.results.eventStatuses;
        this.eventTypes = data.results.eventTypes;
        this.locations = data.results.locations;
        this.bursars = data.results.bursars;
        this.groupBursarsByTier(this.bursars);
      }
    })

    this.eventForm.valueChanges.subscribe(() => {
      this.updateDateTimeFields();
    });
    this.handleLocationTypeChange();
    this.eventForm.get('eventImage')?.valueChanges.subscribe((value) => {
      this.eventImageData = value
    })
    this.loader.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  createAddressForm(): FormGroup {
    return this.fb.group({
      locationName: ['', Validators.required],
      addressLineOne: [''],
      addressLineTwo: ['', Validators.required],
      suburb: ['', Validators.required],
      city: ['', Validators.required],
      code: ['',
        [Validators.required, Validators.pattern(/^\d+$/)]
      ],
      locationStatus: [LocationStatus.CONFIRMED],
    });
  }

  createOnlineLocationForm(): FormGroup {
    return this.fb.group({
      locationName: ['Online Meeting', Validators.required],
      addressLineOne: ['N/A'],
      addressLineTwo: ['N/A', Validators.required],
      suburb: ['N/A', Validators.required],
      city: ['N/A', Validators.required],
      code: ['N/A', Validators.required],
      locationStatus: [LocationStatus.CONFIRMED],
    });
  }

  handleLocationTypeChange(): void {
    this.eventForm.get('eventLocationType')?.valueChanges.subscribe(value => {
      const locations = this.eventForm.get('physicalLocations') as FormArray;
      if (value === this.locationTypes.ONLINE) {
        this.eventForm.get('meetingUrl')?.setValue('');
        this.eventForm.get('meetingUrl')?.markAsUntouched();
        locations.clear();
        locations.push(this.createOnlineLocationForm());

      } else if (value === this.locationTypes.PHYSICAL) {
        this.eventForm.get('meetingUrl')?.setValue('');
        this.eventForm.get('meetingUrl')?.markAsUntouched();
        const filtered = locations.controls.filter(control =>
          control.get('locationName')?.value !== 'Online Meeting'
        );
        locations.clear();
        filtered.forEach(control => locations.push(control));
        if (locations.length === 0) {
          locations.push(this.createAddressForm());
        }

      } else if (value === this.locationTypes.BOTH) {
        const physicalOnly = locations.controls.filter(control =>
          control.get('locationName')?.value !== 'Online Meeting'
        );
        const hadPhysical = physicalOnly.length > 0;
        locations.clear();
        physicalOnly.forEach(control => locations.push(control));
        if (!hadPhysical) {
          locations.push(this.createAddressForm());
        }
        const hasOnline = locations.controls.some(control =>
          control.get('locationName')?.value === 'Online Meeting'
        );
        this.eventForm.get('meetingUrl')?.markAsUntouched();
        if (!hasOnline) {
          locations.push(this.createOnlineLocationForm());
        }
      }
    });
  }

  createEvent(): void {
    const eventYear = new Date(this.eventForm.getRawValue()['startDate']).getFullYear();
    this.eventsService.postEvent(this.eventForm.getRawValue()).subscribe((response) => {
      if (hasValidResults(response)) {
        this.snackBar.open(
          'Event created successfully!',
          'Dismiss',
          {
            duration: SnackBarDuration.DURATION,
            panelClass: ['success-snackbar'],
          },
        );
        reloadComponent(true,this.router);
        this.store.dispatch(eventSummaryList({ year: eventYear }));
      } else {
        this.snackBar.open(
          'Error creating event. Please try again.',
          'Dismiss',
          {
            duration: SnackBarDuration.DURATION,
            panelClass: ['error-snackbar'],
          },
        );
      }
    })
  }

  saveEvent(): void {
    this.eventForm.get('eventStatus')?.setValue('Draft');
    this.eventsService.postEvent(this.eventForm.getRawValue()).subscribe((response) => {
      if (hasValidResults(response)) {
        this.snackBar.open(
          'Event saved successfully!',
          'Dismiss',
          {
            duration: SnackBarDuration.DURATION,
            panelClass: ['success-snackbar'],
          },
        );
        reloadComponent(true,this.router);
      } else {
        this.snackBar.open(
          'Error saving event. Please try again.',
          'Dismiss',
          {
            duration: SnackBarDuration.DURATION,
            panelClass: ['error-snackbar'],
          },
        );
      }
    })
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

  onBursarSelected(bursar: EventInvitees) {
    this.selectedBursars.push(bursar)
    this.selectedBursarIds.push(bursar.studentId);
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

  private syncSelectedBursarsToForm(): void {
    const inviteesArray = Array.from(this.selectedBursars);
    this.eventForm.patchValue({ invitees: inviteesArray }, { emitEvent: false });
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

  onBack(): void {
    this.back = true
  }

  providedImage(): boolean {
    return this.eventForm.get('eventImage')?.value !== null && this.eventForm.valid;
  }

  @ViewChild('stepperRef') stepper!: StepperComponent;
  protected readonly StepperContext = StepperContext;
}
