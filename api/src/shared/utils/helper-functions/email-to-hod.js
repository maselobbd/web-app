const { hodUserId_data } = require("../../../data-facade/adminData");
const { applicationStatusUpdateToHod,applicationStatusUpdateToHodSubject} = require("./email-templates");
const { sendEmail } = require("./send-email");
const { imagePathsEnum } = require("../enums/imagePathsEnum");

async function sendEmailsToHods(applicationGuid,cache,context) {
    
    const hodUserId = await hodUserId_data(applicationGuid);
    const users = cache.get('users') || [];
    const hodDetails = users.find((elem) => elem.id == hodUserId["userId"]);

    if(hodDetails)
    {
      await sendEmail(
        context,
        [{ address: hodDetails.emailAddress }],
        applicationStatusUpdateToHod(hodDetails.givenName),
        applicationStatusUpdateToHodSubject,
        imagePathsEnum.HOD_UPDATE_HEADER,
      );
    }
};

module.exports = {sendEmailsToHods}