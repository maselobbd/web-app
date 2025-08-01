import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StudentPortalState } from './student-portal.reducer';

export const selectStudentPortalState = createFeatureSelector<StudentPortalState>('studentPortal');

export const selectStudentPortalData = createSelector(
  selectStudentPortalState,
  (state) => state.studentPortalDataSuccess
);

export const selectStudentPortalError = createSelector(
  selectStudentPortalState,
  (state) => state.error
);