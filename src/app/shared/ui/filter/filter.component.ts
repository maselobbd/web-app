import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-shared-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  viewProviders: [
      {
        provide: ControlContainer,
        useExisting: FormGroupDirective,
      },
    ],
})
export class FilterComponent implements OnInit {

  filterForm!: FormGroup;
  @Input()
  filterItems: (string | number)[] = [];
  @Input()
  selectedValue!: string | number;
  @Input() 
  controlName!: string;

  label: string = '';

  constructor(
    private controlContainer: ControlContainer,
  ) {  }

  ngOnInit(): void {
    this.filterForm = <FormGroup>(
      this.controlContainer.control
    );
    this.labelMap();
  }

  labelMap(): void {
    const labels: { [key: string]: string } = {'financialYear': 'Financial Year', 'rsvp': 'RSVP', 'university': 'University', 'dietaryRequirement': 'Dietary Requirement'};
    this.label = labels[this.controlName];
  }
}
