import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TabLabels } from '../../enums/tabLabels';
import { FormGroup } from '@angular/forms';
import { ProfileTitleMessages } from '../../enums/ProfileTitleMessages';
import { ProfileSubtitleMessages } from '../../enums/ProfileSubtitlesMessages';
import { HodAccountsService } from '../../data-access/services/hod-accounts.service';
import { DataService } from '../../../shared/data-access/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { AddHodComponent } from '../../ui/add-hod/add-hod.component';
import { GroupedData, HodAccount, PanelTitle } from '../../data-access/models/hod-account.model';
import { UniversityDetails } from '../../data-access/models/university-details.model';
import { IUni } from '../../data-access/models/universityUsers-model';
import { Faculty } from '../../data-access/models/faculties-model';
import {
  DepartmentType,
  UniversityData,
} from '../../../shared/data-access/models/universityProfiles.model';
import { IResponse } from '../../../shared/data-access/models/response.models';
import { Router } from '@angular/router';
import {
  Ranks,
  Roles,
} from '../../../authentication/data-access/models/auth.model';
import { UserStore } from '../../../shared/data-access/stores/user.store';
import { reloadComponent } from '../../../shared/utils/functions/reloadComponent';
import { map, Observable, shareReplay, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: [
    './profile-management.component.scss',
    '../../../shared/utils/styling/tabGroups.scss',
  ],
})
export class ProfileManagementComponent implements OnInit {
  tabLabel!: string;
  tabLabelsEnum = TabLabels;
  dataSource:HodAccount[] = [];
  adminDataSource :GroupedData = {
    admin: [],
    executives: [],
  }; 
  universities: UniversityDetails[] = [];
  allUniversities: IUni[] = [];
  faculties: Faculty[] = [];
  extraUniversities: UniversityData[] = [];
  hasAdminData: boolean = false;
  userRank!: Ranks;
  ranksEnum: typeof Ranks = Ranks;
  userRole!: Roles;
  isAdmin = false;
  rolesEnum: typeof Roles = Roles;
  administrativeRoles = [this.rolesEnum.admin, this.rolesEnum.finance];
  userFaculty!: string;
  adminUsers: HodAccount[] = [];
  panelsTitle:PanelTitle[]= [];
  private accounts$: Observable<HodAccount[]> | null = null;
  private destroy$ = new Subject<void>();
  constructor(
    private accountService: HodAccountsService,
    private sharedDataService: DataService,
    private dialog: MatDialog,
    private router: Router,
    private userStore: UserStore,
  ) {}

  ngOnInit(): void {
    this.loadUniversitiesAndAccounts();
    this.getFaculties();
    this.sharedDataService.triggerReload$
    .pipe(takeUntil(this.destroy$)) 
    .subscribe((doReload: boolean) => {
      if (doReload) {
        reloadComponent(true, this.router);
      }
    });
    this.userStore
    .get()
    .pipe(takeUntil(this.destroy$))
    .subscribe((user) => {
      this.userRank = Ranks[user.rank as keyof typeof Ranks];
      this.userRole = Roles[user.role as keyof typeof Roles];
      this.userFaculty = user.faculty;
      this.isAdmin = this.administrativeRoles.includes(this.userRole);
    });
    if (this.userRank === this.ranksEnum.chief_admin) {
      this.tabLabel = TabLabels.ADMIN;
    } else {
      this.tabLabel = TabLabels.UNIVERSITY;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(); 
    this.destroy$.complete();
  }

private fetchAccounts(): Observable<HodAccount[]> {
  if (!this.accounts$) {
    this.accounts$ = this.accountService.getAccounts().pipe(
      map((accountData: IResponse<HodAccount[]>) => accountData.results || []),
      shareReplay(1),
      takeUntil(this.destroy$)
    );
  }
  return this.accounts$;
}

private loadUniversitiesAndAccounts(): void {
  this.fetchAccounts()
    .pipe(takeUntil(this.destroy$)) 
    .subscribe((accounts) => {
      this.dataSource = accounts;
      this.accountService
        .getDepartmentsAndUniversity()
        .pipe(takeUntil(this.destroy$)) 
        .subscribe((extraData: IResponse<UniversityData[]>) => {
          if (extraData.results) {
            this.extraUniversities = extraData.results;
            this.populateUniversities();
          }
        });
    });
}

  private populateUniversities(): void {
    const allUniMap = new Map<string, IUni>();
    this.extraUniversities.forEach((uni) => {
      allUniMap.set(uni.UniversityName, {
        universityName: uni.UniversityName,
        departments: JSON.parse(uni.Departments.toString()!).map(
          (departmentInfo: DepartmentType) => ({
            departmentInfo,
            hodAccounts: this.getFilteredAccounts(
              uni.UniversityName,
              departmentInfo.departmentName,
            ),
          }),
        ),
      });
    });
    this.allUniversities = Array.from(allUniMap.values()).filter(
      (university) => university.universityName !== 'BBD',
    );
  }

  private getFilteredAccounts(
    universityName: string,
    departmentName: string,
  ): HodAccount[] {
    if (this.tabLabel === TabLabels.UNIVERSITY) {
      const result = this.dataSource.filter(
        (account) =>
          account.University === universityName &&
          account.Department === departmentName &&
          Roles.HOD === Roles[account.role as keyof typeof Roles],
      );
      return result;
    } else if (this.tabLabel === TabLabels.STUDENT) {
      return this.dataSource.filter(
        (account) =>
          account.University === universityName &&
          account.Department === departmentName &&
          Roles.student ===
            Roles[account.role?.toLowerCase() as keyof typeof Roles],
      );
    } else {
      this.adminUsers = this.dataSource.filter(
        (account) =>
          Roles.admin ===
          Roles[account.role?.toLowerCase() as keyof typeof Roles],
      );
      this.groupedUsers();
      this.panelsTitle = [
        { title: 'Admin', dataSource: this.adminDataSource?.admin },
        { title: 'Executives', dataSource: this.adminDataSource?.executives },
      ];
      return this.adminUsers
    }
  }

  tabChange(event: MatTabChangeEvent): void {
    this.tabLabel = event.tab.textLabel;
    this.populateUniversities();
  }

  addUniversity(): void {
    const dialogRef = this.dialog.open(AddHodComponent, {
      width: '400px',
      data: {
        label: ProfileTitleMessages.ADD_UNIVERSITY,
        dialogTitle: ProfileTitleMessages.ADD_UNIVERSITY,
        action: ProfileTitleMessages.ADD_UNIVERSITY,
        dialogMetaData: ProfileSubtitleMessages.UNIVERSITY_METADATA,
        faculties: this.faculties,
        addUniversityCheck: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: FormGroup) => {
      if (result) {
        this.accountService
          .addUniversity(
            result.get('University')?.getRawValue(),
            result.get('Faculty')?.getRawValue(),
          )
          .subscribe(() => {
            if (!result.get('emailAddress')?.value) {
              this.sharedDataService.triggerReload(true);
            }
          });
      }
    });
  }

  getFaculties(): void {
    this.accountService
      .getFaculties()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data.results) {
          this.faculties = data.results
        }
      });
  }
  groupedUsers(): void {
    this.adminDataSource = this.adminUsers.reduce(
      (acc:{ admin: HodAccount[]; executives: HodAccount[] }, user:HodAccount) => {
        if (user.rank === Ranks[Ranks.assistant_admin]) {
          acc.admin.push(user);
        } else if (
          user.rank === Ranks[Ranks.admin_officer] ||
          user.rank === Ranks[Ranks.senior_admin]
        ) {
          acc.executives.push(user);
        }
        return acc;
      },
      { admin: [], executives: [] },
    );
  }
}
