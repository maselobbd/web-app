const { sendEmailToExecutive } = require("./emailToExecutives");
const { sendEmailsToHods } = require("./email-to-hod");
const { documentStatusEnum } = require("../enums/documentStatusEnum");
const { emailTypeEnum } = require("../enums/emailTypeEnum");

const areAllPaymentsApproved = (documents) => {
    return documents.every(item => item.documentType.toLowerCase() === documentStatusEnum.PAYMENT.toLowerCase() && item.documentStatus.toLowerCase() ===documentStatusEnum.APPROVED.toLowerCase());
  };
  
  const isSingleContract = (documents) => {
    return documents.length === 1 && documents[0].documentType.toLowerCase() === documentStatusEnum.CONTRACT.toLowerCase();
  };
  
  const handleContract = async (contractDocument, userId,cache,context) => {
    sendEmailsToHods(contractDocument.applicationGuid, cache,context);
  };
  
  const isInvoiceAwaitingApproval = (document) => {
    return document.documentType.toLowerCase() === documentStatusEnum.INVOICE.toLowerCase()
    &&( document.documentStatus.toLowerCase() === documentStatusEnum.AWAITING_EXEC_APPROVAL.toLowerCase() 
    || document.documentStatus.toLowerCase() === documentStatusEnum.AWAITING_FINANCE_APPROVAL.toLowerCase()) ;
  };
  
  const handleInvoiceApproval = async (invoiceDocument, context,applicationGuid) => {
    const emailToApproveApplication = invoiceDocument[0].documentStatus === documentStatusEnum.AWAITING_EXEC_APPROVAL
        ? process.env.NEW_APPLICATIONS_APPROVER.split(",")
        : process.env.FINANCE_APROVER.split(",");

    if (emailToApproveApplication) {
      const documents = invoiceDocument.map(doc => doc.file);
        await sendEmailToExecutive(context, emailToApproveApplication, emailTypeEnum.STUDENT_APPLICATION_INVOICE_REQUIRES_APPROVAL,documents,applicationGuid);
    }
  };

  module.exports ={areAllPaymentsApproved,isSingleContract,handleContract,isInvoiceAwaitingApproval,handleContract,handleInvoiceApproval}
  