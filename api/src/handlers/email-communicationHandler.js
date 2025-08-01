const { imagePathsEnum } = require("../shared/utils/enums/imagePathsEnum");
const { student_emails, update_application_status_history } = require("../data-facade/studentData");
const { sendEmail } = require("../shared/utils/helper-functions/send-email");
const ResponseStatus = require("../shared/utils/enums/responseStatusEnum");

const message = (emailAddress, studentName) => {
  return `
        <img src="${imagePathsEnum.DEFAULT_HEADER.blobUrl}" alt="ukukhula image" width="596,16" height="211,2"/><br/>
        <p>Hi there, ${studentName}!
        <p>We trust this mail finds you well. We're very excited to share a bursary opportunity with you, which <br/>
        you've been recommended for by your university!<br/><br/>
        We've recently received your details from your university, and we believe you are a great candidate<br/>
        for BBD's Ukukhula Bursary Fund. As such, we'd like to invite you to apply for this opportunity, so<br/>
        that we can assess your eligibility and proceed with your offer. <br/><br/>

        To apply, please complete the application using the link below:<br/><br/>
        <a href="${process.env.additionalInfoUrl + emailAddress}" target="_blank">${process.env.additionalInfoUrl + emailAddress}</a><br/><br/>
        Once you've submitted your application, please reach out to us so we can proceed. To do so, and if<br/>
        you have any other questions, you can contact us on <a href="mailto:${process.env.contactEmail}">${process.env.contactEmail}</a>.<br/><br/>

        Looking forward to hearing back from you soon! </p>

        Kind regards, <br/><br/>
        The BBD team</p>
    `;
};

const postEmail = async (request, context) => {
  try {
    const subject = `We think you'd be a great fit for BBD's Ukukhula Bursary Fund!`;
    const studentEmails = await student_emails();

    const emails = studentEmails.map((student) => {
      return sendEmail(
        context,
        [{ address: student.email }],
        message(student.email, student.name),
        subject,
      );
    });

    const emailsSent = await Promise.all(emails);

    const successfulEmails = [];
    emailsSent.forEach((email) => {
      if (email.status === ResponseStatus.SUCCESS) {
        successfulEmails.push(email.message);
      }
    });

    const applicationsToUpdate = studentEmails.map((student) => {
      if (student.email in successfulEmails) {
        return update_application_status_history(
          "BBD",
          student.applicationId,
          "In Review",
        );
      } else {
        return update_application_status_history(
          "BBD",
          student.applicationId,
          "Email Failed",
        );
      }
    });
    await Promise.all(applicationsToUpdate);

    return { status: ResponseStatus.SUCCESS };
  } catch (error) {
    return { status: ResponseStatus.ERROR };
  }
};

module.exports = {
  postEmail
}
