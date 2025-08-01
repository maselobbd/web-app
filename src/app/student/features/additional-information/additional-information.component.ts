import { Component, input, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AdditionaInfoMessageType } from '../../../shared/enums/messages';
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { DataService } from '../../../shared/data-access/services/data.service';
import { FileData } from '../../../shared/data-access/models/additionalInformationFileData.model';
import { URLS } from '../../enums/legalRoutes';
import { Degrees } from '../../enums/degrees';
import { ApplicationInsightsService } from '../../../shared/data-access/services/application-insights.service';
import { RouteNames } from '../../../shared/enums/routeNames';
import { Router } from '@angular/router';
import { debounceTime, filter } from 'rxjs';
import { MapsService } from '../../services/maps.service';
import { Location } from '../../models/location.model';
import { SearchBarService } from '../../../shared/data-access/services/search-bar.service';
import { SearchBarValues } from '../../../shared/enums/searchValuesEnum';
import { arrayRange } from '../../../shared/utils/functions/checkData.function';
import { MatSelectChange } from '@angular/material/select';
import { ValidationValues } from '../../models/student.model';


@Component({
  selector: 'app-additional-information',
  templateUrl: './additional-information.component.html',
  styleUrls: [
    '../../../shared/utils/styling/forms.scss',
    './additional-information.component.scss',
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class AdditionalInformationComponent implements OnInit {
  @Input({ required: true })
  races!: string[];
  @Input({ required: true })
  genders!: string[];
  @Input()
  personalInfo: any;
  @Input()
  back: boolean = false;
  @Input({ required: true })
  degreeList!: string[];
  @Input({ required: true })
  titles!: string[];
  @Input()
  canRequestLocation!: boolean;

  @Input() isOnboarding: boolean = false;
  @Input() userExists: boolean = false;
  @Input() universities: string[] = [];
  @Input() bursaryTiers: number[] = [];
  @Input() faculties: string[] = [];
  @Input() departments: Set<string> = new Set();

  minDate?: Date;
  maxDate?: Date;
  matric!: FileData;
  academicRecord!: FileData;
  identity!: FileData;
  financial!: FileData;
  file!: FileData;
  errorMessages: any;
  studentFirstName!: string;
  studentLastName!: string;
  additionalInfoApplicationForm!: FormGroup;
  helpMessage: string = AdditionaInfoMessageType.HELP_MESSAGE;
  average: any;
  selectedDate!: Date;
  formattedDate!: string;
  radioValue: boolean = true;
  urls: any = URLS;
  validBirthDate: boolean = false;
  durations: number[] = [];
  honors: boolean = false;
  chosenDegree: string = '';
  confirmHonors: boolean = false;
  options: any;
Contract: any;
  constructor(
    private controlContainer: ControlContainer,
    private dataService: DataService,
    private applicationInsights: ApplicationInsightsService,
    private router: Router,
    private mapsService: MapsService,
    private searchBarService: SearchBarService,
  ) {}

  ngOnInit(): void {
    this.errorMessages = AdditionaInfoMessageType;
    this.additionalInfoApplicationForm = <FormGroup>(
      this.controlContainer.control
    );
    if(this.isOnboarding){
      
    }
    !this.back
      ? this.additionalInfoApplicationForm
          .get('personalInformation.citizenShipControl')
          ?.setValue(true)
      : null;

    !this.back
      ? this.additionalInfoApplicationForm
          .get('universityInformation.confirmHonors')
          ?.setValue('No')
      : null;

    if (
      this.back &&
      this.additionalInfoApplicationForm.get('documentation')?.value
    ) {
      Object.keys(
        this.additionalInfoApplicationForm.get('documentation')?.value,
      ).forEach((fileType) => {
        switch (fileType) {
          case 'matric': {
            this.matric =
              this.additionalInfoApplicationForm.get('documentation')?.value[
                fileType
              ];
            this.dataService.setBackFile(this.matric);
            break;
          }
          case 'academicRecord': {
            this.academicRecord =
              this.additionalInfoApplicationForm.get('documentation')?.value[
                fileType
              ];
            this.dataService.setBackFile(this.academicRecord);
            break;
          }
          case 'proofOfIdentification': {
            this.identity =
              this.additionalInfoApplicationForm.get('documentation')?.value[
                fileType
              ];
            this.dataService.setBackFile(this.identity);
            break;
          }
          case 'financialStatement': {
            this.financial =
              this.additionalInfoApplicationForm.get('documentation')?.value[
                fileType
              ];
            this.dataService.setBackFile(this.financial);
            break;
          }
        }
      });
    }
    this.minDate = new Date(1970, 0, 1);
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear, 11, 31);
    this.applicationInsights.logPageView(
      RouteNames.STUDENT_FORM,
      this.router.url,
    );
    this.setUpAddressSubscription();
    this.durations = arrayRange(1, 4, 1);
  }
  setUpAddressSubscription() {
    if (this.canRequestLocation) {
      this.additionalInfoApplicationForm
        .get('address')
        ?.valueChanges.pipe(
          debounceTime(SearchBarValues.DEBOUNCE_TIME),
          filter((value) => {
            const addressLine1 = value?.addressLine1;
            const isValidInput =
              addressLine1 &&
              addressLine1.length >= SearchBarValues.MAX_CHARACTER;

            if (
              !addressLine1 ||
              addressLine1.length < SearchBarValues.MAX_CHARACTER
            ) {
              this.options = [];
              this.searchBarService.search.set(this.options);
              this.searchBarService.result.set({} as Location);

              return false;
            } else {
              return isValidInput;
            }
          }),
        )
        .subscribe((v) => {
          this.mapsService.getAddress(v.addressLine1).subscribe((res) => {
            if (!res.errors) {
              this.options = res.results['results'] as Location[];
              this.searchBarService.search.set(this.options);
              this.searchBarService.searchCount.update((v) => v + 1);
            }
          });
        });
    }
  }
  setAddress($event: Location) {
    const calls = this.searchBarService.searchCount() + 1;
    const addressLine1Control = this.additionalInfoApplicationForm
      .get('address')
      ?.get('addressLine1');

    if (addressLine1Control) {
      const newStreetName = $event.address.streetName;
      const currentValue = addressLine1Control.value || '';

      const firstPart = newStreetName.split(' ')[0];

      if (!/\d/.test(firstPart)) {
        addressLine1Control.setValue(
          `${currentValue.split(' ')[0]} ${newStreetName}`.trim(),
        );
      } else {
        addressLine1Control.setValue(newStreetName);
      }
    }

    this.additionalInfoApplicationForm
      .get('address')
      ?.get('postalCode')
      ?.setValue($event.address.postalCode);

    this.additionalInfoApplicationForm
      .get('address')
      ?.get('cityTown')
      ?.setValue($event.address.municipality);

    this.additionalInfoApplicationForm
      .get('address')
      ?.get('suburbDistrict')
      ?.setValue($event.address.municipalitySubdivision);
    this.additionalInfoApplicationForm
      .get('address')
      ?.get('addressCalls')
      ?.setValue(calls);
  }

  onGradeAverageInput() {
    const gradeAverageControl = this.additionalInfoApplicationForm
      .get('universityInformation')
      ?.get('gradeAverage');

    if (gradeAverageControl) {
      const value = gradeAverageControl.value;

      if (value && value.toString().length > 3) {
        const decimalPattern = /^\d{1,3}(\.\d{1,2})?$/;
        if (!decimalPattern.test(value.toString())) {
          gradeAverageControl.setValue(0);
        }
      }
    }
  }

  receiveFile(event: any) {
    this.file = event;
    switch (this.file.documentType) {
      case 'Matric Certificate':
        this.additionalInfoApplicationForm
          .get('documentation.matric')
          ?.setValue(this.file);
        break;

      case 'Academic Record':
        this.additionalInfoApplicationForm
          .get('documentation.academicRecord')
          ?.setValue(this.file);
        break;

      case 'Proof Of Identification':
        this.additionalInfoApplicationForm
          .get('documentation.proofOfIdentification')
          ?.setValue(this.file);
        break;

      case 'Financial Statement':
        this.additionalInfoApplicationForm
          .get('documentation.financialStatement')
          ?.setValue(this.file);
        break;
      case 'contract':
        this.additionalInfoApplicationForm
          .get('bursaryInformation.contract')
          ?.setValue(this.file);
          break;
      case 'invoice':
        this.additionalInfoApplicationForm
          .get('bursaryInformation.invoice')
          ?.setValue(this.file);
          break;
      case 'payment':
        this.additionalInfoApplicationForm
          .get('bursaryInformation.payment')
          ?.setValue(this.file);
          break;
    }
  }
  removeValidatorOnDegree() {
    this.additionalInfoApplicationForm
      .get('universityInformation.degree')
      ?.clearValidators();
  }

  removeValidatorOnOther() {
    this.additionalInfoApplicationForm
      .get('universityInformation.other')
      ?.clearValidators();
  }

  updateDateOfBirth(event: any) {
    const date = new Date(event.value);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    this.additionalInfoApplicationForm
      .get('personalInformation.dateOfBirth')
      ?.setValue(formattedDate);
  }

  addValidator(event: any): void {
    if (event.value === 'Other') {
      this.additionalInfoApplicationForm
        .get('personalInformation.other')
        ?.setValidators([Validators.required]);
      this.additionalInfoApplicationForm
        .get('personalInformation.other')
        ?.updateValueAndValidity();
    } else {
      this.additionalInfoApplicationForm
        .get('personalInformation.other')
        ?.clearValidators();
      this.additionalInfoApplicationForm
        .get('personalInformation.other')
        ?.updateValueAndValidity();
    }
  }

  setSelectedDegree(event: MatSelectChange): void {
    const yearOfStudy = event.value;
    yearOfStudy ? (this.chosenDegree = yearOfStudy) : '';
    const yearOfStudyControl: FormControl = this.additionalInfoApplicationForm.get('universityInformation')?.get('yearOfStudy') as FormControl;
    const degreeDuration: number = parseInt(this.additionalInfoApplicationForm.get('universityInformation')?.get('degreeDuration')?.value)

    if (
      this.chosenDegree === Degrees.HONORS ||
      this.chosenDegree === Degrees.DOCTORATE ||
      this.chosenDegree === Degrees.MASTERS
    ) {
      this.confirmHonors = true;
    } else {
      this.confirmHonors = false;
    }

    this.validateYearOfStudyAndDegreeDuration({
      formControlValue: degreeDuration,
      formControl: yearOfStudyControl,
      selectionChange: event
    })
  }

  get addressLine1Control(): FormControl {
    const control = this.additionalInfoApplicationForm.get(
      'address.addressLine1',
    );
    if (control instanceof FormControl) {
      return control;
    }
    return new FormControl();
  }

  onDegreeDurationSelection(selectionEvent: MatSelectChange): void {
    const yearOfStudy: number = parseInt(this.getFormControl('universityInformation.yearOfStudy', this.additionalInfoApplicationForm)?.value);
    const durationControl: FormControl = this.getFormControl('universityInformation.degreeDuration', this.additionalInfoApplicationForm) as FormControl;

    this.validateYearOfStudyAndDegreeDuration({
      formControlValue: yearOfStudy,
      formControl: durationControl,
      selectionChange: selectionEvent
    })
  }

  validateYearOfStudyAndDegreeDuration(validationValues: ValidationValues): void {

    if(!isNaN(validationValues.formControlValue) && validationValues.formControl && validationValues.selectionChange.value) {
      switch (validationValues.selectionChange.source.ngControl.name) {
        case 'degreeDuration':
          if(validationValues.selectionChange.value < validationValues.formControlValue) validationValues.formControl.setErrors({ 
            'invalidDuration': true
          });
          if(this.getFormControl('universityInformation.yearOfStudy', this.additionalInfoApplicationForm).hasError('invalidYearOfStudy')) this.getFormControl('universityInformation.yearOfStudy', this.additionalInfoApplicationForm).setErrors(null);
          break;
        case 'yearOfStudy':
          if(validationValues.formControlValue < validationValues.selectionChange.value) validationValues.formControl.setErrors({ 
            'invalidYearOfStudy': true
          });
          if(this.getFormControl('universityInformation.degreeDuration', this.additionalInfoApplicationForm).hasError('invalidDuration')) this.getFormControl('universityInformation.degreeDuration', this.additionalInfoApplicationForm).setErrors(null);
          break
      }
    } else {
      if (validationValues.formControl) validationValues.formControl.setErrors(null);
    }
  }

  getFormControl(formControlName: string, form: FormGroup): FormControl {
    const formControl: FormControl = form.get(formControlName) as FormControl;
    return formControl
  }
}