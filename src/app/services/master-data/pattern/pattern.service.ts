import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pattern } from 'src/app/models/Pattern';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PatternService {
  //Isi tokenya
  token: String = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyODkxMjkwOH0.A5HGKZbQj7z7pNfM2pmCwB7xz6vtoEwPKw3wRBwRpk88-F8Ubfp1j9fXPBt6Je4C1Zam02MrFZvcN1ZNkP5cLQ';
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }

  getPatternById(idPattern: number): Observable<ApiResponse<Pattern>> {
    return this.http.get<ApiResponse<Pattern>>(environment.apiUrlWebAdmin + '/getPatternById/' + idPattern, { headers: this.getHeaders() });
  }

  getAllPattern(): Observable<ApiResponse<Pattern[]>> {
    return this.http.get<ApiResponse<Pattern[]>>(environment.apiUrlWebAdmin + '/getAllPattern', { headers: this.getHeaders() });
  }
  exportPatternExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportPatternExcel`, { responseType: 'blob' as 'json' });
  }
  activatePattern(pattern: Pattern): Observable<ApiResponse<Pattern>> {
    return this.http.post<ApiResponse<Pattern>>(environment.apiUrlWebAdmin + '/restorePattern', pattern, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  //Method Update plant
  updatePattern(pattern: Pattern): Observable<ApiResponse<Pattern>> {
    return this.http
      .post<ApiResponse<Pattern>>(
        environment.apiUrlWebAdmin + '/updatePattern',
        pattern,
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

  deletePattern(pattern: Pattern): Observable<ApiResponse<Pattern>> {
    return this.http.post<ApiResponse<Pattern>>(environment.apiUrlWebAdmin + '/deletePattern', pattern, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<Pattern>> {
    return this.http.post<ApiResponse<Pattern>>(environment.apiUrlWebAdmin + '/savePatternsExcel', file, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
