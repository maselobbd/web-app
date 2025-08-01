import { DocumentData } from '../../student/models/documentData-model';

export enum DocumentIdentifiers {
  CONTRACT_EXPENSE_CATEGORY_IDENTIFIER = 'contract',
  TUITION_EXPENSE_CATEGORY_IDENTIFIER = 'tuition',
  ACCOMMODATION_EXPENSE_CATEGORY_IDENTIFIER = 'accommodation',
  MEALS_EXPENSE_CATEGORY_IDENTIFIER = 'meals',
  OTHER_EXPENSE_CATEGORY_IDENTIFIER = 'other',
  PAYMENT_EXPENSE_CATEGORY_IDENTIFIER = 'payment',
  INVOICE_EXPENSE_CATEGORY_IDENTIFIER = 'invoice',
}

export const DOC_CATEGORIES = {
  CONTRACT: 'Contract' as keyof DocumentData,
  INVOICE: 'Invoice' as keyof DocumentData,
  PAYMENT: 'Payments' as keyof DocumentData,
};
export enum ExpenseCategory {
  TUITION = 'Tuition',
  ACCOMMODATION = 'Accommodation',
  MEALS = 'Meals',
  OTHER = 'Other',
}
