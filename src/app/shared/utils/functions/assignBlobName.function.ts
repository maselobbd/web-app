import { studentDocument } from "../../../student/models/document-model";
import { DocumentBlobNames } from "../../../student/models/documentBlobNames.model";
import { DocumentData } from "../../../student/models/documentData-model";


function getDocumentBlobName(documents: studentDocument[], expenseCategory: string): string | undefined {
    return documents.find(d => d.expenseCategory === expenseCategory)?.documentBlobName;
}

export function assignDocumentBlobNames(studentDocuments: DocumentData): DocumentBlobNames {
    const invoiceForTuition = getDocumentBlobName(studentDocuments.invoice, 'tuition');
    const invoiceForMeals = getDocumentBlobName(studentDocuments.invoice, 'meals');
    const invoiceForAccommodation = getDocumentBlobName(studentDocuments.invoice, 'accommodation');
    const invoiceForOther = getDocumentBlobName(studentDocuments.invoice, 'other');

    const contract= getDocumentBlobName(studentDocuments.contract, 'contract');
    
    const paymentForAccommodation = getDocumentBlobName(studentDocuments.payments, 'accommodation');
    const paymentForMeals = getDocumentBlobName(studentDocuments.payments, 'meals');
    const paymentForOther = getDocumentBlobName(studentDocuments.payments, 'other');
    const paymentForTuition = getDocumentBlobName(studentDocuments.payments, 'tuition');
    
    return {
        invoiceForTuition,
        invoiceForMeals,
        invoiceForAccommodation,
        invoiceForOther,
        paymentForAccommodation,
        paymentForMeals,
        paymentForOther,
        paymentForTuition,
        contract
    };
}