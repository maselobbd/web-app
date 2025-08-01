const { documentStatusEnum } = require("../enums/documentStatusEnum");

function addApproverNames(details, userMap) {
  const approvedStatuses = new Set([
    documentStatusEnum.AWAITING_EXEC_APPROVAL,
    documentStatusEnum.APPROVED,
    documentStatusEnum.AWAITING_FINANCE_APPROVAL,
    documentStatusEnum.CUSTOM_AWAITING_APP_EXEC_APPROVAL,
    documentStatusEnum.CUSTOM_AWAITING_APP_FIN_APPROVAL,
    documentStatusEnum.CUSTOM_AWAITING_INV_EXEC_APPROVAL,
    documentStatusEnum.CUSTOM_AWAITING_INV_FIN_APPROVAL
  ]);

  for (const status in details) {
    if (approvedStatuses.has(status)) {
      const applicants = details[status];

      if (applicants && Array.isArray(applicants)) {
        applicants.forEach(item => {
          item.approverName = userMap.get(item.approverUserId) || "Unknown";
        });
      }
    }
  }

  return details;
}
function addApproverApplicationName(applications,userMap)
{
  for (let i = 0; i < applications.length; i++) {
    Object.assign(applications[i],{"Approver": userMap.get(applications[i].userId)||applications[i].userId})
  }
    return applications
}
module.exports = { addApproverNames,addApproverApplicationName };
