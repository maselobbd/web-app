const { app } = require("@azure/functions");
const { auth, userRoles } = require("../shared/auth");
const functionNames = require("../shared/utils/enums/functionNamesEnum");
const { getEventsCardData, 
  getEventDetailsByEventId, 
  updateEvent,
  getCreateEventsData,
  postEvent,
  updateEventStatuses
} = require("../handlers/eventsHandlers")
const { cronSchedule } = require("../shared/utils/enums/cronSchedulesEnum");
const eventAppFunctionName = require("../shared/utils/enums/eventAppFunctionNameEnum");

app.get(eventAppFunctionName.getCreateEventsData, {
  route: "create-events-data",
  authLevel: "anonymous",
  handler: auth(userRoles.all, (request, context) => {
    return getCreateEventsData(request, context)
  }),
})

app.post(eventAppFunctionName.postEvent, {
  route: "create-event",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return postEvent(request, context, locals)
  })
})

app.get(eventAppFunctionName.getEventsCardData, {
  route: "events",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return getEventsCardData(request, context, locals);
  }),
});

app.get(eventAppFunctionName.getEventDetailsByEventId, {
  route: "event-details",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return getEventDetailsByEventId(request, context, locals);
  }),
});

app.get(eventAppFunctionName.getStudentEventDetails, {
  route: "student-event-details",
  authLevel: "anonymous",
  handler: auth(userRoles.student, (request, context, locals) => {
    return getEventDetailsByEventId(request, context, locals);
  }),
});

app.patch(eventAppFunctionName.updateEvent, {
  route: "events/{eventGuid}",
  authLevel: "anonymous",
  handler: auth(userRoles.admin, (request, context, locals) => {
    return updateEvent(request, context, locals);
  })
})

app.timer(eventAppFunctionName.updateEventStatuses, {
  schedule: cronSchedule.updateEventStatuses,
  handler: (myTimer, context) => {
    return updateEventStatuses(context);
  }
});
