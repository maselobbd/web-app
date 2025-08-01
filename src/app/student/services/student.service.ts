import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from '../../shared/data-access/models/response.models';
import { observe } from '../../shared/utils/functions/observe.function';
import { Student } from '../models/student.model';
import { Question } from '../models/question.model';
import { StudentUser } from '../../shared/data-access/models/studentUser.model';
import { UniversityStudentDetails } from '../../university-dashboard/data-access/models/student-details-model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient) {}

  getStudentApplicationGuid(studentUser: any): Observable<IResponse<UniversityStudentDetails>> {
    const encodedEmail = encodeURIComponent(studentUser.emailAddress);
    return observe(this.http.get<UniversityStudentDetails>(`api/student-info/?email=${encodedEmail}`));
  }

   getStudentInfo(
      applicationGuid: string,
    ): Observable<IResponse<UniversityStudentDetails>> {
      return observe(
        this.http.get<UniversityStudentDetails>(
          `/api/student-info/?id=${applicationGuid}`,
        ),
      );
    }

  getStudentByGuid(applicationGuid: string): Observable<IResponse<Student>> {
    return observe(
      this.http.get<Student>(
        `/api/studentInformation?applicationGuid=${applicationGuid}`,
      ),
    );
  }

  getRaces(): Observable<IResponse<string[]>> {
    return observe(this.http.get<string[]>('/api/races'));
  }

  getGenders(): Observable<IResponse<string[]>> {
    return observe(this.http.get<string[]>('/api/genderInformation'));
  }

  updateStudentApplication(
    data: any,
  ): Observable<IResponse<{
    message: string, 
    exitNumber: number 
  }>> {
    return observe(
      this.http.post<{
        message: string, 
        exitNumber: number 
      }>('/api/student-application', data),
    );
  }

  getQuestions(): Observable<IResponse<Question[]>> {
    return observe(
      this.http.get<Question[]>("api/questions")
    )
  }

  getTitles(): Observable<IResponse<string[]>> {
    return observe(
      this.http.get<string[]>("api/titles")
    )
  }

  uploadTranscript(form: any): Observable<IResponse<number>> {
    return observe(this.http.post<number>("api/update-transcript", form))
  }
}
