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
export class  MaxCapacityService {
  //Isi tokenya
  token: String =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyODMwODA4M30.y03EN8mmoDGrL7FzHc5W7QDPLuAoVmD21CNXz4OrBMyci5OSMFW8urH69vONuD8YW87911-NUE2BvkFrpFYWhA';

  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getMaxCapacityById(idMaxCapacity: number): Observable<ApiResponse<Max_Capacity>> {
    return this.http.get<ApiResponse<Max_Capacity>>(
      environment.apiUrlWebAdmin + '/getMaxCapacityById/' + idMaxCapacity,
      { headers: this.getHeaders() }
    );
  }

  getAllMaxCapacity(): Observable<ApiResponse<Max_Capacity[]>> {
    return this.http.get<ApiResponse<Max_Capacity[]>>(
      environment.apiUrlWebAdmin + '/getAllMaxCapacity',
      { headers: this.getHeaders() }
    );
  }

  //Method Update plant
  updateMaxCapacity(quadrant: Max_Capacity): Observable<ApiResponse<Max_Capacity>> {
    return this.http
      .post<ApiResponse<Max_Capacity>>(
        environment.apiUrlWebAdmin + '/updateMaxCapacity',
        quadrant,
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

  deleteMaxCapacity(quadrant: Max_Capacity): Observable<ApiResponse<Max_Capacity>> {
    return this.http
      .post<ApiResponse<Max_Capacity>>(
        environment.apiUrlWebAdmin + '/deleteMaxCapacity',
        quadrant,
        { headers: this.getHeaders() }
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

  uploadFileExcel(file: FormData): Observable<ApiResponse<Max_Capacity>> {
    return this.http
      .post<ApiResponse<Max_Capacity>>(
        environment.apiUrlWebAdmin + '/saveMaxCapacityExcel',
        file,
        { headers: this.getHeaders() }
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
}
