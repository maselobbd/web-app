import { createAction, props } from "@ngrx/store";
import { EventDetails } from "../../shared/data-access/models/eventDetails.model";
import { EventInvitees } from "../../admin/data-access/models/eventInvitees.model";
import { Locations } from "../../admin/data-access/models/location.model";
import { EventsData, EventSummary } from '../../shared/data-access/models/eventSummary.model';


export const eventSummaryList = createAction(
    '[Admin Events] Get Events Data', props<{ year: number }>()
);

export const eventSummaryListSuccess = createAction(
    "[Admin Events] Get Events Data Success", props<{ year:number, eventData: EventsData }>()
);

export const eventSummaryListFailure = createAction(
    "[Admin Events] Get Events Data Failure", props<{ error: string }>()
);

export const eventDetails = createAction(
    '[Event Details] Get Event Details Data', props<{ eventGuid: string, email?: string }>()
);

export const eventDetailsSuccess = createAction(
    "[Event Details] Get Event Details Data Success", props<{ eventGuid: string, eventDetails: EventDetails }>()
);

export const eventDetailsFailure = createAction(
    "[Event Details] Get Event Details Data Failure", props<{ error: string }>()
);

export const eventsPrePopulatedData = createAction(
    '[Event Prepopulated Data] Get Event Details Data'
);

export const eventsPrePopulatedDataSuccess = createAction(
    "[Event Prepopulated Data] Get Event Details Data Success", props<{ bursars: EventInvitees[], locations: Locations[], eventTypes: string[] }>()
);

export const eventsPrePopulatedDataFailure = createAction(
    "[Event Prepopulated Data] Get Event Details Data Failure", props<{ error: string }>()
);

export const studentEventsList = createAction(
  "[Student Events] Get Student Events Data", props<{ studentId: number }>()
);

export const studentEventsListSuccess = createAction(
  "[Student Events] Student Events Data Success", props<{ eventData: EventSummary[] }>()
);
