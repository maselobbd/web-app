export interface Application {
  id: number;
  name: string;
  surname: string;
  email: string;
  university: string;
  yearOfFunding: number;
  amount: number;
  complete: boolean;
  applicationId: number;
  department: string;
  faculty: string;
  race: string;
  degreeName: string;
  gender: string;
  gradeAverage: number;
  title: string;
  motivation?: string;
  status?:string;
  yearOfStudy?:string;
  isRenewal?:boolean;
  confirmHonors?:string;
}
