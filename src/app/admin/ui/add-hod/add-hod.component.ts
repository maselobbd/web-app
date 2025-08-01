import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HodAccount } from '../../data-access/models/hod-account.model';
import {
  Ranks,
  Roles,
} from '../../../authentication/data-access/models/auth.model';
import { ProfileTitleMessages } from '../../enums/ProfileTitleMessages';
import { StudentService } from '../../../shared/data-access/services/student.service';
import { hasValidResults } from '../../../shared/utils/functions/checkData.function';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarDuration } from '../../../shared/enums/snackBarDuration';
import { SnackBarMessage } from '../../../shared/enums/snackBarMessage';
import { HodAccountsService } from '../../data-access/services/hod-accounts.service';
import { DataService } from '../../../shared/data-access/services/data.service';
import { IDepartment } from '../../data-access/models/universityUsers-model';
import { MatSelectChange } from '@angular/material/select';
import { TabLabels } from '../../enums/tabLabels';
import { AdminService } from '../../data-access/services/admin.service';
import { UserStore } from '../../../shared/data-access/stores/user.store';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ErrorMessages } from '../../enums/errorMessages';
import { reloadComponent } from '../../../shared/utils/functions/reloadComponent';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-hod',
  templateUrl: './add-hod.component.html',
  styleUrl: './add-hod.component.scss',
})
export class AddHodComponent implements OnInit {
  label = '';
  hodForm!: FormGroup;
  originalInfoForm!: FormGroup;
  title = '';
  action = '';
  dialogTitle = '';
  dialogMetaData = '';
  details!: HodAccount;
  faculties: string[] = [];
  roles: string[] = [];
  universityRoles: string[] = [];
  possibleUniversityRoles: string[] = [];
  userRanks: string[] = [];
  defaultRole: string = 'HOD';
  ProfileTitleMessages: string = ProfileTitleMessages.EDIT_PROFILE;
  AdminProfileTitle: string = ProfileTitleMessages.EDIT_ADMIN_PROFILE;
  StudentProfileTitle: string = ProfileTitleMessages.EDIT_STUDENT_PROFILE;
  AddDepartment: string = ProfileTitleMessages.ADD_DEPARTMENT;
  AddUniversity: string = ProfileTitleMessages.ADD_UNIVERSITY;
  EditAdminProfile: string = ProfileTitleMessages.EDIT_PROFILE;
  EditDepartment: string = ProfileTitleMessages.EDIT_DEPARTMENT;
  addAdminProfile: string = ProfileTitleMessages.ADD_ADMIN_PROFILE;
  addHod: string = ProfileTitleMessages.ADD_HOD;
  universityName: string = '';
  departments: IDepartment[] = [];
  universityRole: string = '';
  addAdminProfileTitle: string = ProfileTitleMessages.ADD_ADMIN_PROFILE;
  userId!: string;
  currentTab!: string;
  tabLabelsEnum = TabLabels;
  currentRole!: Roles;
  rolesEnum: typeof Roles = Roles;
  userEmail!: string;
  rank!: Ranks;
  ranksEnum: typeof Ranks = Ranks;
  deptFaculty: string = "";
  errorMessages = ErrorMessages;
  addFaculty: string = ProfileTitleMessages.ADD_FACULTY;
  showAddFaculty: boolean = false;
  isProfileEdit: boolean = false;
  
  constructor(
    public dialogRef: MatDialogRef<AddHodComponent>,
    private studentService: StudentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private accountService: HodAccountsService,
    private sharedDataService: DataService,
    private userStore: UserStore,
    private router: Router
  ) {
    this.label = data.label;
    this.title = data.title;
    this.action = data.action;
    this.dialogTitle = data.dialogTitle;
    this.dialogMetaData = data.dialogMetaData;
    this.faculties = data?.faculties;
    this.details = data.hodAccount;
    this.departments = data.departments;
    this.universityName = data.universityName;
    this.currentTab = data.tabLabel;
    this.currentRole = data?.role;
    this.rank = data?.rank;
  }
  ngOnInit(): void {
    this.userId = this.details?.id;
    this.isProfileEdit = this.checkProfileEditable(this.details);
    this.hodForm = this.formBuilder.group({
      emailAddress: [this.details?.emailAddress, [
        Validators.email,
        RxwebValidators.required({
          conditionalExpression: () => this.data.addProfile || this.data.editProfileCheck
        })
      ]],
      givenName: [this.details?.givenName, [
        RxwebValidators.required({
          conditionalExpression: () => this.data.editProfileCheck
        })
      ]],
      surname: [this.details?.surname, [
        RxwebValidators.required({
          conditionalExpression: () => this.data.editProfileCheck
        })
      ]],
      Faculty: [this.details?.Faculty, [
        RxwebValidators.required({
          conditionalExpression: () => this.data.label === ProfileTitleMessages.ADD_DEPARTMENT
        })]],
      University: [this.details?.University, [
        RxwebValidators.required({
          conditionalExpression: () => this.data.label === ProfileTitleMessages.ADD_UNIVERSITY
        })
      ]],
      Department: [this.details?.Department, [
        RxwebValidators.required({
          conditionalExpression: () => this.data.label === ProfileTitleMessages.ADD_DEPARTMENT
        })
      ]],
      contactNumber: [this.details?.contactNumber],
      id: [this.details?.id],
      userRole:
        this.currentTab == this.tabLabelsEnum.ADMIN
          ? [this.details?.role || 'admin', [
            RxwebValidators.required({
              conditionalExpression: () => this.data.label === ProfileTitleMessages.ADD_HOD
            })
          ]]
          : [this.details?.role || this.defaultRole, [
            RxwebValidators.required({
              conditionalExpression: () => this.data.label === ProfileTitleMessages.ADD_HOD
            })
          ]],
      department: [null, [
        RxwebValidators.required({
          conditionalExpression: () => this.data.label === ProfileTitleMessages.ADD_HOD && 
          this.universityRole === this.defaultRole
        })
      ]],
      faculty: [null, [
        RxwebValidators.required({
          conditionalExpression: () => this.data.label === ProfileTitleMessages.ADD_HOD
        })
      ]],
      universityName: [this.universityName],
      rank: [this.details?.rank, [
        RxwebValidators.required({
          conditionalExpression: () => 
            this.data.label === ProfileTitleMessages.ADD_ADMIN_PROFILE })
      ]],
      addFaculty: [null, [
        RxwebValidators.required({
          conditionalExpression: () => this.showAddFaculty
        })
      ]]
    });

    this.roles = [Roles[Roles.admin]];
    this.possibleUniversityRoles = Roles
      ? [
          Roles[Roles.HOD],
          Roles[Roles.dean][0].toUpperCase() + Roles[Roles.dean].substring(1),
        ]
      : [];
    
    this.universityRoles = this.filterUniversityRoles(this.possibleUniversityRoles);
    
    this.userRanks = Ranks
      ? [
          Ranks[Ranks.admin_officer],
          Ranks[Ranks.assistant_admin],
          Ranks[Ranks.senior_admin],
        ]
      : [];
    this.userStore.get().subscribe((user) => {
      this.rank = Ranks[user.rank as keyof typeof Ranks];
    });
    this.originalInfoForm = this.formBuilder.group({
      name: [this.details?.givenName],
      surname: [this.details?.surname],
      email: [this.details?.emailAddress],
      contactNumber: [this.details?.contactNumber],
      Faculty: [this.details?.Faculty],
      University: [this.details?.University],
      Department: [this.details?.Department],
    });
    if (this.dialogTitle !== this.addAdminProfile) {
      this.userId = this.details?.id;
    }
    this.universityRole = this.hodForm.get('userRole')?.value;
    this.userEmail = this.details?.emailAddress;
  }

  filterUniversityRoles(possibleUniversityRoles: string[]) {
      if (this.currentRole == Roles.dean) {
        return possibleUniversityRoles.filter((role) => 
          role !== Roles[Roles.dean][0].toUpperCase() + Roles[Roles.dean].substring(1)
        );
      } else {
        return possibleUniversityRoles;
      }
  }

  editAdminProfile() {
    this.dialogRef.close({
      formData: this.hodForm,
      originalData: this.originalInfoForm,
      userId: this.userId
    });
  }

  onProfileAddition(): void {
    if (this.hodForm.valid) {
      this.dialogRef.close(this.hodForm);
    }
  }

  get isAdminDialog(): boolean {
    return this.dialogTitle === this.AdminProfileTitle;
  }

  get isHodDialog(): boolean {
    return this.dialogTitle === this.ProfileTitleMessages;
  }

  onUniversityRoleSelection(event: MatSelectChange): void {
    event.value ? (this.universityRole = event.value) : null;
    if(event.value === 'Dean') {
      this.hodForm.get('department')?.removeValidators(Validators.required);
      this.hodForm.get('department')?.updateValueAndValidity();
    }
  }

  onDepartmentSelection(event: MatSelectChange): void {
    event.value ? this.deptFaculty = this.departments.filter(dept => dept.departmentInfo.departmentName === event.value)[0].departmentInfo.faculty : this.deptFaculty = "";
  }

  showFacultyInput(event: MatSelectChange): void {
    if(event.value === ProfileTitleMessages.ADD_FACULTY) {
      this.showAddFaculty = true;
    } else {
      this.showAddFaculty = false;
      this.hodForm.get("addFaculty")?.setValue(null);
    }
  }

  checkProfileEditable(userDetails: HodAccount): boolean {
    const hasAllProfileFields =
      (userDetails?.emailAddress) &&
      (userDetails?.givenName) &&
      (userDetails?.surname);
      
    return userDetails && userDetails?.id && hasAllProfileFields ? true : false;
  }
}
