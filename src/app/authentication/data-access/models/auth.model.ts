export interface UserAttributes {
  department: string;
  faculty: string;
  isLoggedIn: boolean;
  name: string;
  surname:string;
  email: string;
  userId: string;
  rank: string;
  secondInCharge: string;
  yearsOfExperience: number;
  university: string;
  token: string;
  role: string;
}

export enum Roles {
  all,
  student,
  HOD,
  dean,
  admin,
  finance,
}

export enum Ranks{
  assistant_admin,
  admin_officer,
  senior_admin,
  chief_admin,
}
