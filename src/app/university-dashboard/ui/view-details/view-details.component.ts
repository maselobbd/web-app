import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../shared/data-access/services/student.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UniversityStudentDetails } from '../../data-access/models/student-details-model';
import { UserStore } from '../../../shared/data-access/stores/user.store';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationInsightsService } from '../../../shared/data-access/services/application-insights.service';
import { RouteNames } from '../../../shared/enums/routeNames';
import { DialogTitles } from '../../../shared/enums/dialog-titles';
import { DialogMessage } from '../../../shared/enums/dialogMessages';
import { DynamicDialogComponentComponent } from '../../../shared/ui/dynamic-dialog-component/dynamic-dialog-component.component';
import { AdminService } from '../../../admin/data-access/services/admin.service';
import { hasValidResults } from '../../../shared/utils/functions/checkData.function';
import { SnackBarMessage } from '../../../shared/enums/snackBarMessage';
import { SnackBarDuration } from '../../../shared/enums/snackBarDuration';
import {Roles} from "../../../authentication/data-access/models/auth.model";
import { EditStudentDetailsComponent } from '../edit-student-details/edit-student-details.component';
import { applicationService } from '../../../application/data-access/services/application.service';
import { DialogDimensions } from '../../../shared/enums/dialogDimensions';
import { Years } from '../../../admin/data-access/models/years-model';
import { BursaryApplicationsService } from '../../../admin/data-access/services/bursaryApplications.service';
import { reloadComponent } from '../../../shared/utils/functions/reloadComponent';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss', '../../../shared/utils/styling/footer.scss'],
})
export class ViewDetailsComponent implements OnInit {
  student!: UniversityStudentDetails;
  applicationGuid: string = '';
  status: string = '';
  showActions: boolean | undefined;
  userRole!: Roles
  years: Years[] = [];
  rolesEnum: typeof Roles = Roles;
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  administrativeRoles: Roles[] = [Roles.admin, Roles.finance];
  readonly dialog = inject(MatDialog);
  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private snackbar: MatSnackBar,
    private router: Router,
    private userStore: UserStore,
    private applicationInsights: ApplicationInsightsService,
    private bursaryApplicationsService: BursaryApplicationsService,
    private applicationService: applicationService,
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.applicationGuid = params.get('id')!;
    });
    this.getStudentPendingDetails(this.applicationGuid);
    this.getYears();
    this.userStore.get().subscribe((user) => {
      this.userRole = Roles[(user.role as keyof typeof Roles)];
      this.isAdmin =  this.administrativeRoles.includes(this.userRole);
      this.isLoggedIn = user.isLoggedIn;
    });
    this.applicationInsights.logPageView(RouteNames.BURSARY_DETAILS, this.router.url);
  }
  getStudentPendingDetails(applicationGuid: string): void {
    this.studentService
      .getStudentDetailsByGuid(applicationGuid)
      .subscribe((data) => {
        if (data.results) {
          this.student = data.results;
          this.showActions =
            this.isAdmin && (this.student.status === 'Email Failed' || this.student.status === 'Awaiting student response');
        } else {
          this.snackbar.open('Something went wrong, please try again', '', {
            duration: 3000,
          });
        }
      });
  }
  getYears(): void {
    this.bursaryApplicationsService
      .getYears()
      .subscribe((response) => {
        if (response.results) {
          this.years = response.results;
        } 
      });
  }

  resendEmail(): void {
  const dialogRef =  this.dialog.open(DynamicDialogComponentComponent, {
      data:{
        dialogHeader: DialogTitles.RESEND_EMAIL,
        dialogContent: DialogMessage.RESEND_EMAIL_MESSAGE,
        applicationGuid:this.applicationGuid
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result){
          this.adminService
          .emailFailedApplication(this.applicationGuid)
          .subscribe((data) => {
           if(hasValidResults(data)){
            this.snackbar.open(SnackBarMessage.SUCCESS, '', {
              duration: SnackBarDuration.DURATION,
            });
           }else{
            this.snackbar.open(SnackBarMessage.FAILURE, '', {
              duration: SnackBarDuration.DURATION,
            });
           }
          });
        }
    });
  }

  openEditStudentDialog() {
    const dialogRef = this.dialog.open(EditStudentDetailsComponent, {
      maxWidth: DialogDimensions.MAXWIDTH,
      maxHeight: DialogDimensions.MAXHEIGHT,
      width: DialogDimensions.WIDTH_EIGHTY,
      data: {
        student: this.student,
        years: this.years
      },
    });
    
    dialogRef.afterClosed().subscribe(currentValue => {
      if (currentValue) {
        this.applicationService
        .updateApplication(this.applicationGuid, currentValue)
        .subscribe((response) => {
          if (response.results) {
            reloadComponent(true,this.router);
            const snackBarRef = this.snackbar.open(
              'Application successfully updated!',
              'Dismiss',
              {
                duration: 3000,
                panelClass: ['success-snackbar'],
              },
            );
          } else if (response.errors) {
            this.snackbar.open(
              `${SnackBarMessage.ERROR_UPDATING_DETAILS}, ${SnackBarMessage.INVALID_DEPARTMENT}`,
              SnackBarMessage.CLOSE,
              {
                duration: 3000,
              },
            );
          }
        });
      }
    });
  }

  goBack() {
    window.history.back();
  }
  
  navigateToResendEmail() {
    this.router.navigate(['/dashboard/resendEmail', this.applicationGuid]);
  }
}
