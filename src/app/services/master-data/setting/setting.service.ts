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
  //Isi tokenya
  token: String =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyODMwODA4M30.y03EN8mmoDGrL7FzHc5W7QDPLuAoVmD21CNXz4OrBMyci5OSMFW8urH69vONuD8YW87911-NUE2BvkFrpFYWhA';

  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getSettingById(idSetting: number): Observable<ApiResponse<Setting>> {
    return this.http.get<ApiResponse<Setting>>(
      environment.apiUrlWebAdmin + '/getSettingById/' + idSetting,
      { headers: this.getHeaders() }
    );
  }

  getAllSetting(): Observable<ApiResponse<Setting[]>> {
    return this.http.get<ApiResponse<Setting[]>>(
      environment.apiUrlWebAdmin + '/getAllSettings',
      { headers: this.getHeaders() }
    );
  }

  //Method Update plant
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
    return this.http
      .post<ApiResponse<Setting>>(
        environment.apiUrlWebAdmin + '/deleteSetting',
        setting,
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

  uploadFileExcel(file: FormData): Observable<ApiResponse<Setting>> {
    return this.http
      .post<ApiResponse<Setting>>(
        environment.apiUrlWebAdmin + '/saveSettingsExcel',
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
}
