import {
  Component,
  ChangeDetectorRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { applicationService } from '../../data-access/services/application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Application } from '../../data-access/models/application.model';
import { AllocationUsageService } from '../../../shared/data-access/services/allocation-usage.service';
import { DataService } from '../../../shared/data-access/services/data.service';
import { UserStore } from '../../../shared/data-access/stores/user.store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { generatestamp } from '../../../shared/utils/functions/simple-hash';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationDialogComponent } from '../../../shared/ui/application-dialog/application-dialog.component';
import { DialogMessage } from '../../../shared/enums/dialogMessages';
import { ApplicationDialogButtons } from '../../../admin/enums/applicationDialogButtons';
import { AdditionaInfoMessageType } from '../../../shared/enums/messages';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ApplicationInsightsService } from '../../../shared/data-access/services/application-insights.service';
import { RouteNames } from '../../../shared/enums/routeNames';
import { reloadComponent } from '../../../shared/utils/functions/reloadComponent';
import { DialogTitles } from '../../../shared/enums/dialog-titles';
import { ButtonAction } from '../../../shared/enums/buttonAction';
import { ErrorMessages } from '../../enums/messages';
import { StepperComponent } from "../../../shared/ui/stepper/stepper.component";
import { StepperContext } from "../../../shared/enums/stepperEnum";

@Component({
  selector: 'app-application-form-layout',
  templateUrl: './application-form-layout.component.html',
  styleUrls: [
    '../../../shared/utils/styling/forms.scss',
    './application-form-layout.component.scss',
    '../../../shared/utils/styling/footer.scss',
  ],
})
export class ApplicationFormLayoutComponent implements OnInit, AfterViewInit {
  constructor(
    private service: applicationService,
    private router: Router,
    private allocationUsageService: AllocationUsageService,
    private sharedataService: DataService,
    private userStore: UserStore,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private applicationInsightsService: ApplicationInsightsService,
  ) {
    this.allocationModel = {};
  }
  applicationsForm!: FormGroup;
  year!: number;
  isRenewal: boolean = false;
  applications: Application[]  =[
    {
      id: 1,
      name: '',
      surname: '',
      email: '',
      university: '',
      amount: 0,
      yearOfFunding: this.year,
      complete: false,
      applicationId: -1,
      faculty: '',
      department: '',
      race: 'Black',
      degreeName: '',
      gender: 'Prefer not to say',
      gradeAverage: 0.0,
      title: '',
      motivation: '',
      isRenewal:this.isRenewal,
      yearOfStudy: '',
      confirmHonors: '',
    },
  ];

  currentYear: string = '';
  displayIncompleteApplicationsError: boolean = false;
  allocationModel: any;
  totalRequested!: number;
  requestedAmount!: number;
  faculty: string = '';
  university: string = '';
  department: string = '';
  enableYearSelection = true;
  allocationMin = 0;
  allocationMax = 0;
  remainingAmount!:number;
  noFundsMessage : string = AdditionaInfoMessageType.No_FUNDS_MESSAGE;
  renewalIsChecked: boolean = false;
  formTitle : typeof DialogTitles = DialogTitles;
  buttonAction: typeof ButtonAction = ButtonAction;
  formMessages: typeof AdditionaInfoMessageType = AdditionaInfoMessageType
  errorMessages:typeof ErrorMessages = ErrorMessages;
  yearOfStudy:FormGroup = new FormGroup({
    year: new FormControl('',[Validators.required]),
  });

  @ViewChild('stepperRef') stepper!: StepperComponent;
  step2Completed = false;
  error!: string;

  ngOnInit(): void {
    this.userStore.get().subscribe((user) => {
      if (user && user.university) {
        this.faculty = user.faculty;
        this.department = user.department;
        this.university = user.university;
      }
    });
    this.isRenewal=this.router.url.split("/").includes("renew");
    this.mapApplications()
    this.applicationsForm.valueChanges.subscribe(() => {
      this.step2Completed = this.isFormFilled();
    })

    this.isValidDepartment();
    this.applicationInsightsService.logPageView(RouteNames.HOD_APPLICATIONS, this.router.url);
  }
  mapApplications(){
    this.applicationsForm = this.fb.group({
      applications: this.fb.array(this.applications.map((application) => this.createApplicationForm(application)))
    });
  }
  createApplicationForm(application: any): FormGroup {
    return this.fb.group({
      id: new FormControl(application.id,),
      name: new FormControl(application.name, [RxwebValidators.required({conditionalExpression: () => this.isRenewal === false}),
              Validators.minLength(2),
              Validators.maxLength(50),
              Validators.pattern(/^[a-zA-Z\s'-]*$/),]),
      surname: new FormControl(application.surname,
        [RxwebValidators.required({conditionalExpression: () => this.isRenewal === false}),
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s'-]*$/)],
      ),
      email: new FormControl(application.email,[ RxwebValidators.required({conditionalExpression: () => this.isRenewal === false}),
              Validators.email,
              RxwebValidators.unique()
              ,]),
      university: new FormControl(this.university),
      amount: new FormControl(application.amount,[RxwebValidators.required({conditionalExpression: () => this.stepper.selectedIndex === 2})]),
      yearOfFunding: new FormControl(this.yearOfStudy.get('year')?.value ),
      complete: new FormControl(application.complete),
      applicationId: new FormControl(application.applicationId),
      faculty: new FormControl(this.faculty),
      department: new FormControl(this.department),
      race: new FormControl(application.race),
      degreeName: new FormControl(application.degreeName),
      gender: new FormControl(application.gender),
      gradeAverage: new FormControl(application.gradeAverage),
      title: new FormControl(application.title),
      motivation: new FormControl(application.motivation,RxwebValidators.required({conditionalExpression: () => this.isRenewal === false})),
      isRenewal: new FormControl(this.isRenewal),
      yearOfStudy: new FormControl(null, RxwebValidators.required({conditionalExpression: () => this.isRenewal === true})),
      confirmHonors: new FormControl(application.confirmHonors),
      prevYearOfStudy: new FormControl(application.yearOfStudy),
      confirmSelection: new FormControl(null, RxwebValidators.required({conditionalExpression: () => this.isRenewal === true && this.stepper.selectedIndex === 1})),
      bursaryType:"Ukukhula",
      bursaryTier: 4
    });
  }

  enableContinue(event:any){
    let removeValidators = !(this.applicationsForm.get('applications') as FormArray).controls.some((control: AbstractControl) => {
      const group = control as FormGroup;

      const confirmSelectionControl = group.get('confirmSelection');
      const yearOfStudyControl = group.get('yearOfStudy');

      if(confirmSelectionControl?.getRawValue() ===false && this.applicationsForm.get('applications')?.valid )
      {
        return true
      }

      const confirmSelectionValid = confirmSelectionControl?.valid && confirmSelectionControl?.getRawValue() === true;

      const yearOfStudyPresent = yearOfStudyControl?.value !== null && yearOfStudyControl?.value !== undefined;

      if (confirmSelectionValid && !yearOfStudyControl?.valid) {
        return true;
      }
      if (yearOfStudyPresent && (!confirmSelectionValid || !confirmSelectionControl?.valid)) {
        return true;
      }

      return false;
    });

    (this.applicationsForm.get('applications') as FormArray).controls.forEach((control: AbstractControl) => {
      const group = control as FormGroup;
      if(removeValidators && event)
      {
        group.get('confirmSelection')?.setValidators([]);
        group.get('confirmSelection')?.updateValueAndValidity();
        group.get('yearOfStudy')?.setValidators([]);
        group.get('yearOfStudy')?.updateValueAndValidity();
      }else{
        group.get('confirmSelection')?.setValidators([Validators.required]);
        group.get('confirmSelection')?.updateValueAndValidity();
        group.get('yearOfStudy')?.setValidators([Validators.required]);
        group.get('yearOfStudy')?.updateValueAndValidity();
      }
      group.updateValueAndValidity();
    });
    this.applicationsForm.updateValueAndValidity();
  }

  get applicationsFormArray(): FormArray {
    const applicationsFormArray = this.applicationsForm.get('applications') as FormArray;

    const validApplications = applicationsFormArray.controls.filter(applicationGroup =>
      applicationGroup.get('yearOfStudy')?.getRawValue()!==null && applicationGroup.get('confirmSelection')?.getRawValue() ===true
    );
    let returnedAray = this.isRenewal? new FormArray(validApplications): applicationsFormArray;
    return returnedAray;
  }

  yearSelected(fundingYear: number) {
    this.yearOfStudy.get('year')?.setValue(fundingYear);
    this.year = fundingYear;
    this.currentYear = fundingYear.toString();
   this.applicationsFormArray.controls.forEach((control) => {
      control.get('department')?.setValue(this.department);
      control.get('faculty')?.setValue(this.faculty);
      control.get('yearOfFunding')?.setValue(fundingYear);
   })
    this.getAllocations();
  }
  getFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }
  getFormArray(control: AbstractControl): FormArray {
    return control as FormArray;
  }

  saveForLater() {
      this.applicationsFormArray.controls.forEach((control) => {
        control.get('complete')?.setValue(false);
      })
      this.service.postApplication(this.applicationsForm.get('applications')?.getRawValue()).subscribe((response) => {
        if (response.results && response.results[0]) {
          const snackBarRef = this.snackBar.open(
            'Application saved successfully!',
            'Dismiss',
            {
              duration: 3000,
              panelClass: ['success-snackbar'],
            },
          );

          snackBarRef.afterDismissed().subscribe(() => {
            reloadComponent(true,this.router);
          });
        } else {
          this.snackBar.open(
            'Error saving application. Please try again.',
            'Dismiss',
            {
              duration: 3000,
              panelClass: ['error-snackbar'],
            },
          );
        }
      });
  }
  isValidDepartment() {
    this.allocationUsageService
      .checkDepartment(this.department, this.faculty, this.university)
      .subscribe((response) => {
        if (response.results) {
          this.enableYearSelection = response.results;
        } else {
          this.enableYearSelection = false;
        }
      });
  }
  getApplications() {
    this.service.getApplications(this.isRenewal)?.subscribe((response) => {
      if (response.results?.length! > 0) {
        this.applications = [];
        response.results?.forEach((application, index) => {
          application.id = index + 1;
          application.complete = false;
          this.applications.push(application);
        });

        if(!this.isRenewal)
          {
            this.yearSelected(this.applications[0].yearOfFunding);
            this.stepper.next();
          }
        this.mapApplications();
        if(this.isRenewal)
          return;
        const dialogRef = this.dialog.open(ApplicationDialogComponent, {
          width: '40rem',
          data: {
            title: DialogMessage.TITLE,
            message: DialogMessage.NEW_APPLICATION_MESSAGE,
            buttonText: {
              continue: ApplicationDialogButtons.CONTINUE,
              start: ApplicationDialogButtons.START_NEW,
            },
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result === 'continue') {
            if(this.applications.every((app)=>app.amount>0))
              {
                this.stepper.next();
              }
            this.dialog.closeAll();
          } else if (result === 'start') {
            const idsToDelete = this.applicationsFormArray.controls.map((control) => control.get('id')?.getRawValue());
            for (let i = idsToDelete.length - 1; i >= 0; i--) {
              this.deleteForm(idsToDelete[i]);
            }
            this.reloadCurrentRoute();
          } else {
            this.router.navigate(['/']);
          }
        });
      }else if(this.isRenewal){
        this.enableYearSelection = false;
      }
    });
  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  ngAfterViewInit() {
    this.getApplications();
  }
  addApplicantForm() {
    const newApplicant={
      id: this.applicationsFormArray.length + 1,
      name: '',
      surname: '',
      email: '',
      university: this.university,
      amount: 0,
      complete: false,
      yearOfFunding: this.year,
      applicationId: 0,
      faculty: this.faculty,
      department: this.department,
      race: 'Black',
      degreeName: '',
      gender: 'Prefer not to say',
      gradeAverage: 0.0,
      title: '',
      motivation: '',
    };
    this.applicationsFormArray.push(
      this.createApplicationForm(newApplicant)
    )
  }
  checkExistingApplication() {
    this.service.checkExistingStatus(this.applications).subscribe((data) => {
      if (data && data.results) {
        data.results.forEach((result: any) => {
          const application = this.applications.find(
            (app) => app.id === result.id,
          );
          if (application) {
            Object.assign(application, result);
          }
        });
      }
    });
  }
  deleteForm(id: number) {
      const indexToRemove = this.applicationsFormArray.controls.findIndex(
        (control: AbstractControl) => control.get('id')?.getRawValue() === id
      );

      if (indexToRemove !== -1) {
        const formGroup = this.applicationsFormArray.at(indexToRemove);

        this.applicationsFormArray.removeAt(indexToRemove);

        if (formGroup) {
          const applicationIdControl = formGroup.get('applicationId');

          if (applicationIdControl) {
            const applicationId = applicationIdControl.getRawValue();
            if (applicationId > 0) {
              this.deleteApplicantOnDatabase(applicationId);
            }
          }
        }
      }
  }
  deleteApplicantOnDatabase(applicationId: number) {
    this.service.deleteApplication(applicationId).subscribe((response) => {
      if (response.results) {
        this.snackBar.open('Application deleted', 'Dismiss', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      } else {
        this.snackBar.open(
          'Error deleting application. Please try again.',
          'Dismiss',
          {
            duration: 3000,
            panelClass: ['error-snackbar'],
          },
        );
      }
    });
  }

  getAllocations(): void {
    this.allocationUsageService
      .getAllocationsForDepartment(
        this.university,
        this.department,
        this.faculty,
        this.year?.toString(),
      )
      .subscribe((data) => {
        if (data.results) {
          this.allocationModel = data.results;
          this.totalRequested = this.allocationModel.requestedAmount;
          this.requestedAmount = this.allocationModel.requestedAmount;
          this.allocationMin = this.allocationModel.minimumPerStudent;
          this.allocationMax = this.allocationModel.maximumPerStudent;
          this.sharedataService.sendAllocationUsageData([
            this.allocationModel,
            this.totalRequested || 0,
            this.requestedAmount || 0,
          ]);
          this.remainingAmount = this.allocationModel.totalAllocation - (this.requestedAmount  + this.allocationModel.approvedAmount)
          this.applicationsFormArray.controls.forEach((control) => {
            control.get('amount')?.addValidators([
              RxwebValidators.minNumber({value: this.allocationMin, conditionalExpression: () => this.stepper.selectedIndex === 2}),RxwebValidators.maxNumber({value: this.allocationMax, conditionalExpression: () => this.stepper.selectedIndex === 2})
            ])
          })
        } else if (data.errors) {
          this.error = 'An error has occurred. Please contact BBD.';
        }
      });
  }

  submit() {
    this.applicationsFormArray.controls.forEach((control) => {
      control.get('complete')?.setValue(true);
   })
    this.service.postApplication(this.applicationsFormArray?.getRawValue()).subscribe((response) => {
      if (response.results && response.results[0]) {
        let stamp = generatestamp();
        this.sharedataService.newApplicationData(true);
        this.isRenewal ? this.router.navigateByUrl(`application/success/renewal/${stamp}`): this.router.navigateByUrl(`application/success/${stamp}`);
      }
    });
  }
  isFormFilled():boolean {
   if(this.isRenewal)
   {
    return this.applicationsFormArray.controls.some((control:AbstractControl)=>
    {
      const group = control as FormGroup
      return group.get('confirmSelection')?.getRawValue()===true && group.get('yearOfStudy')?.getRawValue()!=null;
    })
   }else{
     return this.applicationsFormArray.controls.every((control) => control.get('name')?.valid && control.get("surname")?.valid&&control.get("email")?.valid&&control.get("motivation")?.getRawValue()!="")
   }
  }
  amountExceeded(event: boolean){
    this.applicationsFormArray.setErrors({valid: event})
  }

  protected readonly StepperComponent = StepperComponent;
  protected readonly StepperContext = StepperContext;
}
