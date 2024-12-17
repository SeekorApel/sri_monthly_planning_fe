import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CT_Curing } from 'src/app/models/CT_Curing';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CTCuringService {

  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getCTCuringById(idCTCuring: number): Observable<ApiResponse<CT_Curing>> {
    return this.http.get<ApiResponse<CT_Curing>>(environment.apiUrlWebAdmin + '/getCTCuringById/' + idCTCuring, { headers: this.getHeaders() });
  }

  getAllCTCuring(): Observable<ApiResponse<CT_Curing[]>> {
    return this.http.get<ApiResponse<CT_Curing[]>>(environment.apiUrlWebAdmin + '/getAllCTCuring', { headers: this.getHeaders() });
  }

  //Method Update plant
  updateCTCuring(ctcuring: CT_Curing): Observable<ApiResponse<CT_Curing>> {
    console.log(ctcuring);
    return this.http
      .post<ApiResponse<CT_Curing>>(
        environment.apiUrlWebAdmin + '/updateCTCuring',
        ctcuring,
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

  deleteCTCuring(ctcuring: CT_Curing): Observable<ApiResponse<CT_Curing>> {
    return this.http.post<ApiResponse<CT_Curing>>(environment.apiUrlWebAdmin + '/deleteCTCuring', ctcuring, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  activateCTCuring(ct_curing: CT_Curing): Observable<ApiResponse<CT_Curing>> {
    return this.http.post<ApiResponse<CT_Curing>>(environment.apiUrlWebAdmin + '/restoreCTCuring', ct_curing, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<CT_Curing>> {
    return this.http.post<ApiResponse<CT_Curing>>(environment.apiUrlWebAdmin + '/saveCTCuringExcel', file, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  exportCTCuringsExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportCTCuringExcel`, { responseType: 'blob' as 'json' });
  }
  tamplateCTCuringsExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutCTCuringsExcel`, { responseType: 'blob' as 'json' });
  }
}
