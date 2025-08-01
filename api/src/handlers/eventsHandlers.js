const ResponseStatus = require("../shared/utils/enums/responseStatusEnum");
const ErrorMessages = require("../shared/utils/enums/internalServalErrorMessageEnum");
const { getDistinctYears, getDistinctUniversities } = require("../shared/utils/helper-functions/reportsHelperFunctions");
const {
  getDistinctEventTypes,
  getDistinctRsvpResponses,
  getDistinctDietaryRequirements,
  eventImageDownload
} = require("../shared/utils/helper-functions/eventsHelperFunctions");
const {
  get_events_data,
  get_event_types_data,
  get_event_details_data,
  get_event_locations_data,
  get_invitees_details_data,
  get_dietary_requirements_data,
  get_rsvp_responses_data,
  event_statuses_data,
  event_types_data,
  locations_data,
  get_bursars_by_tier_data,
  create_event_data,
  add_event_location_data,
  insert_invitees_data,
  update_event_data,
  get_event_dates_and_times_data,
  update_event_status_id_data,
  get_rsvp_details_data
} = require("../data-facade/eventsData");
const { distinct_year_of_study_data } = require("../data-facade/adminData");
const { getResponseErrors } = require('../shared/utils/helper-functions/errors');
const { uploadFile } = require("../shared/utils/helper-functions/upload-file");
const { sendEmail } = require("../shared/utils/helper-functions/send-email");
const { eventInviteMessage, eventInviteSubject, eventCancellationMessage, eventCancellationSubject} = require("../shared/utils/helper-functions/email-templates");
const { convertDateTimeToStandard } = require("../shared/utils/helper-functions/convertDateHelperFunction");
const eventMessages = require("../shared/utils/enums/eventMessagesEnum");
const { roles} = require("../shared/utils/enums/rolesEnum");

const getEventsCardData = async (request, context, locals) => {
  try {
    const year = request.query.get("year");
    const [allEvents, eventTypes, yearsOfFunding] = await Promise.all([
      get_events_data(year),
      get_event_types_data(),
      distinct_year_of_study_data()
    ]);
    const eventsJsonString = allEvents[0]?.events;
    let parsedEvents = JSON.parse(eventsJsonString) || [];

    parsedEvents = await Promise.all(parsedEvents.map(async (event) => {
      if (event.eventImage !== eventMessages.NOT_AVAILABLE) {
        event.downloadedEventImage = await eventImageDownload(event);
      }
      return event;
    }));

    const filters = {
      years: getDistinctYears(yearsOfFunding),
      eventTypes: getDistinctEventTypes(eventTypes)
    };
    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: {
        events: parsedEvents,
        eventFilters: filters
      }
    }

  } catch(error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.adminDataError}: ${error}`
    }
  }
}

const getEventDetailsByEventId = async (request, context, locals) => {
  const role = locals.role;
  const eventGuid = request.query.get("eventGuid");

  try {
    const eventDetails = await get_event_details_data(eventGuid);
    const eventLocations = await get_event_locations_data(eventGuid);
    
    const eventJsonString = eventDetails[0]?.event;
    const locationJsonString = eventLocations[0]?.locations;

    const parsedEvent = JSON.parse(eventJsonString)[0];
    const parsedLocations = JSON.parse(locationJsonString);

    if (parsedEvent.eventImage !== eventMessages.NOT_AVAILABLE) {
      parsedEvent.downloadedEventImage = await eventImageDownload(parsedEvent);
      parsedEvent.imageExtension = parsedEvent.eventImage.split('.').pop();
    }
    parsedEvent.locations = parsedLocations;
    
    if (role === roles.ADMIN) {
      const [
        inviteesDetails,
        dietaryRequirements,
        possibleRsvpResponses
      ] = await Promise.all([
        get_invitees_details_data(eventGuid),
        get_dietary_requirements_data(),
        get_rsvp_responses_data()
      ]);
  
      const inviteesJsonString = inviteesDetails[0]?.invitees;
      const parsedInvitees = JSON.parse(inviteesJsonString);
      const inviteeUniversities = parsedInvitees.length > 0 ? getDistinctUniversities(parsedInvitees) : [];
  
      parsedEvent.invitees = parsedInvitees;
      parsedEvent.inviteeFilters = {
        rsvp: getDistinctRsvpResponses(possibleRsvpResponses),
        university: inviteeUniversities,
        dietaryRequirements: getDistinctDietaryRequirements(dietaryRequirements)
      };

    } else if (role === roles.STUDENT) {
      const email = request.query.get("email");
      const individualRsvpDetails = await get_rsvp_details_data(email, eventGuid);
    
      const rsvpDetailsString = individualRsvpDetails[0]?.rsvp;
      const parsedRsvpDetails = JSON.parse(rsvpDetailsString)[0];

      parsedEvent.rsvpDetails = parsedRsvpDetails;
    }

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: parsedEvent
    }

  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: `${ErrorMessages.eventsDataError}: ${error}`
    }
  }
}

const updateEvent = async(request, context, locals) => {
  try {
    const eventGuid = request.params.eventGuid;
    const eventChangesBody  = await request.json();
    const userId = locals.userId;

    if(Object.keys(eventChangesBody).length < 1 || !eventGuid) return;

    if (eventChangesBody.eventImage) {
      const imageBlobName = eventChangesBody.eventImage !== eventMessages.NOT_AVAILABLE
          ? await uploadFile(eventChangesBody.eventImage, true)
          : eventChangesBody.eventImage;

      if (!imageBlobName) {
        return {
          status: ResponseStatus.ERROR,
          jsonBody: ErrorMessages.imageUploadError,
        };
      }

      eventChangesBody.eventImage = imageBlobName;
    }
    await update_event_data(eventChangesBody, eventGuid, userId);

    if ((eventChangesBody.invitees && eventChangesBody.invitees.length > 0) || eventChangesBody.isCancelled) {
      const [
        eventDetails,
        eventLocations,
      ] = await Promise.all([
        get_event_details_data(eventGuid),
        get_event_locations_data(eventGuid),
      ]);

      const eventJsonString = eventDetails[0]?.event;
      const locationJsonString = eventLocations[0]?.locations;
      const parsedEvent = JSON.parse(eventJsonString)[0];
      const parsedLocations = JSON.parse(locationJsonString);

      if (eventChangesBody.invitees && eventChangesBody.invitees.length > 0) {
        for (const invitee of eventChangesBody.invitees) {
          await sendEmail(
            context,
            [{address: invitee.email}],
            eventInviteMessage(
              parsedEvent.eventName,
              invitee.name,
              convertDateTimeToStandard(parsedEvent.startDate),
              parsedLocations[0].location),
            eventInviteSubject(parsedEvent.eventName)
          )
        }
      }

      if (eventChangesBody.isCancelled) {
        const inviteesDetails = await get_invitees_details_data(eventGuid);
        const inviteesJsonString = inviteesDetails[0]?.invitees;
        const parsedInvitees = JSON.parse(inviteesJsonString);

        if (parsedInvitees.length > 0) {
          for (const invitee of parsedInvitees) {
            await sendEmail(
              context,
              [{address: invitee.email}],
              eventCancellationMessage(
                parsedEvent.eventName,
                invitee.firstName,
                convertDateTimeToStandard(parsedEvent.startDate),
                parsedLocations[0].location),
              eventCancellationSubject(parsedEvent.eventName)
            )
          }
        }
      }
    }

    return {
      status: ResponseStatus.NO_CONTENT
    }
  } catch(error) {
    context.log(error);
    return getResponseErrors(error.message);
  }
}

const getCreateEventsData = async (request, context) => {
  try {
    const eventStatuses = await event_statuses_data();
    const eventTypes = await event_types_data();
    const locations = await locations_data();
    const bursars = await get_bursars_by_tier_data();

    return {
      status: ResponseStatus.SUCCESS,
      jsonBody: {
        eventStatuses,
        eventTypes,
        locations,
        bursars
      },
    };
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    }
  }
};

const postEvent = async (request, context, locals) => {
  try {
    const data = await request.json();

    let imageBlobName;
    if (!data.eventImage || !data.eventImage.filebytes) {
      imageBlobName = eventMessages.NOT_AVAILABLE;
    } else {
      imageBlobName = await uploadFile(data.eventImage.filebytes, true);
      if (!imageBlobName) {
        return {
          status: ResponseStatus.ERROR,
          jsonBody: ErrorMessages.imageUploadError,
        };
      }
    }

    const createEvent = await create_event_data(data, imageBlobName, locals.userId)
    const eventId = createEvent[0]?.eventId;
    if (!eventId) {
      return {
        status: ResponseStatus.ERROR,
        jsonBody: ErrorMessages.eventCreationError,
      };
    }

    if (data.physicalLocations.length > 0){
      for (const location of data.physicalLocations) {
        await add_event_location_data(location, data.meetingUrl, eventId, locals.userId);
      }
    }

    if (data.invitees.length > 0) {
      for (const invitee of data.invitees) {
        await insert_invitees_data(eventId, invitee.studentId, locals.userId)
        await sendEmail(
          context,
          [{address: invitee.email}],
          eventInviteMessage(
            data.eventName,
            invitee.name,
            convertDateTimeToStandard(data.startDateTime),
            data.physicalLocations[0].locationName),
          eventInviteSubject(data.eventName)
        )
      }
    }

    return {
      status: ResponseStatus.CREATED,
      jsonBody: eventId
    }
  } catch (error) {
    context.log(error);
    return {
      status: ResponseStatus.ERROR,
      jsonBody: ErrorMessages.internalServerError,
    }
  }
}

async function updateEventStatuses (context) {
  const events = await get_event_dates_and_times_data();

  for (const { eventId, startDate, endDate } of events) {
    update_event_status_id_data(eventId, startDate, endDate);
  }
}

module.exports = {
    getEventsCardData,
    getEventDetailsByEventId,
    updateEvent,
    getCreateEventsData,
    postEvent,
    updateEventStatuses
}
