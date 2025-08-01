import { UniversityStudentDetails } from "../../../university-dashboard/data-access/models/student-details-model";

export function hasFundDistribution(student: UniversityStudentDetails): boolean {
    const { tuition, meals, accommodation, other } = student;

    return tuition > 0 || meals > 0 || accommodation > 0 || other > 0;
}
