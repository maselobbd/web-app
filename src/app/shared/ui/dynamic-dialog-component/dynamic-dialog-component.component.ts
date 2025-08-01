import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogTitles } from '../../enums/dialog-titles';
import { RejectStudentComponent } from '../../../university-dashboard/ui/reject-student/reject-student.component';
import { DialogMessage } from '../../enums/dialogMessages';
import { AdminService } from '../../../admin/data-access/services/admin.service';
import { Router } from '@angular/router';
import { ButtonAction } from '../../enums/buttonAction';
import { DataService } from '../../data-access/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdditionaInfoMessageType } from '../../enums/messages';
@Component({
  selector: 'app-dynamic-dialog-component',
  templateUrl: './dynamic-dialog-component.component.html',
  styleUrl: './dynamic-dialog-component.component.scss',
})
export class DynamicDialogComponentComponent {
  contractDialogTitle = DialogTitles.CONFIRM_CONTRACT;
  questionnaireTitle = DialogTitles.QUESTIONNAIRE;
  revertApplicationTitle = DialogTitles.REVERT_APPLICATION;
  revertReason = AdditionaInfoMessageType.REVERT_REASON_REQUIRED;
  revertStage = AdditionaInfoMessageType.REVERT_STAGE_REQUIRED
  fileToUpload: any = {};
  fileRemoved: boolean = false;
  contractFailedReasons: string[] = ['Contract failed', 'Other'];
  confirmButton = ButtonAction.CONFIRM;
  cancelButton = ButtonAction.CANCEL;
  contractFileUploaded: boolean = false;
  selectedRevertStage!: string;
  revertOptions: string[] = ['Distribute funds'];
  form!: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<DynamicDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private adminService: AdminService,
    private router: Router,
    private sharedDataService: DataService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      revertToStage: ['', Validators.required], 
      reason: ['', Validators.required] ,
      revertFromStage:[this.data.currentStage]
    });
  }
  onCancel(): void {
    this.dialogRef.close();
  }

  OnSubmit(): void {
    switch(this.data.dialogHeader)
    {
      case this.contractDialogTitle:
        this.dialogRef.close(this.fileToUpload);
        break;
      case this.revertApplicationTitle:
        this.dialogRef.close(this.form.getRawValue())
        break;
        default:
          this.dialogRef.close(true);
    }
  }
  setFile(event: any) {
    this.fileToUpload = event;
    if (this.fileToUpload.hasOwnProperty('file')) {
      this.fileRemoved = this.fileToUpload.removeFile;
      this.contractFileUploaded = true;
    }
  }

  contractFailed() {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(RejectStudentComponent, {
      data: {
        dialogHeader: DialogTitles.CONTRACT_FAILED,
        dialogContent: DialogMessage.CONTRACT_FAILED_MESSAGE,
        applicationGuid: this.data.applicationGuid,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminService
          .rejectApplication(
            'Rejected',
            this.data.applicationGuid,
            result.declineReason,
            result.motivation,
          )
          .subscribe((data) => {
            if (data.results) {
              this.sharedDataService.newApplicationData(true);
            }
          });
      }
    });
  }
}