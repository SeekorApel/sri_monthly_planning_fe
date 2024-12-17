import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Pattern } from 'src/app/models/Pattern';
import { ApiResponse } from 'src/app/response/Response';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PatternService {
  constructor(private http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
      // Do not set Content-Type here; let the browser handle it
    });
  }

  getPatternById(idPattern: number): Observable<ApiResponse<Pattern>> {
    return this.http.get<ApiResponse<Pattern>>(environment.apiUrlWebAdmin + '/getPatternById/' + idPattern);
  }

  getAllPattern(): Observable<ApiResponse<Pattern[]>> {
    return this.http.get<ApiResponse<Pattern[]>>(environment.apiUrlWebAdmin + '/getAllPattern');
  }

  activatePattern(pattern: Pattern): Observable<ApiResponse<Pattern>> {
    return this.http.post<ApiResponse<Pattern>>(environment.apiUrlWebAdmin + '/restorePattern', pattern).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  updatePattern(pattern: Pattern): Observable<ApiResponse<Pattern>> {
    return this.http.post<ApiResponse<Pattern>>(environment.apiUrlWebAdmin + '/updatePattern', pattern).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  deletePattern(pattern: Pattern): Observable<ApiResponse<Pattern>> {
    return this.http.post<ApiResponse<Pattern>>(environment.apiUrlWebAdmin + '/deletePattern', pattern).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }


  uploadFileExcel(file: FormData): Observable<ApiResponse<Pattern>> {
    return this.http.post<ApiResponse<Pattern>>(environment.apiUrlWebAdmin + '/savePatternsExcel', file).pipe(
      map((response) => {
        console.log(response);
        return response;
      }),
      catchError((err) => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  exportExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportPatternExcel`, { responseType: 'blob' as 'json' });
  }
  tamplateExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutPatternExcel`, { responseType: 'blob' as 'json' });
  }
}
