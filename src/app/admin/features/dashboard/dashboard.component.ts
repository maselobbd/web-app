import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { distinctUntilChanged, take, map } from 'rxjs/operators';
import { DashboardDataType, UniversityApplications, UniversityData } from '../../data-access/models/university-card-info.model';
import { DataService } from '../../../shared/data-access/services/data.service';
import { ImagePaths } from '../../enums/imagePaths';
import { applications } from '../../../shared/enums/noApplications';
import { currentFiscalYear } from '../../../shared/utils/functions/dateUtils';
import { AppState } from '../../../states/app.state';
import { AllocationModel } from '../../../shared/data-access/models/allocation.models';
import { 
  selectDashboardData, 
  selectViewType, 
  selectDashboardError,
} from '../../../states/dashboard/dashboard.selector';
import { Router, ActivatedRoute } from '@angular/router';
import { dashboardData, setViewType } from '../../../states/dashboard/dashboard.action';
import { UserStore } from '../../../shared/data-access/stores/user.store';
import { Roles } from '../../../authentication/data-access/models/auth.model';
import { ImagePreloadService } from '../../../shared/data-access/services/imagePreload.service';
import { Location } from '@angular/common';
import { LoaderService } from '../../../shared/data-access/services/loader.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {

  dashboardData$: Observable<DashboardDataType>;
  viewType$: Observable<string>;
  error$: Observable<any>;
  universities$: Observable<UniversityData[]>;
  universitiesPresent: boolean = false;
  selectedUniversity$: Observable<{ 
    details: UniversityApplications; 
    allocations: AllocationModel; 
    universityName: string 
  } | undefined>;

  private subscriptions = new Subscription();
  currentYear = currentFiscalYear();
  selectedDate = this.currentYear;
  viewType = '';
  role: Roles | null = null;
  noApplicationErrorMessage = applications.noApplicationErrorMessage;
  dateOptions: number[] = [];
  selectedBursaryType = 'All';
  bursaryTypeOptions: string[] = ['All'];
  isLoading = false;
  rolesEnum = Roles;
  wasFromStudentDetails = false;

    constructor(
    private store: Store<AppState>,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private userStore: UserStore,
    private cdr: ChangeDetectorRef,
    private loader: LoaderService,
    private imagePreloadService: ImagePreloadService,
    private location: Location
  ) {
    this.dashboardData$ = this.store.select(selectDashboardData);
    this.viewType$ = this.store.select(selectViewType);
    this.error$ = this.store.select(selectDashboardError);
    this.universities$ = this.dashboardData$.pipe(
      map(data => {
        if (data?.kind === 'universityData') {
          return this.mapImages(data.data);
        }
        return [];
      })
    );
    
    this.selectedUniversity$ = combineLatest([
      this.universities$,
      this.route.queryParams
    ]).pipe(
      map(([universities, params]) => {
        this.universitiesPresent = universities.some(university => !!university.universityDetails);
        if (params['university'] && universities.length) {
          const university = universities.find(
            u => u.universityDetails?.universityName === params['university']
          );
          if (university?.universityDetails) {
            return {
              details: university.universityApplications!,
              allocations: university.allocations!,
              universityName: university.universityDetails.universityName!
            };
          }
        }
        return undefined;
      })
    );
  }
  
  ngOnInit(): void {
    this.loader.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    const navState = this.location.getState() as { navigationId?: number, navigationType?: string, fromStudentDetails?: boolean };
    this.wasFromStudentDetails = !!(navState && navState.fromStudentDetails === true);
    this.subscriptions.add(
      this.userStore.get().subscribe(user => {
        this.role = user ? Roles[user.role as keyof typeof Roles] : null;
      })
    );
    
    this.subscriptions.add(
      this.route.queryParams.subscribe(params => {
        if (params['viewType'] && params['viewType'] !== this.viewType) {
          this.store.dispatch(setViewType({ viewType: params['viewType'] }));
          this.viewType =  params['viewType'];
          this.loadDashboardData(!this.wasFromStudentDetails);
        }
      })
    );
    
    this.subscriptions.add(
      this.dataService.date$.pipe(
        distinctUntilChanged()
      ).subscribe(date => {
        this.selectedDate = date || this.currentYear;
        this.loadDashboardData(!this.wasFromStudentDetails);
        this.cdr.markForCheck();
      })
    );
    
    this.dateOptions = this.generateDateOptions();
    
    this.subscriptions.add(
      this.selectedUniversity$.subscribe(university => {
        if (university) {
          this.cdr.markForCheck();
        }
      })
    );
  }
  
  loadDashboardData(showLoader: boolean = true): void {
    this.isLoading = showLoader;
    this.store.dispatch(dashboardData({ 
      viewType: this.viewType, 
      date: this.selectedDate
    }));
  }

  mapImages(universities: UniversityData[]): UniversityData[] {
    return universities.map(university => {
      if (!university.universityDetails) {
        return { ...university, universityApplications: undefined };
      }
      const universityName = university.universityDetails.universityName?.toLowerCase().trim();
      const imageUrl = this.getUniversityImageUrl(universityName);
      this.imagePreloadService.preloadImageIfNeeded(imageUrl);
      return {
        ...university,
        universityDetails: {
          ...university.universityDetails,
          imageUrl,
        },
      };
    });
  }

  getUniversityImageUrl(universityName?: string): string {
    if (!universityName) return ImagePaths.DEFAULT;

    const imageMap: { [key: string]: string } = {
      'university of the witwatersrand': ImagePaths.WITS,
      'wits': ImagePaths.WITS,
      'nelson mandela university': ImagePaths.NMU,
      'nmu': ImagePaths.NMU,
      'university of the free state': ImagePaths.UFS,
      'ufs': ImagePaths.UFS,
      'university of johannesburg': ImagePaths.UJ,
      'uj': ImagePaths.UJ,
      'university of pretoria': ImagePaths.UP,
      'up': ImagePaths.UP,
      'university of cape town': ImagePaths.CT,
      'uct': ImagePaths.CT,
      'cape peninsula university of technology': ImagePaths.CPU,
      'cput': ImagePaths.CPU,
      'rhodes university': ImagePaths.RUR,
      'rur': ImagePaths.RUR,
      'belgium campus': ImagePaths.BCU,
      'university of south africa': ImagePaths.UNISA,
      'unisa': ImagePaths.UNISA,
      'university of kwazulu-natal': ImagePaths.UKZN,
      'ukzn': ImagePaths.UKZN,
    };

    return imageMap[universityName] || ImagePaths.DEFAULT;
  }

  onDateChange(date: number): void {
    this.selectedDate = date;
    this.dataService.dateState(date);
  }

  onViewTypeChange(viewType: string): void {
    this.viewType = viewType;
    this.store.dispatch(setViewType({ viewType }));
    this.loadDashboardData(true);
  }

  selectUniversity(university: UniversityData): void {
    if (!university.universityDetails) return;

    const universityName = university.universityDetails.universityName;
    
    this.dataService.sendAllocationUsageData([
      university.allocations,
      university.allocations?.requestedAmount,
      university.allocations?.requestedAmount,
    ]);

    this.dataService.setSelectedUniversity(universityName);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { university: universityName },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  deselectUniversity(): void {
    this.dataService.setSelectedUniversity(null);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { university: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
  generateDateOptions(): number[] {
    const currentYear = new Date().getFullYear();
    return [currentYear - 1, currentYear, currentYear + 1];
  }
  filterActiveApplicationsByDate(date: number): void {
    this.selectedDate = date;
    this.dataService.dateState(date);
  }

  onSearchInput(event: { searchTerm: string; searchType: string }): void {
    if (event.searchType === 'bursaryType') {
      this.selectedBursaryType = event.searchTerm;
      this.store.dispatch(setViewType({ viewType: event.searchTerm }));
    }
  }
triggerStateRefresh($event: boolean) {
   this.store.dispatch(dashboardData({ }));
}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}