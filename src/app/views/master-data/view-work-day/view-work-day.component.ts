import { Component, OnInit, ViewChild  } from '@angular/core';
import { CalendarService } from 'src/app/services/master-data/calendar/calendar.service';
import { Calendar, dayCalendar, Event } from 'src/app/models/Calendar';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ApiResponse } from 'src/app/response/Response';
import { WorkDay } from 'src/app/models/WorkDay';
import {WorkDayService} from 'src/app/services/master-data/work-day/work-day.service'
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { WDHours } from 'src/app/models/WDHours';

@Component({
  selector: 'app-view-work-day',
  templateUrl: './view-work-day.component.html',
  styleUrls: ['./view-work-day.component.scss'],
})
export class ViewWorkDayComponent implements OnInit {
  shifts = ["Shift 3", "Shift 1", "Shift 2"];
  title = "Normal Work Day"
  shift1Switches = Array(3).fill(true);
  shift1Reasons = Array(3).fill(new DWorkDay); 
  
  perHourSwitches = Array(24).fill(true);
  perHourReasons = Array(24).fill(''); 
  // editNormalShiftPerHour: FormGroup;

  ttSwitches = Array(3).fill(true);
  ttReasons = Array(3).fill('');

  ttperHourSwitches = Array(24).fill(true);
  ttperHourReasons = Array(24).fill(''); 
  // ttEditNormalShiftPerHour: FormGroup;

  
  tlSwitches = Array(3).fill(true);
  tlReasons = Array(3).fill(new DWorkDay); 

  tlperHourSwitches = Array(24).fill(true);
  tlperHourReasons = Array(24).fill(''); 
  // tlEditNormalShiftPerHour: FormGroup;

  overTimeSwitch = false;
  
  newEvent: Event = { title: '', description: '', date: null };
  showModal: boolean = false;
  weekend: boolean = false;

  readytoload: boolean = false ;
  work_days: WorkDay[] = [];
  work_days_hours: WDHours;
  work_days_hoursTT: WDHours;
  work_days_hoursTL: WDHours;
  errorMessage: string | null = null;

  constructor( private fb: FormBuilder,private calendarService: CalendarService, private workDayService: WorkDayService) {}

  ngOnInit() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    this.calendar = this.calendarService.getCalendar(currentYear, currentMonth);
    this.loadWorkday();
  }

  handleOverTimeChange(){
    this.overtimeOn();
    if(this.overTimeSwitch){
      this.shift1Switches = Array(3).fill(!this.overTimeSwitch);
    }else{
      this.shift1Switches[1] = this.selectedDay.detail.iwd_SHIFT_1 ;
      this.shift1Switches[2] = this.selectedDay.detail.iwd_SHIFT_2 ;
      this.shift1Switches[0] = this.selectedDay.detail.iwd_SHIFT_3 ;
    }
  }
  isReasonRequired(shiftState: boolean): boolean {
    return !shiftState; 
  }
  isReasonRequiredPerHourSwitch(hourIndex: number): boolean {
    const shiftIndex = Math.floor(hourIndex / 8); 
    return !this.shift1Switches[shiftIndex];
  }
  getdateselected(){
    const targetDate = new Date(this.calendar.year, this.selectedDay.month -1, this.selectedDay.days);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' }; 
    const dayName = targetDate.toLocaleDateString('en-US', options);

    // Extract day, month, and year
    const dayValue =  String(targetDate.getDate()).padStart(2, '0'); 
    const monthValue = String(targetDate.getMonth() + 1).padStart(2, '0'); 
    const yearValue = targetDate.getFullYear(); 
    return ( `${dayValue}-${monthValue}-${yearValue}`);
  }

  getdateselectedFlip(){
    const targetDate = new Date(this.calendar.year, this.selectedDay.month -1, this.selectedDay.days);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' }; 
    const dayName = targetDate.toLocaleDateString('en-US', options);

    // Extract day, month, and year
    const dayValue =  String(targetDate.getDate()).padStart(2, '0'); 
    const monthValue = String(targetDate.getMonth() + 1).padStart(2, '0'); 
    const yearValue = targetDate.getFullYear(); 
    return ( `${yearValue}-${monthValue}-${dayValue}`);
  }
  handleShiftChange(shiftIndex: number,shift: string) {
    const ftargetDate = this.getdateselected();
    if(this.shift1Switches[shiftIndex]){
      this.workDayService.turnOnShift(ftargetDate,shift).subscribe(
        (response: ApiResponse<WorkDay[]>) => {
          this.work_days = response.data;
          this.loadWorkday();
          this.loadHours();
        },
        (error) => {
          this.errorMessage = 'Failed to load work day: ' + error.message;
        }
      );
    }else{
      this.workDayService.turnOffShift(ftargetDate,shift).subscribe(
        (response: ApiResponse<WorkDay[]>) => {
          this.work_days = response.data;
          this.loadHours();
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
    const ftargetDate = this.getdateselected();
    const ot = ["OT_TL_3", "OT_TL_1", "OT_TL_2"];
    if(this.tlSwitches[shiftIndex]){
      this.workDayService.turnOnShift(ftargetDate,ot[shiftIndex]).subscribe(
        (response: ApiResponse<WorkDay[]>) => {
          this.work_days = response.data;
          this.loadWorkday();
          this.loadHours();
        },
        (error) => {
          this.errorMessage = 'Failed to load work day: ' + error.message;
        }
      );
    }else{
      this.workDayService.turnOffShift(ftargetDate,ot[shiftIndex]).subscribe(
        (response: ApiResponse<WorkDay[]>) => {
          this.work_days = response.data;
          this.loadHours();
          this.loadWorkday();
        },
        (error) => {
          this.errorMessage = 'Failed to load work day: ' + error.message;
        }
      );
    }
    this.changeShiftOverTime();
    this.loadReason();
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
    const ftargetDate = this.getdateselected();
    const ot = ["OT_TT_3", "OT_TT_1", "OT_TT_2"];
    console.log(ot[shiftIndex]);
    if(this.ttSwitches[shiftIndex]){
      this.workDayService.turnOnShift(ftargetDate,ot[shiftIndex]).subscribe(
        (response: ApiResponse<WorkDay[]>) => {
          this.work_days = response.data;
          this.loadWorkday();
          this.loadHours();
        },
        (error) => {
          this.errorMessage = 'Failed to load work day: ' + error.message;
        }
      );
    }else{
      this.workDayService.turnOffShift(ftargetDate,ot[shiftIndex]).subscribe(
        (response: ApiResponse<WorkDay[]>) => {
          this.work_days = response.data;
          this.loadHours();
          this.loadWorkday();
        },
        (error) => {
          this.errorMessage = 'Failed to load work day: ' + error.message;
        }
      );
    }
    this.changeShiftOverTime();
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
    // console.log(fStartDate)
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
  getShiftIndex(i: number): number {
    if (i === 0) return 3; 
    return i; 
  }
  loadHours() {
    if (!this.overTimeSwitch) {
      console.log(this.getdateselected());
      this.workDayService.getDWorkDayHoursByDateNormal(this.getdateselected()).subscribe(
        (response: ApiResponse<WDHours>) => {
          if (response.data) {
            this.work_days_hours = response.data;
            for (let i = 0; i < 24; i++) {
              this.perHourSwitches[i] = this.work_days_hours[`hour_${i + 1}`] === 1;
            }
          } else {
            // console.log("No hours found, creating default hours");
            // this.createHours("WD_NORMAL"); // Create hours if not found
          }
        },
        (error) => {
          this.errorMessage = 'Failed to load work day hours: ' + error.message;
        }
      );
    }
  }
  
  updateHours(){
    for (let i = 0; i < 24; i++) {
      this.work_days_hours[`hour_${i + 1}`] = this.perHourSwitches[i] ? 1:0;
    }
    this.workDayService.updateDWorkDayHours(this.work_days_hours).subscribe(
      (response: ApiResponse<WDHours>) => {
        if(response){
          this.loadHours();
        }
      },
      (error) => {
        this.errorMessage = 'Failed to Update work day hours: ' + error.message;
      }
    );
  }
  createHours(desc: string) {
    const buffer: WDHoursSpecific = {
      detail_WD_HOURS_SPECIFIC_ID: 1, 
      description: desc,
      date_WD: this.getdateselectedFlip(), 
      shift1_START_TIME: "07:10",
      shift1_END_TIME: '15:50',
      shift1_TOTAL_TIME: 520,
      
      shift2_START_TIME: '15:50',
      shift2_END_TIME: '23:30',
      shift2_TOTAL_TIME: 460,
      
      shift3_START_TIME: '23:30',
      shift3_END_TIME: '07:10',
      shift3_TOTAL_TIME: 460,

      status: 1,
      created_BY: null,
      creation_DATE: null,
      last_UPDATED_BY: null,
      last_UPDATE_DATE: null, 
      hour_1: 1,
      hour_2: 1,
      hour_3: 1,
      hour_4: 1,
      hour_5: 1,
      hour_6: 1,
      hour_7: 1,
      hour_8: 1,
      hour_9: 1,
      hour_10: 1,
      hour_11: 1,
      hour_12: 1,
      hour_13: 1,
      hour_14: 1,
      hour_15: 1,
      hour_16: 1,
      hour_17: 1,
      hour_18: 1,
      hour_19: 1,
      hour_20: 1,
      hour_21: 1,
      hour_22: 1,
      hour_23: 1,
      hour_24: 1,
    };

    this.workDayService.saveDWorkDayHours(buffer).subscribe(
      (response: ApiResponse<WDHours>) => {
        console.log(response);
        if (response) {
          // this.loadHours();
        }
      },
      (error) => {
        this.errorMessage = 'Failed to update work day hours: ' + error.message;
      }
    );
  }
  getMinTime(index: number, type: 'start' | 'end'): string {
    const minTimes = [
      { start: '07:10', end: '15:50' }, // Shift 1
      { start: '15:50', end: '23:30' }, // Shift 2
      { start: '23:30', end: '07:10' }, // Shift 3
    ];
    
    return minTimes[index][type];
  }
  
  getMaxTime(index: number, type: 'start' | 'end'): string {
    const maxTimes = [
      { start: '15:50', end: '23:30' }, // Shift 1
      { start: '23:30', end: '07:10' }, // Shift 2
      { start: '07:10', end: '15:50' }, // Shift 3
    ];
  
    return maxTimes[index][type];
  }
  
  resetShiftTime(mode: 'perHourShift' | 'ttperHourSwitches' | 'tlperHourSwitches', index: number): void {
    const shiftIndex = this.getShiftIndex(index);
    this[mode][`shift${shiftIndex}_START_TIME`] = "00:00";
    this[mode][`shift${shiftIndex}_END_TIME`] = "00:00";
    this[mode][`shift${shiftIndex}_TOTAL_TIME`] = "0"; // Reset total time
  }
  
  
  selectDay(day: dayCalendar) {
    this.work_days_hours = new WDHours;
    this.work_days_hoursTT = new WDHours;
    this.work_days_hoursTL = new WDHours;
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
      this.newEvent.title = `${dayName}, ${dayValue} - ${this.monthNames[monthValue]} - ${yearValue}`;
      this.loadReason();
      this.loadSelectDay();
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

  loadSelectDay(){
        // Set the title in the desired format
        this.showModal = true;
        this.selectedDay.detail.iwd_SHIFT_1;
        
        this.shift1Switches[1] = this.selectedDay.detail.iwd_SHIFT_1 ;
        this.shift1Switches[2] = this.selectedDay.detail.iwd_SHIFT_2 ;
        this.shift1Switches[0] = this.selectedDay.detail.iwd_SHIFT_3 ;
        const { iot_TL_1, iot_TL_2, iot_TL_3, iot_TT_1, iot_TT_2, iot_TT_3 } = this.selectedDay.detail;
        this.overTimeSwitch = [iot_TL_1, iot_TL_2, iot_TL_3, iot_TT_1, iot_TT_2, iot_TT_3].some(value => value === 1);
        this.perHourReasons = Array(24).fill(''); 
        
        this.ttSwitches[0] = this.selectedDay.detail.iot_TT_1;
        this.ttSwitches[1] = this.selectedDay.detail.iot_TT_2;
        this.ttSwitches[2] = this.selectedDay.detail.iot_TT_3;

        this.ttReasons = Array(3).fill('');
        this.ttperHourSwitches = Array(24).fill(true);
        this.ttperHourReasons = Array(24).fill(''); 
        
        this.tlSwitches[0] = this.selectedDay.detail.iot_TL_1;
        this.tlSwitches[1] = this.selectedDay.detail.iot_TL_2;
        this.tlSwitches[2] = this.selectedDay.detail.iot_TL_3;
        
        this.tlReasons = Array(3).fill(''); 
        this.tlperHourSwitches = Array(24).fill(true);
        this.tlperHourReasons = Array(24).fill(''); 

        this.weekend = false;
  }

  overtimeOn() {
    this.workDayService.turnOnOvertime(this.getdateselected()).subscribe(
      (response: ApiResponse<WorkDay>) => {
        if (response.data) {
          this.selectDay(this.selectedDay);
          this.tabset.tabs[1].active = true;
          this.refreshWorkday();
        }
      },
      (error) => {
        this.errorMessage = 'Failed to update work day hours: ' + error.message;
      }
    );
  }
  OffWorkday(){
    Object.assign(this.selectedDay.detail, {
      iot_TL_1: 0,
      iot_TL_2: 0,
      iot_TL_3: 0,
      iot_TT_1: 0,
      iot_TT_2: 0,
      iot_TT_3: 0,
      iwd_SHIFT_1: 0,
      iwd_SHIFT_2: 0,
      iwd_SHIFT_3: 0,
      off: 1
    });
    
    this.workDayService.updateWorkDay(this.selectedDay.detail).subscribe(
      (response: ApiResponse<WorkDay>) => {
        if (response.data) {
          this.refreshWorkday();
          if(this.weekend){
            // this.ove
          }
        }
      },
      (error) => {
        this.errorMessage = 'Failed to update work day hours: ' + error.message;
      }
    );
  }

  OnWorkday(){
    if(this.weekend){
      Object.assign(this.selectedDay.detail, {
        iot_TL_1: 1,
        iot_TL_2: 1,
        iot_TL_3: 1,
        iot_TT_1: 1,
        iot_TT_2: 1,
        iot_TT_3: 1,
        iwd_SHIFT_1: 0,
        iwd_SHIFT_2: 0,
        iwd_SHIFT_3: 0,
        off: 1
      });
      
      this.workDayService.updateWorkDay(this.selectedDay.detail).subscribe(
        (response: ApiResponse<WorkDay>) => {
          if (response.data) {
            this.selectDay(this.selectedDay);
            this.tabset.tabs[1].active = true;
            this.refreshWorkday();
          }
        },
        (error) => {
          this.errorMessage = 'Failed to update work day hours: ' + error.message;
        }
      );
    } else {
      Object.assign(this.selectedDay.detail, {
        iot_TL_1: 0,
        iot_TL_2: 0,
        iot_TL_3: 0,
        iot_TT_1: 0,
        iot_TT_2: 0,
        iot_TT_3: 0,
        iwd_SHIFT_1: 1,
        iwd_SHIFT_2: 1,
        iwd_SHIFT_3: 1,
        off: 0
      });
  
      this.workDayService.updateWorkDay(this.selectedDay.detail).subscribe(
        (response: ApiResponse<WorkDay>) => {
          if (response.data) {
            this.refreshWorkday();
          }
        },
        (error) => {
          this.errorMessage = 'Failed to update work day hours: ' + error.message;
        }
      );
    }
  }

  changeShiftOverTime(){
    Object.assign(this.selectedDay.detail, {
      iot_TL_1: this.tlSwitches[1] ? 1:0,
      iot_TL_2: this.tlSwitches[2] ? 1:0,
      iot_TL_3: this.tlSwitches[0] ? 1:0,
      iot_TT_1: this.ttSwitches[1] ? 1:0,
      iot_TT_2: this.ttSwitches[2] ? 1:0,
      iot_TT_3: this.ttSwitches[0] ? 1:0,
    });
    // console.log(this.selectedDay.detail);
    this.workDayService.updateWorkDay(this.selectedDay.detail).subscribe(
      (response: ApiResponse<WorkDay>) => {
        if (response.data) {
          this.refreshWorkday();
        }
      },
      (error) => {
        this.errorMessage = 'Failed to update work day hours: ' + error.message;
      }
    );
  }
  
  // Helper method to refresh workday and selected day
  refreshWorkday() {
    this.loadWorkday();
    this.loadReason();
    this.loadSelectDay();
  }
  

  closeModal() {
    this.showModal = false;
  }

  resetNewEvent() {
    this.newEvent = { title: '', description: '', date: null };
  }
}
