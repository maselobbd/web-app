import { Component, Input, OnInit } from '@angular/core';
import { TabLabels, ColumnHeadings } from '../../enums/tabLabels';
import { HodAccount } from '../../data-access/models/hod-account.model';
import { AddHodComponent } from '../add-hod/add-hod.component';
import { MatDialog } from '@angular/material/dialog';
import { ProfileTitleMessages } from '../../enums/ProfileTitleMessages';
import { ProfileSubtitleMessages } from '../../enums/ProfileSubtitlesMessages';
import { AdminProfileDialogButtons } from '../../enums/AdminProfileDialogButtons';
import { HodAccountsService } from '../../data-access/services/hod-accounts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../../../shared/data-access/services/data.service';
import { ConfirmActionComponent } from '../../../shared/ui/confirm-action/confirm-action.component';
import { SnackBarMessage } from '../../../shared/enums/snackBarMessage';
import { SnackBarDuration } from '../../../shared/enums/snackBarDuration';
import {
  Ranks,
  Roles,
} from '../../../authentication/data-access/models/auth.model';
import { Router } from '@angular/router';
import { reloadComponent } from '../../../shared/utils/functions/reloadComponent';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-users-detail-table',
  templateUrl: './users-detail-table.component.html',
  styleUrl: './users-detail-table.component.scss',
})
export class UsersDetailTableComponent implements OnInit {
  @Input() tabLabel!: string;
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: string[] = [
    'name',
    'contactNumber',
    'email',
    'edit',
  ];
  @Input() rank!: Ranks;
  @Input() role!: Roles;
  isDepartmentEnabled: boolean = true;
  studentLabel: string = TabLabels.STUDENT;
  rolesEnum: typeof Roles = Roles;
  editProfileCheck: boolean = false;
  columnHeadings = ColumnHeadings;

  constructor(
    private dialog: MatDialog,
    private accountService: HodAccountsService,
    private snackBar: MatSnackBar,
    private sharedDataService: DataService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    if (this.tabLabel == TabLabels.UNIVERSITY) {
      this.displayedColumns.splice(1, 0, 'role');
    } else if (this.tabLabel == TabLabels.ADMIN) {
      this.displayedColumns.splice(1, 0, 'rank');
    }
  }

  editProfile(details: HodAccount) {
    this.editProfileCheck = true;
   const dialogRef =  this.dialog.open(AddHodComponent, {
      width: '25rem',
      data: {
        dialogTitle:
          this.tabLabel === TabLabels.STUDENT
            ? ProfileTitleMessages.EDIT_STUDENT_PROFILE
            : this.tabLabel === TabLabels.UNIVERSITY
              ? ProfileTitleMessages.EDIT_PROFILE
              : ProfileTitleMessages.EDIT_ADMIN_PROFILE,

        dialogMetaData:
          this.tabLabel === TabLabels.STUDENT
            ? ProfileSubtitleMessages.EDIT_STUDENT_PROFILE
            : this.tabLabel === TabLabels.UNIVERSITY
              ? ProfileSubtitleMessages.EDIT_PROFILE
              : ProfileSubtitleMessages.EDIT_ADMIN_PROFILE,
        action:
          this.tabLabel === TabLabels.STUDENT
            ? AdminProfileDialogButtons.UPDATE_STUDENT
            : this.tabLabel === TabLabels.UNIVERSITY
              ? AdminProfileDialogButtons.UPDATE_UNIVERSITY
              : AdminProfileDialogButtons.UPDATE_ADMIN,
        hodAccount: details,
        tabLabel: this.tabLabel,
        rank: this.rank,
        editProfileCheck: this.editProfileCheck,
      },
    });
    dialogRef.afterClosed().subscribe(result=>{
      if(result)
      {
        this.editAdminProfile(result.userId, result.formData, result.originalData);
      }
    })
  }

  editAdminProfile(userId: string, hodForm: FormGroup, originalInfoForm: FormGroup) {
    let profile: string = '';
    if (this.tabLabel === TabLabels.STUDENT) {
      profile = this.rolesEnum[this.rolesEnum.student];
    }
    this.accountService
      .editAccount(userId, hodForm.value, originalInfoForm.value, profile)
      .subscribe((data) => {
        if (data) {
          this.snackBar.open(SnackBarMessage.SUCCESS, '', {
            duration: SnackBarDuration.DURATION,
          });
          reloadComponent(true, this.router);
        } else {
          this.snackBar.open(SnackBarMessage.FAILURE, '', {
            duration: SnackBarDuration.DURATION,
          });
        }
      });
  }

  deleteProfile(id: string, emailAddress: string) {
    if (id) {
      const dialogRef = this.dialog.open(ConfirmActionComponent, {
        data: {
          title:
            this.tabLabel === TabLabels.STUDENT
              ? ProfileTitleMessages.REMOVE_STUDENT_PROFILE
              : ProfileTitleMessages.DELETE_PROFILE,
          message:
            this.tabLabel === TabLabels.STUDENT
              ? ProfileSubtitleMessages.REMOVE_STUDENT_PROFILE
              : ProfileSubtitleMessages.DELETE_PROFILE,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.accountService
            .deleteAccount(id, emailAddress)
            .subscribe((response) => {
              if (response.results?.success) {
                this.snackBar.open(SnackBarMessage.USER_DELETED, '', {
                  duration: SnackBarDuration.DURATION,
                });
                reloadComponent(true, this.router);
              } else {
                this.snackBar.open(SnackBarMessage.ERROR_DELETING_USER, '', {
                  duration: SnackBarDuration.DURATION,
                });
              }
            });
        }
      });
    }
  }

  acceptInvitation(item: any) {
    const dialogRef = this.dialog.open(ConfirmActionComponent, {
      data: {
        title:
          this.tabLabel === TabLabels.STUDENT
            ? ProfileTitleMessages.REMOVE_STUDENT_PROFILE
            : ProfileTitleMessages.ACCEPT_INVITATION,
        message:
          this.tabLabel === TabLabels.STUDENT
            ? ProfileSubtitleMessages.REMOVE_STUDENT_PROFILE
            : ProfileSubtitleMessages.ACCEPT_ADMIN_PROFILE,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        item.InvitedStatus = 'Accepted';
        this.accountService.sendEmail({ data: item }).subscribe((response) => {
          if (response.results) {
            this.snackBar.open(SnackBarMessage.SUCCESS, '', {
              duration: SnackBarDuration.DURATION,
            });
            this.sharedDataService.triggerReload(true);
          } else {
            this.snackBar.open(SnackBarMessage.FAILURE, '', {
              duration: SnackBarDuration.DURATION,
            });
          }
        });
      }
    });
  }

  declineInvitation(item: any) {
    const dialogRef = this.dialog.open(ConfirmActionComponent, {
      data: {
        title:
          this.tabLabel === TabLabels.STUDENT
            ? ProfileTitleMessages.REMOVE_STUDENT_PROFILE
            : ProfileTitleMessages.DECLINE_INVITAION,
        message:
          this.tabLabel === TabLabels.STUDENT
            ? ProfileSubtitleMessages.REMOVE_STUDENT_PROFILE
            : ProfileSubtitleMessages.DECLINE_ADMIN_PROFILE,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        item.InvitedStatus = 'Rejected';
        this.accountService.sendEmail({ data: item }).subscribe((response) => {
          if (response.results) {
            this.snackBar.open(SnackBarMessage.SUCCESS, '', {
              duration: SnackBarDuration.DURATION,
            });
            this.sharedDataService.triggerReload(true);
          } else {
            this.snackBar.open(SnackBarMessage.FAILURE, '', {
              duration: SnackBarDuration.DURATION,
            });
          }
        });
      }
    });
  }
}
