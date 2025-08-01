import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage, DecimalPipe } from '@angular/common';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { SharedRoutingModule } from './shared-routing.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { AllocationUsageComponent } from './ui/allocation-usage/allocation-usage.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { CustomCurrencyPipe } from './utils/pipes/custom-currency-pipe.pipe';
import { GridListDirective } from './utils/directives/grid-list.directive';
import { NavbarComponent } from './ui/navbar/navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { LandingScreenComponent } from './ui/landing-screen/landing-screen.component';
import { UploadFilesComponent } from './ui/upload-files/upload-files.component';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { DragDropDirective } from './utils/directives/drag-drop.directive';
import { ApplicationDetailsComponent } from './ui/application-details/application-details.component';
import { UniversityBursaryDetailsComponent } from './ui/university-bursary-details/university-bursary-details.component';
import { UnauthorisedComponent } from './ui/unauthorised/unauthorised.component';
import { ForbiddenComponent } from './ui/forbidden/forbidden.component';
import { NotFoundComponent } from './ui/not-found/not-found.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InvoiceComponent } from './ui/invoice/invoice.component';
import { UrlSanitationPipe } from './utils/pipes/url-sanitation.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ErrorMessageComponent } from './ui/error-message/error-message.component';
import { LoaderComponent } from './ui/loader/loader.component';
import { ViewDetailsComponent } from '../university-dashboard/ui/view-details/view-details.component';
import { AllocationDetailsComponent } from './ui/allocation-details/allocation-details.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FundSpreadDetailsComponent } from './ui/fund-spread-details/fund-spread-details.component';
import { UploadMultipleFilesDialogComponent } from './ui/upload-multiple-files-dialog/upload-multiple-files-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ViewDocumentComponent } from './ui/view-document/view-document.component';
import { RemoveDocumentDialogComponent } from './ui/remove-document-dialog/remove-document-dialog.component';
import { ApplicationDialogComponent } from './ui/application-dialog/application-dialog.component';
import { TermsConditionsPrivacyPolicyViewComponent } from './ui/terms-conditions-privacy-policy-view/terms-conditions-privacy-policy-view.component';
import { BursaryInformationComponent } from './ui/bursary-information/bursary-information.component';
import { ConfirmActionComponent } from './ui/confirm-action/confirm-action.component';
import { DropdownDialogComponent } from './ui/dropdown-dialog/dropdown-dialog.component';
import { MatOption, MatSelect } from '@angular/material/select';
import { PersonalDetailsComponent } from './ui/personal-details/personal-details.component';
import { UniversityInformationComponent } from './ui/university-information/university-information.component';
import { StudentDocumentsComponent } from './ui/student-documents/student-documents.component';
import { AlterDetailsDialogComponent } from './ui/alter-details-dialog/alter-details-dialog.component';
import { UploadProfilePictureComponent } from './ui/upload-profile-picture/upload-profile-picture.component';
import { SharedMenuComponent } from './ui/shared-menu/shared-menu.component';
import { RouterModule } from '@angular/router';
import { SearchBarComponent } from './ui/search-bar/search-bar.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { SearchOverlayComponent } from './ui/search-overlay/search-overlay.component';
import { MatListModule } from '@angular/material/list';
import { FundAllocationIndividualUniversityComponent } from './ui/fund-allocation-individual-university/fund-allocation-individual-university.component';
import { FundAllocationFilterComponent } from './ui/fund-allocation-filter/fund-allocation-filter.component';
import { MatStep, MatStepLabel, MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DynamicDialogComponentComponent } from './ui/dynamic-dialog-component/dynamic-dialog-component.component';
import { MainDashboardComponent } from './ui/main-dashboard/main-dashboard.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { SplitButtonComponent } from './ui/split-button/split-button.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MaintenancePageComponent } from './ui/maintenance-page/maintenance-page.component';
import { FilterComponent } from './ui/filter/filter.component';
import { SideNavSectionsComponent } from './ui/side-nav-sections/side-nav-sections.component';
import { SideNavMenuComponent } from './ui/side-nav-menu/side-nav-menu.component';
import { NavbarLayoutResolverComponent } from './ui/navbar-layout-resolver/navbar-layout-resolver.component';
import { CategoryBreakdownUniversityComponent } from './ui/category-breakdown-university/category-breakdown-university.component';
import { CategoryBreakdownComponent } from './ui/category-breakdown/category-breakdown.component';
import { ReportsFundAllocationPerUniversityComponent } from './ui/reports-fund-allocation-per-university/reports-fund-allocation-per-university.component';
import { ReportsStudentsFundedPerUniversityComponent } from './ui/reports-students-funded-per-university/reports-students-funded-per-university.component';
import { ReportsRacesFundedPerUniversityComponent } from './ui/reports-races-funded-per-university/reports-races-funded-per-university.component';
import { ConsolidatedUniversityBursaryDetailsComponent } from './ui/consolidated-university-bursary-details/consolidated-university-bursary-details.component';
import { StepperComponent } from './ui/stepper/stepper.component';
import { AddressFormComponent } from './ui/address-form/address-form.component';
import { TimePickerComponent } from './ui/time-picker/time-picker.component';
import { EventSummaryComponent } from './ui/event-summary/event-summary.component';
import { EventsListComponent } from './ui/events-list/events-list.component';
import { AdminLandingComponent } from './ui/admin-landing/admin-landing.component';
import { BursaryFundCardComponent } from './ui/bursary-fund-card/bursary-fund-card.component';
import { BursaryReportingComponent } from './ui/bursary-reporting/bursary-reporting.component';
import { MatAutocomplete, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { EventDetailsComponent } from './ui/event-details/event-details.component';
import { InviteesComponent } from './ui/invitees/invitees.component';
import { FilterDialogComponent } from './ui/filter-dialog/filter-dialog.component';
import { StoreModule } from '@ngrx/store';
import { studentPortalReducer } from '../states/student-portal/student-portal.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StudentPortalEffects } from '../states/student-portal/student-portal.effects';
import { EventsEffects } from '../states/events/events.effects';
import { EventDetailsReducer, EventPrePopulatedDataReducer, EventSummaryReducer } from '../states/events/events.reducer';
import { dashboardReducer } from '../states/dashboard/dashboard.reducer';
import { DashboardEffects } from '../states/dashboard/dashboard.effects';

@NgModule({
  declarations: [
    AllocationUsageComponent,
    CustomCurrencyPipe,
    GridListDirective,
    NavbarComponent,
    SideNavSectionsComponent,
    SideNavMenuComponent,
    LandingScreenComponent,
    UploadFilesComponent,
    DragDropDirective,
    ApplicationDetailsComponent,
    UniversityBursaryDetailsComponent,
    UnauthorisedComponent,
    ForbiddenComponent,
    NotFoundComponent,
    InvoiceComponent,
    ErrorMessageComponent,
    LoaderComponent,
    UrlSanitationPipe,
    ViewDetailsComponent,
    AllocationDetailsComponent,
    FundSpreadDetailsComponent,
    TermsConditionsPrivacyPolicyViewComponent,
    UploadMultipleFilesDialogComponent,
    ViewDocumentComponent,
    RemoveDocumentDialogComponent,
    ApplicationDialogComponent,
    BursaryInformationComponent,
    ConfirmActionComponent,
    DropdownDialogComponent,
    PersonalDetailsComponent,
    UniversityInformationComponent,
    AlterDetailsDialogComponent,
    StudentDocumentsComponent,
    UploadProfilePictureComponent,
    SharedMenuComponent,
    SearchBarComponent,
    SearchOverlayComponent,
    FundAllocationIndividualUniversityComponent,
    FundAllocationFilterComponent,
    DynamicDialogComponentComponent,
    MainDashboardComponent,
    SplitButtonComponent,
    MaintenancePageComponent,
    FilterComponent,
    NavbarLayoutResolverComponent,
    CategoryBreakdownUniversityComponent,
    CategoryBreakdownComponent,
    ReportsFundAllocationPerUniversityComponent,
    ReportsStudentsFundedPerUniversityComponent,
    ReportsRacesFundedPerUniversityComponent,
    ConsolidatedUniversityBursaryDetailsComponent,
    StepperComponent,
    AddressFormComponent,
    TimePickerComponent,
    EventSummaryComponent,
    EventsListComponent,
    AdminLandingComponent,
    BursaryFundCardComponent,
    BursaryReportingComponent,
    EventDetailsComponent,
    InviteesComponent,
    FilterDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatProgressBarModule,
    MatCardModule,
    MatGridListModule,
    MatDividerModule,
    MatMenuTrigger,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    HttpClientModule,
    MatButtonModule,
    MatChipsModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelect,
    MatOption,
    RouterModule,
    OverlayModule,
    MatListModule,
    MatStep,
    MatStepper,
    MatStepperModule,
    MatSidenavModule,
    MatExpansionModule,
    MatTooltipModule,
    MatTabsModule,
    NgOptimizedImage,
    MatRadioModule,
    MatStepLabel,
    StoreModule.forFeature('studentPortal', studentPortalReducer),
    StoreModule.forFeature('dashboard', dashboardReducer),
    EffectsModule.forFeature ([StudentPortalEffects, DashboardEffects, EventsEffects]), 
    MatAutocompleteTrigger,
    MatAutocomplete,
    StoreModule.forFeature('eventSummary', EventSummaryReducer),
    StoreModule.forFeature('eventDetails', EventDetailsReducer),
    StoreModule.forFeature('eventsPrePopulatedData', EventPrePopulatedDataReducer),
  ],
  exports: [
    AllocationUsageComponent,
    LandingScreenComponent,
    CustomCurrencyPipe,
    UrlSanitationPipe,
    NavbarComponent,
    SideNavMenuComponent,
    ApplicationDetailsComponent,
    TermsConditionsPrivacyPolicyViewComponent,
    UniversityBursaryDetailsComponent,
    GridListDirective,
    UploadFilesComponent,
    ErrorMessageComponent,
    LoaderComponent,
    AllocationDetailsComponent,
    BursaryInformationComponent,
    UniversityInformationComponent,
    PersonalDetailsComponent,
    SharedMenuComponent,
    SearchBarComponent,
    FundAllocationIndividualUniversityComponent,
    FundAllocationFilterComponent,
    NgOptimizedImage,
    SplitButtonComponent,
    MaintenancePageComponent,
    FilterComponent,
    CategoryBreakdownUniversityComponent,
    CategoryBreakdownComponent,
    MainDashboardComponent,
    StepperComponent,
    AddressFormComponent,
    TimePickerComponent,
    AdminLandingComponent,
    EventDetailsComponent
  ],
})
export class SharedModule {}
