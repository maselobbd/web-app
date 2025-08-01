import { Injectable } from "@angular/core";
import { StudentService } from "../../student/services/student.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, mergeMap, of } from "rxjs";
import { studentPortalData, studentPortalDataFailure, studentPortalDataSuccess } from "./student-portal.actions";

@Injectable()
export class StudentPortalEffects {
constructor(
    private actions$: Actions,
    private studentService: StudentService
  ) {}

loadStudentPortalData$ = createEffect(() =>
  this.actions$.pipe(
    ofType(studentPortalData),
    exhaustMap((action) =>
      this.studentService.getStudentApplicationGuid(action.studentData).pipe(
        map((data) => studentPortalDataSuccess({ payload: data.results! })),
        catchError((error) => of(studentPortalDataFailure({ error })))
      )
    )
  )
);
}