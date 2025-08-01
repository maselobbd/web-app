import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency',
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    if (value !== undefined && value !== null) {
      const formattedValue = value.toLocaleString('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return formattedValue;
    } else {
      return '';
    }
  }
}
