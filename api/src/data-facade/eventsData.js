const { db, createTVP } = require("../shared/db-connections");
const {
  get_events_query,
  event_statuses_query,
  event_types_query,
  locations_query,
  get_bursars_by_tier_query,
  create_event_query,
  add_event_location_query,
  insert_invitees_query,
  get_event_types_query ,
  get_invitees_details_query,
  get_event_details_query,
  get_event_locations_query,
  get_dietary_requirements_query,
  get_rsvp_responses_query,
  get_event_dates_and_times_query,
  update_event_status_id_query,
  get_rsvp_details_query
} = require("../queries/eventsQueries")

const event_statuses_data = async () => {
  const connection = await db();
  const event_statuses = await connection.timed_query(event_statuses_query, "event_statuses_data");
  return event_statuses["recordset"].map((statusJson) => statusJson["eventStatus"]);
}

const event_types_data = async () => {
  const connection = await db();
  const event_types = await connection.timed_query(event_types_query, "event_types_data");
  return event_types["recordset"].map((typesJson) => typesJson["eventTypeName"]);
}

const locations_data = async () => {
  const connection = await db();
  const locations = await connection.timed_query(locations_query, "locations_data");
  return locations["recordset"];
}

const get_bursars_by_tier_data = async () => {
  const connection = await db();
  const bursars = await connection.timed_query(get_bursars_by_tier_query, "get_bursars_by_tier_data");
  return bursars["recordset"];
}

const create_event_data = async (event, imageBlobName, userId) => {
  const connection = await db();
  const create_event = await connection
    .input("eventName", event.eventName)
    .input("eventDescription", event.description)
    .input("eventImageBlobName", imageBlobName)
    .input("eventType", event.eventType)
    .input("startDate", event.startDateTime)
    .input("endDate", event.endDateTime)
    .input("userId", userId)
    .input("eventStatus", event.eventStatus)
    .input("allowDietaryRequirements", event.dietaryRequirements)
    .input("allowNotes", event.additionalComments)
    .timed_query(create_event_query, "create_event_data");
  return create_event["recordset"];
}

const add_event_location_data = async (eventLocation, meetingUrl, eventId, userId) => {
  const connection = await db();
  const location = await connection
    .input("eventId", eventId)
    .input("locationName", eventLocation.locationName)
    .input("addressLineOne", eventLocation.addressLineOne)
    .input("addressLineTwo", eventLocation.addressLineTwo)
    .input("suburb", eventLocation.suburb)
    .input("city", eventLocation.city)
    .input("code", eventLocation.code)
    .input("meetingUrl", meetingUrl)
    .input("userId", userId)
    .input("locationStatus", eventLocation.locationStatus)
    .timed_query(add_event_location_query, "add_event_location_data");
  return location["recordset"];
}

const insert_invitees_data = async (eventId, studentId, userId) => {
  const connection = await db();
  const invitees = await connection
    .input("eventId", eventId)
    .input("studentId", studentId)
    .input("userId", userId)
    .timed_query(insert_invitees_query, "insert_invitees_data")
  return invitees["recordset"];
}

const get_events_data = async (year) => {
  const connection = await db();
  const events = await connection
    .input("year", year)
    .timed_query(
      get_events_query,
      "get_events_data",
    );
  return events["recordset"];
}

const get_event_types_data = async () => {
  const connection = await db();
  const eventTypes = await connection.timed_query(
    get_event_types_query,
    "get_event_types_data"
  );
  return eventTypes["recordset"];
}

const get_invitees_details_data = async (eventGuid) => {
  const connection = await db();
  const inviteesDetails = await connection
    .input("eventGuid", eventGuid)
    .timed_query(
      get_invitees_details_query,
      "get_invitees_details_data",
    );
  return inviteesDetails["recordset"];
}

const get_event_details_data = async (eventGuid) => {
  const connection = await db();
  const eventDetails = await connection
    .input("eventGuid", eventGuid)
    .timed_query(
      get_event_details_query,
      "get_event_details_data",
    );
  return eventDetails["recordset"];
}

const get_event_locations_data = async (eventGuid) => {
  const connection = await db();
  const eventLocations = await connection
    .input("eventGuid", eventGuid)
    .timed_query(
      get_event_locations_query,
      "get_event_locations_query"
    );
  return eventLocations["recordset"];
}

const get_dietary_requirements_data = async () => {
  const connection = await db();
  const dietaryRequirements = await connection.timed_query(
    get_dietary_requirements_query,
    "get_dietary_requirements_data"
  );
  return dietaryRequirements["recordset"];
}

const get_rsvp_responses_data = async () => {
  const connection = await db();
  const rsvpResponses = await connection.timed_query(
    get_rsvp_responses_query,
    "get_rsvp_responses_data"
  );
  return rsvpResponses["recordset"];
}

const update_event_data = async(eventChanges, eventGuid, userId) => {
  const connection = await db();
  const { startDate, endDate, locations, meetingUrl, eventImage, invitees, isCancelled } = eventChanges;
  const columns = [
    { name: 'studentId', type: 'INT' },
    { name: 'inviteCategory', type: 'VARCHAR', length: 50 }
  ]

  const locationColumns = [
    { name: 'locationName', type: 'VARCHAR', length: 255 },
    { name: 'addressLineOne', type: 'VARCHAR', length: 255 },
    { name: 'addressLineTwo', type: 'VARCHAR', length: 255 },
    { name: 'suburb', type: 'VARCHAR', length: 255 },
    { name: 'city', type: 'VARCHAR', length: 255 },
    { name: 'code', type: 'VARCHAR', length: 255 },
    { name: 'locationStatus', type: 'VARCHAR', length: 50 }
  ]

  const inviteesStudents = createTVP(invitees ? invitees : [], columns, 'inviteesTvp');
  const eventLocationsTVP = createTVP(locations ? locations : [], locationColumns, 'eventLocationsTVP');
  const eventUpdateResponse = await connection
    .input('eventGuid', eventGuid)
    .input('userId', userId)
    .input('startDate', startDate)
    .input('endDate', endDate)
    .input('meetingUrl', meetingUrl)
    .input('eventImageBlobName', eventImage)
    .input('withInvitees', invitees && invitees.length > 0)
    .input('withLocations', locations && locations.length > 0)
    .input('isCancelled', isCancelled)
    .input('inviteesTvp', inviteesStudents)
    .input('eventLocationsTVP', eventLocationsTVP)
    .execute('UpdateEventDetails', (error, result) => {
      if(error) {
        throw new Error(`Error executing event update`);
      } else {
        return result;
      }
    })
  return eventUpdateResponse['recordset'];
}
const get_event_dates_and_times_data = async () => {
  const connection = await db();
  const eventDates = await connection.timed_query(
    get_event_dates_and_times_query,
    "get_event_dates_and_times_data"
  );
  return eventDates["recordset"];
};

const update_event_status_id_data = async (eventId, startDate, endDate) => {
  const connection = await db();
  const eventStatusId = await connection
    .input("eventId", eventId)
    .input("startDate", startDate)
    .input("endDate", endDate)
    .timed_query(update_event_status_id_query, "get_event_status_id_data")
  return eventStatusId["recordset"];
};

const get_rsvp_details_data = async (email, eventGuid) => {
  const connection = await db();
  const individualRsvpDetails = await connection
    .input("email", email)
    .input("eventGuid", eventGuid)
    .timed_query(get_rsvp_details_query, "get_rsvp_details_data")
  return individualRsvpDetails["recordset"];
};

module.exports = {
  event_statuses_data,
  event_types_data,
  locations_data,
  get_bursars_by_tier_data,
  create_event_data,
  add_event_location_data,
  insert_invitees_data,
  get_events_data,
  get_event_types_data,
  get_invitees_details_data,
  get_event_details_data,
  get_event_locations_data,
  get_dietary_requirements_data,
  get_rsvp_responses_data,
  update_event_data,
  get_event_dates_and_times_data,
  update_event_status_id_data,
  get_rsvp_details_data,
}
