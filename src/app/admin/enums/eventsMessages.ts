export enum EventsMessages {
  CREATE_EVENT_FORM_MESSAGE = "Create a new event and add all the students who you would like to send an invite to the event.",
  EVENT_DETAILS_INSTRUCTIONS = "Add the details of the event, including event name, event type, event images, description, dates and times, and locations.",
  ADD_INVITEES_INSTRUCTIONS = "Select the bursars you would like to invite to the event. This will automatically send them an email with the invite and request to RSVP.",
  REVIEW_EVENT_INSTRUCTIONS = "Review the details and your invited guests. Once your event has been created an email will be sent to each of the invitees informing them of the invite and asking them to RSVP. Find your event details and responses to your event on your ‘Events’ page.",
  EVENT_NAME_REQUIRED = "*Event name is a required field",
  EVENT_DESCRIPTION_REQUIRED = "*Event description is a required field",
  EVENT_TYPE_REQUIRED = "*Event type is a required field",
  START_DATE_REQUIRED = "*Start date is a required field",
  END_DATE_REQUIRED = "*End date is a required field",
  LOCATION_REQUIRED = "*Location is a required field",
  URL_REQUIRED = "*Meeting Url is a required field",
  ADDRESS_LINE_TWO_REQUIRED = "*Address Line 2 is a required field",
  SUBURB_REQUIRED = "*Suburb is a required field",
  CITY_REQUIRED = "*City is a required field",
  POSTAL_CODE_REQUIRED = "*Postal code is a required field",
  INVALID_CODE = "*Invalid postal code",
  TIME_REQUIRED = "*Time is a required field",
  PAST_START_DATE = "*Start date cannot be in the past",
  PAST_START_TIME = "*Start time cannot be in the past",
  END_BEFORE_START_DATE = "*End date cannot be before the start date",
  END_BEFORE_START_TIME = "*End time cannot be before start time",
  RSVP_INFO = "RSVP information required",
  DIETARY_REQUIREMENTS = "Dietary requirements",
  ALLOW_NOTES = "Allow notes/additional comments",
  VALID_URL = "*Please enter a valid URL",
  EDIT_INVITEES_INSTRUCTIONS = `Add new invites to your event. The students who’s names have been disabled have already been invited to the event.`,
  EDIT_EVENT = "Make the changes to the selected event details below.",
  EDIT_INVITEES = "Add new invites to your event. The students who’s names have been disabled have already been invited to the event."
}

export enum EventsTitles {
  CREATE_EVENT = "Create a new event",
  EVENT_DETAILS = "Event details",
  ADD_INVITEES = "Add invitees",
  REVIEW_EVENT = "Review event details",
  ONLINE_MEETING = "Online meeting",
  MEETING_URL = "Meeting URL",
  PHYSICAL_LOCATION = "Physical location/s",
  PHYSICAL_ONLINE = "Physical and online event",
  EVENT_NAME = "Event name",
  EVENT_DESCRIPTION = "Event description",
  EVENT_TYPE = "Event type",
  START_DATE = "Start date",
  END_DATE = "End date",
  LOCATION_NAME = "Location name",
  ADDRESS_ONE = "Address Line 1",
  ADDRESS_TWO = "Address Line 2",
  SUBURB = "Suburb",
  CITY = "City",
  POSTAL_CODE = "Postal code",
  ONLINE_MEETING_CHECK = "Online Meeting",
  NOT_AVAILABLE = "Not Available"
}

export enum EventLocationTypes {
  PHYSICAL = 'physical',
  ONLINE = 'online',
  BOTH = 'both'
}

export enum LocationStatus {
  CONFIRMED = 'Confirmed',
  REVOKED = 'Revoked'
}
