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
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }
  activateMct(mct: MachineCuringType): Observable<ApiResponse<MachineCuringType>> {
    return this.http.post<ApiResponse<MachineCuringType>>(environment.apiUrlWebAdmin + '/restoreMachineCuringType', mct, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  exportMctExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportMachineCuringTypeexcel`, { responseType: 'blob' as 'json' });
  }
  tamplateMctExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutMachineCuringTypeexcel`, { responseType: 'blob' as 'json' });
  }

  getMctById(idMct: number): Observable<ApiResponse<MachineCuringType>> {
    return this.http.get<ApiResponse<MachineCuringType>>(environment.apiUrlWebAdmin + '/getMachineCuringTypeById/' + idMct, { headers: this.getHeaders() });
  }

  getAllMCT(): Observable<ApiResponse<MachineCuringType[]>> {
    return this.http.get<ApiResponse<MachineCuringType[]>>(environment.apiUrlWebAdmin + '/getAllMachineCuringType', { headers: this.getHeaders() });
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
    return this.http.post<ApiResponse<MachineCuringType>>(environment.apiUrlWebAdmin + '/deleteMachineCuringType', mct, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<MachineCuringType>> {
    return this.http.post<ApiResponse<MachineCuringType>>(environment.apiUrlWebAdmin + '/saveMachineCuringTypeExcel', file, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  exportProductExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportMachineCuringTypeexcel`, { responseType: 'blob' as 'json' });
  }
  activateProduct(MCT: MachineCuringType): Observable<ApiResponse<MachineCuringType>> {
    return this.http.post<ApiResponse<MachineCuringType>>(environment.apiUrlWebAdmin + '/restoreMachineCuringType', MCT, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
