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
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getPatternById(idPattern: number): Observable<ApiResponse<Pattern>> {
    return this.http.get<ApiResponse<Pattern>>(environment.apiUrlWebAdmin + '/getPatternById/' + idPattern, { headers: this.getHeaders() });
  }

  getAllPattern(): Observable<ApiResponse<Pattern[]>> {
    return this.http.get<ApiResponse<Pattern[]>>(environment.apiUrlWebAdmin + '/getAllPattern', { headers: this.getHeaders() });
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
  exportExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportPatternExcel`, { responseType: 'blob' as 'json' });
  }
}
