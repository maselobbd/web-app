import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IResponse } from '../../../shared/data-access/models/response.models';
import { observe } from '../../../shared/utils/functions/observe.function';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient) {}

  httpOptions: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  getPersonalInfo(): Observable<IResponse<any>> {
    const personalInfo = {
      title: 'Miss',
      fullName: 'Sarah Smith',
      idNumber: '0312166284063',
      race: 'black',
      email: 'sarah.smith@gmail.com',
    };
    return observe(this.http.get('/api/student/{id}'));
  }

  getUniversityInfo(): Observable<IResponse<any>> {
    const universityInfo = {
      university: 'University of Johannesburg',
      degree: 'BEng Computer Science',
      gradeAverage: '74%',
      faculty: 'Faculty of Engineering',
    };
    return observe(this.http.get('/api/universityInfo'));
  }
}
