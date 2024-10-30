import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkDay } from 'src/app/models/WorkDay';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WorkDayService {
  //Isi tokenya
  token: String =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyODA0MjAzNH0.j_HYWCIoDutMP1jk2VbfOJOlbMpUEKkpaP_S4uPOu4Ajds66XOpxxA7t0nFi7zgG7YgC0KVmKPhv2wpb4XQLPA';

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
