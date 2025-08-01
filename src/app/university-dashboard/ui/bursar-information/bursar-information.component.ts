import { Component, Input, OnInit } from '@angular/core';
import { UniversityStudentDetails } from '../../data-access/models/student-details-model';
import { DocumentStatus } from '../../../shared/enums/documentStatus';
import { UserAttributes } from '../../../authentication/data-access/models/auth.model';

@Component({
  selector: 'app-bursar-information',
  templateUrl: './bursar-information.component.html',
  styleUrls: ['./bursar-information.component.scss', '../../../shared/utils/styling/sharedStudentDetails.scss',]
})
export class BursaryInformationComponent implements OnInit {
  @Input() student!: UniversityStudentDetails;
  invoiceStatus: string = '';

  approvedStudentInvoiceStatus: string = '';
  documentsStatus = DocumentStatus
  user!: UserAttributes;
  constructor() { }

  ngOnInit(): void {
    this.setApprovedStudentInvoiceStatus();
  }

  ngOnChanges(): void {
    if (this.student) {
        this.setApprovedStudentInvoiceStatus();
    }
  }

  private setApprovedStudentInvoiceStatus(): void {
    if (this.student && this.student.status === 'Approved') {
      this.approvedStudentInvoiceStatus = this.student.invoiceStatus || 'Status N/A';
    } else if (this.student) {
      this.approvedStudentInvoiceStatus = this.student.status;
    } else {
        this.approvedStudentInvoiceStatus = 'Status N/A';
    }
  }

  getCurrentStatusDisplay(): string {
    if (!this.student) return 'N/A';

    if (this.student.status === 'Approved' && this.student.invoiceStatus === 'Approved') {
      return 'Bursary Awarded';
    } else if (this.student.status === 'Approved' && this.student.invoiceStatus === 'Pending Invoice') {
      return 'Awaiting Invoice';
    } else if (this.student.status === 'In Review') {
      return 'In Review';
    } else if (this.student.status === 'Rejected') {
      return 'Application Rejected';
    }

    return this.student.status || 'N/A';
  }

  get rejectionReasonDisplay(): string | null {
    if (!this.student) return null;
    if (this.student.reason || this.student.motivation) {
      return this.student.reason === 'Other' && this.student.motivation
             ? this.student.motivation
             : this.student.reason;
    }
    return null;
  }
}