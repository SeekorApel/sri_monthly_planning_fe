import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BDistance } from 'src/app/models/BDistance';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BDistanceService {
  //Isi tokenya
  token: String =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyODA0MjAzNH0.j_HYWCIoDutMP1jk2VbfOJOlbMpUEKkpaP_S4uPOu4Ajds66XOpxxA7t0nFi7zgG7YgC0KVmKPhv2wpb4XQLPA';

  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }

  getlBuildingDistanceById(bdistance: number): Observable<ApiResponse<BDistance>> {
    return this.http.get<ApiResponse<BDistance>>(
      environment.apiUrlWebAdmin + '/getBuildingDistanceById/' + bdistance,
      { headers: this.getHeaders() }
    );
  }

  getAllBuildingDistance(): Observable<ApiResponse<BDistance[]>> {
    return this.http.get<ApiResponse<BDistance[]>>(
      environment.apiUrlWebAdmin + '/getAllBuildingDistance',
      { headers: this.getHeaders() }
    );
  }

  //Method Update
  updateBuildingDistance(bdistance: BDistance): Observable<ApiResponse<BDistance>> {
    return this.http
      .post<ApiResponse<BDistance>>(
        environment.apiUrlWebAdmin + '/updateBuildingDistance',
        bdistance,
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

  deletelBuildingDistance(bdistance: BDistance): Observable<ApiResponse<BDistance>> {
    return this.http
      .post<ApiResponse<BDistance>>(
        environment.apiUrlWebAdmin + '/deleteBuildingDistance',
        bdistance,
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

  uploadFileExcel(file: FormData): Observable<ApiResponse<BDistance>> {
    return this.http
      .post<ApiResponse<BDistance>>(
        environment.apiUrlWebAdmin + '/saveBuildingDistancesExcel',
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
