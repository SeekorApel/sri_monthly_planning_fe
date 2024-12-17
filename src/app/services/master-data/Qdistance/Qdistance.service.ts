import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QDistance } from 'src/app/models/QDistance';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class QDistanceService {
  //Isi tokenya

  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getQuadrantDistanceById(idPlant: number): Observable<ApiResponse<QDistance>> {
    return this.http.get<ApiResponse<QDistance>>(
      environment.apiUrlWebAdmin + '/getQuadrantDistanceById/' + idPlant,
      { headers: this.getHeaders() }
    );
  }

  getAllQuadrantDistance(): Observable<ApiResponse<QDistance[]>> {
    return this.http.get<ApiResponse<QDistance[]>>(
      environment.apiUrlWebAdmin + '/getAllQuadrantDistance',
      { headers: this.getHeaders() }
    );
  }

  //Method Update plant
  updateQuadrantDistance(plant: QDistance): Observable<ApiResponse<QDistance>> {
    return this.http
      .post<ApiResponse<QDistance>>(
        environment.apiUrlWebAdmin + '/updateQuadrantDistance',
        plant,
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

  deleteQuadrantDistance(plant: QDistance): Observable<ApiResponse<QDistance>> {
    return this.http
      .post<ApiResponse<QDistance>>(
        environment.apiUrlWebAdmin + '/deleteQuadrantDistance',
        plant,
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

  uploadFileExcel(file: FormData): Observable<ApiResponse<QDistance>> {
    return this.http
      .post<ApiResponse<QDistance>>(
        environment.apiUrlWebAdmin + '/saveQuadrantDistancesExcel',
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
  activateQuadrantDistance(qdistance: QDistance): Observable<ApiResponse<QDistance>> {
    return this.http.post<ApiResponse<QDistance>>(environment.apiUrlWebAdmin + '/restoreQuadrantDistance', qdistance, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  exportQuadrantDistancesExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportQuadrantDistancesExcel`, { responseType: 'blob' as 'json' });
  }
  tamplateQuadrantDistancesExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutQuadrantDistancesExcel`, { responseType: 'blob' as 'json' });
  }
}
