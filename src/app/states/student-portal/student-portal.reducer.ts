import { createReducer, on } from "@ngrx/store";
import { studentPortalDataSuccess } from "./student-portal.actions";
import { UniversityStudentDetails } from "../../university-dashboard/data-access/models/student-details-model";

export interface StudentPortalState {
    studentPortalDataSuccess: UniversityStudentDetails | null;
    error: string | null;
}

export const initialState: StudentPortalState = {
    studentPortalDataSuccess: null,
    error: null,
};

export const studentPortalReducer = createReducer(
    initialState,
    on(studentPortalDataSuccess, (state, { payload }) => ({
        ...state,
        studentPortalDataSuccess: payload,
        error: null
    })))