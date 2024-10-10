import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MachineCuringType } from 'src/app/models/machine-curing-type';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MachineCuringTypeService {
  //Isi tokenya
  token: String =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyNzk2MjczMX0.3qeq8OusdWu9a9IyjGZY-nwx97qWsaJw2ga2DUHqxcN35iLPV9wi8ZqEX48ptxQ0BbtYnWxc7Img6pumz_JJ8w';
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getMctById(idMct: number): Observable<ApiResponse<MachineCuringType>> {
    return this.http.get<ApiResponse<MachineCuringType>>(
      environment.apiUrlWebAdmin + '/getMachineCuringTypeById/' + idMct,
      { headers: this.getHeaders() }
    );
  }

  getAllMCT(): Observable<ApiResponse<MachineCuringType[]>> {
    return this.http.get<ApiResponse<MachineCuringType[]>>(
      environment.apiUrlWebAdmin + '/getAllMachineCuringType',
      { headers: this.getHeaders() }
    );
  }

  //Method Update plant
  updateMCT(mct: MachineCuringType): Observable<ApiResponse<MachineCuringType>> {
    return this.http
      .post<ApiResponse<MachineCuringType>>(
        environment.apiUrlWebAdmin + '/updateMachineCuringType',
        mct,
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

  deleteMct(mct: MachineCuringType): Observable<ApiResponse<MachineCuringType>> {
    return this.http
      .post<ApiResponse<MachineCuringType>>(
        environment.apiUrlWebAdmin + '/deleteMachineCuringType',
        mct,
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

  uploadFileExcel(file: FormData): Observable<ApiResponse<MachineCuringType>> {
    return this.http
      .post<ApiResponse<MachineCuringType>>(
        environment.apiUrlWebAdmin + '/saveMachineCuringTypeExcel',
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
