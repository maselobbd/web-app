import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
} from '@angular/forms';
import { UserStore } from '../../../shared/data-access/stores/user.store';

import { ErrorMessages } from '../../../application/enums/messages';
import { ApplicationInsightsService } from '../../../shared/data-access/services/application-insights.service';
import { RouteNames } from '../../../shared/enums/routeNames';
import { Router } from '@angular/router';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { IUni } from '../../../admin/data-access/models/universityUsers-model';
import { DepartmentType, UniversityData } from '../../../shared/data-access/models/universityProfiles.model';
import { Roles } from '../../../authentication/data-access/models/auth.model';

@Component({
  selector: 'app-applicationform',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss'],
})
export class ApplicationformComponent implements OnInit, OnChanges {
  @Output() formDeleted = new EventEmitter<number>();
  @Input() university: string = '';
  @Input() department: string = '';
  @Input() faculty: string = '';
  @Input() state: 'open' | 'close' = 'open';
  @Input() formNumber = 0;
  @Input() applicationData!: FormGroup;
  @Input() canBeDeleted: boolean = false;
  @Input() isOnboarding: boolean = true;
  @Input() universityDepartment!: UniversityData[];
  
  selectedUniversity = '';
  universities: string[] = [];
  defaultUniversity = '';
  disableUniversityField: boolean = false;
  applicationForm!: FormGroup;
  errorMessages: any = ErrorMessages;
  userExists: boolean = false;
  showForm: boolean = true;
  uploadStudentFinancialDocs = false;
  bursaryType = 'BBD';
  bursaryTiers = [1, 2, 3];
  userRole!: Roles;
  isAdmin = false;
  rolesEnum: typeof Roles = Roles;
  administrativeRoles = [this.rolesEnum.admin, this.rolesEnum.finance];
  private destroy$ = new Subject<void>();
  
  filteredUniversities!: Observable<string[]>;
  filteredFaculties!: Observable<string[]>;
  filteredDepartments!: Observable<string[]>;
  
  constructor(
    private userStore: UserStore,
    private applicationInsights: ApplicationInsightsService,
    private router: Router,
  ) {}
  
  ngOnInit(): void {
    this.setUserUniversity();
    this.applicationInsights.logPageView(RouteNames.HOD_APPLICATIONS, this.router.url);
    this.userStore
        .get()
        .pipe(takeUntil(this.destroy$))
        .subscribe((user) => {
          this.userRole = Roles[user.role as keyof typeof Roles];
          this.isAdmin = this.administrativeRoles.includes(this.userRole);
        });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
  }
  
  setUserUniversity(): void {
    this.userStore.get().subscribe((user) => {
      if (user && !this.isOnboarding) {
        this.applicationData.get('university')?.setValue(user.university);
        this.universities.push(user.university);
        this.applicationData.get('university')?.disable();
      }
    });
  }
  
  deleteForm(): void {
    if (this.canBeDeleted) {
      this.showForm = false;
      this.formDeleted.emit(this.applicationData.get("id")?.getRawValue());
    }
  }
  
  toggleState(): void {
    this.state === 'open' ? this.close() : this.open();
  }
  
  open(): void {
    this.state = 'open';
  }
  
  close(): void {
    this.state = 'close';
    this.applicationData.markAllAsTouched();
  }
  
  receiveFile($event: any): void {
    this.applicationData.get($event.documentType)?.setValue($event.filebytes);
  }
}
  