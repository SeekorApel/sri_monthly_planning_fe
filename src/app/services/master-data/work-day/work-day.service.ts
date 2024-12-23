import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkDay } from 'src/app/models/WorkDay';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
// import { WDHours } from 'src/app/models/WDHours';
import { DWorkDay } from 'src/app/models/DWorkDay';
import { WDHoursSpecific } from 'src/app/models/WDHoursSpecific';

@Injectable({
  providedIn: 'root',
})
export class WorkDayService {
  // Isi tokenya

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getAllWorkDaysByDateRange(dateStart: string, dateEnd: string): Observable<ApiResponse<WorkDay[]>> {
    return this.http.get<ApiResponse<WorkDay[]>>(
      environment.apiUrlWebAdmin + '/getAllWorkDaysByDateRange/' + dateStart + '/' + dateEnd,
      { headers: this.getHeaders() }
    );
  }

  updateWorkDay(workday: WorkDay): Observable<ApiResponse<WorkDay>> {
    return this.http.post<ApiResponse<WorkDay>>(
      environment.apiUrlWebAdmin + '/updateWorkDay',
      workday,
      { headers: this.getHeaders() }
    );
  }

  
  getWorkDayByDate(dateTarget: string): Observable<ApiResponse<WorkDay>> {
    return this.http.get<ApiResponse<WorkDay>>(
      environment.apiUrlWebAdmin + '/getWorkDayByDate/' + dateTarget,
      { headers: this.getHeaders() }
    );
  }

  turnOnOvertime(dateTarget: string): Observable<ApiResponse<WorkDay>> {
    return this.http.post<ApiResponse<WorkDay>>(
      environment.apiUrlWebAdmin + '/turnOnOvertime/' + dateTarget,
      { headers: this.getHeaders() }
    );
  }

  // getDWorkDayHoursByDateDesc(dateTarget: string, targetdesc: string): Observable<ApiResponse<WDHours>> {
  //   return this.http.get<ApiResponse<WDHours>>(
  //     environment.apiUrlWebAdmin + '/getDWorkDayHoursByDateDesc/' + dateTarget+"/"+targetdesc,
  //     { headers: this.getHeaders() }
  //   );
  // }

  // turnOnHour(dateTarget: string,hour: string,type: string): Observable<ApiResponse<WDHours>> {
  //   return this.http.post<ApiResponse<WDHours>>(
  //     environment.apiUrlWebAdmin + '/turnOnHour/'+dateTarget+"/"+hour+"/"+type,
  //     { headers: this.getHeaders() }
  //   );
  // }
  // turnOffHour(dateTarget: string,hour: string,type: string): Observable<ApiResponse<WDHours>> {
  //   return this.http.post<ApiResponse<WDHours>>(
  //     environment.apiUrlWebAdmin + '/turnOffHour/'+dateTarget+"/"+hour+"/"+type,
  //     { headers: this.getHeaders() }
  //   );
  // }

  // updateDWorkDayHours(wdhours: WDHours): Observable<ApiResponse<WDHours>> {
  //   return this.http.post<ApiResponse<WDHours>>(
  //     environment.apiUrlWebAdmin + '/updateDWorkDayHours',
  //     wdhours,
  //     { headers: this.getHeaders() }
  //   );
  // }

  // saveDWorkDayHours(wdhours: WDHours): Observable<ApiResponse<WDHours>> {
  //   console.log(wdhours);
  //   return this.http.post<ApiResponse<WDHours>>(
  //     environment.apiUrlWebAdmin + '/saveDWorkDayHours',
  //     wdhours,
  //     { headers: this.getHeaders() }
  //   );
  // }
  
  getDWorkDayByDate(buffer: string): Observable<ApiResponse<DWorkDay[]>> {
    return this.http.get<ApiResponse<DWorkDay[]>>(
      environment.apiUrlWebAdmin + '/getDWorkDayByDate/'+buffer,
      { headers: this.getHeaders() }
    );
  }

  saveDWorkDay(buffer: DWorkDay): Observable<ApiResponse<DWorkDay>> {
    return this.http.post<ApiResponse<DWorkDay>>(
      environment.apiUrlWebAdmin + '/saveDWorkDay',
      buffer,
      { headers: this.getHeaders() }
    );
  }

  updateDWorkDay(buffer: DWorkDay): Observable<ApiResponse<DWorkDay>> {
    return this.http.post<ApiResponse<DWorkDay>>(
      environment.apiUrlWebAdmin + '/updateDWorkDay',
       buffer,
      { headers: this.getHeaders() }
    );
  }
  deleteDWorkDay(buffer: DWorkDay): Observable<ApiResponse<DWorkDay>> {
    return this.http.post<ApiResponse<DWorkDay>>(
      environment.apiUrlWebAdmin + '/deleteDWorkDay',
       buffer,
      { headers: this.getHeaders() }
    );
  }

  getDWorkDayHoursSpecificByDateDesc(target:string,type: string): Observable<ApiResponse<WDHoursSpecific>> {
    return this.http.get<ApiResponse<WDHoursSpecific>>(
      environment.apiUrlWebAdmin + '/getDWorkDayHoursSpecificByDateDesc/'+target+"/"+type,
      { headers: this.getHeaders() }
    );
  }

  updateShiftTimes(stime:string,etime:string,target:string,type: string,shift: number): Observable<ApiResponse<WDHoursSpecific>> {
    return this.http.post<ApiResponse<WDHoursSpecific>>(
      environment.apiUrlWebAdmin + '/updateShiftTimes/'+stime+'/'+etime+'/'+target+"/"+type+"/"+shift,
      { headers: this.getHeaders() }
    );
  }

  saveDWorkDayHoursSpecific(wdhours: WDHoursSpecific): Observable<ApiResponse<WDHoursSpecific>> {
    return this.http.post<ApiResponse<WDHoursSpecific>>(
      environment.apiUrlWebAdmin + '/saveDWorkDayHoursSpecific',
      wdhours,
      { headers: this.getHeaders() }
    );
  }  
  updateDWorkDayHoursSpecific(wdhours: WDHoursSpecific): Observable<ApiResponse<WDHoursSpecific>> {
    return this.http.post<ApiResponse<WDHoursSpecific>>(
      environment.apiUrlWebAdmin + '/updateDWorkDayHoursSpecific',
      wdhours,
      { headers: this.getHeaders() }
    );
  }
  
}