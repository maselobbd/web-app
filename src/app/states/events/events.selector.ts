import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EventDetailsState, EventsPrePopulatedDataState, EventSummaryState } from './events.reducer';

export const selectEventSummaryState = createFeatureSelector<EventSummaryState>('eventSummary');

export const selectEventDetailsState = createFeatureSelector<EventDetailsState>('eventDetails');

export const selectPrePopulatedDataState = createFeatureSelector<EventsPrePopulatedDataState>('eventsPrePopulatedData');

export const selectEventSummaryData = (year: number) => createSelector(
  selectEventSummaryState,
  (eventSummaryState) => eventSummaryState.eventSummaryListSuccess[year]
);

export const selectEventDetailsData = (eventGuid: string) => createSelector(
  selectEventDetailsState,
  (eventDetailsState) => eventDetailsState.eventDetailsSuccess[eventGuid]
);

export const selectEventsPrePopulatedData = () => createSelector(
  selectPrePopulatedDataState,
  (eventPrePopulatedDataState) => eventPrePopulatedDataState.eventsPrePopulatedDataSuccess
);

export const selectStudentEventsData = createSelector(
  selectEventSummaryState,
  (studentEventsState) => studentEventsState.studentEventsListSuccess
)

export const selectEventSummaryError = () => createSelector(
  selectEventSummaryState,
  (eventSummaryState) => eventSummaryState.error
);

export const selectEventDetailsError = () => createSelector(
  selectEventDetailsState,
  (eventDetailsState) => eventDetailsState.error
);

export const selectEventsPrePopulatedDataError = () => createSelector(
  selectPrePopulatedDataState,
  (eventPrePopulatedDataState) => eventPrePopulatedDataState.error
);
