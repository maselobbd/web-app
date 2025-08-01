import { Component, Inject, Input } from '@angular/core';
import { UploadFile } from '../../data-access/models/fileupload.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SnackBarMessage } from '../../enums/snackBarMessage';
import { SnackBarDuration } from '../../enums/snackBarDuration';
import { DialogTitles } from '../../enums/dialog-titles';
import { ButtonAction } from '../../enums/buttonAction';

@Component({
  selector: 'app-upload-profile-picture',
  templateUrl: './upload-profile-picture.component.html',
  styleUrls: ['./upload-profile-picture.component.scss']
})
export class UploadProfilePictureComponent {
  readonly ButtonAction = ButtonAction;
  isEventPhoto: boolean = false;
  file: UploadFile | undefined;
  fileUploaded: boolean = false;
  fileUrl!: SafeResourceUrl;
  title:string = ''
  documentType:string = ''
  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<UploadProfilePictureComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title;
    this.documentType = data.documentType;
    this.isEventPhoto = data.isEventImage ? data.isEventImage : false;
  }

  addFile($event: any) {
    if($event.removeFile)
    {
      this.file = undefined
    }else{
      this.file = $event;
    }
  }

  close() {
    this.dialogRef.close();
  }

  previewProfilePhoto() {
    if (this.file?.filebytes) {
      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.file.filebytes);
      this.fileUploaded = true;
    } else {
      this.showSnackBar(SnackBarMessage.PREVIEW_PROFILE_PHOTO);
    }
  }

  uploadProfilePhoto() {
    if (!this.file?.filebytes) {
      this.showSnackBar("No file selected for upload.");
      return;
    }
    
    if (this.isEventPhoto) this.dialogRef.close({eventId:this.data.eventId,file:this.file.filebytes});
    this.dialogRef.close({studentId:this.data.student.studentId,file:this.file.filebytes});
  }

 showSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: SnackBarDuration.DURATION });
  }

  isPictureUpdate()
  {
    return this.title === DialogTitles.UPDATE_PROFILE_PICTURE || DialogTitles.UPDATE_EVENT_IMAGE;
  }

  upload()
  {
    this.dialogRef.close({file:this.file?.filebytes,documentType:this.documentType})
  }

  addImageButton() {
    return this.isEventPhoto ? ButtonAction.ADD_EVENT_IMAGE : ButtonAction.ADD_PROFILE_PICTURE
  }
}
