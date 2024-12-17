import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Setting } from 'src/app/models/Setting';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  constructor(private http: HttpClient) { }

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getSettingById(idSetting: number): Observable<ApiResponse<Setting>> {
    return this.http.get<ApiResponse<Setting>>(environment.apiUrlWebAdmin + '/getSettingById/' + idSetting, { headers: this.getHeaders() });
  }

  getAllSetting(): Observable<ApiResponse<Setting[]>> {
    return this.http.get<ApiResponse<Setting[]>>(environment.apiUrlWebAdmin + '/getAllSettings', { headers: this.getHeaders() });
  }

  //Method Update setting
  updateSetting(setting: Setting): Observable<ApiResponse<Setting>> {
    return this.http
      .post<ApiResponse<Setting>>(
        environment.apiUrlWebAdmin + '/updateSetting',
        setting,
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

  deleteSetting(setting: Setting): Observable<ApiResponse<Setting>> {
    return this.http.post<ApiResponse<Setting>>(environment.apiUrlWebAdmin + '/deleteSetting', setting, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  activateSetting(setting: Setting): Observable<ApiResponse<Setting>> {
    return this.http.post<ApiResponse<Setting>>(environment.apiUrlWebAdmin + '/restoreSetting', setting, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<Setting>> {
    return this.http.post<ApiResponse<Setting>>(environment.apiUrlWebAdmin + '/saveSettingsExcel', file, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  exportSettingsExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportSettingsExcel`, { responseType: 'blob' as 'json' });
  }
  templateSettingsExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutSettingsExcel`, { responseType: 'blob' as 'json' });
  }
}
