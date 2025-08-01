import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Approvers } from '../../enums/student-details';

export interface FormattedApplicationHistoryItem {
  applicationStatusHistoryId: number;
  userId: string;
  applicationId: number;
  applicationGuid: string;
  status: string;
  fromDate: string;
  ToDate: string;
  Approver: {
    nameRole?: string;
    email?: string;
    rank?: string;
  } | string;
}

@Component({
  selector: 'app-application-history',
  templateUrl: './application-history.component.html',
  styleUrls: ['./application-history.component.scss'],
  providers: [TitleCasePipe] 
})
export class ApplicationHistoryComponent implements OnInit, OnChanges {
  @Input() historyItems: FormattedApplicationHistoryItem[] = [];

  public panelOpenState: boolean = false; 
  public numberOfIterations: number = 0;

  constructor(private titleCasePipe: TitleCasePipe) {} 

  ngOnInit(): void {
    this._updateIterations();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['historyItems']) {
      this._updateIterations();
    }
  }

  private _updateIterations(): void {
    this.numberOfIterations = this.historyItems && this.historyItems.length > 0
      ? this.historyItems.length - 1
      : 0;
  }

  isAStatus(applicationHistoryItem: FormattedApplicationHistoryItem): boolean {
    return applicationHistoryItem.status.includes('Status') ? true : false; 
  }
  getApproverRole(applicationHistoryItem: FormattedApplicationHistoryItem): string {
    if (typeof applicationHistoryItem.Approver === 'object' && applicationHistoryItem.Approver.rank) {
      const rank = applicationHistoryItem.Approver.rank;
      const approverRoleValue = Approvers[rank as keyof typeof Approvers];
      return approverRoleValue ? ` (${approverRoleValue})` : "";
    }
    return "";
  }

  isStudent(applicationHistoryItem: FormattedApplicationHistoryItem): boolean {
    return typeof applicationHistoryItem.Approver === 'string';
  }

  getApproverNameRole(approver: FormattedApplicationHistoryItem['Approver']): string | undefined {
    if (typeof approver === 'object' && approver.nameRole) {
        return !approver.nameRole.includes('HOD') ? this.titleCasePipe.transform(approver.nameRole) : approver.nameRole;
    }
    return undefined;
  }

  getApproverEmail(approver: FormattedApplicationHistoryItem['Approver']): string | undefined {
      if (typeof approver === 'object') {
          return approver.email;
      }
      return undefined;
  }
}