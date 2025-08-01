import { Component, OnInit } from '@angular/core';
import { EventsData, EventSummary } from '../../data-access/models/eventSummary.model';
import { filter, first, Observable, take } from 'rxjs';
import { AdditionaInfoMessageType } from '../../enums/messages';
import { DataService } from '../../data-access/services/data.service';
import { LoaderService } from '../../data-access/services/loader.service';
import { MatSelectChange } from '@angular/material/select';
import { CategoryBreakdownTitles } from '../../enums/categories';
import { currentFiscalYear } from '../../utils/functions/dateUtils';
import { select, Store } from '@ngrx/store';
import { selectEventSummaryData, selectStudentEventsData } from '../../../states/events/events.selector';
import { eventSummaryList, studentEventsList } from '../../../states/events/events.action';
import { Roles } from "../../../authentication/data-access/models/auth.model";
import { UserStore } from "../../data-access/stores/user.store";
import { selectStudentPortalData } from "../../../states/student-portal/student-portal.selectors";

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.scss'
})
export class EventsListComponent implements OnInit{
  isLoading: boolean = false;
  selectedDate: number = currentFiscalYear();
  selectedEventType: string = CategoryBreakdownTitles.FILTER_DEFAULT;
  dateOptions: number[] = [];
  eventsData: EventsData = {events: [], eventFilters: {years: [], eventTypes: []}};
  eventTypeOptions: string[] = [];
  events: EventSummary[] = [];
  studentEvents: EventSummary[] = [];
  userRole!: Roles;
  studentId: number = 0;
  currentSearchTerm: string = '';
  EventsData$!: Observable<EventsData>;
  noEventErrorMessage: string = AdditionaInfoMessageType.NO_EVENTS

  constructor(
    private shareDataService: DataService,
    private loader: LoaderService,
    private store: Store,
    private userStore: UserStore,
  ) {
    this.userStore.get().subscribe((user) => {
      this.userRole = Roles[user.role as keyof typeof Roles];
    })
  }

  ngOnInit(): void {
    this.loader.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    if (this.userRole === Roles.admin) {
      this.shareDataService.fromDetails$.pipe(first()).subscribe((fromDetails) => {
        if (fromDetails) {
          this.shareDataService.date$.pipe(first()).subscribe((year) => {
            this.selectedDate = year || currentFiscalYear();
            this.eventsDataSubscription(this.selectedDate);
          });
        } else {
          this.selectedDate = currentFiscalYear();
          this.shareDataService.dateState(this.selectedDate);
          this.eventsDataSubscription(this.selectedDate);
        }
        this.shareDataService.setFromDetails(false);
      });
    } else if (this.userRole === Roles.student) {
      this.store.select(selectStudentPortalData).subscribe((student) => {
        if (student) {
          this.studentId = student.studentId;
          this.studentEventsData(this.studentId);
        }
      })
    }
  }

  eventsDataSubscription(year: number): void {
    this.EventsData$ = this.store.pipe(select(selectEventSummaryData(year)));
    this.EventsData$.pipe(first()).subscribe((data) => {
      if ( !data ) {
        this.store.dispatch(eventSummaryList({ year: this.selectedDate }));
        this.shareDataService.dateState(this.selectedDate);
      }
    });
    this.store.select(selectEventSummaryData(year)).subscribe((data) => {
      this.eventsData = data as EventsData;
      this.events = this.eventsData.events;
      this.dateOptions = [...this.eventsData.eventFilters.years, currentFiscalYear()+1];
      this.eventTypeOptions = [CategoryBreakdownTitles.FILTER_DEFAULT, ...this.eventsData.eventFilters.eventTypes];
    });
  }

  studentEventsData(studentId: number): void {
    this.store.select(selectStudentEventsData).pipe(first()).subscribe((data) => {
      if (!data) {
        this.store.dispatch(studentEventsList({ studentId }));
      }
    });
    this.store.select(selectStudentEventsData).pipe(
      filter(data => !!data), take(1)).subscribe((data) => {
      this.studentEvents = data!;
      this.events = [...data!];
    });
  }

  getCurrentSearch(): string {
    return this.shareDataService.getCurrentSearchName();
  }

  filterActiveApplicationsByDate(event: MatSelectChange): void {
    if(event.value) {
      this.selectedDate = event.value;
      this.shareDataService.dateState(event.value);
      this.eventsDataSubscription(event.value);
    }
  }

  search(term: {searchTerm:string, searchType:string}): void {
    const lowerCaseTerm = term.searchTerm.toLowerCase().trim();
    if (this.userRole === Roles.admin && !this.eventsData.events) return;

    if (term.searchType === 'eventName') {
      this.currentSearchTerm = lowerCaseTerm;
    } else if (term.searchType === 'eventType') {
      this.selectedEventType = term.searchTerm;
    }

    let filteredEvents: EventSummary[] = this.userRole == Roles.admin ? this.eventsData.events : this.studentEvents;
    if (this.selectedEventType !== CategoryBreakdownTitles.FILTER_DEFAULT) {
      filteredEvents = filteredEvents.filter((event: EventSummary) =>
        (event.eventType && event.eventType.toLowerCase().includes(this.selectedEventType.toLowerCase())));
    }

    if (this.currentSearchTerm) {
      filteredEvents = filteredEvents.filter((event: EventSummary) =>
        (event.eventName && event.eventName.toLowerCase().includes(this.currentSearchTerm.toLowerCase())));
    }
    this.events = [...filteredEvents];
  }

  protected readonly Roles = Roles;
}
