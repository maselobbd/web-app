import { AbstractControl, ValidatorFn } from '@angular/forms';

// Custom validator to check if the value is boolean
export function booleanValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (value !== null && value !== undefined && typeof value !== 'boolean') {
      return { invalidBoolean: { value: control.value } };
    }
    return null;
  };
}
