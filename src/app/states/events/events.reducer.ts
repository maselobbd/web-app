import { createReducer, on } from '@ngrx/store';
import { eventSummaryListSuccess, eventSummaryListFailure, eventDetailsSuccess, eventDetailsFailure, eventsPrePopulatedDataSuccess, eventsPrePopulatedDataFailure, studentEventsListSuccess } from './events.action';
import { EventDetails } from '../../shared/data-access/models/eventDetails.model';
import { EventInvitees } from '../../admin/data-access/models/eventInvitees.model';
import { Locations } from '../../admin/data-access/models/location.model';
import { EventsData, EventSummary } from '../../shared/data-access/models/eventSummary.model';

export interface EventSummaryState {
    eventSummaryListSuccess: {[year: number] : EventsData};
    studentEventsListSuccess: EventSummary[] | null;
    error: string | null;
}

export interface EventDetailsState {
    eventDetailsSuccess: {[eventGuid: string] : EventDetails};
    error: string | null;
}

export interface EventsPrePopulatedDataState {
    eventsPrePopulatedDataSuccess: {
        bursars: EventInvitees[],
        locations: Locations[],
        eventTypes: string[],
    };
    error: string | null;
}

export const initialEventSummaryState: {[year: number]: EventsData} = {};

export const initialEventDetailsState: {[eventGuid: string] : EventDetails} = {};

export const initialEventsPrePopulatedDataState: { bursars: EventInvitees[], locations: Locations[], eventTypes: string[] } = {
  bursars: [],
  locations: [],
  eventTypes: []
}

export const initialSummaryState: EventSummaryState = {
    eventSummaryListSuccess: initialEventSummaryState,
    studentEventsListSuccess: null,
    error: null,
};

export const initialDetailsState: EventDetailsState = {
    eventDetailsSuccess: initialEventDetailsState,
    error: null,
};

export const initialPrePopulatedDataState: EventsPrePopulatedDataState = {
  eventsPrePopulatedDataSuccess: initialEventsPrePopulatedDataState,
  error: null,
};

export const EventSummaryReducer = createReducer(
  initialSummaryState,
  on(eventSummaryListSuccess, (state, { year, eventData }) => ({
    ...state,
    eventSummaryListSuccess: {
      ...state.eventSummaryListSuccess,
      [year]: eventData
    },
    error: null
  })),
  on(studentEventsListSuccess, (state, { eventData }) => ({
    ...state,
    studentEventsListSuccess: eventData,
    error: null
  })),
  on(eventSummaryListFailure, (state, { error }) => ({
    ...state,
    error
  }))
)

export const EventDetailsReducer = createReducer(
  initialDetailsState,
  on(eventDetailsSuccess, (state, { eventGuid, eventDetails }) => ({
    ...state,
    eventDetailsSuccess: {
      ...state.eventDetailsSuccess,
      [eventGuid]: eventDetails
    },
    error: null
  })),
  on(eventDetailsFailure, (state, { error }) => ({
    ...state,
    error
  }))
)

export const EventPrePopulatedDataReducer = createReducer(
  initialPrePopulatedDataState,
  on(eventsPrePopulatedDataSuccess, (state, { bursars, locations, eventTypes }) => ({
    ...state,
    eventsPrePopulatedDataSuccess: { bursars, locations, eventTypes},
    error: null
  })),
  on(eventsPrePopulatedDataFailure, (state, { error }) => ({
    ...state,
    error
  }))
)
