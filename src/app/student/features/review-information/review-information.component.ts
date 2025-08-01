import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { phoneNumberValidator, ValidateId } from '../../../application/utils/validators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StepperDataService } from '../../services/stepper-data.service';
import { generatestamp } from '../../../shared/utils/functions/simple-hash';
import { DataService } from '../../../shared/data-access/services/data.service';
import { AdditionaInfoMessageType } from '../../../shared/enums/messages';
import { Question } from '../../models/question.model';
import { applicationService } from '../../../application/data-access/services/application.service';
import { IResponse } from '../../../shared/data-access/models/response.models';
import { ApplicationInsightsService } from '../../../shared/data-access/services/application-insights.service';
import { RouteNames } from '../../../shared/enums/routeNames';
import { StepperComponent } from "../../../shared/ui/stepper/stepper.component";
import { StepperContext } from "../../../shared/enums/stepperEnum";

@Component({
  selector: 'app-student',
  templateUrl: './review-information.component.html',
  styleUrls: [
    '../../../shared/utils/styling/forms.scss',
    './review-information.component.scss',
    '../../../shared/utils/styling/footer.scss',
  ],
})
export class ReviewInformationComponent implements OnInit {
  @ViewChild('stepperRef') stepper!: StepperComponent;

  isLinear: any;
  showAdditionalInfo: boolean = false;
  personalInfo!: Student;
  races!: string[];
  genders!: string[];
  additionalInformation: any;
  errors!: any;
  disableContinue!: boolean;
  studentReviewForm: any;
  applicationConfirmationForm: any;
  additionalInfoApplicationForm: any;
  firstName!: string;
  lastName!: string;
  formGroupName!: string;
  invalidStudent: boolean;
  spinnerDone: boolean;
  postExitNumber!: number;
  uploadSubmit: boolean;
  postResults: any;
  previousUrlEvent!: any;
  invalidStudentErrorMessage: string;
  errorMessage: string;
  questions: Question[];
  questionnaireForm!: FormGroup;
  questionnaireFormToPost!: FormGroup;
  back: boolean = false;
  backFile: any;
  degreeList!: string[];
  responsesJson: any = "";
  validBirthDate!: boolean;
  titles: string[] = [];
  allowMapRequests: boolean = false;

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private stepperDataService: StepperDataService,
    private dataService: DataService,
    private applicationService: applicationService,
    private applicationInsights: ApplicationInsightsService
  ) {
    this.personalInfo = {
      studentId: 0,
      firstName: '',
      lastName: '',
      Email: '',
      University: '',
      Faculty: '',
      applicationId: 0,
      applicationStatusHistoryDate: new Date(),
      canRequest:false,
      bursaryType:''
    };
    this.invalidStudent = true;
    this.spinnerDone = false;
    this.uploadSubmit = false;
    this.invalidStudentErrorMessage = AdditionaInfoMessageType.INVALID_STUDENT;
    this.errorMessage = AdditionaInfoMessageType.INCORRECT_INFO;
    this.questions = [];
  }

  isUpdatingValidators = false;
  ngOnInit(): void {
    this.getDegrees();
    this.getQuestions();
    this.getTitles();
    this.questionnaireForm = this.formBuilder.group({
      futureJob: ['', Validators.required],
      outsideFunding: ['', Validators.required],
      outsideFundingResponse: [''],
      itPosition: ['', Validators.required],
      itPositionResponse: [''],
      githubProfile: ['', Validators.required],
      githubProfileResponse: [''],
      extraCourses: ['', Validators.required],
      extraCoursesResponse: [''],
    });
    this.additionalInfoApplicationForm = this.formBuilder.group({
      applicationConfirmationCheckbox: this.formBuilder.group({
        checkbox: ['', Validators.required],
      }),
      personalInformation: this.formBuilder.group({
        applicationGuid: ['', Validators.required],
        applicationId: [
          {
            value: '',
          },
        ],
        studentId: [
          {
            value: '',
          },
        ],
        email: [
          {
            value: '',
          },
        ],
        title: ['', [Validators.required, Validators.pattern('[^0-9]*')]],
        other: ['', Validators.pattern('[^0-9]*')],
        firstName: [
          {
            value: '',
          },
          [Validators.required, Validators.pattern('[^0-9]*')],
        ],

        lastName: [
          {
            value: '',
          },
          [Validators.required, Validators.pattern('[^0-9]*')],
        ],
        idNumber: [
          '',
          [
            Validators.required,
            Validators.minLength(13),
            Validators.maxLength(13),
            ValidateId,
          ],
        ],
        passportNumber: [''],
        dateOfBirth: [''],
        citizenShipControl: ['', Validators.required],
        race: ['', Validators.required],
        gender: ['', Validators.required],
        bursaryType: ['', Validators.required]
      }),

      contactNumber: this.formBuilder.group({
        countryCode: [
          {
            value: '+27',
            disabled: true,
          },
        ],
        phoneNumber: [
          '',
          [
            Validators.required,
            phoneNumberValidator,
          ],
        ],
      }),

      address: this.formBuilder.group({
        addressLine1: ['', Validators.required],
        complexFlat: [''],
        suburbDistrict: ['', Validators.required],
        cityTown: ['', Validators.required],
        postalCode: ['', [
          Validators.required,
          Validators.maxLength(4)
        ]],
        addressCalls:[0]
      }),
      universityInformation: this.formBuilder.group({
        degree: [
          '',
          [
            Validators.required,
            Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9 ]*$'),
          ],
        ],
        other: ['', Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9 ]*$')],
        gradeAverage: [
          null,
          [
            Validators.required,
            Validators.min(50),
            Validators.max(100),
            Validators.pattern('^(?!0)\\d{1,3}(\\.\\d{1,2})?$'),
          ],
        ],
        yearOfStudy: ['', Validators.required],
        faculty: [
          {
            value: '',
            disabled: true,
          },
        ],
        degreeDuration: ['', Validators.required],
        confirmHonors: ['', Validators.required]
      }),

      termsAndConditionsPrivacyPolicy: this.formBuilder.group({
        termsAndConditionsCheckbox: ['', Validators.required],
        privacyPolicyCheckbox: ['', Validators.required],
      }),
      documentation: this.formBuilder.group({
        matric: ['', Validators.required],
        academicRecord: ['', Validators.required],
        proofOfIdentification: ['', Validators.required],
        financialStatement: ['', Validators.required],
      }),
    });

    this.studentService
      .getStudentByGuid(
        this.route.snapshot.paramMap.get('applicationGuid') ?? '',
      )
      .subscribe((data) => {
        if (data.results) {
          this.personalInfo = data.results;
          this.allowMapRequests = this.personalInfo.canRequest

          this.invalidStudent =
            !this.personalInfo.Email &&
            !this.personalInfo.Faculty &&
            !this.personalInfo.University &&
            !this.personalInfo.applicationId &&
            !this.personalInfo.firstName &&
            !this.personalInfo.lastName &&
            !this.personalInfo.studentId;
          this.firstName = this.personalInfo.firstName.trim();
          this.lastName = this.personalInfo.lastName.trim();
          if (this.firstName && this.lastName) {
            this.additionalInfoApplicationForm
              .get('personalInformation.applicationGuid')
              .setValue(this.route.snapshot.paramMap.get('applicationGuid'))
            this.additionalInfoApplicationForm
              .get('personalInformation.firstName')
              .setValue(this.firstName);
            this.additionalInfoApplicationForm
              .get('personalInformation.lastName')
              .setValue(this.lastName);
            this.additionalInfoApplicationForm
              .get('personalInformation.applicationId')
              .setValue(this.personalInfo.applicationId);
            this.additionalInfoApplicationForm
              .get('personalInformation.studentId')
              .setValue(this.personalInfo.studentId);
            this.additionalInfoApplicationForm
              .get('universityInformation.faculty')
              .setValue(this.personalInfo.Faculty);
            this.additionalInfoApplicationForm
              .get('personalInformation.email')
              .setValue(this.personalInfo.Email);
              this.additionalInfoApplicationForm
              .get('personalInformation.bursaryType')
              .setValue(this.personalInfo.bursaryType);

          }
          this.dataService.sendMicrosoftFormData(
            this.personalInfo.firstName + ' ' + this.personalInfo.lastName,
            this.personalInfo.Email,
          );

        } else {
          this.spinnerDone = true;
        }
      });

    this.studentService.getRaces().subscribe((data) => {
      if (data.results) {
        this.races = data.results;
      } else {
        this.errors = 'Please login and try again';
      }
    });

    this.studentService.getGenders().subscribe((data) => {
      if (data.results) {
        this.genders = data.results;
      } else {
      }
    });

    this.applicationConfirmationForm = this.formBuilder.group({
      confirmationCheckBox: this.formBuilder.group({
        checkbox: ['', Validators.required],
      }),
    });

    this.onDegreeChange();
    this.setupCitizenshipChangeHandler();

    this.dataService.validBirthDate$.subscribe(
      data => {
        if(data) {
          this.validBirthDate = data;
        }
      }
    )
    this.applicationInsights.logPageView(RouteNames.STUDENT_FORM, this.router.url);
  }

  setupCitizenshipChangeHandler() {
    const port = this.additionalInfoApplicationForm.get(
      'personalInformation.passportNumber',
    );
    const dateOfBirth = this.additionalInfoApplicationForm.get(
      'personalInformation.dateOfBirth',
    );
    const citizenShipControl = this.additionalInfoApplicationForm.get(
      'personalInformation.citizenShipControl',
    );

    citizenShipControl.valueChanges.subscribe((citizenShipControl: boolean) => {
      if (!citizenShipControl) {
        port.setValidators([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]{6,9}$/),
        ]);
        dateOfBirth.setValidators([
          Validators.required,
          this.createBirthDateValidator()
        ]);
        this.additionalInfoApplicationForm
          .get('personalInformation.idNumber')
          .clearValidators();
        this.additionalInfoApplicationForm
          .get('personalInformation.idNumber')
          .updateValueAndValidity();
        port.valueChanges.subscribe((passportNumber: string) => {
          this.additionalInfoApplicationForm
            .get('personalInformation.idNumber')
            .setValue(passportNumber, { emitEvent: false });
        });
      } else {
        port.clearValidators();
        dateOfBirth.clearValidators();

        this.additionalInfoApplicationForm
          .get('personalInformation.idNumber')
          .setValidators([
            Validators.required,
            Validators.minLength(13),
            Validators.maxLength(13),
            ValidateId,
          ]);
      }

      port.updateValueAndValidity();
      dateOfBirth.updateValueAndValidity();
      this.additionalInfoApplicationForm
        .get('personalInformation.idNumber')
        .updateValueAndValidity();
    });
  }
  onContinue(): void {
    this.stepper.next();
  }

  onBack(): void {
    this.back = true;
    this.stepper.previous();
  }

  getDegrees() {
    this.applicationService
      .getDegrees()
      .subscribe((response: IResponse<string[]>) => {
        if (response.results) {
          this.degreeList = response.results;
        }
      });
  }

  onClick(): void {
    if (this.applicationConfirmationForm.get('confirmationCheckBox.checkbox')) {
      this.additionalInfoApplicationForm
        .get('applicationConfirmationCheckbox.checkbox')
        .setValue(
          this.applicationConfirmationForm.get('confirmationCheckBox.checkbox')
            .value,
        );
    }
  }
  onDegreeChange(): void {
    const degreeControl = this.additionalInfoApplicationForm.get(
      'universityInformation.degree',
    );
    const otherControl = this.additionalInfoApplicationForm.get(
      'universityInformation.other',
    );

    degreeControl.valueChanges.subscribe((value: string) => {
      if (this.isUpdatingValidators) {
        return;
      }

      this.isUpdatingValidators = true;

      if (value === 'Other') {
        otherControl.setValidators([
          Validators.required,
          Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9 ]*$'),
        ]);
        degreeControl.clearValidators();
      } else {
        otherControl.clearValidators();
        degreeControl.setValidators([Validators.required]);
      }

      otherControl.updateValueAndValidity();
      degreeControl.updateValueAndValidity();

      this.isUpdatingValidators = false;
    });
  }

  onSubmit(): void {
    const phoneNumberControl = this.additionalInfoApplicationForm.get('contactNumber.phoneNumber');
    const phoneNumberValue = phoneNumberControl?.value;

    if (phoneNumberValue) {
      const strippedPhoneNumber = phoneNumberValue.replaceAll(' ', '');
      phoneNumberControl?.setValue(strippedPhoneNumber);
    }

    const otherDegreeValue = this.additionalInfoApplicationForm.get(
      'universityInformation.other',
    )?.value;
    const degreeControl = this.additionalInfoApplicationForm.get(
      'universityInformation.degree',
    );
    if (otherDegreeValue && otherDegreeValue.length > 0) {
      degreeControl?.setValue(otherDegreeValue);
    }
    this.uploadSubmit = true;
    if (this.stepper.selectedIndex === 2) {

      this.questionnaireResponses(this.questionnaireForm);
      this.studentService
        .updateStudentApplication(
          {
            additionalInfoApplicationForm: this.additionalInfoApplicationForm.getRawValue(),
            questionnaireFormToPost: this.questionnaireFormToPost.getRawValue(),
          }
        )
        .subscribe((response) => {
          if (response.results) {
            this.postResults = response.results;
            this.postResults && this.postResults['message'] === 'Application Updated'
              ? this.router.navigate([`reviews/success/${generatestamp()}`])
              : this._snackBar.open(
                  'Failed to submit. Please try again.',
                  'ok',
                  { duration: 3000 },
                );
            this.postResults && this.postResults['message'] === 'Application Updated'
              ? (this.stepperDataService.redirectToStudentSuccess = true)
              : (this.stepperDataService.redirectToStudentSuccess = false);
          } else {
            this.postResults = response.errors;
            this._snackBar.open('Failed to submit. Please try again.', 'ok', {
              duration: 3000,
            });
          }
        });
    }
  }

  questionnaireResponses(questionnaireForm: FormGroup): void {
    if (
      questionnaireForm.getRawValue() &&
      questionnaireForm.valid
    ) {
      this.questionnaireFormToPost
        .get('applicationId')
        ?.setValue(this.personalInfo.applicationId);

      Object.keys(questionnaireForm.getRawValue()).forEach((response) => {
        questionnaireForm.get(response)?.value
          ? ((this.questionnaireFormToPost.get(response)?.value)['response'] =
              questionnaireForm.get(response)?.value.trim())
          : null;
      });
      this.questionnaireFormToPost
        .get('questionnaireStatus')
        ?.setValue('Complete');
    }
  }

  createForm(questionsList: Question[]): void {
    if (questionsList) {
      this.questionnaireFormToPost = this.formBuilder.group({
        applicationId: [''],
        futureJob: [
          {
            questionId: questionsList[0]['questionId'],
            response: '',
          },
        ],
        outsideFunding: [
          {
            questionId: questionsList[1]['questionId'],
            response: '',
          },
        ],
        outsideFundingResponse: [
          {
            questionId: questionsList[2]['questionId'],
            response: '',
          },
        ],
        itPosition: [
          {
            questionId: questionsList[3]['questionId'],
            response: '',
          },
        ],
        itPositionResponse: [
          {
            questionId: questionsList[4]['questionId'],
            response: '',
          },
        ],
        githubProfile: [
          {
            questionId: questionsList[5]['questionId'],
            response: '',
          },
        ],
        githubProfileResponse: [
          {
            questionId: questionsList[6]['questionId'],
            response: '',
          },
        ],
        extraCourses: [
          {
            questionId: questionsList[7]['questionId'],
            response: '',
          },
        ],
        extraCoursesResponse: [
          {
            questionId: questionsList[8]['questionId'],
            response: '',
          },
        ],
        questionnaireStatus: [''],
      });
    }
  }

  getQuestions(): void {
    this.studentService.getQuestions().subscribe((data) => {
      if (data.results) {
        this.questions = data.results;
        this.createForm(this.questions);
      } else if (data.errors) {
        this._snackBar.open(
          'Something went wrong, please try again later',
          'Dismiss',
          {
            duration: 3000,
          },
        );
      }
    });
  }

  createBirthDateValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        const dateValue = new Date().valueOf();
        const valueDate = new Date(value)
        valueDate.setFullYear(valueDate.getFullYear() + 18)

        return !(valueDate.valueOf() <= dateValue) ? {invalidBirthDate:true}: null;
    }
  }

  getTitles(): void {
    this.studentService.getTitles().subscribe(
      data => {
        if(data.results) {
          this.titles = data.results;
        } else if(data.errors) {
          this._snackBar.open(
            "Something went wrong, please try again later.",
            "Dismiss", {
              duration: 3000,
        })
      }
    })
  }

  protected readonly StepperContext = StepperContext;
}
