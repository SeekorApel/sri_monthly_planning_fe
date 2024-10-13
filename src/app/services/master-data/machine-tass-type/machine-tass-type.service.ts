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
  token: String = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyODkxMjkwOH0.A5HGKZbQj7z7pNfM2pmCwB7xz6vtoEwPKw3wRBwRpk88-F8Ubfp1j9fXPBt6Je4C1Zam02MrFZvcN1ZNkP5cLQ';
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }
  exportMachineTassTypeExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportMachineTassTypeExcel`, { responseType: 'blob' as 'json' });
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
