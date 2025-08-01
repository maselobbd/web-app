const StatusEnum = Object.freeze({
    Declined: "Rejected",
    "In Review": "In Review",
    Approved: "Approved",
    Invoice: "In Review",
    Pending: "Awaiting student response",
    "Stagnant-application":"Stagnant application",
    "Email-Failed":"Email Failed",
    Terminated: "Terminated"
});

module.exports = StatusEnum
