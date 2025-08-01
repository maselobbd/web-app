import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function notInPastValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const enteredDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return enteredDate < today ? { notInPast: true } : null;
}

export function timeNotInPastValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startDateControl = group.get('startDate');
    const startTimeControl = group.get('startTime');
    if (!startDateControl || !startTimeControl) return null;

    const startDate = startDateControl.value;
    const startTime = startTimeControl.value;

    if (!startDate || !startTime) {
      startTimeControl.setErrors(null);
      return null;
    }

    const enteredDate = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isToday = enteredDate.toDateString() === today.toDateString();

    if (isToday) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const enteredTime = new Date();
      enteredTime.setHours(hours, minutes, 0, 0);
      const now = new Date();

      if (enteredTime < now) {
        startTimeControl.setErrors({ timeInPast: true });
        return { timeInPast: true };
      } else if (startTimeControl.hasError('timeInPast')) {
        startTimeControl.setErrors(null);
      }
    } else if (startTimeControl.hasError('timeInPast')) {
      startTimeControl.setErrors(null);
    }
    return null;
  };
}

export function endAfterStartValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startControl = group.get('startDate');
    const endControl = group.get('endDate');
    if (!startControl || !endControl) return null;
    const start = new Date(startControl.value);
    const end = new Date(endControl.value);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      endControl?.setErrors(null);
      return null;
    }
    if (end < start) {
      endControl?.setErrors({ endAfterStart: true });
      return { endAfterStart: true };
    } else if (endControl.hasError('endAfterStart')) {
      endControl.setErrors(null);
    }
    return null;
  };
}

export function endTimeAfterStartTimeValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;
    const startTime = group.get('startTime')?.value;
    const endTime = group.get('endTime')?.value;
    const endTimeControl = group.get('endTime');

    if (!startDate || !endDate || !startTime || !endTime) {
      endTimeControl?.setErrors(null);
      return null;
    }
    const sameDay = new Date(startDate).toDateString() === new Date(endDate).toDateString();
    if (!sameDay) {
      endTimeControl?.setErrors(null);
      return null;
    }

    const parseTime = (t: string): number => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);

    if (endMinutes <= startMinutes) {
      endTimeControl?.setErrors({ endTimeAfterStartTime: true });
      return { endTimeAfterStartTime: true };
    } else if (endTimeControl?.hasError('endTimeAfterStartTime')) {
      endTimeControl.setErrors(null);
    }
    return null;
  };
}
