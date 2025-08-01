import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AdminRoutingModule } from './admin-routing.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from '../shared/shared.module';
import { FilterComponent } from './filter/filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FundAllocationComponent } from './features/fund-allocation/fund-allocation.component';
import { AddToTotalFundAllocationComponent } from './ui/add-to-total-fund-allocation/add-to-total-fund-allocation.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddAllocationDialogComponent } from './ui/add-allocation-dialog/add-allocation-dialog.component';
import { FundAllocationIndividualUniversityViewComponent } from './ui/fund-allocation-individual-university-view/fund-allocation-individual-university-view.component';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { UniversityCardComponent } from './ui/university-card/university-card.component';
import { NudgeStudentsComponent } from './features/nudge-students/nudge-students.component';
import { MatBadgeModule } from '@angular/material/badge';
import { AddHodComponent } from './ui/add-hod/add-hod.component';
import { DepartmentComponent } from './ui/department/department.component';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { AddHodExpansionComponent } from './ui/add-hod-expansion/add-hod-expansion.component';
import { UniversityAdminProfilesComponent } from './features/university-admin-profiles/university-admin-profiles.component';
import { DeclinedApplicationsComponent } from './features/declined-applications/declined-applications.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ProfileManagementComponent } from './features/profile-management/profile-management.component';
import { AdminProfileManagementComponent } from './ui/admin-profile-management/admin-profile-management.component';
import { UsersDetailTableComponent } from './ui/users-detail-table/users-detail-table.component';
import { ReportsComponent } from './features/reports/reports.component';
import { OnboadStudentComponent } from './features/onboard-student/onboard-student.component';
import { ApplicationModule } from '../application/application.module';
import { StudentModule } from '../student/student.module';
import { StoreModule } from '@ngrx/store';
import { dashboardReducer } from '../states/dashboard/dashboard.reducer';
import { allocationsReducer } from '../states/fund-allocations/fund-allocations.reducer';
import { EffectsModule } from '@ngrx/effects';
import { FundAllocationsEffects } from '../states/fund-allocations/fund-allocations.effects';
import { DashboardEffects } from '../states/dashboard/dashboard.effects';
import { AddFundsComponent } from './ui/add-funds/add-funds.component';
import { ReallocateFundsComponent } from './ui/reallocate-funds/reallocate-funds.component';
import { MoveFundsComponent } from './ui/move-funds/move-funds.component';
import { AllocateFundsDialogComponent } from './ui/allocate-funds-dialog/allocate-funds-dialog.component';
import { CreateEventsComponent } from './features/create-events/create-events.component';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle, MatDatepickerToggleIcon } from "@angular/material/datepicker";
import { MatRadioButton, MatRadioGroup } from "@angular/material/radio";
import { BursarTiersComponent } from './ui/bursar-tiers/bursar-tiers.component';
import { EventInformationFormComponent } from './ui/event-information-form/event-information-form.component';
import { PredictedSpendingComponent } from './ui/predicted-spending/predicted-spending.component';
import { PredictedSpendingExpansionComponent } from './ui/predicted-spending-expansion/predicted-spending-expansion.component';
import { UniversitySpendingExpansionComponent } from './ui/university-spending-expansion/university-spending-expansion.component';
import { EditEventInviteesComponent } from './ui/edit-event-invitees/edit-event-invitees.component';
import { EditEventDetailsComponent } from './ui/edit-event-details/edit-event-details.component';

@NgModule({
  declarations: [
    FilterComponent,
    FundAllocationComponent,
    AddToTotalFundAllocationComponent,
    AddAllocationDialogComponent,
    FundAllocationIndividualUniversityViewComponent,
    DashboardComponent,
    UniversityCardComponent,
    NudgeStudentsComponent,
    AddHodComponent,
    DepartmentComponent,
    AddHodExpansionComponent,
    UniversityAdminProfilesComponent,
    DeclinedApplicationsComponent,
    ProfileManagementComponent,
    AdminProfileManagementComponent,
    UsersDetailTableComponent,
    ReportsComponent,
    OnboadStudentComponent,
    AddFundsComponent,
    ReallocateFundsComponent,
    MoveFundsComponent,
    AllocateFundsDialogComponent,
    CreateEventsComponent,
    BursarTiersComponent,
    EventInformationFormComponent,
    PredictedSpendingComponent,
    PredictedSpendingExpansionComponent,
    UniversitySpendingExpansionComponent,
    EditEventInviteesComponent,
    EditEventDetailsComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
    AdminRoutingModule,
    HttpClientModule,
    MatDividerModule,
    MatGridListModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    SharedModule,
    FormsModule,
    MatProgressBarModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    MatMenuModule,
    MatBadgeModule,
    MatTableModule,
    MatExpansionModule,
    MatSlideToggleModule,
    ApplicationModule,
    StudentModule,
    ApplicationModule,
    StoreModule.forFeature('fundAllocations', allocationsReducer),
    EffectsModule.forFeature([FundAllocationsEffects]),
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepickerToggleIcon,
    MatRadioGroup,
    MatRadioButton
  ],
})
export class AdminModule {}
