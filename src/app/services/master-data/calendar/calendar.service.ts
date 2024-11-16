import { Injectable } from '@angular/core';
import { Calendar, dayCalendar } from 'src/app/models/Calendar';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  getCalendar(year: number, month: number): Calendar {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Shift starting day of the week to make Monday = 0, Sunday = 6
    let startingDayOfWeek = firstDayOfMonth.getDay();
    startingDayOfWeek = (startingDayOfWeek === 0) ? 6 : startingDayOfWeek - 1;

    const days: dayCalendar[][] = [];
    let currentWeek: dayCalendar[] = [];

    // Add days from the previous month if the first day isn't a Monday
    if (startingDayOfWeek > 0) {
      const lastDayOfPreviousMonth = new Date(year, month - 1, 0);
      const daysToAdd = startingDayOfWeek; // Number of days to add from the previous month
      const startDate = lastDayOfPreviousMonth.getDate() - daysToAdd + 1;
      for (let j = startDate; j <= lastDayOfPreviousMonth.getDate(); j++) {
        if(currentWeek.length === 5){
          currentWeek.push(new dayCalendar(j, month - 1, true,null));
        }else{
          currentWeek.push(new dayCalendar(j, month - 1, false,null));
        }
      }
    }

    // Add the days of the current month
    let fullweekofmonth = false;
    for (let i = 1; i <= daysInMonth; i++) {
      fullweekofmonth = false;
      if (currentWeek.length >= 5) {
        currentWeek.push(new dayCalendar(i, month, true,null));
      }else{
        currentWeek.push(new dayCalendar(i, month, false,null));
      }
      
      if (currentWeek.length === 7) {
        fullweekofmonth = true;
        days.push(currentWeek);
        currentWeek = [];
      }
    }
    if(fullweekofmonth){
      return new Calendar(year, month, days);
    }

    // Fill in days from the next month if needed to complete the last week
    let afterMonthEnd = 1;
    while (currentWeek.length < 7) {
      if(currentWeek.length >= 5){
        currentWeek.push(new dayCalendar(afterMonthEnd, month + 1 , true,null));
      }else{
        currentWeek.push(new dayCalendar(afterMonthEnd, month + 1 , false,null));
      }
      afterMonthEnd++;
    }
    if (currentWeek.length) {
      days.push(currentWeek);

    }

    return new Calendar(year, month, days);
  }
}
