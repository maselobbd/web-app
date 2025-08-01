const { app } = require("@azure/functions");
const EmailCommunicationAppFunctionName = require('../shared/utils/enums/communicationAppFunctionEnum')
const { postEmail } = require("../handlers/email-communicationHandler");

app.http(EmailCommunicationAppFunctionName["email-communication"], {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: postEmail,
});
