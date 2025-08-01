import {
  Component,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  Inject,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { IResponse } from '../../data-access/models/response.models';
import { Application } from '../../../application/data-access/models/application.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserStore } from '../../data-access/stores/user.store';
import { DataService } from '../../data-access/services/data.service';

@Component({
  selector: 'app-fund-spread-details',
  templateUrl: './fund-spread-details.component.html',
  styleUrls: ['./fund-spread-details.component.scss'],
})
export class FundSpreadDetailsComponent implements OnInit {
  expensesForm!: FormGroup;
  @Input() application: any;
  @Input() role: string | undefined;
  @Input() currentTab: string = '';
  @ViewChild(MatCheckboxChange) checkbox!: MatCheckboxChange;
  @Output() closeDialog: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;
  @Input() applicationId!: number;
  userRole: string | undefined;
  invoiceTab: string = '';
  checkedInvoices: string[] = [];
  checkboxValue: boolean = false;
  universityName: string = '';
  otherInput: string = '';
  fundDistributed: boolean | null = null;
  totalAmount: number = 0;
  isExpensePosted: boolean = false;
  isFundSpreadCorrect!: boolean;
  allFieldsFilled: boolean = true;
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private sharedDataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userStore: UserStore,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<FundSpreadDetailsComponent>,
    private fb: FormBuilder,
  ) {
    this.applicationId = data.applicationId;
    this.userStore.get().subscribe((user) => {
      this.userRole = user.role;
    });
  }

  ngOnInit(): void {
    this.expensesForm = new FormGroup({
      accommodation: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ]),
      tuition: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ]),
      meals: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ]),
      other: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/),
      ]),
      reason: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z ]*$'),
      ]),
    });

    this.expensesForm.valueChanges.subscribe(() => {
      this.getTotalAmount();
    });
  }

  postExpense() {
    const expense = this.expensesForm?.value;
    const accommodation = +expense.accommodation;
    const tuition = +expense.tuition;
    const meals = +expense.meals;
    let other = +expense.other;
    const reason = expense.reason;
    const applicationId = this.data.application.applicationId;
    if (other === null) {
      other = 0;
    }

    const expenseData = {
      accommodation,
      tuition,
      meals,
      other,
      reason,
      applicationId
    };
    this.dialogRef.close(expenseData)
  }

  isAnyFieldFilled(): boolean {
    const formValues = this.expensesForm.value;
    return Object.values(formValues).some((value) => {
      const numValue = Number(value);
      return numValue && numValue > 0;
    });
  }

  openConfirmationDialog() {
    this.fundDistributed = true;
    this.getTotalAmount();
  }

  Confirm() {
    this.postExpense();
  }
  getTotalAmount() {
    const expense = this.expensesForm?.value;
    const accommodation = +expense.accommodation;
    const tuition = +expense.tuition;
    const meals = +expense.meals;
    const other = +expense.other;
    const bursaryAmount = this.data.application.amount;
    const sum = (accommodation || 0) + (tuition || 0) + (meals || 0) + other;
    this.isFundSpreadCorrect = sum == bursaryAmount;
    const amounts = [accommodation, tuition, meals, other];
    const isExceeding = amounts.some(
      (amount, index) =>
        amounts.slice(0, index + 1).reduce((acc, curr) => acc + curr, 0) >
        bursaryAmount,
    );

    this.allFieldsFilled = this.isFundSpreadCorrect || !isExceeding;

    this.totalAmount = sum;
  }
  reasonValidator(control: FormControl) {
    const otherAmount = this.expensesForm?.get('other')?.value;
    const reason = control.value;
    if (otherAmount > 0 && !reason) {
      return { reasonRequired: true };
    }
    return null;
  }
}
