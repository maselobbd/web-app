import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-renewal-list',
  templateUrl: './renewal-list.component.html',
  styleUrls: [
    './renewal-list.component.scss',
    '../../../shared/ui/application-details/application-details.component.scss',
  ],
})
export class RenewalListComponent {
  @Input() applicationsForm!: FormGroup;
  @Output() enableContinue = new EventEmitter<boolean>();
  formMessage = ['message'];
  displayedColumns: string[] = [
    'Bursar full name',
    'previous year of study',
    'year of study',
    'Degree',
    'Intent to pursue honours',
  ];

  constructor() {}

  getFormGroup(control: AbstractControl): FormGroup {
    if (control instanceof FormGroup) {
      return control;
    } else {
      return new FormGroup({});
    }
  }
  
  getConfirmSelectionControl(element: AbstractControl): FormControl {
    const formGroup = this.getFormGroup(element);
    if (formGroup) {
      return formGroup.get('confirmSelection') as FormControl;
    }
    return new FormControl(false);
  }

  getSelectYearControl(element: AbstractControl): FormControl {
    const formGroup = this.getFormGroup(element);
    if (formGroup) {
      return formGroup.get('yearOfStudy') as FormControl;
    }
    return new FormControl(false);
  }

  getFormArray(): FormArray {
    return this.applicationsForm.get('applications') as FormArray;
  }
  updateFormValidity(
    event: MatCheckboxChange | MatSelectChange,
    element: AbstractControl,
  ) {
    this.enableContinue.emit(
      element.get('confirmSelection')?.getRawValue() === true &&
        element.get('confirmSelection')?.getRawValue() &&
        element.get('yearOfStudy')?.valid,
    );
  }
}
