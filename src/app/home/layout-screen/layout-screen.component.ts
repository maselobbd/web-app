import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStore } from '../../shared/data-access/stores/user.store';
import { Roles } from '../../authentication/data-access/models/auth.model';
import { BackgroundImageService } from '../../shared/data-access/services/background-image.service';
import { StudentUser } from '../../shared/data-access/models/studentUser.model';
import { cacheKeysEnum } from '../../shared/enums/cacheKeysEnum';
import { bbdBursarUrl, adminUrl } from '../../../theme/theme';
import { SLOGANS } from '../../shared/enums/messages';
import { getLogo } from '../../shared/utils/functions/getLogo';
import { AuthService } from "../../authentication/data-access/services/auth.service";
@Component({
  selector: 'app-layout-screen',
  templateUrl: './layout-screen.component.html',
  styleUrl: './layout-screen.component.scss',
})
export class LayoutScreenComponent {
  backgroundImageUrl: string = ''
  logoUrl ='';
   isLoading: boolean = true;

  backgroundImages = [
    '../../../../assets/images/backgroundImage-1.jpg',
    '../../../../assets/images/backgroundImage-2.jpg',
    '../../../../assets/images/backgroundImage-3.jpg',
    '../../../../assets/images/backgroundImage-4.jpg',
    '../../../../assets/images/backgroundImage-5.jpg',
    '../../../../assets/images/backgroundImage-6.jpg',
    '../../../../assets/images/backgroundImage-7.jpg',
    '../../../../assets/images/backgroundImage-8.jpg',
    '../../../../assets/images/backgroundImage-9.jpg',
    '../../../../assets/images/backgroundImage-10.jpg',
    '../../../../assets/images/backgroundImage-11.jpg',
    '../../../../assets/images/backgroundImage-12.jpg',
    '../../../../assets/images/backgroundImage-13.jpg',
    '../../../../assets/images/backgroundImage-14.jpg',

  ]

  isLoggedIn: boolean = false;
  userRole!: Roles;
  rolesEnum: typeof Roles = Roles;
  studentLoginDetails!: StudentUser;
  studentGuidCacheKey = cacheKeysEnum.applicationGuid;
  slogans = SLOGANS;

  constructor(
    private router: Router,
    private userStore: UserStore,
    private backgroundImageService: BackgroundImageService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}

  navigateToApplication() {
    this.router.navigate(['/application']);
  }

  async ngOnInit(): Promise<void> {
    this.userStore.get().subscribe((user) => {
      this.userRole = Roles[(user.role as keyof typeof Roles)];
      this.isLoggedIn = user.isLoggedIn;
      this.studentLoginDetails = {
        emailAddress: user.email,
        university: user.university,
        faculty: user.faculty,
        department: user.department,
      };
      this.isLoading = false; 
    });
    this.backgroundImageUrl = this.backgroundImageService.getRandomBackgroundImage();
    this.logoUrl = getLogo();
    this.activatedRoute.data.subscribe(data => {
        if(data['maintenance'].results) {
          this.router.navigate(['/maintenance'])
        };
    });
  }

  login(): void {
    this.authService.login();
  }

  studentRoute(): boolean {
    return this.router.url.includes('/application/student/bursaryInformation');
  }

  applicationUrlChecks() {
    const url = window.location.href;
    return bbdBursarUrl(url) || adminUrl(url);
  }
}