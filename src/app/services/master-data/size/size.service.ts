import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Size } from 'src/app/models/Size';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SizeService {
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

  getSizeById(idSize: string): Observable<ApiResponse<Size>> {
    return this.http.get<ApiResponse<Size>>(
      environment.apiUrlWebAdmin + '/getSizeById/' + idSize,
      { headers: this.getHeaders() }
    );
  }

  getAllSize(): Observable<ApiResponse<Size[]>> {
    return this.http.get<ApiResponse<Size[]>>(
      environment.apiUrlWebAdmin + '/getAllSize',
      { headers: this.getHeaders() }
    );
  }
  
  updateSize(size: Size): Observable<ApiResponse<Size>> {
    return this.http
      .post<ApiResponse<Size>>(
        environment.apiUrlWebAdmin + '/updateSize',
        size,
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

  deleteSize(size: Size): Observable<ApiResponse<Size>> {
    return this.http
      .post<ApiResponse<Size>>(
        environment.apiUrlWebAdmin + '/deleteSize',
        size,
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

  activateSize(size: Size): Observable<ApiResponse<Size>> {
    return this.http.post<ApiResponse<Size>>(environment.apiUrlWebAdmin + '/restoreSize', size, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<Size>> {
    return this.http
      .post<ApiResponse<Size>>(
        environment.apiUrlWebAdmin + '/saveSizeExcel',
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
  exportSizesExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportSizeexcel`, { responseType: 'blob' as 'json' });
  }
  templateSizesExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutSizeexcel`, { responseType: 'blob' as 'json' });
  }

}
