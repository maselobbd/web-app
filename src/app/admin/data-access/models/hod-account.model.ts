export interface HodAccount {
  displayName?: string,
  givenName?: string,
  accountEnabled?:boolean,
  role?: string,
  rank?: string,
  emailAddress: string,
  Faculty?: string,
  University?: string,
  Department?: string,
  contactNumber?: string,
  surname: string,
  id: string,
}

export interface GroupedData {
  admin: HodAccount[];
  executives: HodAccount[];
}

export interface PanelTitle {
  title: string;
  dataSource:HodAccount[]; 
}