const getPrimaryDocuments = require("./studentDocumentsHelper.function")

function isEmpty(items) {
    if (!items) {
        return true;
    }
    if (Array.isArray(items) || typeof items === 'string') {
        return items.length === 0;
    }
    if (items instanceof Set || items instanceof Map) {
        return items.size === 0;
    }
    if (typeof items === 'object') {
        return Object.keys(items).length === 0;
    }
    return false;
}


function checkAdminDocumentsValues(student) {
    const documents = getPrimaryDocuments(student);
    return documents.every(document => document.blobName !== null);
}

module.exports = {isEmpty, checkAdminDocumentsValues}