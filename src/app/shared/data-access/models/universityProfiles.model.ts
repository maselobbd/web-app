export interface DepartmentType {
    departmentName: string;
    status: string;
    faculty: string;
  }
  
export interface UniversityData {
    UniversityName: string;
    Departments: DepartmentType[];
  }