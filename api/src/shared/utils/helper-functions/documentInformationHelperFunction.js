const { student_documents_data } = require("../../../data-facade/studentData");

const getAdminDocumentsForStudent = async (applicationGuid, year, userRole) => {

    if (!["admin", "student"].includes(userRole)) {
      return;
    }
    
    const documents = await student_documents_data(applicationGuid, year, userRole);

    return {
        Contract: (documents || []).filter((docInfo) =>
          docInfo?.documentType?.toLowerCase().includes("contract")
        ),
        Invoice: (documents || []).filter((docInfo) =>
          docInfo?.documentType?.toLowerCase().includes("invoice")
        ),
        Payments: (documents || []).filter((docInfo) =>
          docInfo?.documentType?.toLowerCase().includes("payment")
        ),
    };
}

module.exports = { getAdminDocumentsForStudent };