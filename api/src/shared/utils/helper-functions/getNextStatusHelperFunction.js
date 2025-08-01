const { documentStatusEnum } = require("../enums/documentStatusEnum");
const { ranks } = require("../enums/ranksEnum");

const statusOrder = [
    documentStatusEnum.IN_REVIEW,
    documentStatusEnum.AWAITING_EXEC_APPROVAL,
    documentStatusEnum.AWAITING_FINANCE_APPROVAL,
    documentStatusEnum.APPROVED
];

const getStatusIndex=(status)=> {
    return statusOrder.indexOf(status);
}

const getNextStatus=(approverDetails, studentDetails)=> {
    let status = studentDetails.status;

    switch (approverDetails.rank) {
        case ranks.LEVEL_ONE_ADMIN:
            if (getStatusIndex(status) < getStatusIndex(documentStatusEnum.AWAITING_EXEC_APPROVAL)) {
                status = documentStatusEnum.AWAITING_EXEC_APPROVAL;
            }
            break;
        
        case ranks.LEVEL_TWO_ADMIN:
            if (getStatusIndex(status) < getStatusIndex(documentStatusEnum.AWAITING_FINANCE_APPROVAL)) {
                status = documentStatusEnum.AWAITING_FINANCE_APPROVAL;
            }
            break;
        
        case ranks.LEVEL_THREE_ADMIN:
            if (getStatusIndex(status) < getStatusIndex(documentStatusEnum.APPROVED)) {
                status = documentStatusEnum.APPROVED;
            }
            break;
        
        case ranks.SUPER_USER:
            switch (status) {
                case documentStatusEnum.IN_REVIEW:
                    if (getStatusIndex(status) < getStatusIndex(documentStatusEnum.AWAITING_EXEC_APPROVAL)) {
                        status = documentStatusEnum.AWAITING_EXEC_APPROVAL;
                    }
                    break;

                case documentStatusEnum.AWAITING_EXEC_APPROVAL:
                    if (getStatusIndex(status) < getStatusIndex(documentStatusEnum.AWAITING_FINANCE_APPROVAL)) {
                        status = documentStatusEnum.AWAITING_FINANCE_APPROVAL;
                    }
                    break;

                case documentStatusEnum.AWAITING_FINANCE_APPROVAL:
                    if (getStatusIndex(status) < getStatusIndex(documentStatusEnum.APPROVED)) {
                        status = documentStatusEnum.APPROVED;
                    }
                    break;

                default:
                    break;
            }
            break;

        default:
            return null; 
    }

    return status;
}

module.exports = {getNextStatus}