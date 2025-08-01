import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Details } from '../../../admin/data-access/models/details-model';
import {
  Ranks,
  Roles,
} from '../../../authentication/data-access/models/auth.model';
import { NoApplicationErrorMessage } from '../../enums/noApplicationsFound';
import {
  debounceTime,
  distinctUntilChanged,
  first,
  Observable,
  Subject,
} from 'rxjs';
import { ApplicationsCount } from '../../../university-dashboard/data-access/models/applications-count.model';
import { AllocationModel } from '../../data-access/models/allocation.models';
import { DataService } from '../../data-access/services/data.service';
import { AppState } from '../../../states/app.state';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStore } from '../../data-access/stores/user.store';
import { ApplicationInsightsService } from '../../data-access/services/application-insights.service';
import {
  selectDashboardCardData,
  selectDashboardData,
} from '../../../states/dashboard/dashboard.selector';
import {
  dashboardCardData,
  dashboardData,
  setViewType,
} from '../../../states/dashboard/dashboard.action';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { RouteNames } from '../../enums/routeNames';
import { dashboardDataModel } from '../../data-access/models/dashboard.model';
import { tabDescription } from '../../enums/tabDescription';
import { currentFiscalYear } from '../../utils/functions/dateUtils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UniversityApplications } from '../../../admin/data-access/models/university-card-info.model';
import { LoaderService } from '../../data-access/services/loader.service';
import { RouteEnum } from '../../enums/routes';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: [
    './main-dashboard.component.scss',
    '../../../shared/utils/styling/tabGroups.scss',
  ],
})
export class MainDashboardComponent implements OnChanges,OnDestroy {
  @ViewChild('emptyList') emptyListTemplate: TemplateRef<any> | undefined;
  @ViewChild('dateSelect') dateSelect: MatSelect | undefined;
  @Output() tabSelected = new EventEmitter<string>();
  @Output() deselectUniversity = new EventEmitter<boolean>();
  @Output() triggerRefresh = new EventEmitter<boolean>();
  numberOfActiveBursaries: number = 0;
  numberOfApplications: number = 0;
  bursaryApplications: Details[] = [];
  filteredApplications: Details[] = [];
  activeBursaries: Details[] = [];
  emptyListMessage: string | undefined;
  numberOfApplicationsInReview: number = 0;
  selectedTab: string = '';
  numberInReviewApplications: number = 0;
  numberInvoiceApplications: number = 0;
  numberPaymentApplications: number = 0;
  numberPendingApplications: number = 0;
  numberEmailFailedApplications: number = 0;
  numberContractApplications: number = 0;
  numberDraftApplications: number = 0;
  numberDeclinedApplications: number = 0;
  numberApplicationsInProgress: number = 0;
  numberFirstApprovalApplications: number = 0;
  numberSecondApprovalApplications: number = 0;
  numberFinalApprovalInProgress: number = 0;
  numberApplicationsInBursaryProcessing: number = 0;
  role!: Roles;
  tabs: string[] = ['Approved', 'In Review', 'Declined', 'Pending'];
  noApplicationsErrorMessage = NoApplicationErrorMessage.errorMessage;
  @Input() dateOptions: number[] | undefined;
  currentYear: number = currentFiscalYear();
  @Input() selectedDate: number = currentFiscalYear();
  bursaryTypeOptions: string[] | undefined;
  selectedBursaryType:string = 'All';
  filteredInReview: Details[] = [];
  filteredDeclined: Details[] = [];
  filteredInvoice: Details[] = [];
  filteredPending: Details[] = [];
  filteredPayment: Details[] = [];
  filteredEmailFailed: Details[] = [];
  filteredContract: Details[] = [];
  filteredAwaitingApproval: Details[] = [];
  filteredDraft: Details[] = [];
  filteredFirstApprovalApplications: Details[] = [];
  filteredSecondApprovalApplications: Details[] = [];
  filteredFinalApprovalApplications: Details[] = [];
  selectedTabIndex: number = 0;
  dashBoardData$!: Observable<any>;
  dashBoardCardData$!: Observable<any>;
  tabIndex: number = 0;
  applicationsCount!: ApplicationsCount;
  isActive: boolean | undefined;
  universityName: string = '';
  private searchSubscription: any;
  private searchTerms = new Subject<{searchTerm:string, searchType:string}>();
  allocationModel: any = {} as AllocationModel;
  totalRequested: any;
  requestedAmount: any;
  rolesEnum: typeof Roles = Roles;
  userRank!: Ranks;
  ranksEnum: typeof Ranks = Ranks;
  department!: string;
  fiscalYear: number = currentFiscalYear();
  filterForm!: FormGroup;
  isLoading: boolean = false;
  @Input() universityApplications!:{ details: UniversityApplications; allocations: AllocationModel; universityName: string} | dashboardDataModel;
  currentSearchTerm: string='';
  DEBOUNCE_TIME: number=100;
  currentRoute: string = '';
  @Input() viewType: string ='';
  consolidatedView: boolean = false;
  applicationsRoute: boolean = false;
  activeBursariesRoute: boolean = false;
  tabHeading: string = '';

  constructor(
    private shareDataService: DataService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private userStore: UserStore,
    private applicationInsights: ApplicationInsightsService,
    private formBuilder: FormBuilder,
    private loader: LoaderService,
    private cdr: ChangeDetectorRef
  ) {
    this.filterForm = this.formBuilder.group({
      filterYear: [this.fiscalYear, Validators.required],
    })
    if (this.router.url.includes('/dashboard/bursaries?tab=1')) {
      this.selectedTabIndex = 1;
    } else {
      this.selectedTabIndex = 0;
    }
    this.userStore.get().subscribe((user) => {
      this.role = Roles[user.role as keyof typeof Roles];
      this.userRank = Ranks[user.rank as keyof typeof Ranks];
    });
    this.routeParamSubscription();
    this.currentRoute = this.router.url.split('?')[0];
    this.applicationsRoute = this.currentRoute === RouteEnum.AdminApplications;
    this.activeBursariesRoute = this.currentRoute === RouteEnum.AdminActiveBursaries;
    this.consolidatedView = this.currentRoute === RouteEnum.AdminActiveBursaries || this.currentRoute === RouteEnum.AdminApplications;
    this.viewType = this.consolidatedView ? 'all' : '';
    if(this.role === this.rolesEnum.HOD || this.role === this.rolesEnum.dean || (this.role === this.rolesEnum.admin && this.consolidatedView))
      {
      this.store.subscribe((state: AppState) => {
        const dashboardDataSuccess = state.dashboard.dashboardDataSuccess;
        const dashboardCardDataSuccess = state.dashboard.dashboardCardDataSuccess;
      if (dashboardDataSuccess) {
        this.universityApplications = dashboardDataSuccess.kind === "dashboardDataModel"?dashboardDataSuccess.data: {details:null,allocations:this.allocationModel,universityName:""};
          this.updateTabData(this.universityApplications as dashboardDataModel);
          this.setNumberOfApplications();

          if (this.consolidatedView && this.selectedBursaryType) {
            this.search({searchTerm: this.selectedBursaryType, searchType: 'bursaryType'});
          }
          if (dashboardCardDataSuccess) {
            this.updateAllocationUsageBar(dashboardCardDataSuccess);
            this.configureDateFilter();
            this.configureBursaryTypeFilter();
          }
        }
      });
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.role ===this.rolesEnum.admin)
    {
      this.updateTabData(this.universityApplications as dashboardDataModel);
      this.updateAllocationUsageBar((this.universityApplications as {details: UniversityApplications; allocations: AllocationModel; universityName: string}).allocations);
      this.setNumberOfApplications();
    }
  }
  configureDateFilter(): void {
    this.dateOptions = this.allocationModel.years;
    this.selectedDate =
      this.dateOptions?.find((date) => date == this.selectedDate) ?? this.currentYear;
  }
  configureBursaryTypeFilter(): void {
    this.bursaryTypeOptions = ['All', ...(this.allocationModel.bursaryTypes ?? [])];
    this.selectedBursaryType =
    this.bursaryTypeOptions?.find((bursaryType) => bursaryType == this.selectedBursaryType) ?? 'All';
  }
  updateTabData(dashboardDataSuccess: dashboardDataModel): void {
    const details = dashboardDataSuccess.details;
    const inReviewInvalid = details?.inReview ?? [];
    const awaitingExecApproval =
      details?.applicationAwaitingExecutiveApproval ?? [];
    const awaitingFinanceApproval =
      details?.applicationAwaitingFinanceApproval ?? [];
    const invoiceAwaitingExecApproval =
      details?.invoiceAwaitingExecutiveApproval ?? [];
    const invoiceAwaitingFinApproval =
      details?.invoiceAwaitingFinanceApproval ?? [];
    const provisionalInvoice =
      details?.provisionalInvoice ?? [];
    const awaitingFundDistribution =
      details?.applicationAwaitingFundDistribution ?? [];
    const inContract = details?.contract ?? [];
    const provisionalContract = details?.provisionalContract ?? [];
    const provisionalPayment = details?.provisionalPayment ?? [];
    const onboarded = details?.onboarded ?? [];
    const provisionalActive = details?.provisionalActive ?? [];
    if (this.userRank === this.ranksEnum.senior_admin) {
      this.filteredInReview = awaitingFinanceApproval ?? [];
    } else if (this.userRank === this.ranksEnum.admin_officer) {
      this.filteredInReview = [
        ...awaitingFinanceApproval,
        ...awaitingExecApproval,
        ...inContract,
      ];
    } else {
      this.filteredInReview = [
        ...awaitingExecApproval,
        ...awaitingFinanceApproval,
        ...inReviewInvalid,
        ...details?.pendingRenewal??[]
      ];
    }
    this.filteredInvoice =
      this.userRank === this.ranksEnum.assistant_admin ||
      this.userRank === this.ranksEnum.chief_admin ||
      this.role === this.rolesEnum.HOD ||
      this.role === this.rolesEnum.dean
        ? [
            ...(details?.invoice ?? []),
            ...provisionalInvoice,
            ...invoiceAwaitingExecApproval,
            ...invoiceAwaitingFinApproval,
          ]
        : this.userRank === this.ranksEnum.admin_officer
          ? [...invoiceAwaitingExecApproval, ...invoiceAwaitingFinApproval]
          : invoiceAwaitingFinApproval;
    this.activeBursaries = [
      ...details?.active ?? [],
      ...provisionalActive,
      ...onboarded
    ];
    this.filteredPending = details?.pending ?? [];
    this.filteredDeclined = details?.declined ?? [];
    this.filteredPayment = [
      ...details?.payment ?? [],
      ...provisionalPayment
    ];
    this.filteredFirstApprovalApplications = [
      ...inReviewInvalid, ...details?.pendingRenewal ?? []
    ]
    this.filteredSecondApprovalApplications = [
      ...awaitingExecApproval ?? []];
    this.filteredFinalApprovalApplications = [
      ...awaitingFinanceApproval ?? []];
    if (
      this.userRank === this.ranksEnum.assistant_admin ||
      this.userRank === this.ranksEnum.chief_admin
    ) {
      this.filteredContract = [
        ...awaitingFundDistribution,
        ...inContract,
        ...provisionalContract
      ];
      this.filteredEmailFailed = details?.emailFailed ?? [];
      this.filteredDraft = details?.saved ?? [];
    }
    if (this.applicationsRoute) {
      this.bursaryApplications = [
        ...this.filteredInReview ?? [],
        ...this.filteredInvoice,
        ...this.filteredPending,
        ...this.filteredPayment,
        ...this.filteredContract,
        ...this.filteredEmailFailed
      ]

    }
  }

  routeParamSubscription(): void {

    if (this.role === Roles.dean)
      this.route.params.subscribe((params) => {
        this.department = decodeURIComponent(params['department']);
        this.shareDataService.setDepartment(this.department);
      });
  }

  setNumberOfApplications(): void {
    const unusedRanks = [
      this.ranksEnum.senior_admin,
      this.ranksEnum.admin_officer,
    ];

    this.applicationsCount = {
      pending: !unusedRanks.includes(this.userRank)
        ? this.filteredPending.length
        : 0,
      active: this.activeBursaries.length,
      inReview: this.filteredInReview.length,
      FirstApprovalApplications: this.filteredFirstApprovalApplications.length,
      SecondApprovalApplications: this.filteredSecondApprovalApplications.length,
      FinalApprovalApplications: this.filteredFinalApprovalApplications.length,
      invoice: this.filteredInvoice.length,
      payment: !unusedRanks.includes(this.userRank)
        ? this.filteredPayment.length
        : 0,
      emailFailed: !unusedRanks.includes(this.userRank)
        ? this.filteredEmailFailed.length
        : 0,
      contract: this.filteredContract.length,
      draft: !unusedRanks.includes(this.userRank)
        ? this.filteredDraft.length
        : 0,
      declined:
        this.role !== this.rolesEnum.admin ? this.filteredDeclined.length : 0,
    };
    this.setAllNumberOfActiveApplications();
  }

  updateAllocationUsageBar(data: AllocationModel): void {
    this.allocationModel = data;
    this.totalRequested = this.allocationModel.requestedAmount;
    this.requestedAmount = this.allocationModel.requestedAmount;

    this.shareDataService.sendAllocationUsageData([
      this.allocationModel,
      this.totalRequested,
      this.requestedAmount,
    ]);
  }

  setupSearchSubscription(): void {
    this.searchSubscription = this.searchTerms
      .pipe(debounceTime(this.DEBOUNCE_TIME), distinctUntilChanged())
      .subscribe((term) => this.search(term));
  }

  onSearchInput(term: {searchTerm:string, searchType:string}): void {
    this.searchTerms.next(term);
  }

  getCurrentSearch(): string {
    return this.shareDataService.getCurrentSearchName();
  }

  search(term: {searchTerm:string, searchType:string}): void {
    const lowerCaseTerm = term.searchTerm.toLowerCase().trim();
    this.currentSearchTerm = lowerCaseTerm; 
  
    if (!this.universityApplications || !this.universityApplications.details) {
      this.updateTabData({ details: null } as dashboardDataModel); 
      this.setNumberOfApplications();
      return;
    }
  
    const originalDetailsObject = this.universityApplications.details;
    const filteredDetails: Partial<UniversityApplications> = {};
  
    if (!lowerCaseTerm) {
      for (const key in originalDetailsObject) {
        if (Object.prototype.hasOwnProperty.call(originalDetailsObject, key)) {
          const typedKey = key as keyof UniversityApplications;
          const applicationList = originalDetailsObject[typedKey];
          if (Array.isArray(applicationList)) {
            (filteredDetails)[typedKey] = [...applicationList];
          } else {
            (filteredDetails)[typedKey] = applicationList;
          }
        }
      }
    } else {
      Object.entries(originalDetailsObject).forEach(
        ([key, applicationList]) => {
          const typedKey = key as keyof UniversityApplications; 
  
          if (Array.isArray(applicationList)) {
            if (term.searchType === 'name') {
              (filteredDetails)[typedKey] = applicationList.filter(
                (app: Details) => 
                  (app.fullName && 
                  typeof app.fullName === "string" && 
                  app.fullName.toLowerCase().includes(lowerCaseTerm)) 
              );
            } else if (term.searchType === 'bursaryType') {
              if (lowerCaseTerm === 'all') {
                (filteredDetails)[typedKey] = applicationList;
              } else {
                (filteredDetails)[typedKey] = applicationList.filter(
                  (app: Details) => 
                    (app.bursaryType && 
                    typeof app.bursaryType === "string" && 
                    app.bursaryType.toLowerCase().includes(lowerCaseTerm)) 
                );
              }
            }
          } else {
            (filteredDetails)[typedKey] = applicationList;
          }
        }
      );
    }
  
    const nameFilteredDashboardData: dashboardDataModel = {
      ...this.universityApplications, 
      details: filteredDetails as dashboardDataModel["details"], 
    };
  
    this.updateTabData(nameFilteredDashboardData);
    this.setNumberOfApplications();
    this.cdr.markForCheck();
  }

  goBack(): void {
    this.deselectUniversity.emit(true);
  }

  ngOnInit(): void {
    this.shareDataService.tabdata$.subscribe((data) => {
      if (data) {
        this.setSelectedTab(data.selectedTab);
        this.selectedTabIndex = data.index;
      }
    });
    this.store.dispatch(setViewType({ viewType: this.viewType })); 
    this.assignDefaultLandingTab();
    this.setupSearchSubscription();
    this.setupDataSubscription();
    this.userStore.get().subscribe((user) => {
      this.role = Roles[user.role as keyof typeof Roles];
    });
    this.loader.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  logApplicationInsights(): void {
    this.applicationInsights.logPageView(
      RouteNames.BURSARY_DETAILS,
      this.router.url,
    );
  }
  assignDefaultLandingTab(): void {
    if (this.role === this.rolesEnum.admin) {
      if (this.applicationsRoute) {
        this.selectedTabIndex === 0 ? this.setSelectedTab('') :
        (this.selectedTabIndex === 1 ? this.setSelectedTab('Pending') :
        (this.selectedTabIndex === 3 ? this.setSelectedTab('Contract') : 
        (this.selectedTabIndex === 2 ? this.setSelectedTab('First approval') : this.setSelectedTab('In review')))); 
      } else {
        this.setSelectedTab('In review');
      }
    } else {
      this.setSelectedTab('Pending');
    }
  }

  setupDataSubscription(): void {
    if (this.role === this.rolesEnum.HOD || (this.role === this.rolesEnum.admin && this.consolidatedView)) {
      let selectedYear: number = 1;
      this.shareDataService.date$.subscribe((year) => {
        selectedYear = year;
      });
      this.dashBoardData$ = this.store.pipe(select(selectDashboardData));
      this.dashBoardData$.pipe(first()).subscribe((data) => {
        if ( selectedYear !== this.selectedDate || !data.data || !data.data.details) {
          this.store.dispatch(dashboardData({ viewType: this.viewType, date: this.selectedDate }));
          this.shareDataService.dateState(this.selectedDate);
        }
      });
      this.dashBoardCardData$ = this.store.pipe(
        select(selectDashboardCardData),
      );
      this.dashBoardCardData$.pipe(first()).subscribe((data) => {
        if (!data) {
          this.store.dispatch(dashboardCardData());
        }
      });
    }
    this.shareDataService.tabdata$.subscribe((data) => {
      if (data) {
        this.setSelectedTab(data.selectedTab);
        this.selectedTabIndex = data.index;
      }
    });
  }

  tabChanged($event: MatTabChangeEvent): void {
    this.selectedTabIndex = $event.index;
    this.assignDefaultLandingTab();
  }
  filterActiveApplicationsByDate(event: MatSelectChange): void {
    if(event.value) {
      this.shareDataService.dateState(event.value);
      this.store.dispatch(dashboardData({ viewType: this.viewType, date: event.value }));
      if(this.role !== this.rolesEnum.admin) {
        this.store.dispatch(dashboardCardData());
      }
    }
  }
  filterActiveApplicationsByBursaryType(event: MatSelectChange): void {
    if(event.value) this.selectedBursaryType = event.value;
  }

  setSelectedTab(selectedTab: string): void {
    this.selectedTab = selectedTab;
  }

  setTabHeading(tabHeading: string): void {
    this.tabHeading = tabHeading;
  }

  ngOnDestroy(): void {
    this.shareDataService.tabState({
      selectedTab: this.selectedTab,
      index: this.selectedTabIndex,
    });
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

  }

  setNumberOfActiveApplications(numberOfActiveApplications: number): void {
    this.numberOfActiveBursaries = numberOfActiveApplications;
  }

  setAllNumberOfActiveApplications(): void {
    this.numberInReviewApplications = this.applicationsCount.inReview;
    this.numberInvoiceApplications = this.applicationsCount.invoice;
    this.numberPaymentApplications = this.applicationsCount.payment;
    this.numberPendingApplications = this.applicationsCount.pending;
    this.numberEmailFailedApplications = this.applicationsCount.emailFailed!;
    this.numberContractApplications = this.applicationsCount.contract!;
    this.numberOfActiveBursaries = this.applicationsCount.active;
    this.numberContractApplications = this.applicationsCount.contract!;
    this.numberDraftApplications = this.applicationsCount.draft!;
    this.numberDeclinedApplications = this.applicationsCount.declined!;
    this.numberOfApplications = this.getTotalCount(this.applicationsCount);
    this.numberApplicationsInProgress = 
        this.numberPendingApplications + this.numberEmailFailedApplications + this.numberDeclinedApplications;
    this.numberApplicationsInBursaryProcessing = 
        this.numberContractApplications + this.numberPaymentApplications + this.numberInvoiceApplications;
    this.numberFirstApprovalApplications = this.applicationsCount.FirstApprovalApplications!;
    this.numberSecondApprovalApplications = this.applicationsCount.SecondApprovalApplications!;
    this.numberFinalApprovalInProgress = this.applicationsCount.FinalApprovalApplications!;
  }

  getTotalCount(applicationsCount: ApplicationsCount): number {
    let totalCount = 0;
    for (const key in applicationsCount) {
      if (applicationsCount.hasOwnProperty(key) && !['active','FirstApprovalApplications','SecondApprovalApplications','FinalApprovalApplications'].includes(key)) {
        if (key in applicationsCount) {
          totalCount += applicationsCount[key as keyof ApplicationsCount] ?? 0;
        }
      }
    }
    return totalCount;
  }
  getUniversityName(): string {
    return  (this.universityApplications as {details: UniversityApplications; allocations: AllocationModel; universityName: string}).universityName;
  }
  showAllTabs(): boolean {
    return (
      this.userRank === this.ranksEnum.assistant_admin ||
      this.userRank === this.ranksEnum.chief_admin
    );
  }

  getTabDescription(): string {
    const isAdmin = this.role === this.rolesEnum.admin;
    const descriptions: Record<string, string> = {
      Pending: isAdmin ? tabDescription.PENDING_ADMIN : tabDescription.PENDING,
      'In review': isAdmin
        ? tabDescription.IN_REVIEW_ADMIN
        : tabDescription.IN_REVIEW,
      Invoice: isAdmin ? tabDescription.INVOICE_ADMIN : tabDescription.INVOICE,
      Payment: isAdmin ? tabDescription.PAYMENT_ADMIN : tabDescription.PAYMENT,
      Declined: tabDescription.DECLINED,
      Draft: tabDescription.DRAFT,
      'Email Failed': tabDescription.EMAIL_FAILED,
      Contract: tabDescription.CONTRACT,
      'First approval': tabDescription.IN_REVIEW_ADMIN,
      'Second approval': tabDescription.IN_REVIEW_ADMIN,
      'Final approval': tabDescription.IN_REVIEW_ADMIN
    };
    return descriptions[this.selectedTab] ?? '';
  }
  applyAdminTabStyle(): boolean {
    return !(this.role === this.rolesEnum.admin);
  }

  triggerStateRefresh(event: boolean): void {
    this.triggerRefresh.emit(event);
  }
}
