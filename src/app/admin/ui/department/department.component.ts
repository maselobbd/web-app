import { Component,input,Input, OnInit, ViewChild } from '@angular/core';
import { HodAccountsService } from '../../data-access/services/hod-accounts.service';
import { HodAccount } from '../../data-access/models/hod-account.model';
import { IResponse } from '../../../shared/data-access/models/response.models';
import { AddHodComponent } from '../add-hod/add-hod.component';
import { MatDialog,} from '@angular/material/dialog';
import { ProfileTitleMessages } from '../../enums/ProfileTitleMessages';
import { ProfileSubtitleMessages } from '../../enums/ProfileSubtitlesMessages';
import { AdminProfileDialogButtons } from '../../enums/AdminProfileDialogButtons';
import { FormGroup } from '@angular/forms';
import { IDepartment, IUni } from '../../data-access/models/universityUsers-model';
import { Router } from '@angular/router';
import { AdminService } from '../../data-access/services/admin.service';
import { ConfirmActionComponent } from '../../../shared/ui/confirm-action/confirm-action.component';
import { AllocationUsageService } from '../../../shared/data-access/services/allocation-usage.service';
import { departmentFundModel } from '../../enums/departmentFund.model';
import { DropdownDialogComponent } from '../../../shared/ui/dropdown-dialog/dropdown-dialog.component';
import { TotalAllocatedService } from '../../data-access/services/total-allocated.service';
import { ReallocationsModel } from '../../data-access/models/reallocations.model';
import { DepartmentStatus } from '../../data-access/models/departmentStatus.enum';
import { ConfirmAction } from '../../../shared/data-access/models/confirmAction.model';
import { TabLabels } from '../../enums/tabLabels';
import { Ranks, Roles } from '../../../authentication/data-access/models/auth.model';

import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { reloadComponent } from '../../../shared/utils/functions/reloadComponent';
import { AdditionaInfoMessageType } from '../../../shared/enums/messages';
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss',
})
export class DepartmentComponent implements OnInit {
   @Input() departmentName: string = '';
   @Input() universityName: string = '';
  dataSource: HodAccount[] = [];
   @Input() department!: IDepartment;
   @Input() departments: IDepartment[] = [];
   @Input() tabLabel!:string
   @Input() university!: IUni;
   @Input() role!:Roles;
   @Input() rank!: Ranks;
   @ViewChild('toggle') slideToggle!: MatSlideToggle;
  displayedColumns: string[] = ['name', 'contactNumber', 'email', 'edit'];
  updatedHodAccount!: any;
  eligibleDepartments: string[] = [];
  isDepartmentEnabled:boolean = true
  studentLabel:string = TabLabels.STUDENT
  universityLabel : string = TabLabels.UNIVERSITY
  rolesEnum: typeof Roles = Roles

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private adminService: AdminService,
    private allocationService: AllocationUsageService,
    private totalAllocation: TotalAllocatedService,
  ) {}
  ngOnInit(): void {
    this.departmentName = this.department.departmentInfo.departmentName;
    this.isDepartmentEnabled=this.department.departmentInfo.status?.toString().toLowerCase() === DepartmentStatus.ACTIVE.toLocaleLowerCase().toString() ? true : false
    if (this.tabLabel !==TabLabels.STUDENT) {
      this.displayedColumns.splice(1, 0, 'role');
    }
    this.dataSource = this.department.hodAccounts
    this.departments = this.university.departments;
  }
  editDepartment(arg0: string) {
    const dialogRef = this.dialog.open(AddHodComponent, {
      data: {
        label: 'Edit department',
        dialogTitle: ProfileTitleMessages.EDIT_DEPARTMENT,
        dialogMetaData: ProfileSubtitleMessages.EDIT_DEPARTMENT,
        action: AdminProfileDialogButtons.UPDATE_DEPARTMENT,
        department: this.department.departmentInfo.departmentName,
        editDepartmentCheck: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: FormGroup) => {
      if (result) {
        let newDepartmentName = result.get('Department')?.getRawValue();
        let oldDepartmentName = this.department.departmentInfo.departmentName;
        let universityToUpdate = this.universityName;
        this.adminService
          .updateUniversityDepartment(
            oldDepartmentName,
            newDepartmentName,
            universityToUpdate,
          )
          .subscribe((response: IResponse<any>) => {
            reloadComponent(true,this.router);
          });
      }
    });
  }
  deleteDepartment(arg0: string) {
    const dialogRef = this.dialog.open(ConfirmActionComponent, {
      data: {
        title: ProfileTitleMessages.DELETE_DEPARTMENT,
        message: ProfileSubtitleMessages.DELETE_DEPARTMENT,
      },
    });
    dialogRef.afterClosed().subscribe((result: ConfirmAction) => {
      if (result.confirmed) {
        const currentYear = new Date().getFullYear();
        this.moveFunds(currentYear)
      }
    });
  }
   moveFunds(currentYear: number) {
    this.allocationService
    .getAllocationsForDepartment(
      this.universityName,
      this.department.departmentInfo.departmentName,
      '',
      currentYear.toString(),
    )
    .subscribe((response: IResponse<departmentFundModel>) => {
      const movableAmount =
        response.results?.totalAllocation! -
        (response.results?.approvedAmount! +
          response.results?.requestedAmount!);
      if (movableAmount && movableAmount > 0) {
        const dialogRef = this.dialog.open(DropdownDialogComponent, {
          width: '25rem',
          data: {
            title: 'Select department to transfer the funds to',
            dropdowns: [
              {
                label: 'From',
                options: [this.departmentName],
                key: 'from',
                default: this.departmentName,
              },
              {
                label: 'To',
                options: this.departments
                  ?.map((d) => d.departmentInfo.departmentName)
                  .filter((d) => d !== this.department.departmentInfo.departmentName),
                key: 'to',
                default: '',
              },
            ],
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (!result) return;
          const takeFundsFromDepartment = {
            amount: -movableAmount,
            departmentName: result.from,
            universityName: this.universityName,
            year: currentYear,
          };
          this.totalAllocation
            .moveFunds(JSON.stringify(takeFundsFromDepartment))
            .subscribe(
              (
                response: IResponse<{
                  message: string;
                  exitNumber: number;
                }>,
              ) => {
                if (response) {
                  const moveFundsToDepartment = {
                    amount: movableAmount,
                    departmentName: result.to,
                    universityName: this.universityName,
                    year: currentYear,
                  };
                  this.totalAllocation
                    .moveFunds(JSON.stringify(moveFundsToDepartment))
                    .subscribe(
                      (
                        response: IResponse<{
                          message: string;
                          exitNumber: number;
                        }>,
                      ) => {},
                    );
                }
              },
            );
          this.allocationService
            .getAllocationsForDepartment(
              this.universityName,
              result.to,
              '',
              currentYear.toString(),
            )
            .subscribe((response: IResponse<departmentFundModel>) => {
              const reallocation = {
                university: this.universityName,
                entities: 'departments',
                to: result.to,
                from: result.from,
                fromNewAllocation: 0,
                fromOldAllocation: movableAmount,
                toNewAllocation: movableAmount,
                toOldAllocation: response.results?.totalAllocation,
                moneyReallocated: movableAmount,
              } as ReallocationsModel;
              this.totalAllocation
                .reallocationsInsert(reallocation)
                .subscribe(
                  (
                    response: IResponse<{
                      message: string;
                      exitNumber: number;
                    }>,
                  ) => { 
                   this.deleteDepartmentAfterChecks();
                  },
                );
            });
        });
      }else{
        this.deleteDepartmentAfterChecks();
      }
    });
  }
  deleteDepartmentAfterChecks() {
    this.adminService
      .deleteUniversityDepartment(
        this.department.departmentInfo.departmentName,
        this.universityName,
        this.department.departmentInfo.faculty
      )
      .subscribe((response: IResponse<any>) => {
        if(response.results)
        {
          reloadComponent(true,this.router);
        }
      });
  }
 
  toogle(slideResult:MatSlideToggleChange){
    const dialogRef = this.dialog.open(ConfirmActionComponent, {
      data: {
        title: this.isDepartmentEnabled?ProfileTitleMessages.DISABLE_DEPARTMENT:ProfileTitleMessages.ENABLE_DEPARTMENT,
        message:this.isDepartmentEnabled? ProfileSubtitleMessages.DISABLE_DEPARTMENT:ProfileSubtitleMessages.ENABLE_DEPARTMENT,
      },
    });
    dialogRef.afterClosed().subscribe((result:ConfirmAction)=>{
      if(result.confirmed)
      {
        this.adminService
        .toogleUniversityDepartment(
          this.department.departmentInfo.departmentName,
          this.universityName,
          this.department.departmentInfo.faculty,
          this.isDepartmentEnabled
        )
        .subscribe((response: IResponse<any>) => {
          if(response.results)
          {
             reloadComponent(true,this.router);
          }else{
            this.undoCheck();
          }
        });
      }else{
        this.undoCheck();
      }
    })
  }
  showActions(): boolean{
    return this.isDepartmentEnabled && this.dataSource?.[0]?.role !== 'student'&& this.role !==this.rolesEnum.dean
  }
  canDisableDepartment():boolean{
    return (this.department.departmentInfo.status && this.dataSource?.[0]?.role !== 'student'&& (this.role !==this.rolesEnum.dean)) as boolean
  }

  undoCheck(){
    this.slideToggle.checked = !this.slideToggle.checked;
  }

  emptyListDisplayMessage(): string {
    return this.tabLabel !== this.studentLabel && this.tabLabel === this.universityLabel
      ? AdditionaInfoMessageType.NO_ADMIN_MESSAGE
      : AdditionaInfoMessageType.NO_BURSARS_MESSAGE
  }
}
