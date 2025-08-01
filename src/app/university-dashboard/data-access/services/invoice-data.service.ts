import { Injectable } from '@angular/core';
import { UploadFile } from '../../../shared/data-access/models/fileupload.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { observe } from '../../../shared/utils/functions/observe.function';
import { ExpensesModel } from '../models/expenses-model';
import { IResponse } from '../../../shared/data-access/models/response.models';

@Injectable({
  providedIn: 'root',
})
export class InvoiceDataService {
  checkedInvoices: UploadFile[] = [];

  constructor(private http: HttpClient) {}

  updateCheckedInvoices(fileUpload: UploadFile, checked: boolean) {
    if (checked && !this.isCheckedInvoice(fileUpload)) {
      this.checkedInvoices.push(fileUpload);
    } else if (!checked) {
      const index = this.checkedInvoices.findIndex(
        (item) => item.applicationId === fileUpload.applicationId,
      );
      if (index !== -1) {
        this.checkedInvoices.splice(index, 1);
      }
    }
  }
  isCheckedInvoice(fileUpload: UploadFile): boolean {
    return this.checkedInvoices.includes(fileUpload);
  }
  isInvoiceBulk(): boolean {
    return this.checkedInvoices.length > 1;
  }
  getInvoiceIds(): UploadFile[] {
    return this.checkedInvoices;
  }
  clearChecked(){
    this.checkedInvoices=[]
  }
  getExpenses(applicationGuid: string):Observable<IResponse<ExpensesModel>> {
    return observe(this.http.get<ExpensesModel>(
      `/api/expenses?applicationGuid=${applicationGuid}`,
    ));
  }
  deleteInvoice(applicationId: number,expenseCategory:string): Observable<IResponse<any>> {
    const body={applicationId,expenseCategory}
    return observe(this.http.post<IResponse<any>>(`/api/update-invoice-status`,body));
  }
}
