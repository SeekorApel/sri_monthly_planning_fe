import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DDeliverySchedule } from 'src/app/models/d-deliveryschedule';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DDeliveryScheduleService {
  //Isi tokenya
  token: String = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyODQ3OTYyNH0.ac7kGJxqMLAs4W7Sk4n3WKVC-LafKMuR_COtCM5XVMnbxV1zqgbEz5dKGu8LKRoXkLjNg7YcT7Jx5dVUWKbVXA';
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getDDeliveryScheduleByID(iDetailDS: number): Observable<ApiResponse<DDeliverySchedule>> {
    return this.http.get<ApiResponse<DDeliverySchedule>>(environment.apiUrlWebAdmin + '/getDDeliveryScheduleById/' + iDetailDS, { headers: this.getHeaders() });
  }

  getAllDDeliverySchedule(): Observable<ApiResponse<DDeliverySchedule[]>> {
    return this.http.get<ApiResponse<DDeliverySchedule[]>>(environment.apiUrlWebAdmin + '/getAllDDeliverySchedule', { headers: this.getHeaders() });
  }

  //Method Update Machine Tass Type
  updateDDeliverySchedule(dDeliverySchedule: DDeliverySchedule): Observable<ApiResponse<DDeliverySchedule>> {
    return this.http
      .post<ApiResponse<DDeliverySchedule>>(
        environment.apiUrlWebAdmin + '/updateDDeliverySchedule',
        dDeliverySchedule,
        { headers: this.getHeaders() } // Menyertakan header
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  deleteDDeliverySchedule(dDeliverySchedule: DDeliverySchedule): Observable<ApiResponse<DDeliverySchedule>> {
    return this.http.post<ApiResponse<DDeliverySchedule>>(environment.apiUrlWebAdmin + '/deleteDDeliverySchedule', dDeliverySchedule, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<DDeliverySchedule>> {
    return this.http.post<ApiResponse<DDeliverySchedule>>(environment.apiUrlWebAdmin + '/saveDDeliverySchedule', file, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
