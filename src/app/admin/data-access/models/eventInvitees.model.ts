import { Locations } from "./location.model";

export interface EventInvitees {
  studentId: number,
  name: string,
  surname: string,
  email: string,
  universityName: string,
  tier: number,
  inviteCategory?: string
}

export interface GroupedBursars {
  tier: number;
  bursars: EventInvitees[];
}

export interface CreateEventData {
  eventStatuses: string[],
  eventTypes: string[],
  locations: Locations[],
  bursars: EventInvitees[]
}
