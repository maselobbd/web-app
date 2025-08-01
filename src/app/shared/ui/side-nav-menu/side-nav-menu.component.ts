import {
  Component,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from '../../../authentication/data-access/services/auth.service';
import { RouteEnum } from '../../enums/routes';
import { ImagePaths } from '../../../admin/enums/imagePaths';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-side-nav-menu',
  templateUrl: './side-nav-menu.component.html',
  styleUrls: ['./side-nav-menu.component.scss', '../../utils/styling/sidenav.scss'],
})
export class SideNavMenuComponent implements OnInit  {
  url: string = '';
  opened!: boolean;
  collapsed = signal(true);
  readonly ImagePaths = ImagePaths;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  darkNavBarRoutes = [
    '/',
    '/unauthorised',
    '/forbidden',
    '/not-found',
  ];

  constructor(
      private router: Router,
      private authService: AuthService,
    ) {
        this.router.events.forEach((event) => {
          if(event instanceof NavigationStart) {
            this.sidenav.close();
          }
        });
    }

  async ngOnInit(): Promise<void> {
    this.url = this.router.url;

    const logo = new Image();
    logo.src = ImagePaths.BBD_LOGO;

    const lightLogo = new Image();
    lightLogo.src = ImagePaths.BBD_LOGO_LIGHT;
  }


  darkNavBar(): boolean {
    if (
      this.darkNavBarRoutes.includes(this.router.url) ||
      this.router.url.includes('/maintenance')
    ) {
      return true;
    }
    return false;
  }

  successScreenRoute(): boolean {
    if (
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

  bursariesAndApplications = [
    {
      links: [
        { name: 'Ukukhula bursaries', route: RouteEnum.AdminDashboard, queryParams: { viewType: 'Ukukhula Bursary Fund' } },
        { name: 'BBD bursaries', route: RouteEnum.AdminDashboard, queryParams: { viewType: 'BBD Bursary Fund' } },
        { name: 'Active bursaries', route: RouteEnum.AdminActiveBursaries },
        { name: 'Applications', route: RouteEnum.AdminApplications },
        { name: 'Failed applications and bursaries', route: RouteEnum.AdminDeclinedApplications },
      ],
    },
  ];

  studentManagement = [
    {
      links: [{ name: 'Nudge students', route: RouteEnum.AdminNudgeStudents }, {name: "Onboard students", route: RouteEnum.OnboardStudents}],
    },
  ];

  funding = [
    {
      links: [{ name: 'Fund allocation', route: RouteEnum.AdminFundAllocations }],
    },
  ];

  reporting = [
    {
      links: [
        { name: 'Reports', route: RouteEnum.Reports },
      ],
    },
  ];

  profileManagement = [
    {
      links: [
        { name: 'User profiles', route: RouteEnum.AdminProfiles },
      ],
    },
  ];

  events = [
    {
      links: [
        { name: 'Create a new event', route: RouteEnum.AdminCreateEvent },
        { name: 'Events', route: RouteEnum.AdminEventList}
      ]
    }
  ]

  logout(): void {
    this.authService.logout();
  }

  toggleSideNavIndicator() {
    this.collapsed.set(true);
  }
}
