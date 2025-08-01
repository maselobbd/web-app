function groupByStatus(applications) {
  const statuses = {
    contract: { invoice: 'Invalid', appStatus: ['Approved', 'Contract'] },
    inReview: { invoice: 'Invalid', appStatus: 'In Review' },
    active: { invoice: 'Approved', appStatus: ['Approved', 'Active'] },
    pending: { invoice: 'Invalid', appStatus: 'Awaiting student response' },
    emailFailed: { invoice: 'Invalid', appStatus: 'Email Failed' },
    invoice: { invoice: 'Pending', appStatus: ['Approved', 'Invoice'] },
    provisionalInvoice: { invoice: 'Invalid', appStatus: 'Invoice' },
    payment: { invoice: 'In Review', appStatus: ['Approved', 'Payment'] },
    declined: { invoice: 'Invalid', appStatus: 'Rejected' },
    invoiceAwaitingExecutiveApproval: { invoice: 'Awaiting executive approval', appStatus: 'Approved' },
    applicationAwaitingExecutiveApproval: { invoice: 'Invalid', appStatus: 'Awaiting executive approval' },
    applicationAwaitingFinanceApproval: { invoice: 'Invalid', appStatus: 'Awaiting finance approval' },
    applicationAwaitingFundDistribution: { invoice: 'Invalid', appStatus: 'Awaiting fund distribution' },
    invoiceAwaitingFinanceApproval: { invoice: 'Awaiting finance approval', appStatus: 'Approved' },
    pendingRenewal: { invoice: 'Invalid', appStatus: 'Pending renewal' },
    invoiceAwaitingFundDistribute: { invoice: 'Awaiting fund distribution', appStatus: 'Approved' },
    saved: { invoice: "Invalid", appStatus: 'Draft' },
    onboarded: { invoice: "Invalid", appStatus: 'Onboarded' }
  };

  const statusLookup = new Map();
  for (const groupName in statuses) {
    const rule = statuses[groupName];
    const invoiceStatus = rule.invoice;
    const appStatuses = Array.isArray(rule.appStatus) ? rule.appStatus : [rule.appStatus];

    for (const appStatus of appStatuses) {
      const lookupKey = `${invoiceStatus}:${appStatus}`;
      statusLookup.set(lookupKey, groupName);
    }
  }

  if (!Array.isArray(applications)) {
    return {};
  }

  return applications.reduce((groups, application) => {
    const { status, invoiceStatus } = application;

    const lookupKey = `${invoiceStatus}:${status}`;
    const mappedStatus = statusLookup.get(lookupKey);

    if (mappedStatus) {
      if (!groups[mappedStatus]) {
        groups[mappedStatus] = [];
      }
      groups[mappedStatus].push(application);
    }
    
    return groups;
  }, {}); 
}
function arrayTextToJson(textArray) {
  try {
    return JSON.parse(textArray);
  } catch (error) {
    return [];
  }
}

async function processApplications(item) {
  const unsortedApplication = Array.isArray(item.details)
    ? item.details
    : arrayTextToJson(item.details);

  return groupByStatus(unsortedApplication);
}


module.exports = {
  groupByStatus,
  arrayTextToJson,
  processApplications
};
