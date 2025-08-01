import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../authentication/data-access/services/auth.service';
import { UserStore } from '../../data-access/stores/user.store';
import { MatMenuPanel } from '@angular/material/menu';
import { DataService } from '../../data-access/services/data.service';
import {
  Roles,
  UserAttributes,
} from '../../../authentication/data-access/models/auth.model';
import { hasValidResults } from '../../utils/functions/checkData.function';
import { HodAccountsService } from '../../../admin/data-access/services/hod-accounts.service';
import { reloadComponent } from '../../utils/functions/reloadComponent';
import { AdminService } from '../../../admin/data-access/services/admin.service';
import { SystemConfigurationService } from '../../data-access/services/system-configuration.service';
import { cacheKeysEnum } from '../../enums/cacheKeysEnum';
import { CacheService } from '../../data-access/services/cache.service';
import { StudentService } from '../../../student/services/student.service';
import { StudentUser } from '../../data-access/models/studentUser.model';
import { bbdBursarUrl, adminUrl } from '../../../../theme/theme';
import { observe } from '../../../shared/utils/functions/observe.function';
import { Logout } from '../../../shared/enums/messages';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AllocationsPageActions } from '../../../states/fund-allocations/fund-allocations.actions';
import { studentPortalData } from '../../../states/student-portal/student-portal.actions';
import { ImagePaths } from '../../../admin/enums/imagePaths';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  logo = 'Ukukhula';
  isLoggedIn: boolean = false;
  showBursariesOptions: boolean = false;
  showApplicationsOptions: boolean = false;
  imagePaths: typeof ImagePaths = ImagePaths;
  roleEnum: typeof Roles = Roles;
  userRole!: Roles;
  student: boolean = true;
  darkNavBarRoutes = [
    '/',
    '/unauthorised',
    '/forbidden',
    '/not-found',
    '/application/student/bursaryInformation',
  ];
  bursaryType: string = 'Ukukhula';
  viewTypeFlag: string = '';
  menu: MatMenuPanel<any> | null | undefined;
  collapse: boolean = false;
  url: string = '';
  showTranscriptUpload: boolean = false;
  administrativeRoles = [Roles.admin, Roles.finance];
  isDarkMode: boolean = false;
  userDetails!: UserAttributes;
  menuItems: any[] = [];
  date = new Date().getFullYear();
  load = true;
  setToTrue = false;
  enableRenewApplication = signal<boolean>(false);

  constructor(
    private router: Router,
    private authService: AuthService,
    private userStore: UserStore,
    private dataService: DataService,
    private accountService: HodAccountsService,
    private adminService: AdminService,
    private systemConfigurationService: SystemConfigurationService,
    private cacheService: CacheService,
    private studentService: StudentService,
    private http: HttpClient,
    private store: Store,
  ) {}

  async ngOnInit(): Promise<void> {
    this.url = this.router.url;
    this.userStore.get().subscribe((user) => {
      this.userRole = Roles[user.role as keyof typeof Roles];
      this.isLoggedIn = user.isLoggedIn;
      this.userDetails = user;
      if(this.userRole === this.roleEnum.student)
      {
        this.getStudentApplicationGuid();
      }
    });
    this.dataService.showTranscriptUpload$.subscribe((data) => {
      if (data) {
        this.showTranscriptUpload = data;
      }
    });
    if (this.userRole === this.roleEnum.dean) {
      this.getDepartments();
      this.store.dispatch(AllocationsPageActions.loadYears());
    }
    if(this.userRole === this.roleEnum.admin && this.load)
    {
        this.adminService
        .getUniversityCardData(this.date,this.load,this.viewTypeFlag).subscribe(()=>{
          this.load=false;
        })
    }
    if(this.userRole === this.roleEnum.HOD)
    {
      this.systemConfigurationService.getApplicationConfiguration("renewals").subscribe((data)=>{
        if(hasValidResults(data))
        {
          this.enableRenewApplication.set(data.results || false);
        }
      })
    }
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    if (Roles[this.userRole].toLowerCase() === "admin") observe(this.http.post(`api/logout`,{logout:true})).subscribe(
      data => {
        if(data.results === Logout.MESSAGE) this.cacheService.clear(cacheKeysEnum.applicationGuid);
      }
    );
    this.authService.logout();
  }

  getRole(): Roles {
    return this.userRole!;
  }

  darkNavBar(): boolean {
    if (
      this.darkNavBarRoutes.includes(this.router.url) ||
      this.router.url.includes('/reviews/success') ||
      this.router.url.includes('/application/success') ||
      this.router.url.includes('/application/success/renewal') ||
      this.router.url.includes('/maintenance') ||
      this.router.url.includes('/reviews/upload-transcript')
    ) {
      return true;
    }
    return false;
  }

  successScreenRoute(): boolean {
    if (
      this.router.url.includes('/reviews/success') ||
      this.router.url.includes('reviews/student') ||
      this.router.url.includes('legal/agreements/privacy-policy') ||
      this.router.url.includes('legal/agreements/terms-conditions') ||
      this.router.url.includes('/unauthorised') ||
      this.router.url.includes('/forbidden') ||
      this.router.url.includes('/maintenance') ||
      this.router.url.includes('/not-found')
    ) {
      return true;
    }
    return false;
  }
  navigate(route: string) {
    this.router.navigate([route]);
  }

  navigateHome() {
    !this.url.includes('reviews/upload-transcript')
      ? this.router.navigate(['/'])
      : reloadComponent(true,this.router);
  }
  getDepartments(): void {
    if (this.userDetails) {
      this.accountService
        .getDepartments(this.userDetails.university, this.userDetails.faculty)
        .subscribe((data) => {
          if (hasValidResults(data)) {
            this.menuItems = data.results;
          }
        });
    }
  }

  navigateToRenewApplication() {
    this.router.navigate(['application/renew']);
  }

  getLogo(): string {
    if(bbdBursarUrl(window.location.href) || adminUrl(window.location.href)) {
      return this.darkNavBar() && !this.showTranscriptUpload
      ? ImagePaths.BBD_BURSARY_LIGHT
      : ImagePaths.BBD_BURSARY_DARK
    }
    return this.darkNavBar() && !this.showTranscriptUpload
      ? ImagePaths.UKUKHULA_NAV_BAR_LIGHT
      : ImagePaths.UKUKHULA_NAV_BAR_DARK
  }

  getStudentApplicationGuid()
  {
    this.store.dispatch(studentPortalData({studentData:{department:this.userDetails.department,faculty:this.userDetails.faculty,emailAddress:this.userDetails.email,university:this.userDetails.university} as StudentUser}))
  }
}
