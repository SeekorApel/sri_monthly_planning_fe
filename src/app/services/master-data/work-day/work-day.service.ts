import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkDay } from 'src/app/models/WorkDay';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { WDHours } from 'src/app/models/WDHours';
@Injectable({
  providedIn: 'root',
})
export class WorkDayService {
  //Isi tokenya


  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getAllWorkDaysByDateRange(dateStart: string,dateEnd: string): Observable<ApiResponse<WorkDay[]>> {
    return this.http.get<ApiResponse<WorkDay[]>>(
      environment.apiUrlWebAdmin + '/getAllWorkDaysByDateRange/' + dateStart +'/'+dateEnd,
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
  turnOffShift(dateTarget: string,shift: string): Observable<ApiResponse<WorkDay[]>> {
    return this.http.post<ApiResponse<WorkDay[]>>(
      environment.apiUrlWebAdmin + '/turnOffShift/' + dateTarget +'/'+shift,
      { headers: this.getHeaders() }
    );
  }  
  turnOnShift(dateTarget: string,shift: string): Observable<ApiResponse<WorkDay[]>> {
    return this.http.post<ApiResponse<WorkDay[]>>(
      environment.apiUrlWebAdmin + '/turnOnShift/' + dateTarget +'/'+shift,
      { headers: this.getHeaders() }
    );
  }
  getDWorkDayHoursByDateNormal(dateTarget: string): Observable<ApiResponse<WDHours>> {
    return this.http.get<ApiResponse<WDHours>>(
      environment.apiUrlWebAdmin + '/getDWorkDayHoursByDate/' + dateTarget ,
      { headers: this.getHeaders() }
    );
  }
  updateDWorkDayHours(wdhours: WDHours): Observable<ApiResponse<WDHours>> {
    return this.http
    .post<ApiResponse<WDHours>>(
      environment.apiUrlWebAdmin + '/updateDWorkDayHours' ,
      wdhours,
      { headers: this.getHeaders() }
    );
  }
  saveDWorkDayHours(wdhours: WDHours): Observable<ApiResponse<WDHours>> {
    console.log(wdhours);
    return this.http
    .post<ApiResponse<WDHours>>(
      environment.apiUrlWebAdmin + '/saveDWorkDayHours' ,
      wdhours,
      { headers: this.getHeaders() }
    );
  }
  turnOnOvertime(dateTarget: string): Observable<ApiResponse<WorkDay>> {
    console.log(dateTarget);
    return this.http
    .post<ApiResponse<WorkDay>>(
      environment.apiUrlWebAdmin + '/turnOnOvertime/'+dateTarget ,
      { headers: this.getHeaders() }
    );
  }
  // getAllBuilding(): Observable<ApiResponse<Building[]>> {
  //   return this.http.get<ApiResponse<Building[]>>(
  //     environment.apiUrlWebAdmin + '/getAllBuilding',
  //     { headers: this.getHeaders() }
  //   );
  // }

  // //Method Update plant
  // updateBuilding(building: Building): Observable<ApiResponse<Building>> {
  //   return this.http
  //     .post<ApiResponse<Building>>(
  //       environment.apiUrlWebAdmin + '/updateBuilding',
  //       building,
  //       { headers: this.getHeaders() } // Menyertakan header
  //     );
  // }

  // deleteBuilding(building: Building): Observable<ApiResponse<Building>> {
  //   return this.http
  //     .post<ApiResponse<Building>>(
  //       environment.apiUrlWebAdmin + '/deleteBuilding',
  //       building,
  //       { headers: this.getHeaders() }
  //     )
  //     .pipe(
  //       map((response) => {
  //         return response;
  //       }),
  //       catchError((err) => {
  //         return throwError(err);
  //       })
  //     );
  // }
  // activateBuilding(building: Building): Observable<ApiResponse<Building>> {
  //   return this.http.post<ApiResponse<Building>>(environment.apiUrlWebAdmin + '/restoreBuilding', building, { headers: this.getHeaders() }).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //     catchError((err) => {
  //       return throwError(err);
  //     })
  //   );
  // }

  // uploadFileExcel(file: FormData): Observable<ApiResponse<Building>> {
  //   return this.http
  //     .post<ApiResponse<Building>>(
  //       environment.apiUrlWebAdmin + '/saveBuildingsExcel',
  //       file,
  //       { headers: this.getHeaders() }
  //     )
  //     .pipe(
  //       map((response) => {
  //         return response;
  //       }),
  //       catchError((err) => {
  //         return throwError(err);
  //       })
  //     );
  // }

  // exportExcel(): Observable<Blob> {
  //   return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportBuildingsExcel`, { responseType: 'blob' as 'json' });
  // }
}
