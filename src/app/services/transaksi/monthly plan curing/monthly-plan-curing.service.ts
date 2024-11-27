import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ApiResponse } from 'src/app/response/Response';
import { environment } from 'src/environments/environment';
import { MonthlyPlanning } from 'src/app/models/MonthlyPlanning';
import { DetailShiftMonthlyPlanCuring } from 'src/app/models/DetailShiftMonthlyPlanCuring';


import { WorkDay } from 'src/app/models/WorkDay';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MonthlyPlanCuringService {

  constructor(private http: HttpClient) { }

  //get all data mp 
  getAllMonthlyPlanning(): Observable<ApiResponse<MonthlyPlanning[]>> {
    return this.http.get<ApiResponse<[]>>(environment.apiUrlWebAdmin + '/getAllMonthlyPlanning');
  }

  //get all data mp (MP, Header, Detail)
  // getDailyMonthlyPlan(partNumber: number): Observable<ApiResponse<any>> {
  //   return this.http.get<ApiResponse<any>>(`${environment.apiUrlWebAdmin}/getMonthlyPlan?partNumber=${partNumber}`
  //   );
  // }

  getDailyMonthlyPlan(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${environment.apiUrlWebAdmin}/getMonthlyPlan`);
  }

    //get detail shift
    getDetailShiftMonthlyPlan(detailDailyId: number, actualDate: string): Observable<ApiResponse<DetailShiftMonthlyPlanCuring[]>> {
      const params = new HttpParams()
        .set('detailDailyId', detailDailyId.toString())
        .set('actualDate', actualDate); // Pastikan format sesuai dengan backend (misal: "dd-MM-yyyy")
  
      return this.http.get<ApiResponse<DetailShiftMonthlyPlanCuring[]>>(
        `${environment.apiUrlWebAdmin}/getDetailShiftMonthlyPlan`, 
        { params }
      );
    }

  getAllMachineByItemCuring(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<[]>>(environment.apiUrlWebAdmin + '/getMachineByItemCuring');
  }

}
