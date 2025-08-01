import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Semesters } from '../../enums/semesters';
import { generatestamp } from '../../../shared/utils/functions/simple-hash';
import { StepperDataService } from '../../services/stepper-data.service';
import { AdditionaInfoMessageType } from '../../../shared/enums/messages';
import { ApplicationInsightsService } from '../../../shared/data-access/services/application-insights.service';
import { RouteNames } from '../../../shared/enums/routeNames';
import { select, Store } from '@ngrx/store';
import { studentPortalData } from '../../../states/student-portal/student-portal.actions';
import { selectStudentPortalData } from '../../../states/student-portal/student-portal.selectors';
import { UserStore } from '../../../shared/data-access/stores/user.store';
import { UserAttributes } from '../../../authentication/data-access/models/auth.model';
import { StudentUser } from '../../../shared/data-access/models/studentUser.model';
@Component({
  selector: 'app-upload-transcript',
  templateUrl: './upload-transcript.component.html',
  styleUrls: ['./upload-transcript.component.scss',
    '../../../shared/utils/styling/forms.scss',
  ]
})
export class UploadTranscriptComponent implements OnInit {

  transcriptForm: FormGroup;
  file: any;
  applicationGuid: string;
  semesters: string[];
  newTranscriptId: number;
  fileRemoved: boolean;
  finalMark: any;
  messages: any = AdditionaInfoMessageType;
  user!: UserAttributes;
  constructor(
    private formBuilder: FormBuilder,
    private userStore: UserStore,
    private studentService: StudentService,
    private router: Router,
    private stepperDataService: StepperDataService,
    private applicationInsights: ApplicationInsightsService,
    private store: Store
  ) {

    this.transcriptForm = this.formBuilder.group({
      transcriptTypes: [
        '', Validators.required
      ],
      transcript: [
        '', Validators.required
      ],
    });
    this.applicationGuid = "";
    this.semesters = [Semesters.FIRST_SEMESTER, Semesters.SECOND_SEMESTER];
    this.newTranscriptId = 0;
    this.fileRemoved = false;
    this.userStore.get().subscribe((user) => {
      this.user = user;
    })
  } 

  ngOnInit(): void {
  this.store.select(selectStudentPortalData).subscribe((studentDetails) => {
    this.applicationGuid = studentDetails?.applicationGuid!;
  })
  this.applicationInsights.logPageView(RouteNames.TRANSCRIPT_UPLOAD, this.router.url);
  }

  receiveFile(event: any): void {
    this.file = event;

    if(this.file.documentType && !this.file.removeFile) {
      this.transcriptForm.get("transcript")?.setValue(this.file.filebytes);
      }
    }

    uploadTranscript(): void {
      this.studentService.uploadTranscript(
        {
          applicationGuid: this.applicationGuid,
          semesterDescription: this.transcriptForm.get("transcriptTypes")?.value,
          base64String: this.file.filebytes,
          average: this.transcriptForm.get("average")?.value
        }
      ).subscribe(
        data => {
          if (data.results) {
            this.newTranscriptId = data.results;
            this.newTranscriptId
                ? (this.stepperDataService.redirectToTranscriptSuccess = true)
                : (this.stepperDataService.redirectToTranscriptSuccess = false);
            this.store.dispatch(studentPortalData({studentData:{department:this.user.department,faculty:this.user.faculty,emailAddress:this.user.email,university:this.user.university} as StudentUser}));
            this.router.navigate([`reviews/success/${generatestamp()}`])
          }
        }
      )
    }
  }

    

  


