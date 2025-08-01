import { Component, Input, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy, ViewEncapsulation } from '@angular/core'; // Keep AfterViewInit, ChangeDetectorRef might not be needed now
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HodAccountsService } from '../../data-access/services/hod-accounts.service';
import { ButtonAction } from '../../../shared/enums/buttonAction';
import { applicationService } from '../../../application/data-access/services/application.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarMessage } from '../../../shared/enums/snackBarMessage';
import { SnackBarDuration } from '../../../shared/enums/snackBarDuration';
import { reloadComponent } from '../../../shared/utils/functions/reloadComponent';
import { Router } from '@angular/router';
import { UniversityData } from '../../../shared/data-access/models/universityProfiles.model';
import { phoneNumberValidator, ValidateId } from '../../../application/utils/validators';
import { IResponse } from '../../../shared/data-access/models/response.models';
import { StudentService } from '../../../student/services/student.service';
import { UniversitiesService } from '../../data-access/services/universities.service';
import { CacheService } from '../../../shared/data-access/services/cache.service';

@Component({
  selector: 'app-onboad-student',
  templateUrl: './onboard-student.component.html',
  styleUrls: ['./onboard-student.component.scss'],
})
export class OnboadStudentComponent implements OnInit {
  @Input() isRenewal: boolean = false;

  departmentsUni!: UniversityData[];
  applicationForm!: FormGroup;

  additionalInfoApplicationForm: any;
  buttonAction = ButtonAction;
  degreeList: string[] = [];
  genders: string[] = [];
  titles: string[] = [];
  races: string[] = [];
  universities: string[] = [];
  faculties: string[] = [];
  departments:Set<string> = new Set();
  bursaryTiers: number[] = [1, 2, 3];


  constructor(
    private fb: FormBuilder,
    private accountService: HodAccountsService,
    private service: applicationService,
    private snackBar: MatSnackBar,
    private router: Router,
    private applicationService: applicationService,
    private studentService: StudentService,
    private universityService: UniversitiesService,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    this.additionalInfoApplicationForm = this.fb.group({
      applicationConfirmationCheckbox: this.fb.group({
        checkbox: [''],
      }),
    personalInformation : this.fb.group({
      applicationGuid: [''],
      applicationId: [{ value: '', disabled: true }],
      studentId: [{ value: '', disabled: true }],
      title: ['', [Validators.required, Validators.pattern('[^0-9]*')]],
      other: ['', Validators.pattern('[^0-9]*')],
      firstName: [
        { value: ''},
        [Validators.required, Validators.pattern('[^0-9]*')],
      ],
      lastName: [
        { value: '' },
        [Validators.required, Validators.pattern('[^0-9]*')],
      ],
      idNumber: ['', [Validators.required, ValidateId]],
      citizenShipControl: [null, Validators.required],
      passportNumber: [{value:'',disabled: true}],
      dateOfBirth: [{value:'',disabled: true} ],
      race: ['', Validators.required],
      gender: ['', Validators.required],
    }),
      contactNumber: this.fb.group({
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

      address: this.fb.group({
        addressLine1: ['', Validators.required],
        complexFlat: [''],
        suburbDistrict: ['', Validators.required],
        cityTown: ['', Validators.required],
        postalCode: ['', [Validators.required, Validators.maxLength(4)]],
        addressCalls: [0],
      }),
      universityInformation: this.fb.group({
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
        yearOfStudy: [''],
        faculty: [
          {
            value: 'N/A',
            disabled: true,
          },
        ],
        degreeDuration: [''],
        confirmHonors: [''],
      }),

      termsAndConditionsPrivacyPolicy: this.fb.group({
        termsAndConditionsCheckbox: [''],
        privacyPolicyCheckbox: [''],
      }),
      documentation: this.fb.group({
        matric: [''],
        academicRecord: [''],
        proofOfIdentification: ['', Validators.required],
        financialStatement: [''],

      }),
      bursaryInformation : this.fb.group({
        bursaryType: [{value:'BBD', disabled: true}, [Validators.required]],
        bursaryTier: ['', Validators.required],
        amount: ['', Validators.required],
        payment: [''],
        invoice: [''],
        contract: ['', Validators.required],
        email: ['', Validators.required],
        department: ['', Validators.required],
        faculty: ['', Validators.required],
        university: ['', Validators.required],
      })
    });
    this.additionalInfoApplicationForm
    .get('personalInformation.firstName')
    .setValue('');
  this.additionalInfoApplicationForm
    .get('personalInformation.lastName')
    .setValue('');
    this.getUniversityDepartments();
    this.universityService.getUniversities().subscribe((data) => {
      if (data.results) {
      this.universities = data.results.map((university) => university.universityName);
      }
    })
    this.getDegrees();
    this.getTitles();
    this.accountService.getFaculties().subscribe((data) => {
      if (data.results) {
        this.faculties = data.results.map((faculty) => faculty.facultyName);
      }
    })
    this.studentService.getRaces().subscribe((data) => {
      if (data.results) {
        this.races = data.results;
      }
    });

    this.studentService.getGenders().subscribe((data) => {
      if (data.results) {
        this.genders = data.results;
      }
    });
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
  getTitles(): void {
    this.studentService.getTitles().subscribe((data) => {
      if (data.results) {
        this.titles = data.results;
      } else if (data.errors) {
          this.snackBar.open(
            SnackBarMessage.FAILURE,
            "", {
              duration: SnackBarDuration.DURATION,
        })
      }
    });
  }

  getFormGroup(control: any): FormGroup {
    return control as FormGroup;
  }

  getUniversityDepartments() {
    this.accountService.getDepartments().subscribe((data) => {
      if (data.errors) return;
      this.departments =new Set(data.results.map((department:{universityDepartmentName:string}) => department.universityDepartmentName));
    });
  }

  submit() {
    let availableDepartments= new Set();
    const phoneNumberControl = this.additionalInfoApplicationForm.get('contactNumber.phoneNumber');
    const phoneNumberValue = phoneNumberControl?.value;
    if (phoneNumberValue) {
      const strippedPhoneNumber = phoneNumberValue.replaceAll(' ', '');
      phoneNumberControl?.setValue(strippedPhoneNumber);
    }
    
    let department = this.additionalInfoApplicationForm.get('bursaryInformation').get('department').value
    let university = this.additionalInfoApplicationForm.get('bursaryInformation').get('university').value
    let faculty = this.additionalInfoApplicationForm.get('bursaryInformation').get('faculty').value;
    this.accountService.getDepartments(university,faculty).subscribe((data) => {
      if(data.errors) return;
      availableDepartments=new Set(data.results.map((department:{universityDepartmentName:string}) => department.universityDepartmentName));
      if(!availableDepartments.has(department)){
        this.snackBar.open(
          SnackBarMessage.INVALID_DEPARTMENT,
          SnackBarMessage.CLOSE,
          { duration: SnackBarDuration.DURATION });
          return
      }else{
        this.service.onboard(this.additionalInfoApplicationForm?.getRawValue()).subscribe((response) => {
          if (!response.errors) {
            this.snackBar.open(
                SnackBarMessage.SUCCESS,
                SnackBarMessage.CLOSE,
                { duration: SnackBarDuration.DURATION });
                reloadComponent(true,this.router)
              }else{
                this.snackBar.open(
                  SnackBarMessage.FAILURE,
                  SnackBarMessage.CLOSE,
                  { duration: SnackBarDuration.DURATION });
              }
          });
      }
    })
  }
    get allDataAvailable(): boolean {
    const formInitialized = !!this.additionalInfoApplicationForm;

    const universitiesAvailable = !!this.universities && this.universities.length > 0;
    const facultiesAvailable = !!this.faculties && this.faculties.length > 0;
    const departmentsAvailable = !!this.departments && this.departments.size > 0;
    const degreeListAvailable = !!this.degreeList && this.degreeList.length > 0;
    const gendersAvailable = !!this.genders && this.genders.length > 0;
    const titlesAvailable = !!this.titles && this.titles.length > 0;
    const racesAvailable = !!this.races && this.races.length > 0;
    const bursaryTiersAvailable = !!this.bursaryTiers && this.bursaryTiers.length > 0;

    return formInitialized &&
          universitiesAvailable &&
          facultiesAvailable &&
          departmentsAvailable &&
          degreeListAvailable &&
          gendersAvailable &&
          titlesAvailable &&
          racesAvailable &&
          bursaryTiersAvailable;
  }
}