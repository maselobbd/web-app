const bursaryTypes = require("../enums/bursaryTypesEnum");
const { imagePathsEnum } = require("../enums/imagePathsEnum");
const bbdWebsiteInvite = `To learn more about BBD software please visit our website: ${process.env.BBD_URL}`;
const studentAdditionalInformationEmailMessage = (
  applicationGuid,
  studentName,
  bursaryType = bursaryTypes.UKUKHULA
) => {
  return bursaryType ===bursaryTypes.UKUKHULA ?
  `
          <main>
            <img src="${imagePathsEnum.DEFAULT_HEADER.blobUrl}" alt="ukukhula image" width="596,16" height="211,2"/><br/>
            <p>Hi there, ${studentName}! </P>
            <p>We're very excited to share a bursary opportunity with you, which <br/>
            you've been recommended for by your university!<br/><br/>
            We've recently received your details from your university, and we believe you are a great applicant<br/>
            for BBD's Ukukhula Bursary Fund. As such, we'd like to invite you to apply for this opportunity, so<br/>
            that we can assess your eligibility and proceed with your application. <br/><br/>

            To apply, please complete the application using the link below:<br/><br/>
            <a href="${process.env.additionalInfoUrl + applicationGuid}" target="_blank">${process.env.additionalInfoUrl + applicationGuid}</a><br/><br/>
            Once you've submitted your application, you will be notified on the next steps. If you have<br/>
            any other questions, you can contact us on <a href="mailto:${process.env.contactEmail}">${process.env.contactEmail}</a>.<br/><br/>
            Looking forward to receiving your application soon!</p> <br/>
            ${bbdWebsiteInvite}<br/><br/>
            
            <p>Kind regards, <br/><br/>
            The Ukukhula team</p>
          </main>
      `:
  `
          <main>
            <img src="${imagePathsEnum.BBD_HEADER.additionalInfoBlobUrl}" alt="Ukukhula Bursary Fund Header Image" width="596.16" height="211.2" style="max-width: 100%; height: auto;" /><br/>
            <p>Hi there, ${studentName}!</p>
            <p>
              We're very excited to welcome you to our new BBD Bursary platform, where you can manage everything related to your bursary.
            </p>
            <p>
              Please click the link below to attach any additional information needed for your bursary:<br/><br/>
              <a href="${process.env.additionalInfoUrlBBDBursar + applicationGuid}" target="_blank" style="color: #007bff; text-decoration: underline;">Submit Additional Information</a>
            </p>
            <p>
              Once you've submitted your additional information, you will be notified on the next steps. If you have any questions, you can contact us at <a href="mailto:${process.env.contactEmail}" style="color: #007bff; text-decoration: underline;">${process.env.contactEmail}</a>.
            </p>
            <p>Looking forward to receiving your additional information soon!</p>
            <p>${bbdWebsiteInvite}</p>
            <p>
              Kind regards,<br/><br/>
              The Ukukhula team
            </p>
          </main>
  `;     
      ;
};

const studentAdditionalInformationEmailMessageSubject = `We think you'd be a great fit for BBD's Ukukhula Bursary Fund!`;

const bbdStudentAdditionalInformationEmailMessageSubject = `BBD Bursary Fund Update!`;

const studentRejectionEmailMessage = (name) => {
  return `
  <main>
    <img src="${imagePathsEnum.DEFAULT_HEADER.blobUrl}" alt="ukukhula image" width="596,16" height="211,2"/><br/>
    <p>Good day ${name}</p>
    <p>Thanks for taking the time to apply for the Ukukhula bursary at BBD.<br/>
    Unfortunately, we won't be moving ahead with your application for the bursary however, we truly appreciate your interest.<br/>
    Please keep an eye on our website for possible suited positions and feel free to apply through the careers page on:&nbsp;&nbsp;
    <a href="https://bbdsoftware.com/open-positions/#positions" target="_blank">https://bbdsoftware.com/open-positions/#positions<a>
    <p>Sincerely, <br/><br/>
    HR Team.</p>
  </main>
  `;
};

const bursaryTerminationEmailMessage = (name) => {
  return `
  <main>
    <img src="${imagePathsEnum.DEFAULT_HEADER.blobUrl}" alt="ukukhula image" width="596,16" height="211,2"/><br/>
    <p>Good day ${name}</p>
    <p>Thank you for your interest in the Ukukhula Bursary at BBD and for taking the time to submit your application.<br/>
    After careful review, we regret to inform you that your application has been terminated and will not be progressing further in the selection process. We sincerely appreciate your effort and the enthusiasm you’ve shown.<br/><br/>
    We encourage you to keep an eye on our website for future opportunities that may be better suited to your profile. You’re welcome to apply via our careers page at:&nbsp;
    <a href="https://bbdsoftware.com/open-positions/#positions" target="_blank">https://bbdsoftware.com/open-positions/#positions<a></p>
    <p>Wishing you all the best in your future endeavors.<br/><br/>
    Kind regards, <br/>
    HR Team.</p>
  </main>
  `;
}

const studentRejectionEmailMessageSubject = `BBD bursary application feedback`;

const studentAdditionalInformationSubmissionEmailMessage = (name) => {
  return `
    <main>
      <img src="${imagePathsEnum.DEFAULT_HEADER.blobUrl}" alt="ukukhula image" width="596,16" height="211,2"/><br/>
      <p>Dear ${name},</p>

      <p>Congratulations, you've taken the first steps to qualify for a bursary with us at BBD! Your application for the Ukukhula bursary fund, has been received and will be assessed in due course. <br/> <br/>

          After your application has been reviewed, a Grad Master from our team, will be in touch with you to explain the next steps in our process, which will include a technical assessment prior to the interview phase. <br/>
          We look forward to chatting with you and will be in touch soon! <br/> <br/>
           ${bbdWebsiteInvite}<br/><br/>

             <p>Kind regards, <br/><br/>
            The Ukukhula team</p>
      </p>
    </main>
  `;
};

const inviteToHODEmailMessage = () => {
  return `
  <main>
      <img src="${imagePathsEnum.HOD_INVITE_HEADER.blobUrl}" alt="ukukhula image" width="596,16" height="211,2"/><br/>
      <p>Hi there,</p>

      <p>We trust this mail finds you well.</p>

      <p>We’re eager to get you and your university registered on BBD’s Ukukhula Bursary Fund system.</p>

      <p>As you know, we’ve developed this bursary fund as an additional funding opportunity, in partnership with various South African universities, to seek out and provide necessary aid for highly talented students. </p>

      <p>Your expertise in identifying high-achieving students is invaluable to us. Through our dedicated online system, you can nominate deserving students from your university for bursary consideration. This streamlined process simplifies the application process for both you and your students.
      </p>

      <p>To register and start referring talented students within your university, click the link below:</p>
      <p> ${process.env.WEBSITE_URL}</p>

      <p>We encourage you to register and explore the Ukukhula Bursary Fund. It's a fantastic opportunity to support your top students and propel their academic journeys.<br/><br/>

      Please get in touch should you require any further information or assistance. <br/><br/>
      ${bbdWebsiteInvite}<br/><br/>
      Kind regards,<br/>
      HR Team.
      </p>
    </main>
  
  `;
};

const studentAcademicRecordEmailMessage = (bursaryType) => {
  return bursaryType.toLowerCase() === bursaryTypes.UKUKHULA.toLowerCase() 
  ? `
  <html>
    <main>
      <img src="${imagePathsEnum.DEFAULT_HEADER.blobUrl}" alt="ukukhula image" width="596.16" height="211.2"/><br/>
      
      <p>Hi there!</p>
      
      <p>We hope this message finds you well. As a candidate for the Ukukhula Bursary Fund, we kindly 
      request that you upload your latest academic records using the link provided below:</p>
      
      <p>Please follow the steps below to submit your records:</p>
      <ol>
        <li>Navigate to the link provided below</li>
        <li>Upload your latest academic transcript or report</li>
      </ol>
      <p> ${process.env.WEBSITE_URL}</p>
      <p>We kindly ask that you complete this task as soon as possible for us to update your records. If you encounter any issues or have any questions, please do not hesitate to get in touch with us! We look forward to continuing to support you on your academic journey.</p> <br/><br/>
      ${bbdWebsiteInvite}<br/><br/>
      <p>Kind regards,</p>
      
      <p>HR Team</p>
    </main>
  </html>
    `
  : `
  <html>
    <main>
      <img src="${imagePathsEnum.BBD_HEADER.blobUrl}" alt="bbd-bursary image" width="596.16" height="211.2"/><br/>
      
      <p>Hi there!</p>
      
      <p>We hope this message finds you well. As a candidate for the BBD Bursary, we kindly 
      request that you upload your latest academic records using the link provided below:</p>
      
      <p>Please follow the steps below to submit your records:</p>
      <ol>
        <li>Navigate to the link provided below</li>
        <li>Upload your latest academic transcript or report</li>
      </ol>
      <p> ${process.env.BBD_WEBSITE_URL}</p>
      <p>We kindly ask that you complete this task as soon as possible for us to update your records. If you encounter any issues or have any questions, please do not hesitate to get in touch with us! We look forward to continuing to support you on your academic journey.</p> <br/><br/>
      ${bbdWebsiteInvite}<br/><br/>
      <p>Kind regards,</p>
      
      <p>HR Team</p>
    </main>
  </html>
    `;
};
const applicationStatusUpdateToHod = (hodName) => {
  return `
            <main>
             <img src="${imagePathsEnum.HOD_UPDATE_HEADER.blobUrl}" alt="ukukhula image" width="596,16" height="211,2"/><br/>
          <p> Dear ${hodName}</p>
          <p>We trust this email finds you well. 
          We’d like to notify you of recent status updates to some of your Ukukhula Bursary Fund applications. <br/>

          Please log on to the platform to check ensure that any necessary actions are taken promptly to facilitate the smooth processing of these applications.
          If you have any questions or require further information, do not hesitate to reach out.<br/>
          <p>Thank you for your continued support and cooperation.</p><br/>
          ${bbdWebsiteInvite}<br/><br/>
          <P>Best regards, <br/>
            HR Team.
          <p/>`;
};

const alertExecutiveToApproveApplication = (execName,applicationGuid) => {
  const websiteUrl = `${process.env.WEBSITE_URL}admin/studentDetails/${applicationGuid}`;
  return `<main>
  <img src="cid:${imagePathsEnum.BBD_EXECS_HEADER.name}" alt="ukukhula image" width="596,16" height="211,2"/><br/>
   <p>Dear ${execName}!</p>
   <p>Please find attached documents for a new candidate for the Ukukhula Bursary Fund.</br></br>

   We ask that you kindly review these documents for your consideration and approval. <b>With our latest update, you’ll be able to reply directly to this mail to approve this candidate</b></br></br>

   To complete the review process, please log in and approve the applications.</br> 
  <a href="${websiteUrl}" target="_blank">${websiteUrl}</a>
  <p>Your timely response will ensure that applicants proceed smoothly through the funding process. Please reach out if you require any assistance.</p> </br>
  <p>Thank you for your support and involvement.
  </br></br>
  Kind regards,<br/>
  HR Team
  </p>
  </main>`;
};
const alertExecutiveToApproveInvoice = (execName) => {
  return `<main>
  <img src="cid:${imagePathsEnum.BBD_EXECS_HEADER.name}" alt="ukukhula image" width="596,16" height="211,2"/><br/>
   <p>Hi there, ${execName}! </p>
   <p>There are items waiting for your approval. We kindly request that you log into the Ukukhula Bursary<br/> Fund system at your earliest convenience to review and approve the relevant invoices.
 </br> 
 <p> ${process.env.WEBSITE_URL}</p>
   Your timely approval is crucial to ensure that we can continue to support our beneficiaries without<br/> any delays. If you encounter any issues or have any questions, please do not hesitate to reach out to<br/> us.
 <br/>
   Thank you for your prompt attention to this matter.<br/><br/>
   Best regards,
   HR Team.</p>
  </main>`;
};

const inviteStudentEmailMessage = (studentData, bursaryType) => {
  return bursaryType === bursaryTypes.UKUKHULA ? `
  <main>
    <img src="${imagePathsEnum.STUDENT_INVITE_HEADER.blobUrl}" alt="Ukukhula Bursary Fund" width="596.16" height="211.2"/><br/>
    
    <p>Dear ${studentData.givenName},</p>
    
    <p>We’re excited to welcome you to the Ukukhula Bursary Fund system! As part of our commitment to empowering students through education, this platform provides a simple, centralised way to manage bursary applications, track progress, and stay informed.</p>
    
    <p>To get started, please sign up to the system:</p>
    
    <p>
      <a href="${process.env.WEBSITE_URL}" target="_blank" style="color: #007bff; text-decoration: none;">Click here to visit the Ukukhula Bursary Fund platform now.</a>
    </p>
    
    <p>If you have any questions, feel free to reach out to us. We look forward to supporting your educational journey!</p>
     ${bbdWebsiteInvite}<br/><br/>
    
    <p>Kind regards,<br/>
    HR Team.</p>
  </main>
  `:
   `
 <main>
       <img src="${imagePathsEnum.BBD_HEADER.signUpBlobUrl}" alt="BBD Bursary" width="596.16" height="211.2"/><br/>
        <p>Dear ${studentData.givenName},</p>
        
        <p>We’re excited to welcome you to the BBD Bursary Fund system! As part of our commitment to empowering students through education, this platform offers a centralised and streamlined way to manage your bursary, track progress, and stay up to date with important information.</p>
        
        <p>To get started, please log in to the platform using the details below:</p>
        
        <p>
            <strong>Login details:</strong><br>
            Username: ${studentData.emailAddress}<br>
            Password: ${studentData.password}
        </p>
        
        <p>You will be prompted to reset your password upon first login for security purposes.</p>
        
        <p style="margin-top: 20px; margin-bottom: 20px;">
            <a href="${process.env.BBD_WEBSITE_URL}" target="_blank" style="background-color:rgba(255, 0, 0, 0.64); color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Click here to access the system now!</a>
        </p>
        
        <p>If you have any questions or need assistance, please don’t hesitate to reach out. We’re here to support you every step of the way on your educational journey.</p>
        
        <p>Kind regards,<br>
        HR Team.</p>
    </main>
    `;
};

const inviteToDeanEmailMessage = () => {
  return `
  <main>
      <img src="${imagePathsEnum.DEAN_INVITE_HEADER.blobUrl}" alt="ukukhula image" width="596,16" height="211,2"/><br/>
      <p>Dear Sir/Madam,</p>
      <p>We would like to kindly request you register your details on the Ukukhula Bursary Fund system, where you will have access to review and manage all HODs and student applications.</br>Your participation is essential to the smooth operation of the fund and the ongoing support we provide to your students.</p>
      <p>To complete your credentials, please click on the provided link to register your profile on the Ukukhula Bursary Fund system: ${process.env.WEBSITE_URL}</p>
      <p>Should you have any questions or need assistance during the registration process, please don’t hesitate to contact us.</p>
      <p>Thank you for your support in helping us ensure the success of your students.</p>
      <br/><br/>
      ${bbdWebsiteInvite}<br/><br/>
      Best regards,<br/>
      HR Team.
      </p>
    </main>
  `;
};

const inviteAdminEmailMessage = (name) => {
  return `
<main>
  <img src="${imagePathsEnum.DEAN_INVITE_HEADER.blobUrl}" alt="Ukukhula Bursary Fund" width="596.16" height="211.2"/><br/>
  
  <p>Dear ${name},</p>
  
  <p>We’re excited to welcome you to the Ukukhula Bursary Fund system! As part of our commitment to empowering students through education, this platform provides a simple, centralised way to manage bursary applications, track progress, and stay informed.</p>
  
  <p>To get started, please sign up to the system:</p>
  
  <p>
    <a href="${process.env.WEBSITE_URL}" target="_blank" style="color: #007bff; text-decoration: none;">Click here to visit the Ukukhula Bursary Fund platform now.</a>
  </p>
  
  <p>If you have any questions, feel free to reach out to us. We look forward to supporting your educational journey!</p>
  
  <p>Kind regards,<br/>
  HR Team</p>
</main>
`;
};
const creditorInvoiceProcessingMessage = (name)=>{
return `<main>
 <img src="${imagePathsEnum.BBD_CREDITORS_HEADER.name}" alt="Ukukhula Bursary Fund" width="596.16" height="211.2"/><br/>
    <p>Dear ${name}</p>
      <p>We trust this email finds you well.<br></br>
      We would kindly request your assistance in processing outstanding student invoices on the Ukukhula Bursary Fund platform. Your prompt processing will ensure that the bursary funds are allocated in a timely manner, allowing the students to focus on their studies without financial concerns.<br></br>
      If you need any additional details or support, please don’t hesitate to let us know.<br/><br/>
      Thank you for your continued support and collaboration!<br/><br/>
      Kind regards,<br></br>
      HR Team
    </p>
  </main>`
}

const studentAcceptanceToBursaryMessage = (name) => {
  return `
    <main>
      <img src="${imagePathsEnum.UKUKHULA_CONGRATS_HEADER.blobUrl}" alt="ukukhula image" width="596,16" height="211,2"/><br/>
      <p>Dear ${name},</p>

      <p>Congratulations and a warm welcome to the Ukukhula Bursary Fund! We are delighted to inform you that you have been awarded a bursary. This bursary is a recognition of your hard work, dedication, and potential, and we are proud to support you on your academic journey. <br/> <br/>
      For more details, please log into the Ukukhula Bursary Fund platform now.
      <br/> <br/>
      <a href="${process.env.WEBSITE_URL}" target="_blank" style="color: #007bff; text-decoration: none;">Click here to visit the Ukukhula Bursary Fund platform now.</a>
      <br/> <br/>
          We are excited to be part of your educational journey and look forward to seeing you thrive! If you have any questions, feel free to reach out to us. <br/>
         Once again, congratulations to you on this incredible achievement! <br/> <br/>
           ${bbdWebsiteInvite}<br/><br/>

             <p>Best regards, <br/><br/>
            The Ukukhula team</p>
      </p>
    </main>
  `;
};

const studentBursaryRenewalMessage = (name) => {
  return `
    <main>
      <img src="${imagePathsEnum.BURSARY_RENEWAL.blobUrl}" alt="ukukhula image" width="596,16" height="211,2"/><br/>
      <p>Dear ${name},</p>

    <p>We hope you’re doing well. We’re pleased to inform you that your Ukukhula Bursary renewal is currently under review. Our team is assessing applications, and we will be in touch soon with further communication regarding the outcome.</p>

    <p><strong>What You Need to Do:</strong></p>
    <ul>
        <li>Keep an eye on your emails for important updates</li>
        <li>If we require any additional information, we’ll reach out to you directly</li>
    </ul>
    <br/><br/>
    <p>We look forward to sharing the next steps with you soon. If you have any questions in the meantime, feel free to reach out.</p>
    <br/><br/>
    <p>Best regards,<br/>
    The Ukukhula Team</p>
      </p>
    </main>
  `;
};

const nudgeHodForRenewal = (name)=>
{
  return `
  <main>
    <img src="${imagePathsEnum.BURSARY_RENEWAL.blobUrl}" alt="ukukhula image" width="596,16" height="211,2"/><br/>
    <p>Dear ${name},</p>

  <p>This is a friendly reminder that it’s time to initiate the renewal process for the current applicants in your care. Please review the relevant details for each applicant, and where applicable, proceed with the necessary renewal steps.</p>
  <br/>
  <p>If you need any assistance or have questions about the process, don’t hesitate to reach out.</p>
  <br/>
  <p>Thank you for your attention to this matter.</p>
  <br/>
  <p>Best regards,<br/>
  HR Team</p>
    </p>
  </main>
`;
}

const eventInviteMessage = (eventName, bursarName, startDate, locationName) => {
  return `
    <main>
      <img src="${imagePathsEnum.DEFAULT_HEADER.blobUrl}" alt="ukukhula image" width="596,16" height="211,2"/><br/>
      <p>Dear ${bursarName},</p>
      <p>You're invited to attend ${eventName}, taking place on ${startDate} at ${locationName}.</p>
      <p>This exciting event is an opportunity to engage with the BBD team, gain valuable insights, and take part in a day filled with learning, connection and fun.</p>
      <p>Please log into your student portal to RSVP and access more details about the event.</p>
      <p>We look forward to seeing you there!</p>
      <br/>
      <p>Regards<br/>
      HR Team</p>
    </main>
  `;
}

const eventCancellationMessage = (eventName, bursarName, startDate, locationName) => {
  return `
    <main>
      <img src="${imagePathsEnum.DEFAULT_HEADER.blobUrl}" alt="ukukhula image" width="596,16" height="211,2"/><br/>
      <p>Dear ${bursarName},</p>
      <p>We regret to inform you that the upcoming ${eventName}, originally scheduled for ${startDate} at ${locationName}, has been cancelled</p>
      <p>We understand this may come as a disappointment, and we sincerely apologize for any inconvenience this may cause. Your support and interest in our event mean a great deal to us.</p>
      <p>We appreciate your understanding and hope to see you at future events.</p>
      <br/>
      <p>Regards<br/>
      HR Team</p>
    </main>
  `;
}

const alertExecApplicationApprovalSubject = `Please review and approve Ukukhula Bursary Fund application`;
const alertExecInvoiceApproval = `Request For Invoice Approval`;
const hodInvitationEmailMessageSubject = `You have been invited to create an account for the UKukhula bursary`;
const studentAdditionalInformationSubmissionEmailSubject = `BBD bursary application additional information submission`;
const studentAcademicTranscript = `Request for your latest academic records – Ukukhula Bursary Fund`;
const applicationStatusUpdateToHodSubject = `Status update on your Ukukhula Bursary Fund applications`;
const inviteStudentSubject = `NB: Welcome to the Ukukhula Bursary Fund system! Sign up to get started`;
const inviteDeanSubject = `Make sure to register on the Ukukhula Bursary Fund System!`;
const inviteAdminSubject = `Invitation to Register as an Admin for the Ukukhula Bursary Fund System`;
const emailCreditorsSubject = `Time to process student invoices!`
const bursaryAcceptanceMessageEmailSubject = `Congratulations! You’ve been awarded an Ukukhula bursary`;
const bursaryRenewalMessageEmailSubject= `Your Ukukhula Bursary renewal is under review`;
const nudgeHodForRenewalSubject = `Action Required: Renewal Process for Current Applicants`;
const inviteBBDStudentSSubject = `Welcome to the BBD Bursary Fund System! Your login details inside`
const eventInviteSubject = eventName => `You have been invited to ${eventName} at BBD`;
const eventCancellationSubject = eventName => `Event Cancellation Notice: ${eventName}`;

module.exports = {
  studentAdditionalInformationEmailMessage,
  studentAdditionalInformationEmailMessageSubject,
  studentRejectionEmailMessage,
  studentRejectionEmailMessageSubject,
  studentAdditionalInformationSubmissionEmailMessage,
  studentAdditionalInformationSubmissionEmailSubject,
  inviteToHODEmailMessage,
  hodInvitationEmailMessageSubject,
  studentAcademicTranscript,
  studentAcademicRecordEmailMessage,
  alertExecutiveToApproveApplication,
  alertExecApplicationApprovalSubject,
  applicationStatusUpdateToHod,
  applicationStatusUpdateToHodSubject,
  alertExecutiveToApproveInvoice,
  alertExecInvoiceApproval,
  inviteStudentEmailMessage,
  inviteStudentSubject,
  inviteToDeanEmailMessage,
  inviteDeanSubject,
  inviteAdminEmailMessage,
  inviteAdminSubject,
  creditorInvoiceProcessingMessage,
  emailCreditorsSubject,
  studentAcceptanceToBursaryMessage,
  bursaryAcceptanceMessageEmailSubject,
  studentBursaryRenewalMessage,
  bursaryRenewalMessageEmailSubject,
  nudgeHodForRenewal,
  nudgeHodForRenewalSubject,
  bbdStudentAdditionalInformationEmailMessageSubject,
  inviteBBDStudentSSubject,
  eventInviteMessage,
  eventInviteSubject,
  eventCancellationMessage,
  eventCancellationSubject,
  bursaryTerminationEmailMessage
};