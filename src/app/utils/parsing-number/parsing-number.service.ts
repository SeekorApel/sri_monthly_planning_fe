import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ParsingNumberService {
  constructor() {}

  separatorAndDecimalInput(value: string): string {
    let formattedValue = value.replace(/[^\d,]/g, '');
    const commaIndex = formattedValue.indexOf(',');
    if (commaIndex !== -1) {
      formattedValue = formattedValue.slice(0, commaIndex + 1) + formattedValue.slice(commaIndex + 1).replace(/,/g, '');
    }
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
      // Jika nilai adalah 0, kembalikan '0' saja
      if (value === 0) {
        return '0';
      }

      let strValue = value.toString();

      const parts = strValue.split('.');
      const integerPart = parts[0];
      const decimalPart = parts[1] ? ',' + parts[1].padEnd(2, '0') : ',00';

      // Jika angkanya tunggal (1 digit) dan tidak memiliki bagian desimal, tambahkan ,00
      if (integerPart.length === 1 && !parts[1]) {
        return `${integerPart},00`;
      }

      // Format bagian integer dengan pemisah ribuan
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

      // Gabungkan bagian integer dan bagian desimal
      return formattedInteger + decimalPart;
    }
    return '';
  }

  separatorTableView(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
