import { Component } from '@angular/core';
import { DeclinedApplications } from '../../data-access/models/declinedApplication-model';
import { BursaryApplicationsService } from '../../data-access/services/bursaryApplications.service';
import { IResponse } from '../../../shared/data-access/models/response.models';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserStore } from '../../../shared/data-access/stores/user.store';
import { applications } from '../../../shared/enums/noApplications';
import { LoaderService } from '../../../shared/data-access/services/loader.service';

@Component({
  selector: 'app-declined-applications',
  templateUrl: './declined-applications.component.html',
  styleUrl: './declined-applications.component.scss',
})
export class DeclinedApplicationsComponent {
  declinedApplications: DeclinedApplications[] = [];
  displayedColumns: string[] = [
    'Bursar full name',
    'Bursary amount',
    'Type',
    'Reason given',
    'action',
  ];
  dataSource: MatTableDataSource<DeclinedApplications> =
    new MatTableDataSource<DeclinedApplications>([]);
  userRole: string = '';
  noApplicationErrorMessage: string = applications.noApplicationErrorMessage;
  isLoading: boolean = false;

  constructor(
    private bursaryApplicationsService: BursaryApplicationsService,
    private router: Router,
    private userStore: UserStore,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.userStore.get().subscribe((user) => {
      this.userRole = user.role;
    });
    this.getDeclinedDetails();
    this.loader.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }
  getDeclinedDetails(): void {
    this.bursaryApplicationsService
      .getDeclinedApplications()
      .subscribe((response: IResponse<DeclinedApplications[]>) => {
        if (response.results) {
          this.declinedApplications = response.results;
        } else if (response.errors) {
        }
      });
  }
  navigateToDetailsPage(applicationGuid: any) {
    this.router.navigate(['/admin/studentDetails', applicationGuid]);
  }
}
