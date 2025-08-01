export interface InvoiceApplications {
  universityId: number;
  universityName: string;
  details: {
    name: string;
    surname: string;
    amount: number;
    status: string;
    applicationGuid: string;
  }[];
}
