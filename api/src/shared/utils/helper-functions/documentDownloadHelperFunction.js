const { downloadFile } = require("./download-file");

const profilePhotoDownload = async (student) => {
  if (!student?.profilephoto) {
    return null;
  }
  const profilePhoto = await downloadFile(student.profilephoto);
  return { DownloadedProfilePhoto: { ...profilePhoto }, }  
}

const fileDownloadStudentDocuments = async (student) => {
  const profilePhoto = student.profilephoto ? await downloadFile(student.profilephoto) : null;
  const matricCertificate = student.matricCertificate ? await downloadFile(student.matricCertificate) : null;
  const academicTranscript = student.academicTranscript ? await downloadFile(student.academicTranscript) : null;
  const financialStatement = student.financialStatement ? await downloadFile(student.financialStatement) : null;
  const identityDocument = student.identityDocument ? await downloadFile(student.identityDocument) : null;

  return {
    DownloadedProfilePhoto: profilePhoto ? { ...profilePhoto } : null,
    DownloadedMatricCertificate: matricCertificate ? { ...matricCertificate } : null,
    DownloadedAcademicTranscript: academicTranscript ? { ...academicTranscript } : null,
    DownloadedFinancialStatement: financialStatement ? { ...financialStatement } : null,
    DownloadedIdentityDocument: identityDocument ? { ...identityDocument } : null,
  }
}

const fileDownloadAdminDocuments = async (documents) => {
    const contracts = documents.Contract;
    const invoices = documents.Invoice;
    const payments = documents.Payments;

    const DownloadedContracts = await Promise.all(contracts.map(contract =>
      contract.documentBlobName ? downloadFile(contract.documentBlobName) : null
    ));
    const DownloadedInvoices = await Promise.all(invoices.map(invoice =>
      invoice.documentBlobName ? downloadFile(invoice.documentBlobName) : null
    ));
    const DownloadedPayments = await Promise.all(payments.map(payment =>
      payment.documentBlobName ? downloadFile(payment.documentBlobName) : null
    ));

  return { 
    DownloadedContracts,
    DownloadedInvoices,
    DownloadedPayments,
  }
}

module.exports = { profilePhotoDownload, fileDownloadStudentDocuments, fileDownloadAdminDocuments };