import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { HodAccountsService } from '../../data-access/services/hod-accounts.service';
import { IResponse } from '../../../shared/data-access/models/response.models';
import { HodAccount } from '../../data-access/models/hod-account.model';
import { IUni } from '../../data-access/models/universityUsers-model';
import { AddHodComponent } from '../add-hod/add-hod.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Faculty } from '../../data-access/models/faculties-model';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../../shared/data-access/services/data.service';
import { AdminProfileDialogButtons} from '../../enums/AdminProfileDialogButtons';
import { ProfileTitleMessages } from '../../enums/ProfileTitleMessages';
import { ProfileSubtitleMessages } from '../../enums/ProfileSubtitlesMessages';
import { TabLabels } from '../../enums/tabLabels';
import { Ranks, Roles } from '../../../authentication/data-access/models/auth.model';
import { reloadComponent } from '../../../shared/utils/functions/reloadComponent';
import { hasValidResults } from '../../../shared/utils/functions/checkData.function';
import { ConfirmActionComponent } from '../../../shared/ui/confirm-action/confirm-action.component';
import { ConfirmAction } from '../../../shared/data-access/models/confirmAction.model';
import { UniversitiesService } from '../../data-access/services/universities.service';
import { DocumentStatus } from '../../../shared/enums/documentStatus';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-add-hod-expansion',
  templateUrl: './add-hod-expansion.component.html',
  styleUrl: './add-hod-expansion.component.scss',
})
export class AddHodExpansionComponent implements OnInit {
  @Input() university!: IUni;
  @Input() faculties: Faculty[] = [];
  @Input() tabLabel!:string;
  @Input() role!:Roles;
  @Input() rank!:Ranks;
  @ViewChild('toggle') slideToggle!: MatSlideToggle;
  panelOpenState = false;
  universityName: string = '';
  departmentName: string='';
  departments: string[] = [];
  tabLabelsEnum: any = TabLabels;
  hasDepartments: boolean = false;
  profileFaculties: string[] = [];
  rolesEnum: typeof Roles = Roles;
  addProfileCheck: boolean = false;
  isUniversityEnabled = false;
  constructor(
    private accountService: HodAccountsService,
    private dialog: MatDialog,
    private router: Router,
    private universityService: UniversitiesService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    if (this.university) {
      this.universityName = this.university?.universityName;
    }
    this.hasDepartments = this.university.departments.some(department => Object.keys(department.departmentInfo).length > 0)
    this.isUniversityEnabled = !this.university.departments.every((department)=> department.departmentInfo.status === DocumentStatus.DISABLE)
    this.profileFaculties = [...new Set(this.university.departments.map(department => department.departmentInfo.faculty))]
  }


  addDepartment() {
    const dialog = this.dialog.open(AddHodComponent, {
      width: '500px',
      data: {
        action: ProfileTitleMessages.ADD_DEPARTMENT,
        title: ProfileTitleMessages.ADD_DEPARTMENT,
        dialogTitle: ProfileTitleMessages.ADD_DEPARTMENT,
        dialogMetaData: ProfileSubtitleMessages.DEPARTMENT_METADATA,
        label: ProfileTitleMessages.ADD_DEPARTMENT,
        departments: this.university?.departments,
        faculties: this.role === this.rolesEnum.dean ? this.profileFaculties :this.faculties.map(faculty => faculty.facultyName),
        universityName: this.universityName,
        role:this.role,
        addDepartmentCheck: true,
      },
    });

    dialog.afterClosed().subscribe((result: FormGroup) => {
      if (result) {
        this.accountService
          .addDepartment({
            university: this.universityName, 
            department: result.get('Department')?.getRawValue(), 
            faculty: result.get('Faculty')?.getRawValue(), 
            newFaculty: result.get("addFaculty")?.getRawValue()})
          .subscribe((response: IResponse<any>) => {
            if(response)
              {
                reloadComponent(true, this.router);
              }
          });
      }
    });
    this.addProfileCheck = false;
    
  }

  addProfile() {
    this.addProfileCheck = true;
    const dialogRef = this.dialog.open(AddHodComponent, {
      width: '400px',
      data: {
        label: ProfileTitleMessages.ADD_HOD,
        dialogTitle: ProfileTitleMessages.ADD_UNIVERSITY_PROFILE,
        dialogMetaData: ProfileSubtitleMessages.REQUEST_EMAIL,
        action: AdminProfileDialogButtons.SEND_EMAIL,
        universityName: this.universityName,
        departments: this.university.departments,
        faculties: this.profileFaculties,
        role:this.role,
        addProfile: this.addProfileCheck,
      },
    });
    dialogRef.afterClosed().subscribe((result: FormGroup) => {
     
      if (result && this.tabLabel === TabLabels.UNIVERSITY) {
        this.accountService
          .sendEmail(
            { data: result.getRawValue() }  
          )
          .subscribe(
            response => {
            if(hasValidResults(response)) {
              reloadComponent(true, this.router);
            }
          });
        this.addProfileCheck = false;
      }
    });
  }
  showExpansion(){
    return this.role === this.rolesEnum.dean
  }
  
  toogle(slideResult:MatSlideToggleChange){
    const dialogRef = this.dialog.open(ConfirmActionComponent, {
      data: {
        title: this.isUniversityEnabled? ProfileTitleMessages.DISABLE_UNIVERSITY:ProfileTitleMessages.ENABLE_UNIVERSITY,
        message: this.isUniversityEnabled? ProfileSubtitleMessages.DISABLE_UNIVERSITY:ProfileSubtitleMessages.ENABLE_DEPARTMENT,
      },
    });
    dialogRef.afterClosed().subscribe((result:ConfirmAction)=>{
      if(result.confirmed)
      {
        this.universityService
        .toogleUniversity(
          this.universityName,
          this.isUniversityEnabled ? DocumentStatus.DISABLE : DocumentStatus.ENABLE
        )
        .subscribe((response: IResponse<number[]>) => {
          if(!response.errors)
          {
            reloadComponent(true, this.router);
          }else{
            this.undoCheck();
          }
        });
      }else{
        this.undoCheck();
      }
    })
  }
  
  undoCheck(){
    this.slideToggle.checked = !this.slideToggle.checked;
  }
}