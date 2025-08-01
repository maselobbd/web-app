import { Component, OnInit } from '@angular/core';
import { UserStore } from '../../data-access/stores/user.store';
import { Roles } from '../../../authentication/data-access/models/auth.model';
import { UniversityStudentDetails } from '../../../university-dashboard/data-access/models/student-details-model';
import { StudentUser } from '../../data-access/models/studentUser.model';
import { URLS } from '../../../student/enums/legalRoutes';
import { Store } from '@ngrx/store';
import { selectStudentPortalData } from '../../../states/student-portal/student-portal.selectors';
@Component({
  selector: 'app-bursary-information',
  templateUrl: './bursary-information.component.html',
  styleUrls: ['./bursary-information.component.scss','../../../university-dashboard/ui/student-details/student-details.component.scss','../../utils/styling/sharedStudentDetails.scss']
})
export class BursaryInformationComponent implements OnInit {
userRole!:Roles
rolesEnum: typeof Roles = Roles;
student!: UniversityStudentDetails;
user!:any
studentLoginDetails!:StudentUser
applicationGuid:string =''
  invoiceStatus: any;
  urls: any = URLS;
  constructor(
    private userStore: UserStore, 
    private store: Store
  ) {
      this.userStore.get().subscribe((user) => {
      this.user = user;
      this.userRole = Roles[user.role as keyof typeof Roles];
    })
  }

  ngOnInit(): void {
      this.store.select(selectStudentPortalData).subscribe((studentDetails) => {
        this.student = studentDetails!;
      });
      this.invoiceStatus = this.setStatus(this.student.invoiceStatus);
  }

  setStatus(status: string) {
    switch (status) {
      case 'Pending':
        return 'Pending invoice';
      case 'Approved':
        return 'Bursary Active';
      case 'In Review':
        return 'Pending payment';
      default:
        return '';
    }
  }
  getGreyTextClass() {
    return {
      'white-small-text': this.userRole === this.rolesEnum.student,
      'grey-text': this.userRole !== this.rolesEnum.student,
    };
  }
  getBlackTextClass() {
    return this.userRole === this.rolesEnum.student ? 'white-text' : 'black-text';
  }

  getContainerClass() {
    return {
      'student-bursaries-info-container row2': this.userRole === this.rolesEnum.student,
      'student-info-more row2': this.userRole !== this.rolesEnum.student,
    };
  }
}
