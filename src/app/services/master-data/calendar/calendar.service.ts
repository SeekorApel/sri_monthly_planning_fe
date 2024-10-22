import { Injectable } from '@angular/core';
import { Calendar, dayCalendar } from 'src/app/models/Calendar';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  getCalendar(year: number, month: number): Calendar {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.

    const days: dayCalendar[][] = [];
    let currentWeek: dayCalendar[] = [];

    // Add days from the previous month if the first day isn't a Sunday
    if (startingDayOfWeek > 0) {
      const lastDayOfPreviousMonth = new Date(year, month - 1, 0);
      const daysToAdd = startingDayOfWeek; // Number of days to add from the previous month
      const startDate = lastDayOfPreviousMonth.getDate() - daysToAdd + 1;
      for (let j = startDate; j <= lastDayOfPreviousMonth.getDate(); j++) {
        currentWeek.push(j,(month - 1));
      }
    }

    // Add the days of the current month
    let fullweekofmonth = false;
    for (let i = 1; i <= daysInMonth; i++) {
      fullweekofmonth = false;
      currentWeek.push(i);
      if (currentWeek.length === 7 ) {
        fullweekofmonth = true;
        days.push(currentWeek);
        currentWeek = [];
        
      }
    }
    if(fullweekofmonth){
      return new Calendar(year, month, days);
    }
    
    let aftermothend = 1;
    while (currentWeek.length < 7) {
      currentWeek.push(aftermothend);
      aftermothend++;
    }
    if (currentWeek.length) {
      days.push(currentWeek);
      currentWeek = [];
    }

    return new Calendar(year, month, days);
  }
}
