const ResponseStatus = require('../enums/responseStatusEnum');
const { responseMessages, commonErrorMessages }  = require('../enums/responseMessageEnum');

const getResponseErrors = (message) => {
    let response = {};
    switch (message) {
        case commonErrorMessages.invalidJson:
            response = {
                status: ResponseStatus.BAD_REQUEST,
                jsonBody: responseMessages.INVALID_BODY
            }
            break;
        default:
            response = {
                status: ResponseStatus.ERROR,
                jsonBody: responseMessages.DEFAULT
            }
    }

    return response;
}

module.exports = {
    getResponseErrors,
}