import { WorkDay } from "./WorkDay";

export class Calendar {
  year: number;
  month: number;
  days: dayCalendar[][];

  constructor(year: number, month: number, days: dayCalendar[][]) {
    this.year = year;
    this.month = month;
    this.days = days;
  }
}
export class dayCalendar{
  month: number;
  days: number;
  weekend: boolean;
  detail: WorkDay;
  constructor( days: number, month: number, weekend: boolean,  detail:WorkDay) {
    this.month = month;
    this.days = days;
    this.weekend = weekend;
    this.detail = detail;
  }
}
export interface Event {
  title: string;
  description: string;
  date: Date;
}