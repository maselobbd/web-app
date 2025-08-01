import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, of, withLatestFrom } from "rxjs";
import { eventSummaryList, eventSummaryListSuccess, eventSummaryListFailure, eventDetails, eventDetailsSuccess, eventDetailsFailure, eventsPrePopulatedData, eventsPrePopulatedDataSuccess, eventsPrePopulatedDataFailure, studentEventsList, studentEventsListSuccess } from "./events.action";
import { EventsData, EventSummary } from '../../shared/data-access/models/eventSummary.model';
import { EventsService } from "../../shared/data-access/services/events.service";
import { EventDetails } from "../../shared/data-access/models/eventDetails.model";
import { EventInvitees } from "../../admin/data-access/models/eventInvitees.model";
import { Locations } from "../../admin/data-access/models/location.model";
import { UserStore } from "../../shared/data-access/stores/user.store";
import { Roles } from "../../authentication/data-access/models/auth.model";

@Injectable()
export class EventsEffects {
  constructor(
    private actions$: Actions,
    private userStore: UserStore,
    private eventService: EventsService
  ) {}

  loadEventSummaryData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(eventSummaryList),
      exhaustMap(({year}) =>
        this.eventService.getAdminEvents(year).pipe(
          map((data) => eventSummaryListSuccess({ year: year, eventData: data.results as EventsData })),
          catchError((error) => of(eventSummaryListFailure({ error: error.message })))
        )
      )
    )
  );

  loadEventDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(eventDetails),
      withLatestFrom(this.userStore.get()),
      exhaustMap(([{ eventGuid, email }, user]) => {
        const role = Roles[user.role as keyof typeof Roles];
        const isAdmin = role === Roles.admin;
        const request$ = isAdmin
          ? this.eventService.getIndividualEvent(eventGuid)
          : this.eventService.getIndividualStudentEvent(eventGuid, email!);

        return request$.pipe(
          map((data) =>  eventDetailsSuccess({eventGuid, eventDetails: data.results as EventDetails,})),
          catchError((error) =>
            of(eventDetailsFailure({ error: error.message }))
          )
        );
      })
    )
  );

  loadEventPepopulatedData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(eventsPrePopulatedData),
      exhaustMap(() =>
        this.eventService.getCreateEventsData().pipe(
          map((data) => eventsPrePopulatedDataSuccess({ bursars: data.results?.bursars as EventInvitees[], locations: data.results?.locations as Locations[], eventTypes: data.results?.eventTypes! })),
          catchError((error) => of(eventsPrePopulatedDataFailure({ error: error.message })))
        )
      )
    )
  );

  loadStudentEventsData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(studentEventsList),
      exhaustMap(({studentId}) =>
        this.eventService.getStudentEvents(studentId).pipe(
          map((data) => studentEventsListSuccess({ eventData: data.results as EventSummary[] })),
          catchError((error) => of(eventSummaryListFailure({ error: error.message })))
        )
      )
    )
  )
}
