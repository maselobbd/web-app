import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewInformationComponent } from './features/review-information/review-information.component';
import { SuccessScreenComponent } from '../shared/ui/success-screen/success-screen.component';
import { TermsConditionsPrivacyPolicyViewComponent } from '../shared/ui/terms-conditions-privacy-policy-view/terms-conditions-privacy-policy-view.component';
import { UploadTranscriptComponent } from './features/upload-transcript/upload-transcript.component';
import { UploadTranscriptLandingComponent } from './features/upload-transcript-landing/upload-transcript-landing.component';

const routes: Routes = [
  { path: 'student/:applicationGuid', component: ReviewInformationComponent },
  {
    path: 'success/:timestamp',
    component: SuccessScreenComponent,
    pathMatch: 'full',
  },
  { 
    path: 'transcript/:applicationGuid', 
    component: UploadTranscriptComponent 
  },
  { 
    path: 'upload-transcript/:applicationGuid', 
    component: UploadTranscriptLandingComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
