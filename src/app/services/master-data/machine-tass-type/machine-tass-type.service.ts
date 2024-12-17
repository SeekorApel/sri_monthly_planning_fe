import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MachineTassType } from 'src/app/models/machine-tass-type';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MachineTassTypeService {
  //Isi tokenya
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }
  exportMachineTassTypeExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportMachineTassTypeExcel`, { responseType: 'blob' as 'json' });
  }
  tamplateMachineTassTypeExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutMachineTassTypeExcel`, { responseType: 'blob' as 'json' });
  }
  activateMachineTassType(mtt: MachineTassType): Observable<ApiResponse<MachineTassType>> {
    return this.http.post<ApiResponse<MachineTassType>>(environment.apiUrlWebAdmin + '/restoreMachineTassType', mtt, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getMachineTassTypeById(idMachineTassType: number): Observable<ApiResponse<MachineTassType>> {
    return this.http.get<ApiResponse<MachineTassType>>(environment.apiUrlWebAdmin + '/getMachineTassTypeById/' + idMachineTassType, { headers: this.getHeaders() });
  }

  getAllMachineTassType(): Observable<ApiResponse<MachineTassType[]>> {
    return this.http.get<ApiResponse<MachineTassType[]>>(environment.apiUrlWebAdmin + '/getAllMachineTassType', { headers: this.getHeaders() });
  }

  //Method Update Machine Tass Type
  updateMachineTassType(machineTassType: MachineTassType): Observable<ApiResponse<MachineTassType>> {
    return this.http
      .post<ApiResponse<MachineTassType>>(
        environment.apiUrlWebAdmin + '/updateMachineTassType',
        machineTassType,
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

  deleteMachineTassType(machineTassType: MachineTassType): Observable<ApiResponse<MachineTassType>> {
    return this.http.post<ApiResponse<MachineTassType>>(environment.apiUrlWebAdmin + '/deleteMachineTassType', machineTassType, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<MachineTassType>> {
    return this.http.post<ApiResponse<MachineTassType>>(environment.apiUrlWebAdmin + '/saveMachineTassTypeExcel', file, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
