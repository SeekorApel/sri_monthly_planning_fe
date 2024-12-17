import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoutingMachine } from 'src/app/models/RoutingMachine';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getCTAssyById(idRouting: number): Observable<ApiResponse<RoutingMachine>> {
    return this.http.get<ApiResponse<RoutingMachine>>(environment.apiUrlWebAdmin + '/getCTAssyById/' + idRouting, { headers: this.getHeaders() });
  }

  getAllCTAssy(): Observable<ApiResponse<RoutingMachine[]>> {
    return this.http.get<ApiResponse<RoutingMachine[]>>(environment.apiUrlWebAdmin + '/getAllCTAssy', { headers: this.getHeaders() });
  }

  //Method Update setting
  updateCTAssy(setting: RoutingMachine): Observable<ApiResponse<RoutingMachine>> {
    return this.http
      .post<ApiResponse<RoutingMachine>>(
        environment.apiUrlWebAdmin + '/updateCTAssy',
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

  deleteCTAssy(routingMachine: RoutingMachine): Observable<ApiResponse<RoutingMachine>> {
    return this.http.post<ApiResponse<RoutingMachine>>(environment.apiUrlWebAdmin + '/deleteCTAssy', routingMachine, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  activateCTAssy(routingMachine: RoutingMachine): Observable<ApiResponse<RoutingMachine>> {
    return this.http.post<ApiResponse<RoutingMachine>>(environment.apiUrlWebAdmin + '/restoreCTAssy', routingMachine, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<RoutingMachine>> {
    return this.http.post<ApiResponse<RoutingMachine>>(environment.apiUrlWebAdmin + '/saveCTAssyExcel', file, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  exportRoutingMachineExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportCTAssyExcel`, { responseType: 'blob' as 'json' });
  }
  templateRoutingMachineExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutCTAssysExcel`, { responseType: 'blob' as 'json' });
  }
}
