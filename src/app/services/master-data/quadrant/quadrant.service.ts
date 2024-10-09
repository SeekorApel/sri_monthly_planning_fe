import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quadrant } from 'src/app/models/quadrant';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class QuadrantService {
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

  getQuadrantById(idQuadrant: number): Observable<ApiResponse<Quadrant>> {
    return this.http.get<ApiResponse<Quadrant>>(
      environment.apiUrlWebAdmin + '/getQuadrantById/' + idQuadrant,
      { headers: this.getHeaders() }
    );
  }

  getAllQuadrant(): Observable<ApiResponse<Quadrant[]>> {
    return this.http.get<ApiResponse<Quadrant[]>>(
      environment.apiUrlWebAdmin + '/getAllQuadrant',
      { headers: this.getHeaders() }
    );
  }

  //Method Update plant
  updateQuadrant(quadrant: Quadrant): Observable<ApiResponse<Quadrant>> {
    return this.http
      .post<ApiResponse<Quadrant>>(
        environment.apiUrlWebAdmin + '/updateQuadrant',
        quadrant,
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

  deleteQuadrant(quadrant: Quadrant): Observable<ApiResponse<Quadrant>> {
    return this.http
      .post<ApiResponse<Quadrant>>(
        environment.apiUrlWebAdmin + '/deleteQuadrant',
        quadrant,
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

  uploadFileExcel(file: FormData): Observable<ApiResponse<Quadrant>> {
    return this.http
      .post<ApiResponse<Quadrant>>(
        environment.apiUrlWebAdmin + '/saveQuadrantExcel',
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
