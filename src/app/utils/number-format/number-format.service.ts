import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumberFormatService {

  constructor() { }

  formatSeparator(value: any): string {
    //Jika null maka return ''
    if (value == null || value === '') {
      return '';
    }
    // Menghapus karakter selain angka
    let numberString = value.toString().replace(/[^0-9]/g, '');
    // Menambahkan pemisah ribuan
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  formatDecimal(value: any): string {
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
}