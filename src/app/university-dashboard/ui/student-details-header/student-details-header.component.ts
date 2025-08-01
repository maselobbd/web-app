import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Roles } from '../../../authentication/data-access/models/auth.model';
import { Router } from '@angular/router';
import { DocumentStatus } from '../../../shared/enums/documentStatus';
import { UniversityStudentDetails } from '../../data-access/models/student-details-model';
import { getEnumValue } from "../../../shared/utils/functions/getEnumValue.function";
import { ButtonAction } from "../../../shared/enums/buttonAction";

@Component({
  selector: 'app-student-details-header',
  templateUrl: './student-details-header.component.html',
  styleUrl: './student-details-header.component.scss'
})
export class StudentDetailsHeaderComponent {

  @Input() student: UniversityStudentDetails = {} as UniversityStudentDetails;
  @Input() isAdmin: boolean =true;
  @Input() role:Roles = Roles.all;
  @Input() applicationGuid ='';

  @Output() goBackClicked = new EventEmitter<void>();
  @Output() renewApplicationClicked = new EventEmitter<UniversityStudentDetails>();
  @Output() terminateBursaryClicked = new EventEmitter<void>();
  documentsStatus=DocumentStatus;
  terminatedDocumentStatus = [
    DocumentStatus.APPROVED,
    DocumentStatus.CONTRACT,
    DocumentStatus.INVOICE,
    DocumentStatus.PAYMENT,
    DocumentStatus.APPLICATION_ACTIVE
  ];
  constructor(private router: Router) { }
  onGoBack(): void {
    this.goBackClicked.emit();
  }
  onRenewApplication(): void {
    this.renewApplicationClicked.emit(this.student);
  }

  canRenew():boolean{
    return this.student.yearOfFunding === new Date().getFullYear();
  }

  navigateToEditDetails() {
    this.router.navigate(['/dashboard/editDetails', this.applicationGuid]);
  }

  revertApplication() {}

  onTerminateBursary(): void {
    this.terminateBursaryClicked.emit();
  }

  isValidStatus(): boolean {
    return this.terminatedDocumentStatus.includes(getEnumValue(this.student.status));
  }

  showRenewButton(): boolean {
    return (this.student.status === this.documentsStatus.APPROVED || this.student.status === this.documentsStatus.APPLICATION_ACTIVE) &&
      this.student.invoiceStatus === this.documentsStatus.APPROVED &&
      !!this.student.canRenew
  }

  protected readonly ButtonAction = ButtonAction;
}
