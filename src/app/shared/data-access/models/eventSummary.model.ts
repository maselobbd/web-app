import {EventPhoto} from "../../../student/models/photo.model";

export interface EventSummary {
    eventGuid: string,
    eventName: string,
    eventImage: string,
    eventType?: string,
    startDate: string,
    endDate: string,
    eventStatus?: string,
    rsvp?: string,
    RsvpNumbers?: Rsvpnumbers,
    downloadedEventImage: EventPhoto | string,
}

export interface Rsvpnumbers {
    totalInvites: number,
    confirmedRsvps: number,
    declinedRsvps: number,
    outstandingRsvps: number
}

export interface EventFilters {
    years: number[],
    eventTypes: string[]
}

export interface EventsData {
    events: EventSummary[],
    eventFilters: EventFilters
}
