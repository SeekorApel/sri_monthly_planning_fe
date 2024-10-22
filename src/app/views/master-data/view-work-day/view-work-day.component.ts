import { Component, OnInit } from '@angular/core';
import { CalendarService } from 'src/app/services/master-data/calendar/calendar.service';
import { Calendar, Event } from 'src/app/models/Calendar';

@Component({
  selector: 'app-view-work-day',
  templateUrl: './view-work-day.component.html',
  styleUrls: ['./view-work-day.component.scss'],
})
export class ViewWorkDayComponent implements OnInit {
  monthNames: string[] = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus',
    'September', 'Oktober', 'November', 'Desember'
  ];
  calendar: Calendar;
  selectedDay: number | null = null;
  events: Event[] = [];

  constructor(private calendarService: CalendarService) {}

  ngOnInit() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    this.calendar = this.calendarService.getCalendar(currentYear, currentMonth);
  }

  getEventsForDay(day: number): Event[] {
    return this.events.filter(event => 
      day > 0 && // Only check for valid days
      event.date.getFullYear() === this.calendar.year &&
      event.date.getMonth() + 1 === this.calendar.month && // Months are 0-indexed
      event.date.getDate() === day
    );
  }

  isWeekend(): boolean {

    return false;
  }  

  previousMonth() {
    this.selectedDay = null;
    const { year, month } = this.calendar;
    const newMonth = month === 1 ? 12 : month - 1;
    const newYear = month === 1 ? year - 1 : year;
    this.calendar = this.calendarService.getCalendar(newYear, newMonth);
  }

  nextMonth() {
    this.selectedDay = null;
    const { year, month } = this.calendar;
    const newMonth = month === 12 ? 1 : month + 1;
    const newYear = month === 12 ? year + 1 : year;
    this.calendar = this.calendarService.getCalendar(newYear, newMonth);
  }

  newEvent: Event = { title: '', description: '', date: null };
  showModal: boolean = false;

  selectDay(day: number) {
    if (day > 0) { // Only allow selection for valid days
      this.selectedDay = day;
      this.newEvent.date = new Date(this.calendar.year, this.calendar.month - 1, day);
      this.showModal = true;
    }
  }

  createEvent() {
    if (this.newEvent.title && this.newEvent.description) {
      this.events.push(this.newEvent);
      this.closeModal();
      this.resetNewEvent();
    } else {
      alert('Title and description are required.');
    }
  }

  closeModal() {
    this.showModal = false;
  }

  resetNewEvent() {
    this.newEvent = { title: '', description: '', date: null };
  }
}
