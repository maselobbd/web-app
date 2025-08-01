import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MaxFileSize } from '../../enums/maxFileSize';
import { FileData } from '../../data-access/models/additionalInformationFileData.model';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.scss',
})
export class UploadFilesComponent implements OnInit {
  @Output()
  fileEmitter: EventEmitter<any>;
  @Input()
  back: boolean = false;
  @Input()
  matric!: FileData;
  @Input()
  academicRecord!: FileData;
  @Input()
  identity!: FileData;
  @Input()
  financial!: FileData;
  @Input()
  eventImage!: FileData;

  file!: any;
  fileName!: any;
  formData!: FormData;
  files!: File[];
  fileBytes: any;
  reader: FileReader;
  fileRemoved: boolean = false;
  maxFileSize: any = MaxFileSize;
  average: any;
  maxFileSizeExceeded: boolean = false;
  fileNameLength: number = 0;
  additionalInformationData!: FileData;
  screenWidth: number = 0;

  @ViewChild('fileUpload')
  fileUploadRef!: ElementRef;

  @Input()
  fieldLabel!: string;

  constructor(

  ) {
    this.fileEmitter = new EventEmitter<any>();
    this.reader = new FileReader();
    this.average = 0;
  }

  ngOnInit(): void {

    switch(this.fieldLabel) {
      case 'Matric Certificate' : {
        if (this.back && this.matric) {
          this.file = this.matric;
          this.fileName = this.file.filename;
        }
        break;
      }
      case 'Academic Record' : {
        if (this.back && this.academicRecord) {
          this.file = this.academicRecord;
          this.fileName = this.file.filename;
        }
        break;
      }
      case 'Proof Of Identification' : {
        if (this.back && this.identity) {
          this.file = this.identity;
          this.fileName = this.file.filename;
        }
        break;
      }
      case 'Financial Statement' : {
        if (this.back && this.financial) {
          this.file = this.financial;
          this.fileName = this.file.filename;
        };
        break;
      }
      case 'Event Image' : {
        if (this.back && this.eventImage) {
          this.file = this.eventImage;
          this.fileName = this.eventImage.filename;
        }
      }
    }
  }

  onFileSelected(event: any) {

    if (
      event.target.files[0]
      && event.target.files[0].size <= this.maxFileSize.FILE_SIZE
    ) {
        this.maxFileSizeExceeded = false;
        this.file = event.target.files[0];
        this.fileNameLength = this.file.name.length;
        this.fileName = this.fileNameLength <= 24
        ? this.file.name : `${this.file.name.split("").slice(0, 21).join("")}...`;
        this.formData = new FormData();
        this.formData.append(this.fileName, this.file);

        this.reader.readAsDataURL(this.file);

        this.reader.addEventListener('loadend', () => {
        this.fileBytes = this.reader.result;
        const fileLocation = URL.createObjectURL(this.file);

        this.additionalInformationData = {
          file: this.file,
          filename: this.fileName,
          filebytes: this.fileBytes,
          documentType: this.fieldLabel,
          removeFile: false,
          fileLocation: fileLocation,
          formData: this.formData
          }
        this.fileEmitter.emit(this.additionalInformationData);
        });
    } else if(event.target.files[0] && event.target.files[0].size > this.maxFileSize.FILE_SIZE) {
      this.maxFileSizeExceeded = true;
    }
  }

  onFileDrop(event: any) {
    if (event) {
      if (
        (event[0].name.endsWith('.pdf') ||
        event[0].name.endsWith('.jpeg') ||
        event[0].name.endsWith('.png'))
      ) {
        this.maxFileSizeExceeded = false;
        this.file = event[0];
        this.fileName = this.file?.name;
        this.formData = new FormData();
        this.formData.append(this.fileName, this.file);

        this.reader.readAsDataURL(this.file);
        const fileLocation = URL.createObjectURL(this.file);
        this.reader.addEventListener('loadend', () => {
          this.fileBytes = this.reader.result;
          this.fileEmitter.emit({
            file: this.file,
            filename: this.fileName,
            filebytes: this.fileBytes,
            documentType: this.fieldLabel,
            removeFile: false,
            fileLocation: fileLocation,
          });
        });
      } else if(event[0].size > this.maxFileSize.FILE_SIZE) {
        this.maxFileSizeExceeded = true;
      }
    }
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  onFileRemove() {
    this.fileUploadRef.nativeElement.value = "";
    this.fileName = '';
    this.file = undefined;
    !this.back ? this.formData.delete(this.fileName) : null;
    this.fileEmitter.emit({
      file: this.file,
      filename: this.fileName,
      filebytes: this.fileBytes,
      documentType: this.fieldLabel,
      removeFile: true
    });
  }
}
