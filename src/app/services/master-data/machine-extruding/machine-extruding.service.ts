import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MachineExtruding } from 'src/app/models/machine-extruding';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MachineExtrudingService {
  //Isi tokenya
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }
  activateMachineExtruding(me: MachineExtruding): Observable<ApiResponse<MachineExtruding>> {
    return this.http.post<ApiResponse<MachineExtruding>>(environment.apiUrlWebAdmin + '/restoreMachineExtruding', me, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  exportMachineExtrudingExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportMachineExtrudingExcel`, { responseType: 'blob' as 'json' });
  }
  tamplateMachineExtrudingExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutMachineExtrudingExcel`, { responseType: 'blob' as 'json' });
  }

  getMachineExtrudingByID(idMachineExtruding: number): Observable<ApiResponse<MachineExtruding>> {
    return this.http.get<ApiResponse<MachineExtruding>>(environment.apiUrlWebAdmin + '/getMachineExtrudingById/' + idMachineExtruding, { headers: this.getHeaders() });
  }

  getAllMachineExtruding(): Observable<ApiResponse<MachineExtruding[]>> {
    return this.http.get<ApiResponse<MachineExtruding[]>>(environment.apiUrlWebAdmin + '/getAllMachineExtruding', { headers: this.getHeaders() });
  }

  //Method Update Machine Tass Type
  updateMachineExtruding(machineExtruding: MachineExtruding): Observable<ApiResponse<MachineExtruding>> {
    return this.http
      .post<ApiResponse<MachineExtruding>>(
        environment.apiUrlWebAdmin + '/updateMachineExtruding',
        machineExtruding,
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

  deleteMachineExtruding(machineExtruding: MachineExtruding): Observable<ApiResponse<MachineExtruding>> {
    return this.http.post<ApiResponse<MachineExtruding>>(environment.apiUrlWebAdmin + '/deleteMachineExtruding', machineExtruding, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<MachineExtruding>> {
    return this.http.post<ApiResponse<MachineExtruding>>(environment.apiUrlWebAdmin + '/saveMachineExtrudingsExcel', file, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
