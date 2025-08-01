import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewInformationComponent } from './features/review-information/review-information.component';
import { QuestionnaireComponent } from './features/questionnaire/questionnaire.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { AdditionalInformationComponent } from './features/additional-information/additional-information.component';
import { SharedModule } from '../shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatDivider } from '@angular/material/divider';
import { StudentRoutingModule } from './student-routing.module';
import { UploadTranscriptComponent } from './features/upload-transcript/upload-transcript.component';
import { UploadTranscriptLandingComponent } from './features/upload-transcript-landing/upload-transcript-landing.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { StudentPersonalDetailsComponent } from './ui/student-personal-details/student-personal-details.component';
@NgModule({
  declarations: [
    ReviewInformationComponent,
    QuestionnaireComponent,
    AdditionalInformationComponent,
    UploadTranscriptComponent,
    UploadTranscriptLandingComponent,
    StudentPersonalDetailsComponent,
  ],
  imports: [
    CommonModule,
    MatStepperModule,
    MatDialogModule,
    MatGridListModule,
    MatStepperModule,
    SharedModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatDivider,
    StudentRoutingModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  exports: [
    ReviewInformationComponent,
    QuestionnaireComponent,
    AdditionalInformationComponent,
    StudentPersonalDetailsComponent
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class StudentModule {}
