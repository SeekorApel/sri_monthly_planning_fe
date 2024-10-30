import { Component, OnInit, ViewChild  } from '@angular/core';
import { CalendarService } from 'src/app/services/master-data/calendar/calendar.service';
import { Calendar, dayCalendar, Event } from 'src/app/models/Calendar';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ApiResponse } from 'src/app/response/Response';
import { WorkDay } from 'src/app/models/WorkDay';
import {WorkDayService} from 'src/app/services/master-data/work-day/work-day.service'
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-view-work-day',
  templateUrl: './view-work-day.component.html',
  styleUrls: ['./view-work-day.component.scss'],
})
export class ViewWorkDayComponent implements OnInit {

  title = "Normal Work Day"
  shift1Switches = Array(3).fill(true);
  shift1Reasons = Array(3).fill(''); 

  // editNormalShift: FormGroup;
  
  perHourSwitches = Array(24).fill(true);
  perHourReasons = Array(24).fill(''); 
  // editNormalShiftPerHour: FormGroup;

  ttSwitches = Array(3).fill(true);
  ttReasons = Array(3).fill('');
  // ttEditNormalShift: FormGroup;

  ttperHourSwitches = Array(24).fill(true);
  ttperHourReasons = Array(24).fill(''); 
  // ttEditNormalShiftPerHour: FormGroup;

  
  tlSwitches = Array(3).fill(true);
  tlReasons = Array(3).fill(''); 
  // tlEditNormalShift: FormGroup;

  tlperHourSwitches = Array(24).fill(true);
  tlperHourReasons = Array(24).fill(''); 
  // tlEditNormalShiftPerHour: FormGroup;

  overTimeSwitch = false;
  
  newEvent: Event = { title: '', description: '', date: null };
  showModal: boolean = false;
  weekend: boolean = false;

  readytoload: boolean = false ;
  work_days: WorkDay[] = [];
  errorMessage: string | null = null;

  constructor( private fb: FormBuilder,private calendarService: CalendarService, private workDayService: WorkDayService) {}

  ngOnInit() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    this.calendar = this.calendarService.getCalendar(currentYear, currentMonth);
    this.loadWorkday();
    // this.editNormalShift = this.fb.group({
    //   shift1Switch0: new FormControl(true),
    //   shift1Switch1: new FormControl(true),
    //   shift1Switch2: new FormControl(true),
    //   shift1Reason0: new FormControl(''),
    //   shift1Reason1: new FormControl(''),
    //   shift1Reason2: new FormControl(''),
    // });
  }

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

  changePerHour(shiftIndex: number){
    const startIndex = shiftIndex * 8;
    const endIndex = startIndex + 8;
  
    // Loop over the 8-hour block and update perHourSwitches based on shift1Switches
    for (let i = startIndex; i < endIndex; i++) {
      this.perHourSwitches[i] = this.shift1Switches[shiftIndex] ? true : false;
    }
  }
  handleShiftChange(shiftIndex: number,shift: string) {
    this.changePerHour(shiftIndex);
    const targetDate = new Date(this.calendar.year, this.selectedDay.month -1, this.selectedDay.days);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' }; 
    const dayName = targetDate.toLocaleDateString('en-US', options);

    // Extract day, month, and year
    const dayValue =  String(targetDate.getDate()).padStart(2, '0'); 
    const monthValue = String(targetDate.getMonth() + 1).padStart(2, '0'); 
    const yearValue = targetDate.getFullYear(); 
    // Set the title in the desired format
    const ftargetDate = `${dayValue}-${monthValue}-${yearValue}`;
    if(this.shift1Switches[shiftIndex]){
      this.workDayService.turnOnShift(ftargetDate,shift).subscribe(
        (response: ApiResponse<WorkDay[]>) => {
          this.work_days = response.data;
          this.loadWorkday();
        },
        (error) => {
          this.errorMessage = 'Failed to load work day: ' + error.message;
        }
      );
    }else{
      this.workDayService.turnOffShift(ftargetDate,shift).subscribe(
        (response: ApiResponse<WorkDay[]>) => {
          this.work_days = response.data;
          this.loadWorkday();
        },
        (error) => {
          this.errorMessage = 'Failed to load work day: ' + error.message;
        }
      );
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
  selectedDay: dayCalendar = new dayCalendar(null,null,null,null);
  events: Event[] = [];
  @ViewChild('tabset', { static: false }) tabset: TabsetComponent;

  loadWorkday() {
    this.readytoload = false
    this.work_days = [];
    const startDate = new Date(this.calendar.year, this.calendar.days[0][0].month, this.calendar.days[0][0].days);
    const endDate = new Date(this.calendar.year, this.calendar.days[this.calendar.days.length - 1][6].month, this.calendar.days[this.calendar.days.length - 1][6].days);
    
    const fStartDate = [
      String(startDate.getDate()).padStart(2, '0'),  // dd
      String(startDate.getMonth()).padStart(2, '0'), // MM (months are zero-based)
      startDate.getFullYear()                           // yyyy
    ].join('-');
    console.log(fStartDate)
    const fEndDate = [
      String(endDate.getDate()).padStart(2, '0'),    // dd
      String(endDate.getMonth()).padStart(2, '0'), // MM (months are zero-based)
      endDate.getFullYear()                            // yyyy
    ].join('-');
    this.workDayService.getAllWorkDaysByDateRange(fStartDate, fEndDate).subscribe(
      (response: ApiResponse<WorkDay[]>) => {
        this.work_days = response.data;
        
        let index = 0;
        this.calendar.days.forEach(week => {
          week.forEach(day => {
            if (index < this.work_days.length) {
              day.detail = this.work_days[index];
              index++;
            }
          });
        });
        this.readytoload = true;
      },
      (error) => {
        this.errorMessage = 'Failed to load work day: ' + error.message;
      }
    );
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
    this.selectedDay = new dayCalendar(null,null,null,null);
    const { year, month } = this.calendar;
    const newMonth = month === 1 ? 12 : month - 1;
    const newYear = month === 1 ? year - 1 : year;
    this.calendar = this.calendarService.getCalendar(newYear, newMonth);
    this.loadWorkday();
  }

  nextMonth() {
    this.selectedDay = new dayCalendar(null,null,null,null);
    const { year, month } = this.calendar;
    const newMonth = month === 12 ? 1 : month + 1;
    const newYear = month === 12 ? year + 1 : year;
    this.calendar = this.calendarService.getCalendar(newYear, newMonth);
    this.loadWorkday();
  }
  formatHourRange(hourIndex: number): string {
    const startHour = hourIndex.toString().padStart(2, '0'); // Format hour as 00
    const endHour = (hourIndex + 1).toString().padStart(2, '0'); // Format next hour as 01
    return `${startHour}:00 - ${endHour}:00`;
  }
  selectDay(day: dayCalendar) {
    this.selectedDay = new dayCalendar(null, null, null,null);
    if (day.days > 0) {
        this.selectedDay = day;
        // Create a date for the selected day
        const eventDate = new Date(this.calendar.year, day.month-1, day.days);
        this.newEvent.date = eventDate;

        // Get the day name in English
        const options: Intl.DateTimeFormatOptions = { weekday: 'long' }; 
        const dayName = eventDate.toLocaleDateString('en-US', options);

        // Extract day, month, and year
        const dayValue = eventDate.getDate(); 
        const monthValue = eventDate.getMonth(); 
        const yearValue = eventDate.getFullYear(); 

        // Set the title in the desired format
        this.newEvent.title = `${dayName}, ${dayValue} - ${this.monthNames[monthValue]} - ${yearValue}`;
        this.showModal = true;
        this.selectedDay.detail.iwd_SHIFT_1;

        this.shift1Switches[1] = this.selectedDay.detail.iwd_SHIFT_1 ;
        this.shift1Switches[2] = this.selectedDay.detail.iwd_SHIFT_2 ;
        this.shift1Switches[0] = this.selectedDay.detail.iwd_SHIFT_3 ;
        this.shift1Reasons = Array(3).fill(''); 
        this.changePerHour(0);
        this.changePerHour(1);
        this.changePerHour(2);
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
