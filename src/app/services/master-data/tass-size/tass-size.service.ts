import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tass_Size } from 'src/app/models/Tass_Size';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TassSizeService {
  //Isi tokenya
  token: String =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyODQ0NTU3M30.mZU3Cv8_PnnHvdb75SGJdJoJ6lPt8-aURge2J2OooVGl7k0lsWlaPyUE1iIHi4BTPN1SkcDdOxJc4BP2hxvH3Q';

  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getTassSizeById(idTassSize: number): Observable<ApiResponse<Tass_Size>> {
    return this.http.get<ApiResponse<Tass_Size>>(
      environment.apiUrlWebAdmin + '/getTassSizeById/' + idTassSize,
      { headers: this.getHeaders() }
    );
  }

  getAllTassSize(): Observable<ApiResponse<Tass_Size[]>> {
    return this.http.get<ApiResponse<Tass_Size[]>>(
      environment.apiUrlWebAdmin + '/getAllTassSize',
      { headers: this.getHeaders() }
    );
  }
  updateTassSize(tass_size: Tass_Size): Observable<ApiResponse<Tass_Size>> {
    console.log(tass_size);
    return this.http
      .post<ApiResponse<Tass_Size>>(
        environment.apiUrlWebAdmin + '/updateTassSize',
        tass_size,
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

  deleteTassSize(tass_size: Tass_Size): Observable<ApiResponse<Tass_Size>> {
    return this.http
      .post<ApiResponse<Tass_Size>>(
        environment.apiUrlWebAdmin + '/deleteTassSize',
        tass_size,
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

  
  activateTassSize(tass_size: Tass_Size): Observable<ApiResponse<Tass_Size>> {
    console.log(tass_size);
    return this.http.post<ApiResponse<Tass_Size>>(environment.apiUrlWebAdmin + '/restoreTassSize', tass_size, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<Tass_Size>> {
    return this.http
      .post<ApiResponse<Tass_Size>>(
        environment.apiUrlWebAdmin + '/saveTassSizeExcel',
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
  exportTassSizesExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportTassSizeexcel`, { responseType: 'blob' as 'json' });
  }
  templateTassSizesExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutTassSizesExcel`, { responseType: 'blob' as 'json' });
  }
}
