import { createAction, props } from "@ngrx/store";
import { UniversityStudentDetails } from "../../university-dashboard/data-access/models/student-details-model";
import { StudentUser } from "../../shared/data-access/models/studentUser.model";

export const studentPortalData = createAction(
    "[Student Portal] Get Student Portal Data",
    props<{ studentData: StudentUser }>()
);
export const studentPortalDataSuccess = createAction(
    "[Student Portal] Get Student Portal Data Success",
    props<{ payload: UniversityStudentDetails }>()
);
export const studentPortalDataFailure = createAction(
    "[Student Portal] Get Student Portal Data Failure",
    props<{ error: string }>()
);