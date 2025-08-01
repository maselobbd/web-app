import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDetailsComponent } from './ui/student-details/student-details.component';
import { ViewDetailsComponent } from './ui/view-details/view-details.component';
import { EditStudentDetailsComponent } from './ui/edit-student-details/edit-student-details.component';
import { ProfileManagementComponent } from '../admin/features/profile-management/profile-management.component';
import { UniversityDepartmentFundingComponent } from './ui/university-department-funding/university-department-funding.component';
import { MainDashboardComponent } from '../shared/ui/main-dashboard/main-dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'bursaries',
    pathMatch: 'full',
  },
  {
    path: 'bursaries',
    component: MainDashboardComponent,
  },
  {
    path: 'profiles',
    component: ProfileManagementComponent,
  },
  {
    path: 'studentDetails/:id',
    component: StudentDetailsComponent,
  },
  {
    path: 'details/:id',
    component: ViewDetailsComponent,
  },
  {
    path: 'editDetails/:id',
    component: EditStudentDetailsComponent,
  },
  {
    path: 'department/bursaries/:id',
    component: MainDashboardComponent,
  },
  {
    path: 'funds',
    component: UniversityDepartmentFundingComponent,
  },
  {
    path: 'departments/:department',
    component: MainDashboardComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UniversityDashboardRoutingModule {}
