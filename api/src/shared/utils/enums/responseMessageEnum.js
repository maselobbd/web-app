const responseMessages = Object.freeze({
    ERROR_INVALID_USER : 'Invalid user',
    ERROR_UPDATE_FAILED: 'Database update failed',
    ERROR_STUDENT_NOT_FOUND: 'Student not found',
    ERROR_NOT_APPROVER: 'Not a valid approver',
    ERROR_NO_RESPONSE: 'No response message in email',
    INVALID_BODY: 'Invalid or missing body',
    DEFAULT: 'An error occured, please try again'
})

const commonErrorMessages = Object.freeze({
    invalidJson: "Unexpected end of JSON input",
})

module.exports = { responseMessages, commonErrorMessages }