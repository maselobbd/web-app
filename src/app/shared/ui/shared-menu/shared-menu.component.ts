import { Component, Input, OnInit } from '@angular/core';
import {
  Roles,
  UserAttributes,
} from '../../../authentication/data-access/models/auth.model';
import { NavigationEnd, Router } from '@angular/router';
import { DetailsService } from '../../../admin/data-access/services/details.service';
import { ExcelService } from '../../data-access/services/excel.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouteEnum } from '../../enums/routes';
import { HodAccountsService } from '../../../admin/data-access/services/hod-accounts.service';
import { hasValidResults } from '../../utils/functions/checkData.function';
import { AdditionaInfoMessageType } from '../../enums/messages';

@Component({
  selector: 'app-shared-menu',
  templateUrl: './shared-menu.component.html',
  styleUrl: './shared-menu.component.scss',
})
export class SharedMenuComponent implements OnInit {
  @Input() isLoggedIn: boolean = false;
  @Input() userRole!: Roles;
  @Input() menuTrigger!: string;
  @Input() label!: string;
  @Input() userDetails!: UserAttributes;
  currentRoute!: string;
  adminUsers!: any;
  departments!: string[];
  menuItems: any[] = [];
  isLoading = true;
  currentUserRole!: number;
  darkNavBarRoutes = [
    '/',
    '/unauthorised',
    '/forbidden',
    '/not-found',
    '/application/student/bursaryInformation',
    '/application/success',
    '/application/renewal/success',
  ];

  constructor(
    private router: Router,
    private detailsService: DetailsService,
    private excelService: ExcelService,
    private _snackBar: MatSnackBar,
    private accountService: HodAccountsService,
  ) {
    this.currentRoute = this.router.url;
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  ngOnInit(): void {
    if (this.userDetails) {
      this.getDepartments();
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
    this.currentUserRole = Roles[this.userDetails?.role as keyof typeof Roles];
  }
  isHomeRoute(): boolean {
    return this.currentRoute === '/';
  }

  darkNavBar(): boolean {
    const regex = new RegExp(/^\/application\/success(\/\d+|\/renewal\/\d+)?$/);
    return regex.test(this.currentRoute);
  }
  navigate(route: string) {
    this.router.navigateByUrl(route);
  }
  getMenuItems() {
    switch (this.userRole) {
      case Roles.admin:
        return [
          {
            label: 'Active bursaries & applications',
            route: RouteEnum.AdminDashboard,
          },
          { label: 'Profile management', route: RouteEnum.AdminProfiles },
          { label: 'Nudge students', route: RouteEnum.AdminNudgeStudents },
          {
            label: 'Failed applications and bursaries',
            route: RouteEnum.AdminDeclinedApplications,
          },
          {
            label: 'Reports',
            route: RouteEnum.Reports,
          },
        ];
      case Roles.dean:
        return this.menuItems.length != 0
          ? this.menuItems.map((departments) => {
              const department = departments.universityDepartmentName;
              return {
                label: department,
                route: `dashboard/departments/${department}`,
              };
            })
          : [
              {
                label: AdditionaInfoMessageType.NO_DEPARTMENTS_MESSAGE,
                route: this.router.url,
              },
            ];
      default:
        return [
          {
            label: 'Bursaries',
            route: RouteEnum.HodDashboardBursaries,
            queryParams: { tab: 0 },
          },
          {
            label: 'Applications',
            route: RouteEnum.HodDashboardApplication,
            queryParams: { tab: 1 },
          },
        ];
    }
  }

  getDepartments(): void {
    if (this.userDetails) {
      this.accountService
        .getDepartments(this.userDetails.university, this.userDetails.faculty)
        .subscribe((data) => {
          if (hasValidResults(data)) {
            this.menuItems = data.results;
            if (this.menuItems) this.isLoading = false;
          }
        });
    }
  }
  trackByFn(index: number, item: any): any {
    return item.route;
  }
}
