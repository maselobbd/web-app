import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ValidateId(control: AbstractControl) {
  const value = control.value;
  if (value == null) {
    return null;
  }

  if (value.length !== 13) {
    return null;
  }

  if (!isValidLuhn(value)) {
    return { invalid: true };
  } else {
    return null;
  }
}

export function phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  const numberCount = (value.match(/[0-9]/g) || []).length;
  const onlyNumbersAndSpacesCheck = /^[0-9\s]*$/.test(value);
  
  if (!onlyNumbersAndSpacesCheck || numberCount !== 10) {
    return { phoneNumber: true };
  }
  
  return null;
}

function isValidLuhn(idNumber: string): boolean {
  // Reverse the ID number to simplify indexing
  const reversedIdNumber: string = idNumber.split('').reverse().join('');
  let totalSum: number = 0;

  for (let i = 0; i < reversedIdNumber.length; i++) {
    let digit: number = parseInt(reversedIdNumber[i], 10);

    if (i % 2 === 1) {
      let doubledDigit: number = digit * 2;
      totalSum += doubledDigit < 10 ? doubledDigit : doubledDigit - 9;
    } else {
      totalSum += digit;
    }
  }

  return totalSum % 10 === 0;
}
