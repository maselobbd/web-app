const  ErrorMessages = Object.freeze({
  internalServerError:"There was an internal error in the server, please contact your administrator.",
  invalidYearError:"Year must be a number",
  minimumAmountError:"newAmount must be greater than or equal to 1000.",
  configurationNotBooleanError:"Configuration is not of type boolean!",
  badRequest:"Bad Request",
  yearlyDataFailed:"Fetching reports data failed: ",
  configNotFound:"Error fetching configuration data",
  adminDataError:"There was an error fetching university data",
  eventsDataError: "There was an error fetching events data",
  imageUploadError: "Image upload failed.",
  eventCreationError: "There was an error creating the event",
  addLocationError: "There was an error adding the location"
});

  module.exports = ErrorMessages
