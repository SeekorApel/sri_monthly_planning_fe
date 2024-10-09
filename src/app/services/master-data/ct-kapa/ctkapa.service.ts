import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CtKapa } from 'src/app/models/ct-kapa';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CtKapaService {
  //Isi tokenya
  token: String =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyODA1Nzk5Mn0.aVJTkZq5E2y3TC0z1tDAbvsDln1IeWm36cN5IvtibIydnEw4wfEpsxaP5dY6nt1l2N0Wl42XgdCC-sRZ1sytmw';
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }

  getCtKapaById(idCtkapa: number): Observable<ApiResponse<CtKapa>> {
    return this.http.get<ApiResponse<CtKapa>>(
      environment.apiUrlWebAdmin + '/getCtKapaById/' + idCtkapa,
      { headers: this.getHeaders() }
    );
  }

  getAllCtKapa(): Observable<ApiResponse<CtKapa[]>> {
    return this.http.get<ApiResponse<CtKapa[]>>(
      environment.apiUrlWebAdmin + '/getAllCtKapa',
      { headers: this.getHeaders() }
    );
  }

  //Method Update plant
  updateCtKapa(ctkapa: CtKapa): Observable<ApiResponse<CtKapa>> {
    return this.http
      .post<ApiResponse<CtKapa>>(
        environment.apiUrlWebAdmin + '/updateCtKapa',
        ctkapa,
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

  deleteCtKapa(ctkapa: CtKapa): Observable<ApiResponse<CtKapa>> {
    return this.http
      .post<ApiResponse<CtKapa>>(
        environment.apiUrlWebAdmin + '/deleteCtKapa',
        ctkapa,
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

  uploadFileExcel(file: FormData): Observable<ApiResponse<CtKapa>> {
    return this.http
      .post<ApiResponse<CtKapa>>(
        environment.apiUrlWebAdmin + '/saveCtKapasExcel',
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