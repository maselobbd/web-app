import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApplicationFormLayoutComponent } from './features/application-form-layout/application-form-layout.component';
import { SuccessScreenComponent } from '../shared/ui/success-screen/success-screen.component';
import { successGuard } from '../shared/utils/functions/success.guard';
import { ViewDetailsComponent } from '../university-dashboard/ui/view-details/view-details.component';
import { LayoutScreenComponent } from '../home/layout-screen/layout-screen.component';
import { StudentDocumentsComponent } from '../shared/ui/student-documents/student-documents.component';
import { StudentPersonalDetailsComponent } from '../student/ui/student-personal-details/student-personal-details.component';
import { EventDetailsComponent } from '../shared/ui/event-details/event-details.component';
import { EventsListComponent } from "../shared/ui/events-list/events-list.component";
const routes: Routes = [
  { path: '', component: ApplicationFormLayoutComponent },
  {
    path: 'success/:timestamp',
    component: SuccessScreenComponent,
    canActivate: [successGuard],
    pathMatch: 'full',
  },
  { path: 'success/renewal/:timestamp', component: SuccessScreenComponent, canActivate: [successGuard] },
  { path: 'view', component: ViewDetailsComponent },
  { path: 'student/bursaryInformation', component:LayoutScreenComponent },
  { path: 'student/details', component:StudentPersonalDetailsComponent },
  { path: 'student/documents', component:StudentDocumentsComponent },
  {path: 'student/events/:id', component: EventDetailsComponent},
  { path: 'student/events', component: EventsListComponent },
  {path: 'renew', component: ApplicationFormLayoutComponent}
];
@NgModule({
  providers: [ApplicationFormLayoutComponent],
  imports: [RouterModule.forChild(routes), MatFormFieldModule, MatInputModule],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
