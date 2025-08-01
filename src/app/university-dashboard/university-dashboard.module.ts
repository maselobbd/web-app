import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { UniversityDashboardRoutingModule } from './university-dashboard-routing.module';
import { StudentDetailsComponent } from './ui/student-details/student-details.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared.module';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { RejectStudentComponent } from './ui/reject-student/reject-student.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EditStudentDetailsComponent } from './ui/edit-student-details/edit-student-details.component';
import { ViewDocumentsComponent } from './ui/view-documents/view-documents.component';
import { UniversityDepartmentFundingComponent } from './ui/university-department-funding/university-department-funding.component';
import { MatStep, MatStepper } from '@angular/material/stepper';
import {
  MatExpansionModule,
} from '@angular/material/expansion';
import { TitleCasePipe } from '@angular/common';
import { StudentDetailsHeaderComponent } from './ui/student-details-header/student-details-header.component';
import { BursaryInformationComponent } from './ui/bursar-information/bursar-information.component';
import { FundDistributionComponent } from './ui/fund-distribution/fund-distribution.component';
import { StudentDocumentationManagementComponent } from './ui/student-documentation-management/student-documentation-management.component';
import { ApplicationHistoryComponent } from './ui/application-history/application-history.component';

@NgModule({
  declarations: [
    StudentDetailsComponent,
    RejectStudentComponent,
    EditStudentDetailsComponent,
    ViewDocumentsComponent,
    UniversityDepartmentFundingComponent,
    StudentDetailsHeaderComponent,
    BursaryInformationComponent,
    FundDistributionComponent,
    StudentDocumentationManagementComponent,
    ApplicationHistoryComponent,
  ],
  imports: [
    CommonModule,
    UniversityDashboardRoutingModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    SharedModule,
    MatProgressSpinner,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatStep,
    MatStepper,
    MatExpansionModule,
    TitleCasePipe
  ],
})
export class UniversityDashboardModule {}
