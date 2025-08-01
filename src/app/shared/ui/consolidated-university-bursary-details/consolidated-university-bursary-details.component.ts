import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Details } from '../../../admin/data-access/models/details-model';
import { Subscription } from 'rxjs';
import { RouteEnum } from '../../enums/routes';
import { ButtonAction } from '../../enums/buttonAction';
import { getConsolidatedApplicationStatus } from '../../utils/functions/getApplicationStatus.function';
import { InviteeInformation } from '../../data-access/models/inviteeInformation.model';
import { Router } from '@angular/router';
import { AdditionaInfoMessageType } from '../../enums/messages';

@Component({
  selector: 'app-consolidated-university-bursary-details',
  templateUrl: './consolidated-university-bursary-details.component.html',
  styleUrl: './consolidated-university-bursary-details.component.scss'
})
export class ConsolidatedUniversityBursaryDetailsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() currentTab?: string = '';
  @Input() details!: Details[] | InviteeInformation[];
  @Input() applicationArrayLength!:number;
  @Input() selectedHeaderTab?: number;
  @Input() index?:number;
  @Input() isEventPage: boolean = false;
  detailsAsDetails: Details[] = [];
  detailsAsInvitees: InviteeInformation[] = [];
  selectedApplication!: Details;
  detailsSubscription: Subscription | undefined;
  noDetailsMessage: string | undefined;
  isLoading: boolean = true;
  currentRoute: string = '';
  buttonAction: typeof ButtonAction = ButtonAction;
  applicationsRoute: boolean = false;
  activeBursariesRoute: boolean = false;
  consolidatedView: boolean = false;
  eventsRoute: boolean = false;
  application!: { invoiceStatus: string; status: string; };
  tabsToNavigateToSmallDetailsPage = ['Pending', 'Pending Info', 'Draft'];

  @Output() numberOfActiveApplications: EventEmitter<number> =
    new EventEmitter<number>();

  constructor(
    private router: Router,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['details']) {
      if (this.isEventPage) {
        this.detailsAsInvitees = this.details as InviteeInformation[] ?? [];
        this.noDetailsMessage = AdditionaInfoMessageType.NO_INVITEES;
      } else {
        this.detailsAsDetails = this.details as Details[] ?? [];
      }
    }
  }

  ngOnInit() {
    this.currentRoute = this.router.url;
    this.currentRoute = this.currentRoute.split('?')[0];
    this.applicationsRoute = this.currentRoute === RouteEnum.AdminApplications;
    this.activeBursariesRoute = this.currentRoute === RouteEnum.AdminActiveBursaries;
    this.consolidatedView = this.activeBursariesRoute || this.applicationsRoute;
    this.eventsRoute = this.currentRoute.includes('events');

    if (this.isEventPage) {
      this.detailsAsInvitees = this.details as InviteeInformation[] ?? [];
      this.noDetailsMessage = AdditionaInfoMessageType.NO_INVITEES;
    } else {
      this.detailsAsDetails = this.details as Details[] ?? [];
    }
  }

  ngOnDestroy(): void {
    if (this.detailsSubscription) {
      this.detailsSubscription.unsubscribe();
    }
  }

  getCurrentStatus(status: string) {
      return getConsolidatedApplicationStatus(status);
    }

  navigateToDetailsPage(applicationGuid: string) {
    if (this.tabsToNavigateToSmallDetailsPage.includes(this.currentTab!)) {
      this.router.navigate(['/admin/details', applicationGuid])
    } else {
      this.router.navigate(['/admin/studentDetails', applicationGuid])
    }
  }

  navigateToEmailFailed(applicationGuid: string) {
    this.router.navigate(['/admin/EmailFailed', applicationGuid]);
  }

  allTab() : boolean {
    return (this.applicationsRoute && this.selectedHeaderTab === 0)
  }

  isLastRow(index: number): boolean {
    return index === this.applicationArrayLength - 1;
  }

  getAllergies(inviteeDetails: InviteeInformation) {
    const allergies = inviteeDetails.allergies === 'N/A' ? `` : `Allergies - ${inviteeDetails.allergies}`;
    return allergies;
  }

  getNotes(inviteeDetails: InviteeInformation) {
    const notes = inviteeDetails.notes === 'N/A' ? `-` : inviteeDetails.notes;
    return notes;
  }
}
