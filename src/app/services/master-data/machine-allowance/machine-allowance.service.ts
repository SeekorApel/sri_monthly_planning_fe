import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { machineAllowence } from 'src/app/models/machineAllowance';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MachineAllowenceService {
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getMachineAllowenceById(idMachineAllowence: number): Observable<ApiResponse<machineAllowence>> {
    return this.http.get<ApiResponse<machineAllowence>>(environment.apiUrlWebAdmin + '/getMachineAllowenceById/' + idMachineAllowence, { headers: this.getHeaders() });
  }

  getAllMachineAllowence(): Observable<ApiResponse<machineAllowence[]>> {
    return this.http.get<ApiResponse<machineAllowence[]>>(environment.apiUrlWebAdmin + '/getAllMachineAllowence', { headers: this.getHeaders() });
  }

  //Method Update Machine Allowence
  updateMachineAllowence(machineAllowence: machineAllowence): Observable<ApiResponse<machineAllowence>> {
    return this.http
      .post<ApiResponse<machineAllowence>>(
        environment.apiUrlWebAdmin + '/updateMachineAllowence',
        machineAllowence,
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

  deleteMachineAllowence(machineAllowence: machineAllowence): Observable<ApiResponse<machineAllowence>> {
    return this.http.post<ApiResponse<machineAllowence>>(environment.apiUrlWebAdmin + '/deleteMachineAllowence', machineAllowence, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  activateMachineAllowence(machineAllowence: machineAllowence): Observable<ApiResponse<machineAllowence>> {
    return this.http.post<ApiResponse<machineAllowence>>(environment.apiUrlWebAdmin + '/restoreMachineAllowence', machineAllowence, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<machineAllowence>> {
    return this.http.post<ApiResponse<machineAllowence>>(environment.apiUrlWebAdmin + '/saveMachineAllowencesExcel', file, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  exportMachineAllowenceExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportMachineAllowenceExcel`, { responseType: 'blob' as 'json' });
  }
  
  templateMachineAllowenceExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutMachineAllowencesExcel`, { responseType: 'blob' as 'json' });
  }
}
