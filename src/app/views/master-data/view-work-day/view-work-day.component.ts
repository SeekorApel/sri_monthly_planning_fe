import { Component, OnInit, ViewChild  } from '@angular/core';
import { CalendarService } from 'src/app/services/master-data/calendar/calendar.service';
import { Calendar, dayCalendar, Event } from 'src/app/models/Calendar';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ApiResponse } from 'src/app/response/Response';
import { WorkDay } from 'src/app/models/WorkDay';
import {WorkDayService} from 'src/app/services/master-data/work-day/work-day.service'
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { WDHours } from 'src/app/models/WDHours';
import { DWorkDay } from 'src/app/models/DWorkDay';
import { WDHoursSpecific } from 'src/app/models/WDHoursSpecific';
import Swal from 'sweetalert2';

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
  
  perHourShift = new WDHoursSpecific;
  perHourReasons = Array(3).fill(new DWorkDay); 

  ttSwitches = Array(3).fill(true);
  ttReasons = Array(3).fill('');

  ttperHourSwitches = new WDHoursSpecific;
  ttperHourReasons = Array(3).fill(new DWorkDay); 

  Loading = true;
  isSaturday = false;
  isMonday = false;
  overTimeSwitch = false;
  tlSwitches = Array(3).fill(true);
  tlReasons = Array(3).fill(new DWorkDay); 

  tlperHourSwitches = new WDHoursSpecific;
  tlperHourReasons = Array(3).fill(new DWorkDay); 

  
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

  async ngOnInit() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    this.calendar = this.calendarService.getCalendar(currentYear, currentMonth);
    await this.loadWorkday();
    this.Loading = false;
  }

  isReasonRequired(shiftState: boolean): boolean {
    return !shiftState; 
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
  async handleShiftChange(shiftIndex: number, shift: string) {
    this.Loading = true;
    const ftargetDate = this.getdateselected();
    try {
      if (this.shift1Switches[shiftIndex]) {
        const Times = [
          { start: '23:30', end: '07:10' }, // Shift 3
          { start: '07:10', end: '15:50' }, // Shift 1
          { start: '15:50', end: '23:30' }, // Shift 2
        ];
        try{
          const response = await this.workDayService.updateShiftTimes(
            Times[shiftIndex].start,
            Times[shiftIndex].end,
            this.getdateselected(),
            "WD_NORMAL",
            shiftIndex == 0 ? 3 : shiftIndex
          ).toPromise();
          this.perHourShift = response.data;
        } catch (error) {
          this.errorMessage = 'Failed to update work day specific: ' + error.message;
        }
      } else {
        try{
          const response = await this.workDayService.updateShiftTimes(
            "00:00",
            "00:00",
            this.getdateselected(),
            "WD_NORMAL",
            shiftIndex == 0 ? 3 : shiftIndex
          ).toPromise();
          this.perHourShift = response.data;
        } catch (error) {
          this.errorMessage = 'Failed to update work day specific: ' + error.message;
        }
      }
  
      await this.loadWorkday();
      await this.loadHours();
    } catch (error) {
      this.errorMessage = 'Failed to load work day: ' + error.message;
    }
    this.Loading = false;
  }
  

  // TL overtime

  async handleShiftChangeTL(shiftIndex: number) {
    this.Loading = true;
    const ftargetDate = this.getdateselected();
    const ot = ["OT_TL_3", "OT_TL_1", "OT_TL_2"];
    
    try {
      if (this.tlSwitches[shiftIndex]) {
        const Times = [
          { start: '23:30', end: '07:10' }, // Shift 3
          { start: '07:10', end: '15:50' }, // Shift 1
          { start: '15:50', end: '23:30' }, // Shift 2
        ];
        try{
          const response = await this.workDayService.updateShiftTimes(
            Times[shiftIndex].start,
            Times[shiftIndex].end,
            this.getdateselected(),
            this.tlperHourSwitches.description,
            shiftIndex == 0 ? 3 : shiftIndex
          ).toPromise();
          this.tlperHourSwitches = response.data;
        } catch (error) {
          this.errorMessage = 'Failed to update work day specific: ' + error.message;
        }
      } else {
        try{
          const response = await this.workDayService.updateShiftTimes(
            "00:00",
            "00:00",
            this.getdateselected(),
            this.tlperHourSwitches.description,
            shiftIndex == 0 ? 3 : shiftIndex
          ).toPromise();
          this.tlperHourSwitches = response.data;
        } catch (error) {
          this.errorMessage = 'Failed to update work day specific: ' + error.message;
        }
      }
      await this.loadWorkday();
      await this.loadHours();
    } catch (error) {
      this.errorMessage = 'Failed to load work day: ' + error.message;
    }
    this.Loading = false;
  }
  

  // TT Overtime
  async handleShiftChangeTT(shiftIndex: number) {
    this.Loading = true;
    const ftargetDate = this.getdateselected();
    const ot = ["OT_TT_3", "OT_TT_1", "OT_TT_2"];
  
    try {
      if (this.ttSwitches[shiftIndex]) {
        const Times = [
          { start: '23:30', end: '07:10' }, // Shift 3
          { start: '07:10', end: '15:50' }, // Shift 1
          { start: '15:50', end: '23:30' }, // Shift 2
        ];
        try{
          const response = await this.workDayService.updateShiftTimes(
            Times[shiftIndex].start,
            Times[shiftIndex].end,
            this.getdateselected(),
            this.ttperHourSwitches.description,
            shiftIndex == 0 ? 3 : shiftIndex
          ).toPromise();
          // console.log(response.data);
          this.ttperHourSwitches = response.data;
        } catch (error) {
          this.errorMessage = 'Failed to update work day specific: ' + error.message;
        }
      } else {
        try{
          const response = await this.workDayService.updateShiftTimes(
            "00:00",
            "00:00",
            this.getdateselected(),
            this.ttperHourSwitches.description,
            shiftIndex == 0 ? 3 : shiftIndex
          ).toPromise();
          this.ttperHourSwitches = response.data;
        } catch (error) {
          this.errorMessage = 'Failed to update work day specific: ' + error.message;
        }
      }
  
      // await this.loadWorkday();
      // await this.loadHours();
    } catch (error) {
      this.errorMessage = 'Failed to load work day: ' + error.message;
    }
    this.Loading = false;
  }
  
  
  
  monthNames: string[] = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus',
    'September', 'Oktober', 'November', 'Desember'
  ];
  calendar: Calendar;
  selectedDay: dayCalendar = new dayCalendar(null,null,null,null);
  events: Event[] = [];
  @ViewChild('tabset', { static: false }) tabset: TabsetComponent;

  async loadWorkday() {
    try {
      this.readytoload = false;
      this.work_days = [];
  
      // Calculate start and end dates
      const startDate = new Date(
        this.calendar.year,
        this.calendar.days[0][0].month - 1, // Subtract 1 as months are zero-based
        this.calendar.days[0][0].days
      );
  
      const endDate = new Date(
        this.calendar.year,
        this.calendar.days[this.calendar.days.length - 1][6].month - 1, // Subtract 1 as months are zero-based
        this.calendar.days[this.calendar.days.length - 1][6].days
      );
  
      const fStartDate = [
        String(startDate.getDate()).padStart(2, '0'), // dd
        String(startDate.getMonth() + 1).padStart(2, '0'), // MM
        startDate.getFullYear() // yyyy
      ].join('-');
  
      const fEndDate = [
        String(endDate.getDate()+1).padStart(2, '0'), // dd
        String(endDate.getMonth() + 1).padStart(2, '0'), // MM
        endDate.getFullYear() // yyyy
      ].join('-');
  
      // Fetch workdays using the service
      const response = await this.workDayService.getAllWorkDaysByDateRange(fStartDate, fEndDate).toPromise();
  
      if (response?.data) {
        console.log(response.data);
        this.work_days = response.data;
        let index = 0;
  
        // Assign work day details to calendar days
        this.calendar.days.forEach(week => {
          week.forEach(day => {
            if (index < this.work_days.length) {
              day.detail = this.work_days[index];
              index++;
            }
          });
        });
      }
  
      this.readytoload = true;
    } catch (error: any) {
      this.errorMessage = 'Failed to load work day: ' + error.message;
      console.error('Error loading work days:', error);
    }
  }
  
  
  getEventsForDay(day: number): Event[] {
    return this.events.filter(event => 
      day > 0 && // Only check for valid days
      event.date.getFullYear() === this.calendar.year &&
      event.date.getMonth() + 1 === this.calendar.month && // Months are 0-indexed
      event.date.getDate() === day
    );
  }

  async previousMonth() {
    this.Loading = true;
    this.selectedDay = new dayCalendar(null,null,null,null);
    const { year, month } = this.calendar;
    const newMonth = month === 1 ? 12 : month - 1;
    const newYear = month === 1 ? year - 1 : year;
    this.calendar = this.calendarService.getCalendar(newYear, newMonth);
    await this.loadWorkday();
    this.Loading = false;
  }

  async nextMonth() {
    this.Loading = true;
    this.selectedDay = new dayCalendar(null,null,null,null);
    const { year, month } = this.calendar;
    const newMonth = month === 12 ? 1 : month + 1;
    const newYear = month === 12 ? year + 1 : year;
    this.calendar = this.calendarService.getCalendar(newYear, newMonth);
    await this.loadWorkday();
    this.Loading = false;
  }

  getShiftIndex(i: number): number {
    if (i === 0) return 3; 
    return i; 
  }
  async loadHours() {
    try {
      const response = await this.workDayService.getDWorkDayHoursSpecificByDateDesc(this.getdateselected(), "WD_NORMAL").toPromise();
      if (response?.data) {
        this.perHourShift = response.data;
      } else {
        console.log("ini create normal")
        // this.createHours("WD_NORMAL");
      }
      const otTTResponse = await this.workDayService.getDWorkDayHoursSpecificByDateDesc(this.getdateselected(), "OT_TT").toPromise();

      if (otTTResponse?.data) {
        this.ttperHourSwitches = otTTResponse.data;
      } else {
        console.log("ini create ot tt")
        // this.createHours("OT_TT");
      }
      const otTLResponse = await this.workDayService.getDWorkDayHoursSpecificByDateDesc(this.getdateselected(), "OT_TL").toPromise();

      if (otTLResponse?.data) {
        this.tlperHourSwitches = otTLResponse.data;
      } else {
        console.log("ini create to tl")
        // this.createHours("OT_TL");
      }
    } catch (error: any) {
      this.errorMessage = 'Failed to load work day hours: ' + error.message;
    }
    this.Loading = false;
  }
  
  
  async createHours(desc: string) {
    const buffer: WDHoursSpecific = {
      detail_WD_HOURS_SPECIFIC_ID: 1,
      description: desc,
      date_WD: this.getdateselectedFlip(),
      shift1_START_TIME: "07:10",
      shift1_END_TIME: "15:50",
      shift1_TOTAL_TIME: 520,
  
      shift2_START_TIME: "15:50",
      shift2_END_TIME: "23:30",
      shift2_TOTAL_TIME: 460,
  
      shift3_START_TIME: "23:30",
      shift3_END_TIME: "07:10",
      shift3_TOTAL_TIME: 460,
  
      status: 1,
      created_BY: null,
      creation_DATE: null,
      last_UPDATED_BY: null,
      last_UPDATE_DATE: null,
    };
  
    if (this.isSaturday && desc === "WD_NORMAL") {
      buffer.shift1_START_TIME = "00:00";
      buffer.shift2_START_TIME = "00:00";
      buffer.shift1_END_TIME = "00:00";
      buffer.shift2_END_TIME = "00:00";
      buffer.shift1_TOTAL_TIME = 0;
      buffer.shift2_TOTAL_TIME = 0;
    }

    try {
      const response = await this.workDayService.saveDWorkDayHoursSpecific(buffer).toPromise();
      if (response?.data) {
        switch (response.data.description) {
          case "WD_NORMAL":
            this.perHourShift = response.data;
            break;
          case "OT_TT":
            this.ttperHourSwitches = response.data;
            break;
          case "OT_TL":
            this.tlperHourSwitches = response.data;
            break;
        }
      }
    } catch (error: any) {
      this.errorMessage = 'Failed to create work day hours specific: ' + error.message;
    }
  }
  
  convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
  
  changeStartTime(buffer: WDHoursSpecific, index: number): void {
    const Times = [
      { start: '23:30', end: '07:10' }, // Shift 3
      { start: '07:10', end: '15:50' }, // Shift 1
      { start: '15:50', end: '23:30' }, // Shift 2
    ];
  
    const shiftKeyStart = `shift${index}_START_TIME`;
    const shiftKeyEnd = `shift${index}_END_TIME`;
    const startTime = this.convertTimeToMinutes(buffer[shiftKeyStart]);
    const endTime = this.convertTimeToMinutes(buffer[shiftKeyEnd]);
    const allowedStart = this.convertTimeToMinutes(Times[index].start);
    const allowedEnd = this.convertTimeToMinutes(Times[index].end);
  
    // Adjust start time if it is earlier than the allowed start
    if (startTime < allowedStart) {
      buffer[shiftKeyStart] = Times[index].start;
      console.warn(
        `Start time adjusted to the minimum allowed value: ${Times[index].start}`
      );
    }
  
    // Adjust end time if it is earlier than the allowed end
    if (endTime < allowedEnd) {
      buffer[shiftKeyEnd] = Times[index].end;
      console.warn(
        `End time adjusted to the minimum allowed value: ${Times[index].end}`
      );
    }
  }
  
  updateTotalTime(index: number): void {
    const shiftIndex = this.getShiftIndex(index);
    this.changeStartTime(this.perHourShift,shiftIndex);
    const startTime = this.perHourShift[`shift${shiftIndex}_START_TIME`];
    const endTime = this.perHourShift[`shift${shiftIndex}_END_TIME`];
    if (startTime && endTime) {
      const start = this.convertTimeToMinutes(startTime);
      const end = this.convertTimeToMinutes(endTime);
  
      // Calculate total time in minutes (handle overnight shifts)
      let totalMinutes = end >= start ? end - start : 24 * 60 - start + end;
  
      // Check if the day is Friday and only for Shift 1
      const eventDate = this.newEvent.date; // Replace with your actual event date
      const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
      const dayName = eventDate.toLocaleDateString('en-US', options);
  
      if (dayName === 'Friday' && shiftIndex === 1) {
        const excludedStart = this.convertTimeToMinutes('11:40');
        const excludedEnd = this.convertTimeToMinutes('12:40');
  
        // Adjust for overlap with the excluded period
        if (start < excludedEnd && end > excludedStart) {
          const overlapStart = Math.max(start, excludedStart);
          const overlapEnd = Math.min(end, excludedEnd);
          const overlapMinutes = overlapEnd - overlapStart;
  
          if (overlapMinutes > 0) {
            totalMinutes -= overlapMinutes;
          }
        }
      }
  
      this.perHourShift[`shift${shiftIndex}_TOTAL_TIME`] = Math.max(totalMinutes, 0); // Ensure no negative time
    }
  }  

  updateTotalTimeOTTT(index: number): void {
    const shiftIndex = this.getShiftIndex(index);
    const startTime = this.ttperHourSwitches[`shift${shiftIndex}_START_TIME`];
    const endTime = this.ttperHourSwitches[`shift${shiftIndex}_END_TIME`];
  
    if (startTime && endTime) {
      const start = this.convertTimeToMinutes(startTime);
      const end = this.convertTimeToMinutes(endTime);
  
      // Calculate total time in minutes (handle overnight shifts)
      let totalMinutes = end >= start ? end - start : 24 * 60 - start + end;
  
      // Check if the day is Friday and only for Shift 1
      const eventDate = this.newEvent.date; // Replace with your actual event date
      const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
      const dayName = eventDate.toLocaleDateString('en-US', options);
  
      if (dayName === 'Friday' && shiftIndex === 1) {
        const excludedStart = this.convertTimeToMinutes('11:40');
        const excludedEnd = this.convertTimeToMinutes('12:40');
  
        // Adjust the total time if the shift spans the excluded period
        if (start < excludedEnd && end > excludedStart) {
          const overlapStart = Math.max(start, excludedStart);
          const overlapEnd = Math.min(end, excludedEnd);
          const overlapMinutes = overlapEnd - overlapStart;
  
          if (overlapMinutes > 0) {
            totalMinutes -= overlapMinutes;
          }
        }
      }
  
      this.ttperHourSwitches[`shift${shiftIndex}_TOTAL_TIME`] = Math.max(totalMinutes, 0); // Ensure no negative time
    }
  }
  
  updateTotalTimeOTTL(index: number): void {
    const shiftIndex = this.getShiftIndex(index);
    const startTime = this.tlperHourSwitches[`shift${shiftIndex}_START_TIME`];
    const endTime = this.tlperHourSwitches[`shift${shiftIndex}_END_TIME`];
  
    if (startTime && endTime) {
      const start = this.convertTimeToMinutes(startTime);
      const end = this.convertTimeToMinutes(endTime);
  
      // Calculate total time in minutes (handle overnight shifts)
      let totalMinutes = end >= start ? end - start : 24 * 60 - start + end;
  
      // Check if the day is Friday and only for Shift 1
      const eventDate = this.newEvent.date; // Replace with your actual event date
      const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
      const dayName = eventDate.toLocaleDateString('en-US', options);
  
      if (dayName === 'Friday' && shiftIndex === 1) {
        const excludedStart = this.convertTimeToMinutes('11:40');
        const excludedEnd = this.convertTimeToMinutes('12:40');
  
        // Adjust the total time if the shift spans the excluded period
        if (start < excludedEnd && end > excludedStart) {
          const overlapStart = Math.max(start, excludedStart);
          const overlapEnd = Math.min(end, excludedEnd);
          const overlapMinutes = overlapEnd - overlapStart;
  
          if (overlapMinutes > 0) {
            totalMinutes -= overlapMinutes;
          }
        }
      }
  
      this.tlperHourSwitches[`shift${shiftIndex}_TOTAL_TIME`] = Math.max(totalMinutes, 0); // Ensure no negative time
    }
  }  

  async saveHour(buffer: WDHoursSpecific) {
    const result = await Swal.fire({
      title: 'Confirm Save',
      text: 'Are you sure you want to save these hours?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
  
    if (result.isConfirmed) {
      try {
        const response = await this.workDayService.updateDWorkDayHoursSpecific(buffer).toPromise();
        if (response.data) {
          await Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Work day hours saved successfully!',
          });
          try{
            const response = await this.workDayService.getWorkDayByDate(this.getdateselected()).toPromise();
            if(response.data){
              this.selectedDay.detail = response.data;
            }
          }catch (error: any) {
            this.errorMessage = 'Failed to get updated work day: ' + error.message;
          }
          this.refreshWorkday();
          this.selectDay(this.selectedDay);
          this.tabset.tabs[1].active = true;

        }
      } catch (error: any) {
        this.errorMessage = 'Failed to save work day hours: ' + error.message;
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to save work day hours. ' + error.message,
        });
      }
    }
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
    this.Loading = true;
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
      this.isSaturday = dayName == "Saturday" ? true : false;
      // Extract day, month, and year
      const dayValue = eventDate.getDate(); 
      const monthValue = eventDate.getMonth(); 
      const yearValue = eventDate.getFullYear(); 
      this.newEvent.title = `${dayName}, ${dayValue} - ${this.monthNames[monthValue]} - ${yearValue}`;
      this.loadReason();
      this.loadSelectDay();
      if(this.tabset)
      this.tabset.tabs[0].active = true;
      if (day.weekend) {
        this.weekend = true;
        this.title = "OverTime TT and TL";
      } else {
        this.weekend = false;
        if(this.overTimeSwitch){
          this.title = "OverTime TT and TL";
        }else{
          this.title = "Normal Work Day";
        }
      }
    }
  }

  async handleReasonSaveUpdateDelete(buffer: DWorkDay, inputElement: HTMLInputElement) {
    try {
      if (buffer.detail_WD_ID) {
        if (buffer.description === "") {
          const deleteResponse = await this.workDayService.deleteDWorkDay(buffer).toPromise();
          if (deleteResponse) {
            // Handle successful delete response if needed
          }
        } else {
          const updateResponse = await this.workDayService.updateDWorkDay(buffer).toPromise();
          if (updateResponse) {
            // Handle successful update response if needed
          }
        }
      } else {
        const saveResponse = await this.workDayService.saveDWorkDay(buffer).toPromise();
        if (saveResponse) {
          // Handle successful save response if needed
        }
      }
    } catch (error: any) {
      this.errorMessage = 'Failed to process detail work day hours: ' + error.message;
    } finally {
      inputElement.blur();
    }
  }
  

  async loadReason() {
    try {
      const dateToLoad = this.getdateselectedFlip();
      const hourIntervals = ["HShift 3", "HShift 1", "HShift 2"];
      const response = await this.workDayService.getDWorkDayByDate(this.getdateselected()).toPromise();
  
      if (response?.data) {
        const defaultReason = (parent: string) => ({
          description: '',
          parent,
          date_WD: dateToLoad,
        });
  
        const findReason = (parent: string) =>
          response.data.find(item => item.parent === parent && item.status === 1) ?? defaultReason(parent);
  
        this.shift1Reasons = ["SHIFT 3", "SHIFT 1", "SHIFT 2"].map(findReason);
        this.ttReasons = ["OT TT SHIFT 3", "OT TT SHIFT 1", "OT TT SHIFT 2"].map(findReason);
        this.tlReasons = ["OT TL SHIFT 3", "OT TL SHIFT 1", "OT TL SHIFT 2"].map(findReason);
  
        this.perHourReasons = hourIntervals.map(interval => findReason(interval));
        this.ttperHourReasons = hourIntervals.map(interval => findReason(`OT TT ${interval}`));
        this.tlperHourReasons = hourIntervals.map(interval => findReason(`OT TL ${interval}`));
      }
    } catch (error: any) {
      this.errorMessage = 'Failed to update work day hours: ' + error.message;
    }
  }
  
  loadSelectDay() {
    this.showModal = true;
  
    // Assign shift switches
    const { iwd_SHIFT_1, iwd_SHIFT_2, iwd_SHIFT_3, iot_TL_1, iot_TL_2, iot_TL_3, iot_TT_1, iot_TT_2, iot_TT_3 } =
    this.selectedDay.detail;
  
    this.shift1Switches = [iwd_SHIFT_3, iwd_SHIFT_1, iwd_SHIFT_2];
  
    // Assign overtime switches
    this.ttSwitches = [iot_TT_3, iot_TT_1, iot_TT_2];
    this.tlSwitches = [iot_TL_3, iot_TL_1, iot_TL_2];
  
    // Determine if any overtime switches are active
    this.overTimeSwitch = [iot_TL_1, iot_TL_2, iot_TL_3, iot_TT_1, iot_TT_2, iot_TT_3].some(value => value === 1);
  
    // Assign weekend and load hours
    this.weekend = this.selectedDay.weekend;
    this.loadHours();
  }
  

  async overtimeOn() {
    this.Loading = true;
    const Times = [
      { start: '23:30', end: '07:10' }, // Shift 3
      { start: '07:10', end: '15:50' }, // Shift 1
      { start: '15:50', end: '23:30' }, // Shift 2
    ];
    try{
      
      for (let shiftIndex = 0; shiftIndex < Times.length; shiftIndex++) {
        const response = await this.workDayService.updateShiftTimes(
          shiftIndex == 0 ? "23:30":"00:00",
          shiftIndex == 0 ? "07:10":"00:00",
          this.getdateselected(),
          "WD_NORMAL",
          shiftIndex == 0 ? 3 : shiftIndex
        ).toPromise();
        this.perHourShift = response.data;
      }

      for (let shiftIndex = 0; shiftIndex < Times.length; shiftIndex++) {
        const response = await this.workDayService.updateShiftTimes(
          Times[shiftIndex].start,
          Times[shiftIndex].end,
          this.getdateselected(),
          "OT_TT",
          shiftIndex == 0 ? 3 : shiftIndex
        ).toPromise();
        this.ttperHourSwitches = response.data;
      }

      for (let shiftIndex = 0; shiftIndex < Times.length; shiftIndex++) {
        const response = await this.workDayService.updateShiftTimes(
          Times[shiftIndex].start,
          Times[shiftIndex].end,
          this.getdateselected(),
          "OT_TL",
          shiftIndex == 0 ? 3 : shiftIndex
        ).toPromise();
        this.tlperHourSwitches = response.data;
      }
    } catch (error) {
      this.errorMessage = 'Failed to update work day specific: ' + error.message;
    }

    // try {
    //   const response = await this.workDayService.turnOnOvertime(this.getdateselected()).toPromise();
    //   if (response.data) {
    //     this.selectedDay.detail = response.data;
    //     this.refreshWorkday();
    //     this.selectDay(this.selectedDay);
    //     this.tabset.tabs[1].active = true;
    //   }
    // } catch (error: any) {
    //   this.errorMessage = 'Failed to update work day hours: ' + error.message;
    // }
    await this.loadWorkday();
    this.selectDay(this.selectedDay);
    this.Loading = false;
  }
  
  async OffWorkday() {
  this.Loading = true;
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
      off: 1,
    });
    if(!this.overTimeSwitch){
      try {
        for (let i = 1; i <= 3; i++) {
          const response = await this.workDayService.updateShiftTimes(
            "00:00",
            "00:00",
            this.getdateselected(),
            "WD_NORMAL",
            i
          ).toPromise();
          this.perHourShift = response.data;
        }
      } catch (error) {
        this.errorMessage = 'Failed to update work day specific: ' + error.message;
      }  
    }
    try {
      const response = await this.workDayService.updateWorkDay(this.selectedDay.detail).toPromise();
      if (response.data) {
        await this.refreshWorkday();
        if (this.weekend) {
          // Add logic here if needed
        }
      }
    } catch (error) {
      this.errorMessage = 'Failed to update work day hours: ' + error.message;
    }
    this.Loading = false;
  }

  async OnWorkday() {
    this.Loading = true;
    const Times = [
      { start: '23:30', end: '07:10' }, // Shift 3
      { start: '07:10', end: '15:50' }, // Shift 1
      { start: '15:50', end: '23:30' }, // Shift 2
    ];
    
    try {
      for (let i = 0; i < Times.length; i++) {
        const response = await this.workDayService.updateShiftTimes(
          Times[i].start,
          Times[i].end,
          this.getdateselected(),
          "WD_NORMAL",
          i === 0 ? 3 : i
        ).toPromise();
        this.perHourShift = response.data;
      }
    } catch (error) {
      this.errorMessage = 'Failed to update work day specific: ' + error.message;
    }    
    try {
      if (this.weekend) {
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
          off: 1,
        });
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
          off: 0,
        });
      }

      const response = await this.workDayService.updateWorkDay(this.selectedDay.detail).toPromise();

      if (response.data) {
        await this.refreshWorkday();
      }
    } catch (error) {
      this.errorMessage = 'Failed to update work day hours: ' + error.message;
    }
    this.Loading = true;
  }


  
  // Helper method to refresh workday and selected day
  refreshWorkday() {
    this.loadWorkday();
    this.loadReason();
    this.loadSelectDay();
  }
}
