const event_statuses_query = "SELECT eventStatus FROM eventStatuses";
const event_types_query = "SELECT eventTypeName FROM eventTypes";
const locations_query = "SELECT locationName, addressLineOne, addressLineTwo, suburb, city, code FROM locations";
const get_bursars_by_tier_query = `
  SELECT st.studentId,
    st.name,
    st.surname,
    st.email,
    u.universityName,
    t.tier
  FROM tiers AS t
     INNER JOIN applicationTiers AS apt ON t.tierId = apt.tierId
     INNER JOIN universityApplications AS ua ON apt.applicationId = ua.applicationId
     INNER JOIN students AS st ON ua.studentId = st.studentId
     INNER JOIN universityDepartments AS ud ON ua.universityDepartmentId = ud.universityDepartmentId
     INNER JOIN universities AS u ON ud.universityId = u.universityId
  ORDER BY tier
`;
const create_event_query = `
EXEC CreateEvent @eventName, @eventDescription, @eventImageBlobName, @eventType, @startDate, @endDate, @userId, @eventStatus, @allowDietaryRequirements, @allowNotes`;
const add_event_location_query = `
EXEC AddEventLocation @eventId, @locationName, @addressLineOne, @addressLineTwo, @suburb, @city, @code, @meetingUrl, @userId, @locationStatus`;
const insert_invitees_query = `EXEC InsertInvitees @eventId, @studentId, @userId`

const get_events_query = `EXEC GetEvents @year`;

const get_event_types_query = `SELECT eventTypeName AS eventType FROM eventTypes`;

const get_invitees_details_query = `EXEC GetEventInvitees @eventGuid`;

const get_event_details_query = `EXEC GetEventDetails @eventGuid`;

const get_event_locations_query = `EXEC GetActiveEventLocations @eventGuid`;

const get_dietary_requirements_query = `SELECT dietaryRequirement FROM dietaryRequirements`;

const get_rsvp_responses_query = `SELECT response FROM rsvpResponses`;

const get_event_dates_and_times_query = `
  SELECT e.eventId,
    MAX(s.startDate) AS startDate,
    MAX(ed.endDate) AS endDate
  FROM events e
  LEFT JOIN eventsStartDateHistory s ON e.eventId = s.eventId
  LEFT JOIN eventsEndDateHistory ed ON e.eventId = ed.eventId
  GROUP BY e.eventId
`;

const update_event_status_id_query = `EXEC UpdateEventStatus @eventId, @startDate, @endDate`;

const get_rsvp_details_query = `EXEC GetRsvpDetails @eventGuid, @email`;

module.exports = {
  event_statuses_query,
  event_types_query,
  locations_query,
  get_bursars_by_tier_query,
  create_event_query,
  add_event_location_query,
  insert_invitees_query,
  get_events_query,
  get_event_types_query,
  get_invitees_details_query,
  get_event_details_query,
  get_event_locations_query,
  get_dietary_requirements_query,
  get_rsvp_responses_query,
  get_event_dates_and_times_query,
  update_event_status_id_query,
  get_rsvp_details_query,
};
