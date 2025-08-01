import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from '../../../shared/data-access/models/response.models';
import { observe } from '../../../shared/utils/functions/observe.function';
import { BursaryApplications } from '../models/bursaryApplications-model';
import { studentDetails } from '../models/studentDetails-model';
import { PendingApplications } from '../models/pendingApplication-model';
import { InReviewApplications } from '../models/InReviewApplications-model';
import { DeclinedApplications } from '../models/declinedApplication-model';
import { FilterDetails } from '../models/filterDetails-model';
import { Years } from '../models/years-model';
import { UploadFile } from '../../../shared/data-access/models/fileupload.model';
import { ApplicationNumber } from '../../../university-dashboard/data-access/models/application-number.model';
import { ContractApplications } from '../models/contractApplications-model';
import { PaymentApplications } from '../models/paymentApplication.model';
import { InvoiceApplications } from '../models/invoiceApplications-model';
import { Application } from '../../../application/data-access/models/application.model';
import { FundSpreadApplications } from '../models/fundSpreadApplications';

@Injectable({
  providedIn: 'root',
})
export class BursaryApplicationsService {
  getPaymentApplicationDetails(
    filters?: FilterDetails,
  ): Observable<IResponse<PaymentApplications[]>> {
    let params = new HttpParams();
    if (filters?.fullName) {
      params = params.set('fullName', filters.fullName);
    }
    if (filters?.university) {
      params = params.set('university', filters.university);
    }
    if (filters?.year) {
      params = params.set('year', filters.year);
    }
    return observe(
      this.http.get<PaymentApplications[]>(`api/paymentApplications`, {
        params,
      }),
    );
  }

  getNumberOfHODApplicationsByDate(date: string) {
    return observe(
      this.http.get<number>(`api/numberOfHODApplicationsByDate/?date=${date}`),
    );
  }
  getNumberOfFilteredApplicationsByDate(selectedDate: string | undefined) {
    return observe(
      this.http.get<ApplicationNumber[]>(
        `api/hodNumberApplicationsByDateStatus/?date=${selectedDate}`,
      ),
    );
  }
  constructor(private http: HttpClient) {}
  getNumberOfHODApplications() {
    return observe(this.http.get<number>(`api/numberOfHODApplications`));
  }

  getYears(): Observable<IResponse<Years[]>> {
    return observe(this.http.get<Years[]>(`api/years`));
  }
  getEmailedBursaryApplicationDetails(): Observable<
    IResponse<BursaryApplications[]>
  > {
    return observe(
      this.http.get<BursaryApplications[]>(`api/bursariesApplications`),
    );
  }

  getPendingApplications(): Observable<IResponse<PendingApplications[]>> {
    return observe(
      this.http.get<PendingApplications[]>(`api/pendingApplications`),
    );
  }

  getNumberOfEmailFailedApplications(): Observable<IResponse<number>> {
    return observe(
      this.http.get<number>(`api/numberOfEmailFailedApplications`),
    );
  }
  getNumberOfPendingApplications(): Observable<IResponse<number>> {
    return observe(this.http.get<number>(`api/numberOfPendingApplications`));
  }
  getInReviewApplications(): Observable<IResponse<InReviewApplications[]>> {
    return observe(
      this.http.get<InReviewApplications[]>(`api/inReviewApplications`),
    );
  }

  getNumberOfInReviewApplications(): Observable<IResponse<number>> {
    return observe(this.http.get<number>(`api/numberOfInReviewApplications`));
  }

  getDeclinedApplications(): Observable<IResponse<DeclinedApplications[]>> {
    return observe(
      this.http.get<DeclinedApplications[]>(`api/declinedApplications`),
    );
  }

  getNumberOfDeclinedApplications(): Observable<IResponse<number>> {
    return observe(this.http.get<number>(`api/numberOfDeclinedApplications`));
  }

  getAllHODapplications(): Observable<IResponse<studentDetails[]>> {
    return observe(
      this.http.get<studentDetails[]>(`api/allHODBursaryApplications`),
    );
  }
  getHODApplicationsInReview(): Observable<IResponse<studentDetails[]>> {
    return observe(
      this.http.get<studentDetails[]>(`api/hodInReviewApplications`),
    );
  }
  getNumberOfFilteredApplications(): Observable<
    IResponse<ApplicationNumber[]>
  > {
    return observe(
      this.http.get<ApplicationNumber[]>(`api/hodNumberApplicationsByStatus`),
    );
  }
  getHODApplicationByDate(date: string) {
    return observe(
      this.http.get<studentDetails[]>(`api/hodApplicationByDate/?date=${date}`),
    );
  }

  getHODApplicationsApproved() {
    return observe(
      this.http.get<studentDetails[]>(`api/hodApprovedApplications`),
    );
  }

  gethodActiveApplicationsByDate(date: string) {
    return observe(
      this.http.get<studentDetails[]>(
        `api/hodActiveApplicationsByDate/?date=${date}`,
      ),
    );
  }

  getBursaryApplicationDetails(
    filters?: FilterDetails,
  ): Observable<IResponse<BursaryApplications[]>> {
    let params = new HttpParams();
    if (filters?.fullName) {
      params = params.set('fullName', filters.fullName);
    }
    if (filters?.university) {
      params = params.set('university', filters.university);
    }
    if (filters?.year) {
      params = params.set('year', filters.year);
    }
    return observe(
      this.http.get<BursaryApplications[]>(
        `api/filterEmailFailedApplications`,
        {
          params,
        },
      ),
    );
  }
  getBursaryPendingApplicationDetails(
    filters?: FilterDetails,
  ): Observable<IResponse<PendingApplications[]>> {
    let params = new HttpParams();
    if (filters?.fullName) {
      params = params.set('fullName', filters.fullName);
    }
    if (filters?.university) {
      params = params.set('university', filters.university);
    }
    if (filters?.year) {
      params = params.set('year', filters.year);
    }
    return observe(
      this.http.get<BursaryApplications[]>(`api/filterPendingApplications`, {
        params,
      }),
    );
  }

  getBursaryInvoiceApplicationDetails(
    filters?: FilterDetails,
  ): Observable<IResponse<InvoiceApplications[]>> {
    let params = new HttpParams();
    if (filters?.fullName) {
      params = params.set('fullName', filters.fullName);
    }
    if (filters?.university) {
      params = params.set('university', filters.university);
    }
    if (filters?.year) {
      params = params.set('year', filters.year);
    }
    return observe(
      this.http.get<BursaryApplications[]>(`api/invoiceApplications`, {
        params,
      }),
    );
  }

  getBursaryInReviewApplicationDetails(
    filters?: FilterDetails,
  ): Observable<IResponse<InReviewApplications[]>> {
    let params = new HttpParams();
    if (filters?.fullName) {
      params = params.set('fullName', filters.fullName);
    }
    if (filters?.university) {
      params = params.set('university', filters.university);
    }
    if (filters?.year) {
      params = params.set('year', filters.year);
    }
    return observe(
      this.http.get<BursaryApplications[]>(`api/filterInReviewApplications`, {
        params,
      }),
    );
  }
  getBursaryDeclinedApplicationDetails(
    filters?: FilterDetails,
  ): Observable<IResponse<DeclinedApplications[]>> {
    let params = new HttpParams();
    if (filters?.fullName) {
      params = params.set('fullName', filters.fullName);
    }
    if (filters?.university) {
      params = params.set('university', filters.university);
    }
    if (filters?.year) {
      params = params.set('year', filters.year);
    }
    return observe(
      this.http.get<BursaryApplications[]>(`api/filterRejectedApplications`, {
        params,
      }),
    );
  }

  getBursaryApplicationContractDetails(
    filters?: FilterDetails,
  ): Observable<IResponse<ContractApplications[]>> {
    let params = new HttpParams();
    if (filters?.fullName) {
      params = params.set('fullName', filters.fullName);
    }
    if (filters?.university) {
      params = params.set('university', filters.university);
    }
    if (filters?.year) {
      params = params.set('year', filters.year);
    }
    return observe(
      this.http.get<ContractApplications[]>(`api/contractApplications`, {
        params,
      }),
    );
  }

  getBursaryApplicationForFundSpread(
    filters?: FilterDetails,
  ): Observable<IResponse<FundSpreadApplications[]>> {
    let params = new HttpParams();
    if (filters?.fullName) {
      params = params.set('fullName', filters.fullName);
    }
    if (filters?.university) {
      params = params.set('university', filters.university);
    }
    if (filters?.year) {
      params = params.set('year', filters.year);
    }
    return observe(
      this.http.get<FundSpreadApplications[]>(`api/fundSpreadApplication`, {
        params,
      }),
    );
  }
}
