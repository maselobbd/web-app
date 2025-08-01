import { Component, inject } from '@angular/core';
import { UniversityStudentDetails } from '../../data-access/models/student-details-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { Years } from '../../../admin/data-access/models/years-model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogTitles } from '../../../shared/enums/dialog-titles';
import { ButtonAction } from '../../../shared/enums/buttonAction';

@Component({
  selector: 'app-edit-student-details',
  templateUrl: './edit-student-details.component.html',
  styleUrls: ['./edit-student-details.component.scss', '../../../shared/utils/styling/footer.scss'],
})
export class EditStudentDetailsComponent {
  student!: UniversityStudentDetails;
  readonly DialogTitles = DialogTitles;
  readonly ButtonAction = ButtonAction;
  applicationGuid: string = '';
  status: string = '';
  years: Years[] = [];
  applicationForm!: FormGroup;
  noUniversitiesMessage: string = '';
  Year: any;
  studentForm: any;

  data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<EditStudentDetailsComponent>);

  constructor(
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.getStudentPendingDetails();
    this.getYears();
  }

  getStudentPendingDetails(): void {
        if (!!this.data) {
          this.student = this.data.student;
          this.applicationForm = this.fb.group({
            name: [this.student.name, [Validators.required, Validators.pattern('[^0-9]*')]],
            surname: [this.student.surname, [Validators.required, Validators.pattern('[^0-9]*')]],
            email: [this.student.email],
            contactNumber: [this.student.contactNumber, [Validators.pattern('^(0[0-9]{9}|[1-9][0-9]{8})$')]],
            yearOfFunding: [this.student.yearOfFunding],
            university: [this.student.university],
            degree: [this.student.degree],
            faculty: [this.student.faculty],
            yearOfStudy: [!!this.student.yearOfStudy ? this.student.yearOfStudy.toString().trim() : this.student.yearOfStudy],
            degreeDuration: [this.student.degreeDuration],
            honors: [this.student.confirmHonors],
          });
        } else {
          this.snackbar.open('Something went wrong, please try again', '', {
            duration: 3000,
          });
        };
  }

  getYears(): void {
    if (!!this.data.years) {
      this.years = this.data.years;
    }
  }
  onYearChange(year: any) {
    const applicationData = this.applicationForm.value;
    applicationData.yearOfFunding = year;
  }

  updateApplication() {
    const currentValue = this.applicationForm.getRawValue();
    if (this.applicationForm.valid) {
      this.dialogRef.close(currentValue);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
