import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { IResponse } from "../models/response.models";
import { CreateEventData, EventInvitees } from "../../../admin/data-access/models/eventInvitees.model";
import { EventDetails, PreviewEventFormData } from "../models/eventDetails.model";
import { EventsData, EventSummary } from "../models/eventSummary.model";
import { observe } from '../../utils/functions/observe.function';
import { EventUpdate } from '../../../admin/data-access/models/eventUpdate.model';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAdminEvents(year: number): Observable<IResponse<EventsData>> {
    return observe(this.http.get<EventsData>(`api/events/?year=${year}`),);
  }

  getIndividualEvent(eventGuid: string): Observable<IResponse<EventDetails>> {
    return observe(this.http.get<EventDetails>(`api/event-details/?eventGuid=${eventGuid}`));
  }

  getIndividualStudentEvent(eventGuid: string, email: string): Observable<IResponse<EventDetails>> {
    return observe(this.http.get<EventDetails>(`api/student-event-details/?eventGuid=${eventGuid}&email=${email}`));
  }

  getCreateEventsData(): Observable<IResponse<CreateEventData>> {
    return observe(this.http.get<CreateEventData>('api/create-events-data'));
  }

  postEvent(data: PreviewEventFormData): Observable<IResponse<any>> {
    return observe(this.http.post('api/create-event', data, this.httpOptions))
  }

  updateEvent(eventGuid: string, data: EventUpdate):  Observable<IResponse<any>> {
    const body = data;
    return observe(this.http.patch(`api/events/${eventGuid}`, body));
  }

  getStudentEvents(studentId: number): Observable<IResponse<EventSummary[]>> {
    return observe(this.http.get<EventSummary[]>(`api/student-events-data?studentId=${studentId}`));
  }
}
