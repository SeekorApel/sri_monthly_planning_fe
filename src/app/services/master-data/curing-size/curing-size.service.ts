import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Curing_Size } from 'src/app/models/curingSize';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CuringSizeService {
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getCuringSizeById(idCuringSize: number): Observable<ApiResponse<Curing_Size>> {
    return this.http.get<ApiResponse<Curing_Size>>(environment.apiUrlWebAdmin + '/getCuringSizeById/' + idCuringSize, { headers: this.getHeaders() });
  }

  getAllCuringSize(): Observable<ApiResponse<Curing_Size[]>> {
    return this.http.get<ApiResponse<Curing_Size[]>>(environment.apiUrlWebAdmin + '/getAllCuringSize', { headers: this.getHeaders() });
  }

  
  updateCuringSize(curingsize: Curing_Size): Observable<ApiResponse<Curing_Size>> {
    return this.http
      .post<ApiResponse<Curing_Size>>(
        environment.apiUrlWebAdmin + '/updateCuringSize',
        curingsize,
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

  deleteCuringSize(curingsize: Curing_Size): Observable<ApiResponse<Curing_Size>> {
    return this.http.post<ApiResponse<Curing_Size>>(environment.apiUrlWebAdmin + '/deleteCuringSize', curingsize, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  activateCuringSize(curingsize: Curing_Size): Observable<ApiResponse<Curing_Size>> {
    return this.http.post<ApiResponse<Curing_Size>>(environment.apiUrlWebAdmin + '/restoreCuringSize', curingsize, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<Curing_Size>> {
    return this.http.post<ApiResponse<Curing_Size>>(environment.apiUrlWebAdmin + '/saveCuringSizeExcel', file, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  exportCuringSizeExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportCuringSizeexcel`, { responseType: 'blob' as 'json' });
  }
  templateCuringSizeExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutCuringSizeexcel`, { responseType: 'blob' as 'json' });
  }

}
