export interface ContractApplications {
  universityId: number;
  universityName: string;
  details: {
    universityId: number;
    name: string;
    surname: string;
    amount: number;
    status: string;
    applicationGuid: string;
  }[];
}
