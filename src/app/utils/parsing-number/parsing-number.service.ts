import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParsingNumberService {

  constructor() { }

  separatorAndDecimalInput(value: string): string {
    let formattedValue = value.replace(/[^\d,]/g, '');
    if (formattedValue.includes(',')) {
      const parts = formattedValue.split(',');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      formattedValue = parts.join(',');
    } else {
      formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    return formattedValue;
  }

  separatorAndDecimalView(value: number): string {
    if (value !== null && value !== undefined) {
      let strValue = value.toString();

      const parts = strValue.split('.');
      const integerPart = parts[0];
      const decimalPart = parts[1] ? ',' + parts[1].padEnd(2, '0') : ',00';

      if (integerPart.length === 1 && !parts[1]) {
        return `${integerPart},00`;
      }

      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

      if (decimalPart === ',00' || decimalPart !== ',00') {
        return formattedInteger + decimalPart;
      }
    }
    return '';
  }

  separatorTableView(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }


}
