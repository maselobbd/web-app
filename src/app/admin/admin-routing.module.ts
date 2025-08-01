import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDetailsComponent } from '../university-dashboard/ui/student-details/student-details.component';
import { FundAllocationComponent } from './features/fund-allocation/fund-allocation.component';
import { ViewDetailsComponent } from '../university-dashboard/ui/view-details/view-details.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { NudgeStudentsComponent } from './features/nudge-students/nudge-students.component';
import { DeclinedApplicationsComponent } from './features/declined-applications/declined-applications.component';
import { ProfileManagementComponent } from './features/profile-management/profile-management.component';
import { SharedMenuComponent } from '../shared/ui/shared-menu/shared-menu.component';
import { MainDashboardComponent } from '../shared/ui/main-dashboard/main-dashboard.component';
import { ReportsComponent } from './features/reports/reports.component';
import { OnboadStudentComponent } from './features/onboard-student/onboard-student.component';
import { CreateEventsComponent } from "./features/create-events/create-events.component";
import { EventsListComponent } from '../shared/ui/events-list/events-list.component';
import { EventDetailsComponent } from '../shared/ui/event-details/event-details.component';

const routes: Routes = [
  { path: 'studentDetails/:id', component: StudentDetailsComponent },
  { path: 'details/:id', component: ViewDetailsComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'dashboard/:universityName/:year',
    component: MainDashboardComponent,
  },
  {
    path: 'dashboard/:universityName',
    component: MainDashboardComponent,
  },
  { path: 'profiles', component: ProfileManagementComponent },
  {
    path: 'fundAllocations',
    component: FundAllocationComponent,
  },
  {
    path: 'EmailFailed/:id',
    component: ViewDetailsComponent,
  },
  {
    path: 'nudgeStudents',
    component: NudgeStudentsComponent,
  },
  {
    path: 'declinedApplications',
    component: DeclinedApplicationsComponent,
  },
  {
    path: 'menu',
    component: SharedMenuComponent,
  },
  {
    path: 'reports',
    component: ReportsComponent
  },
  {
    path: 'onboardStudents',
    component: OnboadStudentComponent
  },
  {
    path: 'fundAllocations/:university-name',
    component: FundAllocationComponent,
  },
  {
    path: 'activeBursaries',
    component: MainDashboardComponent
  },
  {
    path: 'applications',
    component: MainDashboardComponent
  },
  {
    path: 'createEvent',
    component: CreateEventsComponent
  },
  {
    path: 'events',
    component: EventsListComponent
  },
  {
    path: 'events/:id', 
    component: EventDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
