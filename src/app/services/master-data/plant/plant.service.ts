import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Plant } from 'src/app/models/Plant';
import { ApiResponse } from 'src/app/response/Response';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  constructor(private http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getPlantById(idPlant: number): Observable<ApiResponse<Plant>> {
    return this.http.get<ApiResponse<Plant>>(environment.apiUrlWebAdmin + '/getPlantById/' + idPlant);
  }

  getAllPlant(): Observable<ApiResponse<Plant[]>> {
    return this.http.get<ApiResponse<Plant[]>>(environment.apiUrlWebAdmin + '/getAllPlant');
  }

  activatePlant(Plant: Plant): Observable<ApiResponse<Plant>> {
    return this.http.post<ApiResponse<Plant>>(environment.apiUrlWebAdmin + '/restorePlant', Plant).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  updatePlant(plant: Plant): Observable<ApiResponse<Plant>> {
    return this.http.post<ApiResponse<Plant>>(environment.apiUrlWebAdmin + '/updatePlant', plant).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  deletePlant(plant: Plant): Observable<ApiResponse<Plant>> {
    return this.http.post<ApiResponse<Plant>>(environment.apiUrlWebAdmin + '/deletePlant', plant).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<Plant>> {
    return this.http.post<ApiResponse<Plant>>(environment.apiUrlWebAdmin + '/savePlantsExcel', file).pipe(
      map((response) => {
        console.log(response);
        return response;
      }),
      catchError((err) => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  exportExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportPlantsExcel`, { responseType: 'blob' as 'json' });
  }

  tamplateExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutPlantsExcel`, { responseType: 'blob' as 'json' });
  }
}
