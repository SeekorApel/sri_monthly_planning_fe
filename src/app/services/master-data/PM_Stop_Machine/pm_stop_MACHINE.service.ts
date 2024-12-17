import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PMStopMachine } from 'src/app/models/pm-stop-machine';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PMStopMachineService {
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }
  activatePMStopMachine(pmStopMachine: PMStopMachine): Observable<ApiResponse<PMStopMachine>> {
    return this.http.post<ApiResponse<PMStopMachine>>(environment.apiUrlWebAdmin + '/restoreStopMachine', pmStopMachine, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getPMStopMachineById(pmStopMachineID: number): Observable<ApiResponse<PMStopMachine>> {
    return this.http.get<ApiResponse<PMStopMachine>>(environment.apiUrlWebAdmin + '/getStopMachineById/' + pmStopMachineID, { headers: this.getHeaders() });
  }

  getAllPMStopMachine(): Observable<ApiResponse<PMStopMachine[]>> {
    return this.http.get<ApiResponse<PMStopMachine[]>>(environment.apiUrlWebAdmin + '/getAllStopMachines', { headers: this.getHeaders() });
  }

  //Method Update plant
  updatePMStopMachine(pmStopMachine: PMStopMachine): Observable<ApiResponse<PMStopMachine>> {
    return this.http
      .post<ApiResponse<PMStopMachine>>(
        environment.apiUrlWebAdmin + '/updateStopMachine',
        pmStopMachine,
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

  // Method Untuk Save
  SavePMStopMachine(pmStopMachine: PMStopMachine): Observable<ApiResponse<PMStopMachine>> {
    return this.http
      .post<ApiResponse<PMStopMachine>>(
        environment.apiUrlWebAdmin + '/saveStopMachine',
        pmStopMachine,
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

  deletePmStopMachine(pmStopMachine: PMStopMachine): Observable<ApiResponse<PMStopMachine>> {
    return this.http.post<ApiResponse<PMStopMachine>>(environment.apiUrlWebAdmin + '/deleteStopMachine', pmStopMachine, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<PMStopMachine>> {
    return this.http.post<ApiResponse<PMStopMachine>>(environment.apiUrlWebAdmin + '/saveStopMachinesExcel', file, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  exportExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportStopMachinesExcel`, { responseType: 'blob' as 'json' });
  }
  tamplateExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutStopMachinesExcel`, { responseType: 'blob' as 'json' });
  }
}
