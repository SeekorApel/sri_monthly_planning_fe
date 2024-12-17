import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeliverySchedule } from 'src/app/models/DeliverySchedule';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DeliveryScheduleService {
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getDeliveryScheduleById(iddDeliverySchedule: number): Observable<ApiResponse<DeliverySchedule>> {
    return this.http.get<ApiResponse<DeliverySchedule>>(environment.apiUrlWebAdmin + '/getDeliveryScheduleById/' + iddDeliverySchedule, { headers: this.getHeaders() });
  }

  getAllDeliverySchedule(): Observable<ApiResponse<DeliverySchedule[]>> {
    return this.http.get<ApiResponse<DeliverySchedule[]>>(environment.apiUrlWebAdmin + '/getAllDeliverySchedules', { headers: this.getHeaders() });
  }

  
  updateDeliverySchedule(deliverySchedule: DeliverySchedule): Observable<ApiResponse<DeliverySchedule>> {
    console.log(deliverySchedule);
    return this.http
      .post<ApiResponse<DeliverySchedule>>(
        environment.apiUrlWebAdmin + '/updateDeliverySchedule',
        deliverySchedule,
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

  deleteDeliverySchedule(curingsize: DeliverySchedule): Observable<ApiResponse<DeliverySchedule>> {
    return this.http.post<ApiResponse<DeliverySchedule>>(environment.apiUrlWebAdmin + '/deleteDeliverySchedule', curingsize, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  activateDeliverySchedule(curingsize: DeliverySchedule): Observable<ApiResponse<DeliverySchedule>> {
    return this.http.post<ApiResponse<DeliverySchedule>>(environment.apiUrlWebAdmin + '/restoreDeliverySchedule', curingsize, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<DeliverySchedule>> {
    return this.http.post<ApiResponse<DeliverySchedule>>(environment.apiUrlWebAdmin + '/saveDeliverySchedulesExcel', file, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  exportDeliveryScheduleExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportDeliveryScheduleExcel`, { responseType: 'blob' as 'json' });
  }
  templateDeliveryScheduleExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutDeliveryScheduleExcel`, { responseType: 'blob' as 'json' });
  }

}
