import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StepperDataService {
  redirectToStudentSuccess!: boolean;
  redirectToTranscriptSuccess!: boolean;
  
  studentFullName!: string;
  studentEmail!: string;
  constructor() {}
}
