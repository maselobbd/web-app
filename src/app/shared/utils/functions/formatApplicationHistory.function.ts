import { ApplicationHistory } from "../../../university-dashboard/data-access/models/application-history.model";
import { InvoiceHistory } from "../../../university-dashboard/data-access/models/invoice-history.model ";
import { CustomApplicationStatusEnum } from "../../enums/customApplicationStatus";
import { DocumentStatus } from "../../enums/documentStatus";
import { ApplicationHistoryStatusMessages } from "../../../university-dashboard/enums/student-details";

export function formatApplicationStatusHistory(application: ApplicationHistory[]=[], student: string):ApplicationHistory[]{
    const defaultApprover: string = 'BBD'
    for(let app of application)
    {
        let status = app.status
        switch(status)
        {
            case CustomApplicationStatusEnum.PENDING:
                app.status = ApplicationHistoryStatusMessages.applicationSubmitted;
                break;
            case CustomApplicationStatusEnum.AWAITING_STUDENT_RESPONSE:
                if(app.Approver === defaultApprover && app.userId === defaultApprover) {
                    app.status = ApplicationHistoryStatusMessages.pendingInfo;
                } else if (app.userId === app.userId && !(app.Approver === defaultApprover && app.userId === defaultApprover)) {
                    app.status = ApplicationHistoryStatusMessages.studentInfoSubmitted;
                    app.Approver = student;
                }
                break;
            case CustomApplicationStatusEnum.IN_REVIEW:
                app.status = ApplicationHistoryStatusMessages.inReview;
                break;
            case CustomApplicationStatusEnum.AWAITING_EXECUTIVE:
                app.status = ApplicationHistoryStatusMessages.acceptedByHR;
                break;
            case CustomApplicationStatusEnum.AWAITING_FINANCE:
                app.status = ApplicationHistoryStatusMessages.acceptedByExec;
                break;
            case DocumentStatus.APPROVED:
                app.Approver === defaultApprover ?
                app.status = ApplicationHistoryStatusMessages.contract :
                app.status = ApplicationHistoryStatusMessages.acceptedApproved;
                break;
            case DocumentStatus.INVOICE:
                app.status = ApplicationHistoryStatusMessages.invoice
                break;
            case DocumentStatus.CONTRACT:
                app.status = ApplicationHistoryStatusMessages.contract
                break;
          case DocumentStatus.AWAITING_FUND_DISTRIBUTION:
                app.status = ApplicationHistoryStatusMessages.awaitingFundDistribution
                break;
            case (DocumentStatus.UPDATE).toLocaleLowerCase():
            case (DocumentStatus.AMEND).toLocaleLowerCase():
            case (DocumentStatus.DELETE).toLocaleLowerCase():
                app.status = status === 'amend' ? `${app.type} ${status}ed` : `${app.type} ${status}d`;
                break;
        }
    }

    application = application.filter(app =>
      app.status !== DocumentStatus.PAYMENT && app.status !== DocumentStatus.APPLICATION_ACTIVE
    )
    return application
}
export function formatInvoiceStatusHistory(application: InvoiceHistory[]=[]): InvoiceHistory[] {
    let statusCount = new Map<string, number>();

    for (let app of application) {
        let status = app.status;
        statusCount.set(status, (statusCount.get(status) || 0) + 1);
    }
    let updatedApplication: InvoiceHistory[] = [];

    for (let app of application) {
        let status = app.status;
        let count = statusCount.get(status);

        switch (status) {
            case CustomApplicationStatusEnum.PENDING:
                app.status = ApplicationHistoryStatusMessages.contractUploaded;

                updatedApplication.push(app);

                const invoiceEntry = { ...app, status: ApplicationHistoryStatusMessages.invoice };
                updatedApplication.push(invoiceEntry);
                break;

            case CustomApplicationStatusEnum.IN_REVIEW:
                app.status = ApplicationHistoryStatusMessages.payment;
                updatedApplication.push(app);
                break;

            case CustomApplicationStatusEnum.AWAITING_EXECUTIVE:
                app.status = `${count} ${ApplicationHistoryStatusMessages.invoicesUploaded}`;
                updatedApplication.push(app);
                break;

            case  CustomApplicationStatusEnum.AWAITING_FINANCE:
                app.status = `${count} : ${ApplicationHistoryStatusMessages.acceptedApproved}`;
                updatedApplication.push(app);
                break;

            case DocumentStatus.APPROVED:
                app.status = `${count} ${ApplicationHistoryStatusMessages.paymentsSubmitted}`;
                updatedApplication.push(app);
                break;

            default:
                updatedApplication.push(app);
        }
    }

    let seenStatuses = new Set<string>();
    updatedApplication = updatedApplication.filter(app => {
        if (seenStatuses.has(app.status)) {
            return false;
        }
        seenStatuses.add(app.status);
        return true;
    });

    for (let app of updatedApplication) {
        if (app.status.includes(ApplicationHistoryStatusMessages.paymentsSubmitted)) {
            const activeEntry = { ...app, status: ApplicationHistoryStatusMessages.active };
            updatedApplication.push(activeEntry);
            break;
        }
    }

    return updatedApplication;
}
