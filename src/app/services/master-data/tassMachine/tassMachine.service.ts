import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MachineTass } from 'src/app/models/tass-machine';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MachineTassService {
  //Isi tokenya
  token: String =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyODA1MzEwMn0.TvtFLNBN9DKENLYA3wSw_BfTWES-lA0rbNKTveGiIB43vyKDSa6Tktxwrm0a6xJdb6CoPYhku4f5z-TODQGAwA';  
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }

  getMachineTassByID(idMachineTass: number): Observable<ApiResponse<MachineTass>> {
    return this.http.get<ApiResponse<MachineTass>>(
      environment.apiUrlWebAdmin + '/getMachineTassById/' + idMachineTass,
      { headers: this.getHeaders() }
    );
  }

  getAllMachineTass(): Observable<ApiResponse<MachineTass[]>> {
    return this.http.get<ApiResponse<MachineTass[]>>(
      environment.apiUrlWebAdmin + '/getAllMachineTass',
      { headers: this.getHeaders() }
    );
  }

  //Method Update plant
  updateMachineTass(machinetass: MachineTass): Observable<ApiResponse<MachineTass>> {
    return this.http
      .post<ApiResponse<MachineTass>>(
        environment.apiUrlWebAdmin + '/updateMachineTass',
        machinetass,
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

  deleteMachineTass(machinetass: MachineTass): Observable<ApiResponse<MachineTass>> {
    return this.http
      .post<ApiResponse<MachineTass>>(
        environment.apiUrlWebAdmin + '/deleteMachineTass',
        machinetass,
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

  uploadFileExcel(file: FormData): Observable<ApiResponse<MachineTass>> {
    return this.http
      .post<ApiResponse<MachineTass>>(
        environment.apiUrlWebAdmin + '/saveMachineTassExcel',
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
