import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParsingDateService {

  constructor() { }

  //Long date dd-MMMM-yyyy
  convertDateToString(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

}
