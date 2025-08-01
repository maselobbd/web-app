import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TitleCasePipe } from '@angular/common';

import { DocumentData } from '../../../student/models/documentData-model';
import { ButtonAction } from '../../../shared/enums/buttonAction';
import {
  DOC_CATEGORIES,
  DocumentIdentifiers,
  ExpenseCategory,
} from '../../enums/document-identifiers';
import {
  DocumentStructure,
  StudentForDocManagement,
} from '../../data-access/models/documents-helper.models';
import { SnackBarMessage } from '../../../shared/enums/snackBarMessage';

@Component({
  selector: 'app-student-documentation-management',
  templateUrl: './student-documentation-management.component.html',
  styleUrls: [
    './student-documentation-management.component.scss',
    '../../../shared/utils/styling/sharedStudentDetails.scss',
  ],
  providers: [TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDocumentationManagementComponent {
  @Input() studentDocuments: DocumentData | undefined = undefined;
  @Input() student: StudentForDocManagement | null = null;
  @Input() userRole: string | null = null;
  @Input() administrativeRoles: string[] = [];
  @Input() splitButtonMainActionLabel: string = ButtonAction.VIEW;

  @Output() openViewDialog = new EventEmitter<{documentCategoryKey: keyof DocumentData, expenseCategory: string, selectedDocumentIndex: number}>();
  @Output() displayError = new EventEmitter<string>();

  DOC_CATEGORIES = DOC_CATEGORIES;
  ExpenseCategory = ExpenseCategory;
  CONTRACT_EXPENSE_CATEGORY_IDENTIFIER =
    DocumentIdentifiers.CONTRACT_EXPENSE_CATEGORY_IDENTIFIER;
  TUITION_EXPENSE_CATEGORY_IDENTIFIER =
    DocumentIdentifiers.TUITION_EXPENSE_CATEGORY_IDENTIFIER;
  ACCOMMODATION_EXPENSE_CATEGORY_IDENTIFIER =
    DocumentIdentifiers.ACCOMMODATION_EXPENSE_CATEGORY_IDENTIFIER;
  MEALS_EXPENSE_CATEGORY_IDENTIFIER =
    DocumentIdentifiers.MEALS_EXPENSE_CATEGORY_IDENTIFIER;
  OTHER_EXPENSE_CATEGORY_IDENTIFIER =
    DocumentIdentifiers.OTHER_EXPENSE_CATEGORY_IDENTIFIER;
  PAYMENT_EXPENSE_CATEGORY_IDENTIFIER =
    DocumentIdentifiers.PAYMENT_EXPENSE_CATEGORY_IDENTIFIER;
  INVOICE_EXPENSE_CATEGORY_IDENTIFIER =
    DocumentIdentifiers.INVOICE_EXPENSE_CATEGORY_IDENTIFIER;

  relevantExpenseTypes = [
    { id: ExpenseCategory.ACCOMMODATION, label: 'Accommodation' },
    { id: ExpenseCategory.MEALS, label: 'Meals' },
    { id: ExpenseCategory.TUITION, label: 'Tuition' },
    { id: ExpenseCategory.OTHER, label: 'Other' },
  ];

  deletableDocTypes = new Map<string, number>();

  constructor(
    private titleCasePipe: TitleCasePipe,
  ) {}

  generateButtonMenuItems(
    docCategoryKey: keyof DocumentData,
    expenseCatValue: string,
  ): string[] {
    const docs = this.getDocumentsInternal(docCategoryKey, expenseCatValue);
    const labels: string[] = [];

    docs.forEach((doc, index) => {
      if (index === 0) {
        labels.push(
          doc.fileName || this.titleCasePipe.transform(expenseCatValue),
        );
      } else {
        labels.push(
          doc.fileName ||
            `${this.titleCasePipe.transform(expenseCatValue)} - Addendum ${index}`,
        );
      }
    });

    this.deletableDocTypes.set(expenseCatValue, labels.length);
    return labels;
  }

   triggerViewDocument(
    docCategoryKey: keyof DocumentData,
    expenseCatValue: string,
    docIndexInFilteredList: number,
  ) {
    if (!this.student) {
      this.displayError.emit(SnackBarMessage.NO_STUDENT_DATA);
      return;
    }
    this.openViewDialog.emit({
      documentCategoryKey: docCategoryKey,
      expenseCategory: expenseCatValue,
      selectedDocumentIndex: docIndexInFilteredList,
    });
  }

  onViewSingleDocButtonClick(
    docCategoryKey: keyof DocumentData,
    expenseCatValue: string,
  ) {
    this.triggerViewDocument(docCategoryKey, expenseCatValue, 0);
  }

  onViewDocFromSplitButton(
    docCategoryKey: keyof DocumentData,
    expenseCatValue: string,
    selectedMenuItemIndex: number,
  ) {
    this.triggerViewDocument(
      docCategoryKey,
      expenseCatValue,
      selectedMenuItemIndex,
    );
  }

  hasMultipleDocuments(
    docCategoryKey: keyof DocumentData,
    expenseCatValue: string,
  ): boolean {
    return (
      this.getDocumentsInternal(docCategoryKey, expenseCatValue).length > 1
    );
  }

  getSingleDocument(
    docCategoryKey: keyof DocumentData,
    expenseCatValue: string,
  ): DocumentStructure | undefined {
    const docs = this.getDocumentsInternal(docCategoryKey, expenseCatValue);
    return docs.length === 1 ? docs[0] : undefined;
  }

  hasDocuments(
    docCategoryKey: keyof DocumentData,
    expenseCatValue?: string,
  ): boolean {
    if (!this.studentDocuments || !this.studentDocuments[docCategoryKey])
      return false;

    if (docCategoryKey === DOC_CATEGORIES.CONTRACT && expenseCatValue) {
      return (
        this.getDocumentsInternal(docCategoryKey, expenseCatValue).length > 0
      );
    } else if (
      (docCategoryKey === DOC_CATEGORIES.INVOICE ||
        docCategoryKey === DOC_CATEGORIES.PAYMENT) &&
      expenseCatValue
    ) {
      return (
        this.getDocumentsInternal(docCategoryKey, expenseCatValue).length > 0
      );
    } else if (
      !expenseCatValue &&
      (docCategoryKey === DOC_CATEGORIES.INVOICE ||
        docCategoryKey === DOC_CATEGORIES.PAYMENT)
    ) {
      return (
        (this.studentDocuments[docCategoryKey] as DocumentStructure[])?.length >
        0
      );
    }
    return false;
  }
  private getDocumentsInternal(
    docCategoryKey: keyof DocumentData,
    expenseCatValue?: string,
  ): DocumentStructure[] {
    if (!this.studentDocuments || !this.studentDocuments[docCategoryKey]) {
      return [];
    }
    const docsForCategory = this.studentDocuments[
      docCategoryKey
    ] as DocumentStructure[];
    if (expenseCatValue) {
      const lowerExpenseCatValueToFilterBy = expenseCatValue.toLowerCase();
      return docsForCategory.filter((doc) => {
        return (
          doc.expenseCategory &&
          doc.expenseCategory.toLowerCase() === lowerExpenseCatValueToFilterBy
        );
      });
    }
    return docsForCategory;
  }
}
