import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  Router,
} from '@angular/router';
import { StepperDataService } from '../../../student/services/stepper-data.service';
import { UserStore } from '../../data-access/stores/user.store';
import { SuccessMessages } from '../../enums/successScreenMessages';
import { BackgroundImageService } from '../../data-access/services/background-image.service';
import { getLogo } from '../../utils/functions/getLogo';
@Component({
  selector: 'app-success-screen',
  templateUrl: './success-screen.component.html',
  styleUrl: './success-screen.component.scss',
})
export class SuccessScreenComponent implements OnInit, AfterViewInit {
  errorMessage: string | undefined;
  redirectToStudentSuccess!: boolean;
  redirectToTranscriptSuccess!: boolean;
  isLoggedIn: boolean = false;
  userRole: string = '';
  url:string='';
  showUploadTranscript: boolean = false
  successMessages: any = SuccessMessages;
  role!: string;
  constructor(
    private router: Router,
    private stepperDataService: StepperDataService,
    private userStore: UserStore,
    private backgroundImageService: BackgroundImageService
  ) {}
  backgroundImageUrl = '';
  logoUrl = '';

  navigateToBursaries() {
    this.router.navigateByUrl('/dashboard/bursaries');
  }

  navigateToBursaryInfo() {
    this.router.navigate(['/application/student/bursaryInformation']);
  }
  async ngOnInit(): Promise<void> {
    this.redirectToStudentSuccess =
      this.stepperDataService.redirectToStudentSuccess;
    this.redirectToTranscriptSuccess =
      this.stepperDataService.redirectToTranscriptSuccess
    this.url = this.router.url;
    this.userStore.get().subscribe((user) => {
      this.isLoggedIn = user.isLoggedIn;
      this.userRole = user.rank;
      this.role = user.role
    }); 
    this.backgroundImageUrl = this.backgroundImageService.getRandomBackgroundImage();
    this.logoUrl = getLogo();
  }

  ngAfterViewInit(): void {
    this.stepperDataService.redirectToStudentSuccess = false;
  }

  successScreenRoute(): boolean {
    if (this.router.url.includes('/reviews/success')|| this.router.url.includes('success/renewal')) {
      return true;
    }
    return false;
  }
  checkForExistingApplication():boolean {
    return this.userRole === 'HOD' && this.isLoggedIn&&this.url.includes('/application')
  }
}
