import { AfterViewInit, Component, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { StudentService } from '../../data-access/services/student.service';
import { UniversityStudentDetails } from '../../../university-dashboard/data-access/models/student-details-model';
import { Roles } from '../../../authentication/data-access/models/auth.model';
import { UserStore } from '../../data-access/stores/user.store';
import { StudentUser } from '../../data-access/models/studentUser.model';
import { hasValidResults } from '../../utils/functions/checkData.function';
import { MatDialog } from '@angular/material/dialog';
import { AlterDetailsDialogComponent } from '../alter-details-dialog/alter-details-dialog.component';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../authentication/data-access/services/auth.service';
import { SnackBarMessage } from '../../enums/snackBarMessage';
import { SnackBarDuration } from '../../enums/snackBarDuration';
import { UploadProfilePictureComponent } from '../upload-profile-picture/upload-profile-picture.component';
import { FileDownloadService } from '../../../university-dashboard/data-access/services/file-download-service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { dataUrl } from '../../enums/dataURIs';
import { reloadComponent } from '../../utils/functions/reloadComponent';
import { DialogTitles } from '../../enums/dialog-titles';
import { documentTypeName } from '../../../university-dashboard/enums/documentType.model';
import { StatusEnum } from '../../enums/statusEnum';
import { StudentDocumentData } from '../../../student/models/downloadedStudentDocumentData.model';
import { StudentProfilePicture } from '../../../student/models/photo.model';
import { studentFileTraverser } from '../../utils/functions/traverseDownloadedFiles.function';
import { FileContents } from '../../data-access/models/file-contents.model';
import { CacheService } from '../../data-access/services/cache.service';
import { cacheKeysEnum } from '../../enums/cacheKeysEnum';
import { DialogDimensions } from '../../enums/dialogDimensions';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: [
    './personal-details.component.scss',
    '../../../university-dashboard/ui/student-details/student-details.component.scss',
    '../../utils/styling/sharedStudentDetails.scss'
  ],
})
export class PersonalDetailsComponent implements AfterViewInit {
  @Input() applicationGuid: string = '';
  @Input() student!: UniversityStudentDetails;
  @Output() studentDetailsChanged = new EventEmitter<boolean>();
  userRole!: Roles;
  rolesEnum: typeof Roles = Roles;
  user!: any;
  studentLoginDetails!: StudentUser;
  blobResult: any;
  profilePhotoUrl!: SafeUrl;
  defaultPhotoUrl = '../../../../assets/images/profile_photo.png';
  downloadedStudentDocuments!: StudentDocumentData;
  studentProfilePhoto?: StudentProfilePicture;

  constructor(
    private userStore: UserStore, 
    private studentService: StudentService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private cacheService: CacheService,
    private snackBar: MatSnackBar 
  ) {
    this.userStore.get().subscribe((user) => {
      this.userRole = Roles[user.role as keyof typeof Roles];
      this.user = user;
    });
  }

  ngOnInit(): void {
    this.downloadedStudentDocuments = this.student.DownloadedStudentDocuments;
    this.studentProfilePhoto = this.student.StudentProfilePhoto || { profilePicture:{ base64: this.student.profilephoto, fileExtention:'.png'} as FileContents } as StudentProfilePicture;
  }
 
  ngAfterViewInit(): void {
    this.viewDocument(this.student.profilephoto);
  }

  loadProfileImage(): void {
    const {jpeg,jpg,png}=dataUrl
    const filteredDataUrl = { jpg, png, jpeg };
    if (this.blobResult && this.blobResult.base64 && this.blobResult.fileExtention) {
      this.profilePhotoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        filteredDataUrl[this.blobResult.fileExtention as keyof typeof filteredDataUrl] + this.blobResult.base64
      );
    } else {
      this.profilePhotoUrl = this.defaultPhotoUrl;
    }
    this.cdr.detectChanges();
  }

  viewDocument(profilePhoto: string): void {
    if (this.student.profilephoto) {
      
      if (!(this.userRole === this.rolesEnum.student)) {
        const fileData = studentFileTraverser(this.downloadedStudentDocuments, profilePhoto);
        this.blobResult = fileData;
        this.loadProfileImage();

      } else if ((this.userRole === this.rolesEnum.student)) {
        if (!this.studentProfilePhoto) return;
        const fileData = studentFileTraverser(this.studentProfilePhoto, profilePhoto);
        this.blobResult = fileData;
        this.loadProfileImage();
      }

    } else {
      this.profilePhotoUrl = this.defaultPhotoUrl;
      this.cdr.detectChanges();
    }
  }

  edit(): void {
    const dialogRef = this.dialog.open(AlterDetailsDialogComponent, {
      width: '25rem',
      data: this.student
    });

    dialogRef.afterClosed().subscribe((result: FormGroup) => {
      if (result) {
        const updatedDetails = result.getRawValue();
        this.studentService.updateStudentDetails(updatedDetails, this.student.applicationGuid)
          .subscribe((data) => {
            if (hasValidResults(data)) {
              const isEmailUpdated = data.results[0].initialEmail !== updatedDetails.email;
              const message = isEmailUpdated ? SnackBarMessage.EMAIL_UPDATED : SnackBarMessage.DETAILS_UPDATED;
              
              this.snackbar.open(message, '', { duration: SnackBarDuration.DURATION })
                .afterDismissed()
                .subscribe(() => {
                  if (isEmailUpdated) {
                    this.authService.logout();
                  } else {
                    this.studentDetailsChanged.emit(true);
                    reloadComponent(true,this.router);
                  }
                });
            } else {
              this.snackbar.open(SnackBarMessage.ERROR_UPDATING_DETAILS, '', { duration: SnackBarDuration.DURATION });
            }
          });
      }
    });
  }

  openUpload(): void {
    const dialofRef = this.dialog.open(UploadProfilePictureComponent, {
      maxWidth: DialogDimensions.MAXWIDTH,
      maxHeight: DialogDimensions.MAXHEIGHT,
      width: DialogDimensions.WIDTH_FIFTY,
      data: {student:this.student, title:DialogTitles.UPDATE_PROFILE_PICTURE, documentType:documentTypeName.PROFILE_PICTURE}
    });
    dialofRef.afterClosed().subscribe((data:{studentId:number, file:string})=>{
      this.studentService.uploadStudentPhoto(data.studentId, data.file)
      .subscribe((data) => {
        if (hasValidResults(data)) {
          this.studentDetailsChanged.emit(true);
          this.snackBar.open(SnackBarMessage.UPLOAD_IMAGE_SUCCESS, '', { duration: SnackBarDuration.DURATION }).afterDismissed().subscribe(() => {
            
            reloadComponent(true,this.router);
          });
        } else {
          this.snackBar.open(SnackBarMessage.UPLOAD_IMAGE_FAILURE, '', { duration: SnackBarDuration.DURATION });
        }
      });
    })
  }

  shouldDisplayProfileSection(): boolean {
    return  this.student.status ===StatusEnum.Approved || this.student.status === StatusEnum.Onboarded
  }
  
}
