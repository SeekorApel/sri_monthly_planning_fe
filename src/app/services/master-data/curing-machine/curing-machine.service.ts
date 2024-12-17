import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Curing_Machine } from 'src/app/models/Curing_Machine';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CuringMachineService {
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

getMachineCuringById(idMachineCuring: string): Observable<ApiResponse<Curing_Machine>> {
    return this.http.get<ApiResponse<Curing_Machine>>(
      environment.apiUrlWebAdmin + '/getMachineCuringById/' + idMachineCuring,
      { headers: this.getHeaders() }
    );
  }

  getAllMachineCuring(): Observable<ApiResponse<Curing_Machine[]>> {
    return this.http.get<ApiResponse<Curing_Machine[]>>(
      environment.apiUrlWebAdmin + '/getAllMachineCuring',
      { headers: this.getHeaders() }
    );
  }

  updateMachineCuring(curingmachine: Curing_Machine): Observable<ApiResponse<Curing_Machine>> {
    return this.http
      .post<ApiResponse<Curing_Machine>>(
        environment.apiUrlWebAdmin + '/updateMachineCuring',
        curingmachine,
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

  deleteMachineCuring(curingmachine: Curing_Machine): Observable<ApiResponse<Curing_Machine>> {
    return this.http
      .post<ApiResponse<Curing_Machine>>(
        environment.apiUrlWebAdmin + '/deleteMachineCuring',
        curingmachine,
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

  uploadFileExcel(file: FormData): Observable<ApiResponse<Curing_Machine>> {
    return this.http
      .post<ApiResponse<Curing_Machine>>(
        environment.apiUrlWebAdmin + '/saveMachineCuringExcel',
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
  activateCuringMachine(curingmachine: Curing_Machine): Observable<ApiResponse<Curing_Machine>> {
    return this.http.post<ApiResponse<Curing_Machine>>(environment.apiUrlWebAdmin + '/restoreMachineCuring', curingmachine, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  exportMachineCuringsExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportMachineCuringExcel`, { responseType: 'blob' as 'json' });
  }
  templateMachineCuringsExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutMachineCuringExcel`, { responseType: 'blob' as 'json' });
  }
}
