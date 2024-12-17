import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Max_Capacity } from 'src/app/models/Max_Capacity';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MaxCapacityService {
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getMaxCapacityById(idMaxCapacity: number): Observable<ApiResponse<Max_Capacity>> {
    return this.http.get<ApiResponse<Max_Capacity>>(environment.apiUrlWebAdmin + '/getMaxCapacityById/' + idMaxCapacity, { headers: this.getHeaders() });
  }

  getAllMaxCapacity(): Observable<ApiResponse<Max_Capacity[]>> {
    return this.http.get<ApiResponse<Max_Capacity[]>>(environment.apiUrlWebAdmin + '/getAllMaxCapacity', { headers: this.getHeaders() });
  }

  //Method Update Max Capacity
  updateMaxCapacity(maxCapacity: Max_Capacity): Observable<ApiResponse<Max_Capacity>> {
    return this.http
      .post<ApiResponse<Max_Capacity>>(
        environment.apiUrlWebAdmin + '/updateMaxCapacity',
        maxCapacity,
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

  deleteMaxCapacity(maxCapacity: Max_Capacity): Observable<ApiResponse<Max_Capacity>> {
    return this.http.post<ApiResponse<Max_Capacity>>(environment.apiUrlWebAdmin + '/deleteMaxCapacity', maxCapacity, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  activateMaxCapacity(maxCapacity: Max_Capacity): Observable<ApiResponse<Max_Capacity>> {
    return this.http.post<ApiResponse<Max_Capacity>>(environment.apiUrlWebAdmin + '/restoreMaxCapacity', maxCapacity, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<Max_Capacity>> {
    return this.http.post<ApiResponse<Max_Capacity>>(environment.apiUrlWebAdmin + '/saveMaxCapacitiesExcel', file, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  exportMaxCapacitiesExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportMaxCapacityExcel`, { responseType: 'blob' as 'json' });
  }

  templateMaxCapacitiesExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutMaxCapacityExcel`, { responseType: 'blob' as 'json' });
  }

}
