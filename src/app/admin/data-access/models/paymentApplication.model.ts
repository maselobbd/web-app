export interface PaymentApplications {
    universityId: number;
    universityName: string;
    applicantCount: number;
    details: {
      name: string;
      surname: string;
      amount: number;
      status: string;
      applicationId:number;
      applicationGuid: string;
    }[
      
    ];
  }
  