export interface StudentDetails {
  universityName: string;
  fullName: string;
  email: string;
  year: number;
  semesterOneTranscriptExists: string;
  semesterTwoTranscriptExists: string;
  applicationGuid: string;
  applicationId: number;
}

export interface StudentsToNudgeDetails {
  year: number;
  semesterOneTranscriptExists: StudentDetails[];
  semesterTwoTranscriptExists: StudentDetails[];
}
