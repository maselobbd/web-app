export interface BursaryApplications {
  universityId: number;
  universityName: string;
  applicantCount: number;
  details: {
    universityId: number;
    name: string;
    surname: string;
    amount: number;
    status: string;
    applicationGuid: string;
  }[];
}
