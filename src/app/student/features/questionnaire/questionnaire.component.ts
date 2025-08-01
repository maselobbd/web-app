import { Component, OnInit, Input } from '@angular/core';
import { Question } from '../../models/question.model';
import { ControlContainer, FormGroup, Validators } from '@angular/forms';
import { QuestionnaireOptions } from '../../enums/questionnaireOptions';
import { Student } from '../../models/student.model';
import { AdditionaInfoMessageType } from '../../../shared/enums/messages';
import { ApplicationInsightsService } from '../../../shared/data-access/services/application-insights.service';
import { RouteNames } from '../../../shared/enums/routeNames';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrl: './questionnaire.component.scss',
})
export class QuestionnaireComponent implements OnInit {
  
  @Input()
  questions: Question[];
  questionnaireOptions: any;
  additionalMessages: any;
  questionnaireForm!: FormGroup;
  questionnaireFormToPost!: FormGroup;

  @Input()
  personalInfo!: Student;

  constructor(
    private controlContainer: ControlContainer,
    private applicationInsights: ApplicationInsightsService,
    private router: Router,
  ) {
    this.questions = [];
    this.questionnaireOptions = QuestionnaireOptions;
    this.additionalMessages = AdditionaInfoMessageType;
  }

  ngOnInit(): void {
    this.questionnaireForm = <FormGroup>this.controlContainer.control;
    this.applicationInsights.logPageView(RouteNames.STUDENT_FORM, this.router.url);
  }

  onSelectionChange(event: any, control: string): void {
    switch (event.value) {
      case QuestionnaireOptions.YES: {
        this.questionnaireForm
          .get(`${control}Response`)
          ?.addValidators(Validators.required);
        this.questionnaireForm
          .get(`${control}Response`)
          ?.updateValueAndValidity();
        return;
      }

      case QuestionnaireOptions.NO: {
        this.questionnaireForm.get(`${control}Response`)?.clearValidators();
        this.questionnaireForm
          .get(`${control}Response`)
          ?.updateValueAndValidity();
        this.questionnaireForm.get(`${control}Response`)?.setValue('');
        return;
      }
    }
  }
}
