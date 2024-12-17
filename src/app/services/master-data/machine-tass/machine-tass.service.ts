import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MachineTass } from 'src/app/models/machine-tass';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MachineTassService {
  //Isi tokenya
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getMachineTassByID(idMachineTass: number): Observable<ApiResponse<MachineTass>> {
    return this.http.get<ApiResponse<MachineTass>>(environment.apiUrlWebAdmin + '/getMachineTassById/' + idMachineTass, { headers: this.getHeaders() });
  }
  activateMachineTass(machineTass: MachineTass): Observable<ApiResponse<MachineTass>> {
    return this.http.post<ApiResponse<MachineTass>>(environment.apiUrlWebAdmin + '/restoreMachineTass', machineTass, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getAllMachineTass(): Observable<ApiResponse<MachineTass[]>> {
    return this.http.get<ApiResponse<MachineTass[]>>(environment.apiUrlWebAdmin + '/getAllMachineTass', { headers: this.getHeaders() });
  }

  //Method Update plant
  updateMachineTass(machinetass: MachineTass): Observable<ApiResponse<MachineTass>> {
    return this.http
      .post<ApiResponse<MachineTass>>(
        environment.apiUrlWebAdmin + '/updateMachineTass',
        machinetass,
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

  deleteMachineTass(machinetass: MachineTass): Observable<ApiResponse<MachineTass>> {
    return this.http.post<ApiResponse<MachineTass>>(environment.apiUrlWebAdmin + '/deleteMachineTass', machinetass, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<MachineTass>> {
    return this.http.post<ApiResponse<MachineTass>>(environment.apiUrlWebAdmin + '/saveMachineTassExcel', file).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  exportMachineTassExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportMachineTassExcel`, { responseType: 'blob' as 'json' });
  }
  tamplateMachineTassExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutMachineTassExcel`, { responseType: 'blob' as 'json' });
  }
}
