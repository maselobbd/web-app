export interface InviteeInformation {
    firstName: string,
    surname: string,
    studentId: number,
    universityName: string,
    rsvp: string,
    location: string,
    dietaryRequirements: string,
    allergies: string,
    notes: string
}

export interface InviteeFilters {
    rsvp: string[],
    university: string[],
    dietaryRequirements: string[]
}

export interface RsvpDetails {
    studentId: number,
    eventId: number,
    rsvp: string,
    location: string,
    dietaryRequirements: string,
    allergies: string,
    notes: string
}