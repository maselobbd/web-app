import { Component, OnInit } from '@angular/core';
import { UserStore } from '../../../shared/data-access/stores/user.store';
import { UniversityStudentDetails } from '../../../university-dashboard/data-access/models/student-details-model';
import { StudentUser } from '../../../shared/data-access/models/studentUser.model';
import { Store } from '@ngrx/store';
import { selectStudentPortalData } from '../../../states/student-portal/student-portal.selectors';
import { studentPortalData } from '../../../states/student-portal/student-portal.actions';

@Component({
  selector: 'app-student-personal-details',
  templateUrl: './student-personal-details.component.html',
  styleUrl: './student-personal-details.component.scss'
})
export class StudentPersonalDetailsComponent implements OnInit  {
 student!: UniversityStudentDetails;
  studentLoginDetails!: StudentUser;
  user!: any;
  applicationGuid: string = '';
  isLoading: boolean = true;

  constructor(
    private userStore: UserStore, 
    private store: Store
  ) {
    this.userStore.get().subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit(): void {
     this.store.select(selectStudentPortalData).subscribe((studentDetails) => {
            this.student = studentDetails!;
          });
  }

  triggerStateUpdate(event: boolean): void {
    if (event) {
      this.store.dispatch(studentPortalData({studentData:{department:this.user.department,faculty:this.user.faculty,emailAddress:this.user.email,university:this.user.university} as StudentUser}));
    }
  }
}
