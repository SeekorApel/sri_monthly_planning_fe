import { Component, OnInit, ViewChild  } from '@angular/core';
import { CalendarService } from 'src/app/services/master-data/calendar/calendar.service';
import { Calendar, dayCalendar, Event } from 'src/app/models/Calendar';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-view-work-day',
  templateUrl: './view-work-day.component.html',
  styleUrls: ['./view-work-day.component.scss'],
})
export class ViewWorkDayComponent implements OnInit {

  title = "Normal Work Day"
  shift1Switches = Array(3).fill(true);
  shift1Reasons = Array(3).fill(''); 
  
  perHourSwitches = Array(24).fill(true);
  perHourReasons = Array(24).fill(''); 

  ttSwitches = Array(3).fill(true);
  ttReasons = Array(3).fill('');
  ttperHourSwitches = Array(24).fill(true);
  ttperHourReasons = Array(24).fill(''); 
  
  tlSwitches = Array(3).fill(true);
  tlReasons = Array(3).fill(''); 
  tlperHourSwitches = Array(24).fill(true);
  tlperHourReasons = Array(24).fill(''); 
  overTimeSwitch = false;
  
  newEvent: Event = { title: '', description: '', date: null };
  showModal: boolean = false;
  weekend: boolean = false;

  handleOverTimeChange(){
    this.shift1Switches = Array(3).fill(!this.overTimeSwitch);
    this.perHourSwitches = Array(24).fill(!this.overTimeSwitch);
  }
  isReasonRequired(shiftState: boolean): boolean {
    return !shiftState; 
  }
  isReasonRequiredPerHourSwitch(hourIndex: number): boolean {
    const shiftIndex = Math.floor(hourIndex / 8); 
    return !this.shift1Switches[shiftIndex];
  }
  isReasonRequiredPerHour(hourIndex: number): boolean {
    const shiftIndex = Math.floor(hourIndex / 8); 
    const isShiftActive = this.shift1Switches[shiftIndex];
    const isSwitchOff = !this.perHourSwitches[hourIndex]; 
  
    // If the hour index is in range and the shift is active, return true if the switch is off
    return hourIndex < 24 && isShiftActive && isSwitchOff;
  }
  handleShiftChange(shiftIndex: number) {
    // Calculate the start and end indices for the 8-hour block based on the shift index
    const startIndex = shiftIndex * 8;
    const endIndex = startIndex + 8;
  
    // Loop over the 8-hour block and update perHourSwitches based on shift1Switches
    for (let i = startIndex; i < endIndex; i++) {
      this.perHourSwitches[i] = this.shift1Switches[shiftIndex] ? true : false;
    }
  }

  // TL overtime
  isReasonRequiredPerHourSwitchTL(hourIndex: number): boolean {
    const shiftIndex = Math.floor(hourIndex / 8); 
    return !this.tlSwitches[shiftIndex];
  }
  isReasonRequiredTL(hourIndex: number): boolean {
    const shiftIndex = Math.floor(hourIndex / 8); 
    const isShiftActive = this.tlSwitches[shiftIndex];
    const isSwitchOff = !this.tlperHourSwitches[hourIndex]; 
  
    // If the hour index is in range and the shift is active, return true if the switch is off
    return hourIndex < 24 && isShiftActive && isSwitchOff;
  }
  handleShiftChangeTL(shiftIndex: number) {
    // Calculate the start and end indices for the 8-hour block based on the shift index
    const startIndex = shiftIndex * 8;
    const endIndex = startIndex + 8;
  
    // Loop over the 8-hour block and update perHourSwitches based on shift1Switches
    for (let i = startIndex; i < endIndex; i++) {
      this.tlperHourSwitches[i] = this.tlSwitches[shiftIndex] ? true : false;
    }
  }

  // TT Overtime
  isReasonRequiredPerHourSwitchTT(hourIndex: number): boolean {
    const shiftIndex = Math.floor(hourIndex / 8); 
    return !this.ttSwitches[shiftIndex];
  }
  isReasonRequiredTT(hourIndex: number): boolean {
    const shiftIndex = Math.floor(hourIndex / 8); 
    const isShiftActive = this.ttSwitches[shiftIndex];
    const isSwitchOff = !this.ttperHourSwitches[hourIndex]; 
  
    // If the hour index is in range and the shift is active, return true if the switch is off
    return hourIndex < 24 && isShiftActive && isSwitchOff;
  }
  handleShiftChangeTT(shiftIndex: number) {
    // Calculate the start and end indices for the 8-hour block based on the shift index
    const startIndex = shiftIndex * 8;
    const endIndex = startIndex + 8;
  
    // Loop over the 8-hour block and update perHourSwitches based on shift1Switches
    for (let i = startIndex; i < endIndex; i++) {
      this.ttperHourSwitches[i] = this.ttSwitches[shiftIndex] ? true : false;
    }
  }
  
  
  monthNames: string[] = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus',
    'September', 'Oktober', 'November', 'Desember'
  ];
  calendar: Calendar;
  selectedDay: dayCalendar = new dayCalendar(null,null,null);
  events: Event[] = [];
  @ViewChild('tabset', { static: false }) tabset: TabsetComponent;

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
    this.selectedDay = new dayCalendar(null,null,null);
    const { year, month } = this.calendar;
    const newMonth = month === 1 ? 12 : month - 1;
    const newYear = month === 1 ? year - 1 : year;
    this.calendar = this.calendarService.getCalendar(newYear, newMonth);
  }

  nextMonth() {
    this.selectedDay = new dayCalendar(null,null,null);
    const { year, month } = this.calendar;
    const newMonth = month === 12 ? 1 : month + 1;
    const newYear = month === 12 ? year + 1 : year;
    this.calendar = this.calendarService.getCalendar(newYear, newMonth);
  }
  formatHourRange(hourIndex: number): string {
    const startHour = hourIndex.toString().padStart(2, '0'); // Format hour as 00
    const endHour = (hourIndex + 1).toString().padStart(2, '0'); // Format next hour as 01
    return `${startHour}:00 - ${endHour}:00`;
  }
  selectDay(day: dayCalendar) {
    this.selectedDay = new dayCalendar(null, null, null);
    if (day.days > 0) {
        this.selectedDay = day;

        // Create a date for the selected day
        const eventDate = new Date(this.calendar.year, day.month - 1, day.days);
        this.newEvent.date = eventDate;

        // Get the day name in English
        const options: Intl.DateTimeFormatOptions = { weekday: 'long' }; 
        const dayName = eventDate.toLocaleDateString('en-US', options);

        // Extract day, month, and year
        const dayValue = eventDate.getDate(); // Get the day of the month (1-31)
        const monthValue = eventDate.getMonth() + 1; // Get the month (0-11), add 1 for (1-12)
        const yearValue = eventDate.getFullYear(); // Get the full year (YYYY)

        // Set the title in the desired format
        this.newEvent.title = `${dayName}, ${dayValue} - ${this.monthNames[monthValue]} - ${yearValue}`;
        this.showModal = true;

        this.shift1Switches = Array(3).fill(true);
        this.shift1Reasons = Array(3).fill(''); 

        this.perHourSwitches = Array(24).fill(true);
        this.perHourReasons = Array(24).fill(''); 
      
        this.ttSwitches = Array(3).fill(true);
        this.ttReasons = Array(3).fill('');
        this.ttperHourSwitches = Array(24).fill(true);
        this.ttperHourReasons = Array(24).fill(''); 
        
        this.tlSwitches = Array(3).fill(true);
        this.tlReasons = Array(3).fill(''); 
        this.tlperHourSwitches = Array(24).fill(true);
        this.tlperHourReasons = Array(24).fill(''); 
        this.overTimeSwitch = false;

        this.weekend = false;
        this.overTimeSwitch = false; 
    }

    if (day.weekend) {
        this.weekend = true;
        this.overTimeSwitch = true;
        this.handleOverTimeChange();
        this.title = "OverTime TT and TL";
      } else {
        this.weekend = false;
        this.title = "Normal Work Day";
    }
  }



  clear(){

  }

  closeModal() {
    this.showModal = false;
  }

  resetNewEvent() {
    this.newEvent = { title: '', description: '', date: null };
  }
}
