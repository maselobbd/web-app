const { sendEmail } = require("./send-email");
const {emailTypeEnum}= require("../enums/emailTypeEnum");
const emailTemplates = require("./email-templates");
const { extractNameFromEmail } = require("./extractNameFromEmailHelperFunctions");
const { imagePathsEnum } = require("../enums/imagePathsEnum");

const sendEmailToExecutive = async (context, emailList, type, documents, applicationGuid) => {

  const emailConfig = getEmailConfig(type);
  if(!emailConfig) {
    context.log("Invalid email type");
    return;
  }

  const { template, subject } = emailConfig;

  await Promise.allSettled(
    emailList.map((email) =>
      sendEmail(
        context,
        [{ address: email }],
        template(extractNameFromEmail(email), applicationGuid),
        subject,
        imagePathsEnum.BBD_EXECS_HEADER,
        documents,
        true
      )
    )
  ).then((results) => {
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        context.log(`Failed to send email to ${emailList[index]}: ${result.reason}`);
      }
    });
  });
}

const emailConfigMap = {
  [emailTypeEnum.STUDENT_APPLICATION_REQUIRES_APPROVAL]: {
    template: emailTemplates.alertExecutiveToApproveApplication,
    subject: emailTemplates.alertExecApplicationApprovalSubject,
  },
  [emailTypeEnum.STUDENT_APPLICATION_INVOICE_REQUIRES_APPROVAL]: {
    template: emailTemplates.alertExecutiveToApproveApplication,
    subject: emailTemplates.alertExecInvoiceApproval,
  }
};

const getEmailConfig = (type) => emailConfigMap[type] || null;

module.exports = {sendEmailToExecutive}