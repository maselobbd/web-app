import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private http: HttpClient) {}

  getStudent(studentId: number): Observable<any> {
    // Make an HTTP request to fetch student information by ID from your backend
    return this.http.get<any>(`/api/students/${studentId}`);
  }
}
