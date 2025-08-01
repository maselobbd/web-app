import { Component, Input} from '@angular/core';
import { hasValidResults } from '../../../shared/utils/functions/checkData.function';
import {
  Ranks,
  Roles,
} from '../../../authentication/data-access/models/auth.model';
import { AddHodComponent } from '../add-hod/add-hod.component';
import { ProfileTitleMessages } from '../../enums/ProfileTitleMessages';
import { ProfileSubtitleMessages } from '../../enums/ProfileSubtitlesMessages';
import { AdminProfileDialogButtons } from '../../enums/AdminProfileDialogButtons';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../../data-access/services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarDuration } from '../../../shared/enums/snackBarDuration';
import { SnackBarMessage } from '../../../shared/enums/snackBarMessage';
import { FormGroup } from '@angular/forms';
import { reloadComponent } from '../../../shared/utils/functions/reloadComponent';
import { Router } from '@angular/router';
import { TabLabels } from '../../enums/tabLabels';
import { HodAccount, PanelTitle } from '../../data-access/models/hod-account.model';
@Component({
  selector: 'app-admin-profile-management',
  templateUrl: './admin-profile-management.component.html',
  styleUrl: './admin-profile-management.component.scss',
})
export class AdminProfileManagementComponent{
  @Input() tabLabel!: string;
  @Input() rank!: Ranks;
  @Input() role!: Roles;
  @Input() panelsTitle: PanelTitle[]= [];
  panelOpenState = false;
  dataSource:HodAccount[] = []
  addProfileCheck: boolean = false;

  constructor(
    private dialog: MatDialog,
    private adminService: AdminService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  addProfile() {
    this.addProfileCheck = true;
    const dialogRef = this.dialog.open(AddHodComponent, {
      width: '400px',
      data: {
        label: ProfileTitleMessages.ADD_ADMIN_PROFILE,
        dialogTitle: ProfileTitleMessages.ADD_ADMIN_PROFILE,
        dialogMetaData: ProfileSubtitleMessages.ADD_ADMIN_PROFILE,
        action: AdminProfileDialogButtons.SEND_EMAIL,
        tabLabel: this.tabLabel,
        addProfile: this.addProfileCheck
      },
    });
    dialogRef.afterClosed().subscribe((result: FormGroup) => {
      if (result && this.tabLabel === TabLabels.ADMIN) {
        this.adminService.createUser(result.value).subscribe((data) => {
          if (hasValidResults(data)) {
            this.snackbar.open(SnackBarMessage.SUCCESS, '', {
              duration: SnackBarDuration.DURATION,
            });
            reloadComponent(true, this.router)
          } else {
            this.snackbar.open(
              `${SnackBarMessage.FAILURE} ${data.errors}`,
              '',
              {
                duration: SnackBarDuration.DURATION,
              },
            );
          }
          this.addProfileCheck = false;
        });
      }
    });
  }
}
