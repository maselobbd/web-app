const { get_users_from_db_data } = require("../../../data-facade/usersData");
let Sentiment = require('sentiment');
const { sendEmailToExecutive } = require("./emailToExecutives");
const getPrimaryDocuments = require("./studentDocumentsHelper.function");
const { student_data_by_id } = require("../../../data-facade/studentData");
const { update_last_email_sent_time_data, admin_update_application_status_history } = require("../../../data-facade/adminData");
const { getNextStatus } = require("./getNextStatusHelperFunction");
const { sendEmailsToHods } = require("./email-to-hod");
const { sendEmail } = require("./send-email");
const { studentAcceptanceToBursaryMessage, studentRejectionEmailMessageSubject, studentRejectionEmailMessage, bursaryAcceptanceMessageEmailSubject } = require("./email-templates");
const { documentStatusEnum } = require("../enums/documentStatusEnum");
const { responseMessages } = require("../enums/responseMessageEnum");
const { emailTypeEnum } = require("../enums/emailTypeEnum");
const actionReason = require("../enums/actionReasonEnum");
const ResponseStatus = require("../enums/responseStatusEnum");

const getApproverDetailsFromDb = async (approverEmail) => {
    const approverDetails = await get_users_from_db_data();
    return approverDetails.find((user) => user.emailAddress.toLowerCase() === approverEmail.toLowerCase());
  };
  
const validateApprover = (approver) => {
    const isKnownEmail = process.env.NEW_APPLICATIONS_APPROVER.split(",").includes(approver) ||
      process.env.FINANCE_APROVER.split(",").includes(approver);
    if (!isKnownEmail) {
      throw new Error(responseMessages.ERROR_INVALID_USER);
    }
  };
  
const extractStudentGuid = (body) => {
    const urlRegex = /\/admin\/studentDetails\/([A-Fa-f0-9-]{36})/g;
    const matches = [];
    let match;
    while ((match = urlRegex.exec(body)) !== null) {
      matches.push(match[1]);
    }
    return matches[1];
  };

  const extractMessageText = (htmlContent) => {
    const pattern1 = /<p class="MsoNormal"><span style="font-size:11\.0pt">(.*?)<\/span><\/p>/;
  
  const pattern2 = /<div dir="auto">(.*?)(?:<br|<\/div>)/;

  const pattern3 = /<div class="elementToProof"[^>]*>(.*?)<\/div>/;
  
  let match = htmlContent.match(pattern1) || 
              htmlContent.match(pattern2) || 
              htmlContent.match(pattern3);
  
  if (!match) {

    const genericPattern = /<body[^>]*>(.*?)<div[^>]*><div[^>]*>(?:<b>)?From:/s;
    match = htmlContent.match(genericPattern);
    
    if (match && match[1]) {
      const cleanedText = match[1].replace(/<[^>]*>/g, ' ')
                                  .replace(/\s+/g, ' ')
                                  .trim();
      if (cleanedText) {
        return cleanedText;
      }
    }
  }
  
  if (match && match[1]) {
    return match[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  
  throw new Error(responseMessages.NO_RESPONSE) 
  };
 

const sendApprovalEmails = async (status, applicationGuid, userId, context) => {
    const emailToApproveApplication = (status === documentStatusEnum.AWAITING_EXEC_APPROVAL)
      ? process.env.NEW_APPLICATIONS_APPROVER.split(",")
      : process.env.FINANCE_APROVER.split(",");
    
    context.log(`Sending approval emails to: ${emailToApproveApplication.join(", ")}`);
  
    await sendEmailToExecutive(
      context,
      emailToApproveApplication,
      emailTypeEnum.STUDENT_APPLICATION_REQUIRES_APPROVAL,
      getPrimaryDocuments(await student_data_by_id(applicationGuid)),
      applicationGuid
    );
  
    try {
      for (const email of emailToApproveApplication) {
        await update_last_email_sent_time_data(applicationGuid, actionReason.APPROVAL, email, userId);
      }
      context.log("LastEmailSentTime updated successfully.");
    } catch (dbError) {
      context.log("Database update failed:", dbError);
      throw new Error(responseMessages.ERROR_UPDATE_FAILED);
    }
  };
  
  const processApplicationApproval = async (approverDetails, applicationGuid, messageText,context) => {
    const studentDetails = await student_data_by_id(applicationGuid);
    if (!studentDetails) {
      throw new Error(responseMessages.ERROR_STUDENT_NOT_FOUND);
    }

    let status = getNextStatus(approverDetails, studentDetails);
    if (!status) {
      return ResponseStatus.ACCEPTED;
    }
    const sentiment = new Sentiment();
    const result = sentiment.analyze(messageText, { extras: { "approve": 5 } }).score;
    status = Math.sign(result) > 0 ? status : documentStatusEnum.REJECTED;
  
    await admin_update_application_status_history(status, applicationGuid, approverDetails.id);
  
    if (status === documentStatusEnum.APPROVED) {
        await processStudentAcceptance(status, applicationGuid, context);
    }else if(status == documentStatusEnum.REJECTED)
        {
          const studentFullname = `${studentDetails.name} ${studentDetails.surname}`;
          await sendEmail(
              context,
              [{ address: studentDetails.email }],
              studentRejectionEmailMessage(studentFullname),
              studentRejectionEmailMessageSubject,
          );
        }else{
            await sendApprovalEmails(status, applicationGuid, approverDetails.id,context);
        }
  
    return status;
  };
  
  const processStudentAcceptance = async (status, applicationGuid, context) => {
    if (status === documentStatusEnum.APPROVED) {
      const student = await student_data_by_id(applicationGuid);
      const studentFullname = `${student.name} ${student.surname}`;
      sendEmailsToHods(applicationGuid, context);
      await sendEmail(
        context,
        [{ address: student.email }],
        studentAcceptanceToBursaryMessage(studentFullname),
        bursaryAcceptanceMessageEmailSubject
      );
    }
  };

module.exports = {getApproverDetailsFromDb, validateApprover,extractStudentGuid,processApplicationApproval,processStudentAcceptance,extractMessageText}