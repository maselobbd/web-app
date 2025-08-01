export enum tabDescription{
    PENDING_ADMIN =`The following applications are currently pending student. Any
    modifications or approvals will be addressed accordingly once the
    review process is complete.`,
    PENDING = 'The following applications are currently pending review.',
    IN_REVIEW_ADMIN =  `The following applications are currently under review and pending
    further updates. Any modifications or approvals will be addressed
    accordingly once the review process is complete.`,
    IN_REVIEW = 'The following applications are currently under review.',
    PAYMENT_ADMIN = `The following applications are awaiting payments. Any
              modifications will be addressed accordingly once the payments have
              been processed.`,
    PAYMENT = 'The following applications are awaiting payments.',
    DECLINED = 'The following applications have been declined.',
    DRAFT = 'The following applications are currently in draft.',
    EMAIL_FAILED = `The following applications have been received from the university,
              but the email delivery failed due to an invalid email address for
              the student. Kindly rectify the email address to ensure it's
              validity then resend the email.`,
    CONTRACT = `The following applications are awaiting contract approvals and
              fund distribution breakdowns.`,
    INVOICE_ADMIN = `The following applications are awaiting invoice attachments. Any
              modifications will be addressed accordingly once the attachments
              has been processed.`,
    INVOICE= 'The following applications are awaiting invoice attachments.'
}