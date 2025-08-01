import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { EventsMessages, EventsTitles } from "../../../admin/enums/eventsMessages";
import { Locations } from "../../../admin/data-access/models/location.model";
import {startWith} from "rxjs";

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss'
})
export class AddressFormComponent implements OnInit{
  @Input() addressForm!: FormGroup;
  @Input() formNumber: number = 0;
  @Input() canBeDeleted: boolean = false;
  @Input() locations: Locations[] = [];
  @Input() usedLocationNames: string[] = [];
  @Output() formDeleted = new EventEmitter<void>();
  eventTitles: typeof EventsTitles = EventsTitles;
  eventMessages: typeof EventsMessages = EventsMessages;
  filteredLocations: Locations[] = [];

  ngOnInit() {
    this.addressForm.get('locationName')?.valueChanges
      .pipe(startWith('')).subscribe(value => {
      const input = typeof value === 'string' ? value : value?.locationName;
      this.filteredLocations = this.filterLocations(input || '');
    });
  }

  filterLocations(value: string): Locations[] {
    return this.locations.filter(loc => {
    const locationName = loc.locationName.toLowerCase();
      return (
        locationName.includes(value.toLowerCase()) &&
        locationName !== 'online meeting' &&
        !this.usedLocationNames.includes(locationName)
      );
    });
  }

  displayLocation(location?: any): string {
    return location && typeof location === 'object'
      ? location.locationName
      : location || '';
  }

  onLocationSelected(selectedLocation: Locations): void {
    this.addressForm.patchValue({
      locationName: selectedLocation.locationName,
      addressLineOne: selectedLocation.addressLineOne,
      addressLineTwo: selectedLocation.addressLineTwo,
      suburb: selectedLocation.suburb,
      city: selectedLocation.city,
      code: selectedLocation.code
    });
  }

  onDelete(): void {
    if (this.canBeDeleted) {
      this.formDeleted.emit();
    }
  }
}
