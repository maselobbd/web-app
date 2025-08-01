export interface InReviewApplications {
  universityId: number;
  universityName: string;
  applicantCount: number;
  details: {
    name: string;
    surname: string;
    amount: number;
    status: string;
    applicationGuid: string;
  }[];
}
