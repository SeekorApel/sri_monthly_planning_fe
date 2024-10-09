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
  token: String = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyODM4NTExNH0.EcIqiAPq5tX2MgDMcwD5rDNN-85fobiCN6S57r3rOBO64TK4JKUwzlF1zpLTqj4ul0KsBdnHqpDh4zOcAzoT8w';
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
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
    return this.http.post<ApiResponse<MachineExtruding>>(environment.apiUrlWebAdmin + '/saveMachineExtruding', file, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
