import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StepData } from "../../data-access/models/stepper.model";
import { StepperContext, StepperDescriptions, StepperSteps } from "../../enums/stepperEnum";
import { StepperSelectionEvent } from "@angular/cdk/stepper";

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})

export class StepperComponent implements AfterViewInit {
  defaultForm: FormGroup;
  @ViewChild(MatStepper, { static: false }) stepper?: MatStepper;

  @Input() context!: StepperContext;
  @Input() formGroups: { [key: string]: FormGroup } = {};
  @Input() completedChecks: { [key: string]: boolean } = {};

  steps: StepData[] = [];
  stepperReady = false;
  visitedSteps = new Set<number>();

  constructor(private fb: FormBuilder) {
    this.defaultForm = this.fb.group({});
  }

  ngAfterViewInit() {
    this.setupSteps();
    this.stepperReady = true;
  }

  public next(): void {
    this.stepper?.next();
  }

  public previous(): void {
    this.stepper?.previous();
  }

  public get selectedIndex(): number {
    return this.stepper?.selectedIndex ?? 0;
  }

  public onStepChange(event: StepperSelectionEvent): void {
    this.visitedSteps.add(event.previouslySelectedIndex);
  }

  setupSteps() {
    switch (this.context) {
      case StepperContext.APPLICATION_FORM_LAYOUT:
        this.steps = [
          {
            label: StepperSteps.STEP_1,
            description: StepperDescriptions.BURSARY_YEAR,
            formGroup: this.formGroups['yearOfStudy'],
            completed: () => this.visitedSteps.has(0) && this.formGroups['yearOfStudy'].valid
          },
          {
            label: StepperSteps.STEP_2,
            description: StepperDescriptions.ADD_CANDIDATES,
            formGroup: this.formGroups['applicationsForm'],
            completed: () => this.visitedSteps.has(1) && this.completedChecks['step2']
          },
          {
            label: StepperSteps.STEP_3,
            description: StepperDescriptions.ALLOCATE_FUNDS,
            formGroup: this.defaultForm,
            completed: () => this.visitedSteps.has(2) && this.defaultForm.valid
          }
        ];
        break;

      case StepperContext.REVIEW_INFORMATION:
        this.steps = [
          {
            label: StepperSteps.STEP_1,
            description: StepperDescriptions.REVIEW_INFORMATION,
            formGroup: this.formGroups['applicationConfirmationForm'],
            completed: () => this.visitedSteps.has(0) && this.formGroups['applicationConfirmationForm'].value
          },
          {
            label: StepperSteps.STEP_2,
            description: StepperDescriptions.ADDITIONAL_INFORMATION,
            formGroup: this.formGroups['additionalInfoApplicationForm'],
            completed: () => this.visitedSteps.has(1) && this.formGroups['additionalInfoApplicationForm'].valid
          },
          {
            label: StepperSteps.STEP_3,
            description: StepperDescriptions.QUESTIONNAIRE,
            formGroup: this.defaultForm,
            completed: () => this.completedChecks['step3']
          }
        ];
        break;

      case StepperContext.CREATE_EVENT:
        this.steps = [
          {
            label: StepperSteps.STEP_1,
            description: StepperDescriptions.EVENT_DETAILS,
            formGroup: this.formGroups['eventForm'],
            completed: () => this.completedChecks['providedImage']
          },
          {
            label: StepperSteps.STEP_2,
            description: StepperDescriptions.ADD_INVITES,
            formGroup: this.formGroups['eventForm'],
            completed: () => this.completedChecks['selectedBursars']
          },
          {
            label: StepperSteps.STEP_3,
            description: StepperDescriptions.REVIEW,
            formGroup: this.defaultForm,
            completed: () => this.visitedSteps.has(2) && this.defaultForm.valid
          }
        ];
        break;

      default:
        this.steps = [];
        break;
    }
  }
}
