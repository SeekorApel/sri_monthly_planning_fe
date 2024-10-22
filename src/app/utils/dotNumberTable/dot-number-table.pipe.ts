import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dotNumberTable',
})
export class DotNumberTablePipe implements PipeTransform {
  transform(value: number | string, digitsInfo?: string): string {
    if (value === null || value === undefined) {
      return '';
    }

    // Menggunakan Intl.NumberFormat untuk format angka
    const formattedValue = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: digitsInfo ? parseInt(digitsInfo.split('.')[1]?.charAt(0) || '0') : 0,
      maximumFractionDigits: digitsInfo ? parseInt(digitsInfo.split('.')[1]?.charAt(1) || '0') : 0,
    }).format(Number(value));

    return formattedValue.replace(/,/g, '.'); // Ubah koma menjadi titik
  }
}
