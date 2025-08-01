import { EventInvitees } from "./eventInvitees.model";
import { Locations } from "./location.model";

export interface EventUpdate {
  startDate?: string; 
  endDate?: string; 
  eventImage?: string;
  locations?: Locations[]; 
  meetingUrl?: string; 
  invitees?: EventInvitees[];
  isCancelled: boolean;
}

export interface EventFormValues {
  eventName: string;
  eventLocationType: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  physicalLocations: Locations[];
  meetingUrl: string;
  startDateTime: string;
  endDateTime: string;
}