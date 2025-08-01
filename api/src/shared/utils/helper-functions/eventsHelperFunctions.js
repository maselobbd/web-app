const { downloadFile } = require("./download-file");

const getDistinctEventTypes = (objectsWithEventTypes) => {
  return Array.from(new Set(objectsWithEventTypes.map(objectWithEventType => objectWithEventType.eventType)));
}

const getDistinctRsvpResponses = (objectsWithRsvpResponses) => {
  return Array.from(new Set(objectsWithRsvpResponses.map(objectWithRsvpResponse => objectWithRsvpResponse.response)));
}

const getDistinctDietaryRequirements = (objectsWithDietaryRequirements) => {
  return Array.from(new Set(objectsWithDietaryRequirements.map(objectWithDietaryRequirement => objectWithDietaryRequirement.dietaryRequirement)));
}

const eventImageDownload = async (event) => {
  if (!event?.eventImage) {
    return null;
  }
  const eventImage = await downloadFile(event.eventImage);
  return { eventImage: eventImage }  
}

module.exports = { getDistinctEventTypes, getDistinctRsvpResponses, getDistinctDietaryRequirements, eventImageDownload }