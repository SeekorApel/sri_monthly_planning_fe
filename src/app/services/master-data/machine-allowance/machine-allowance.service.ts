import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { machineAllowance } from 'src/app/models/machineAllowance';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class machineAllowanceService {
  //Isi tokenya
  token: String =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyODMwODA4M30.y03EN8mmoDGrL7FzHc5W7QDPLuAoVmD21CNXz4OrBMyci5OSMFW8urH69vONuD8YW87911-NUE2BvkFrpFYWhA';

  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }

  getMachineAllowanceById(idMachineAllowance: number): Observable<ApiResponse<machineAllowance>> {
    return this.http.get<ApiResponse<machineAllowance>>(
      environment.apiUrlWebAdmin + '/getMachineAllowenceById/' + idMachineAllowance,
      { headers: this.getHeaders() }
    );
  }

  getAllMachineAllowance(): Observable<ApiResponse<machineAllowance[]>> {
    return this.http.get<ApiResponse<machineAllowance[]>>(
      environment.apiUrlWebAdmin + '/getAllMachineAllowence',
      { headers: this.getHeaders() }
    );
  }

  //Method Update plant
  updateMachineAllowance(machineAllowance: machineAllowance): Observable<ApiResponse<machineAllowance>> {
    return this.http
      .post<ApiResponse<machineAllowance>>(
        environment.apiUrlWebAdmin + '/updateMachineAllowence',
        machineAllowance,
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

  deleteMachineAllowance(machineAllowance: machineAllowance): Observable<ApiResponse<machineAllowance>> {
    return this.http
      .post<ApiResponse<machineAllowance>>(
        environment.apiUrlWebAdmin + '/deleteMachineAllowence',
        machineAllowance,
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

  uploadFileExcel(file: FormData): Observable<ApiResponse<machineAllowance>> {
    return this.http
      .post<ApiResponse<machineAllowance>>(
        environment.apiUrlWebAdmin + '/saveMachineAllowencesExcel',
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
