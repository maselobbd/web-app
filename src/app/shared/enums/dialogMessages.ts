export enum DialogMessage{
    NEW_APPLICATION_MESSAGE = "You will continue with the application that you have previously started. If you start a new application, you will lose all progress in the current application.",
    TITLE= "Do you want to continue the application in progress?",
    APPROVE_INVOICES_TITLE = "Are you sure you want to approve these invoices?",
    APPROVE_INVOICES_MESSAGE = "These invoices will now be sent to finance for the payment process to begin. Please ensure all of the relevant information on these invoices is correct.",
    UPLOAD_DOCUMENTS_MESSAGE='Please upload all the necessary documents for this student',
    REQUEST_CHANGES_TITLE = "Are you sure you want to send back these invoices?",
    REQUEST_CHANGES_MESSAGE = "Please describe the reasons for sending back these invoices so that changes can be made by admin.",
    RESEND_EMAIL_MESSAGE = "Have you made all of the necessary updates so that the email successfully sends?",
    SUCCESSFUL_EMAIL_MESSAGE ="The email has successfully been sent to the student, and we are now awaiting their response.",
    FAILURE_EMAIL_MESSAGE ="The email has failed to send. This could be because the student's email is invalid. Please update the student's information and try again.",
    ACCEPT_APPLICATION_MESSAGE= "This is the final phase of review for the application. If it is accepted, the contract process will begin between BBD and the student.",
    CONTRACT_MESSAGE ="Before we move this student to the next step, please confirm that the contract has been acknowledged and signed by the student.",
    CONTRACT_FAILED_MESSAGE ="Please select the reason for the contract failing.",
    DECLINED_APPLICATION_MESSAGE= "Please select a valid reason for declining this student.",
    AMEND_BURSARY_AMOUNT_MESSAGE= "Please input an amount you would like the bursary to be amended to.",
    REVERT_APPLICATION_MESSAGE = "Please select a step in the process that you would like to revert this application back to and provide a reason why:",
    CONFIRM_REVERT_APPLICATION_MESSAGE = `You will lose any progress that was made after the selected step`,
    RENEW_APPLICATION_MESSAGE = `Please confirm the student you would like to renew funding for, the
          year you would like to fund the student for, and the amount of funding
          you would like them to receive.`,
    TERMINATE_BURSARY_MESSAGE = "Please select a valid reason for terminating this bursary."
}
