import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationRoutingModule } from './application-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ApplicationformComponent } from './ui/application-form/application-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationFormLayoutComponent } from './features/application-form-layout/application-form-layout.component';
import { MatDividerModule } from '@angular/material/divider';
import { ApplicationFormBursaryYearComponent } from './ui/application-form-bursary-year/application-form-bursary-year.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridTile } from '@angular/material/grid-list';
import { SharedModule } from '../shared/shared.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CdkStepperModule, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AllocateFundsComponent } from './ui/allocate-funds/allocate-funds.component';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { SuccessScreenComponent } from '../shared/ui/success-screen/success-screen.component';
import { AllowNumbersOnlyDirective } from '../shared/utils/directives/allow-numbers-only.directive';
import { MatBadgeModule } from '@angular/material/badge';
import { StudentModule } from '../student/student.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RenewApplicationDialogComponent } from './ui/renew-application-dialog/renew-application-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RenewalListComponent } from './ui/renewal-list/renewal-list.component';
import { MatTableModule } from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    ApplicationformComponent,
    ApplicationFormLayoutComponent,
    ApplicationFormBursaryYearComponent,
    AllocateFundsComponent,
    SuccessScreenComponent,
    AllowNumbersOnlyDirective,
    SuccessScreenComponent,
    AllowNumbersOnlyDirective,
    RenewApplicationDialogComponent,
    RenewalListComponent
  ],
  providers: [
    provideNativeDateAdapter(),
    HttpClient,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    MatDividerModule,
    MatGridListModule,
    MatCheckboxModule,
    MatGridTile,
    MatStepperModule,
    MatToolbarModule,
    CdkStepperModule,
    FormsModule,
    MatCardModule,
    SharedModule,
    MatMenuModule,
    MatBadgeModule,
    StudentModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTabsModule,
    MatSnackBarModule,
    StudentModule,
    MatTooltipModule,
    MatTableModule,
    MatAutocompleteModule,
    MatSlideToggle
  ],
  exports:[
    ApplicationformComponent
  ]
})
export class ApplicationModule {}
