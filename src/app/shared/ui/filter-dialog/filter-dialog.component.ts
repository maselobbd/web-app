import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogTitles } from '../../enums/dialog-titles';
import { ButtonAction } from '../../enums/buttonAction';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryBreakdownTitles } from '../../enums/categories';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrl: './filter-dialog.component.scss'
})
export class FilterDialogComponent {
  rsvpOptions: string[] = [];
  universityOptions: string[] = [];
  dietaryRequirementOptions: string[] = [];
  rsvpFilterForm!: FormGroup;
  universityFilterForm!: FormGroup;
  dietaryRequirementsFilterForm!: FormGroup;
  readonly dialogTitles = DialogTitles;
  readonly buttonActions = ButtonAction;
  data = inject(MAT_DIALOG_DATA);

  private dialogRef = inject(MatDialogRef<FilterDialogComponent>);

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    const selected = this.data.selectedValues ?? {};
    
    this.rsvpFilterForm = this.formBuilder.group({
      rsvp: [selected.rsvp ?? CategoryBreakdownTitles.FILTER_DEFAULT, Validators.required]
    });
    this.universityFilterForm = this.formBuilder.group({
      university: [selected.university ?? CategoryBreakdownTitles.FILTER_DEFAULT, Validators.required]
    });
    this.dietaryRequirementsFilterForm = this.formBuilder.group({
      dietaryRequirement: [selected.dietaryRequirement ?? CategoryBreakdownTitles.FILTER_DEFAULT, Validators.required]
    });

    if (this.data.filters) {
      this.rsvpOptions = [CategoryBreakdownTitles.FILTER_DEFAULT, ...(this.data?.filters?.rsvp ?? [])];
      this.universityOptions = [CategoryBreakdownTitles.FILTER_DEFAULT, ...(this.data.filters.university ?? [])];
      this.dietaryRequirementOptions = [CategoryBreakdownTitles.FILTER_DEFAULT, ...(this.data.filters.dietaryRequirements ?? [])];
      this.rsvpOptions.sort();
      this.universityOptions.sort();
      this.dietaryRequirementOptions.sort();
    }
  }

  onSubmit(): void {
    const result = {
      rsvp: this.rsvpFilterForm.value.rsvp,
      university: this.universityFilterForm.value.university,
      dietaryRequirement: this.dietaryRequirementsFilterForm.value.dietaryRequirement
    };

    this.dialogRef.close(result);
  }
}
