import { EventPhoto } from "../../../student/models/photo.model";
import { InviteeFilters, InviteeInformation, RsvpDetails } from "./inviteeInformation.model";
import { EventLocation } from "./location.model";
import { EventLocationTypes } from "../../../admin/enums/eventsMessages";
import { Locations } from "../../../admin/data-access/models/location.model";
import { EventInvitees } from "../../../admin/data-access/models/eventInvitees.model";
import {FileData} from "./additionalInformationFileData.model";

export interface EventDetails {
    eventGuid?: string,
    eventName: string,
    eventStatus?: string,
    eventType: string,
    startDate: string,
    endDate: string,
    eventImage: string,
    eventDescription: string,
    downloadedEventImage: EventPhoto | string,
    imageExtension?: string,
    locations: EventLocation[],
    rsvpDetails?: RsvpDetails,
    invitees?: InviteeInformation[],
    inviteeFilters?: InviteeFilters,
}

export interface PreviewEventFormData {
  eventName: string;
  eventType: string;
  description: string;
  eventImage: FileData;
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
  eventLocationType: EventLocationTypes.PHYSICAL | EventLocationTypes.ONLINE | EventLocationTypes.BOTH;
  physicalLocations: Locations[];
  meetingUrl?: string;
  dietaryRequirements: boolean;
  additionalComments: boolean;
  invitees: EventInvitees[];
  startDateTime: string;
  endDateTime: string;
}
