import { Component, Input, EventEmitter} from '@angular/core';
import { EventsMessages, EventLocationTypes, EventsTitles } from "../../enums/eventsMessages";
import { ButtonAction } from "../../../shared/enums/buttonAction";
import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";
import { FileData } from "../../../shared/data-access/models/additionalInformationFileData.model";
import { Locations } from "../../data-access/models/location.model";
import { EventLocation } from '../../../shared/data-access/models/location.model';

@Component({
  selector: 'app-event-information-form',
  templateUrl: './event-information-form.component.html',
  styleUrl: './event-information-form.component.scss'
})
export class EventInformationFormComponent{
  @Input() eventForm!: FormGroup
  @Input() createAddressForm!: () => FormGroup;
  @Input() eventTypes: string[] = [];
  @Input() locations: Locations[] = [];
  @Input() back: boolean = false;
  @Input() eventImage!: FileData;
  @Input() isEdit: boolean = false;
  @Input() allLocations: EventLocation[] = [];
  buttonAction: typeof ButtonAction = ButtonAction;
  locationTypes: typeof EventLocationTypes = EventLocationTypes;
  eventMessages: typeof EventsMessages = EventsMessages;
  eventTitle: typeof EventsTitles = EventsTitles;
  private initialLocationCount: number = 0;

  constructor() {}

  ngOnInit() {
    if (this.isEdit && this.allLocations) {
      this.initialLocationCount = this.allLocations.filter(
        loc => loc.location.toLowerCase() !== 'online meeting'
      ).length;
    }
  }

  get eventLocationType() {
    return this.eventForm.get('eventLocationType')?.value;
  }

  get physicalLocations(): FormArray {
    return this.eventForm.get('physicalLocations') as FormArray;
  }

  get filteredPhysicalLocations(): FormGroup[] {
    return this.physicalLocations.controls.filter(control =>
      control.get('locationName')?.value !== EventsTitles.ONLINE_MEETING_CHECK
    ) as FormGroup[];
  }

  getFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  getUsedLocationNames(): string[] {
    return this.eventForm.get('physicalLocations')?.value
      .map((form: Locations) => form.locationName?.toLowerCase());
  }

  get startTimeControl(): FormControl {
    return this.eventForm.get('startTime') as FormControl;
  }

  get endTimeControl(): FormControl {
    return this.eventForm.get('endTime') as FormControl;
  }

  addNewLocation(): void {
    this.physicalLocations.push(this.createAddressForm());
  }

  removeLocation(index: number): void {
    this.physicalLocations.removeAt(index);
  }

  canBeDeleted(): boolean {
    return this.filteredPhysicalLocations.length > 1;
  }

  onEventImageUploaded(fileData: FileData): void {
    if (fileData.removeFile) {
      this.eventForm.get('eventImage')?.setValue(null);
    } else {
      this.eventForm.get('eventImage')?.setValue(fileData);
    }
  }
}
