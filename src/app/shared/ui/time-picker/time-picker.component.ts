import { Component, Input } from '@angular/core';
import { FormControl } from "@angular/forms";
import { EventsMessages } from "../../../admin/enums/eventsMessages";

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss'
})

export class TimePickerComponent {
  @Input() timeControl!: FormControl;
  timeOptions: string[] = [];

  constructor() {
    this.generateTimeOptions();
  }

  generateTimeOptions() {
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 15) {
        const h = hour.toString().padStart(2, '0');
        const m = min.toString().padStart(2, '0');
        this.timeOptions.push(`${h}:${m}`);
      }
    }
  }

  selectTime(time: string) {
    this.timeControl.setValue(time);
    this.timeControl.markAsTouched();
  }

  protected readonly eventMessages = EventsMessages;
}
