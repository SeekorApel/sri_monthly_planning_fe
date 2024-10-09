import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plant } from 'src/app/models/Plant';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  //Isi tokenya
  token: String = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyODM4NTExNH0.EcIqiAPq5tX2MgDMcwD5rDNN-85fobiCN6S57r3rOBO64TK4JKUwzlF1zpLTqj4ul0KsBdnHqpDh4zOcAzoT8w';
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }

  getPlantById(idPlant: number): Observable<ApiResponse<Plant>> {
    return this.http.get<ApiResponse<Plant>>(environment.apiUrlWebAdmin + '/getPlantById/' + idPlant, { headers: this.getHeaders() });
  }

  getAllPlant(): Observable<ApiResponse<Plant[]>> {
    return this.http.get<ApiResponse<Plant[]>>(environment.apiUrlWebAdmin + '/getAllPlant', { headers: this.getHeaders() });
  }

  //Method Update plant
  updatePlant(plant: Plant): Observable<ApiResponse<Plant>> {
    return this.http
      .post<ApiResponse<Plant>>(
        environment.apiUrlWebAdmin + '/updatePlant',
        plant,
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

  deletePlant(plant: Plant): Observable<ApiResponse<Plant>> {
    return this.http.post<ApiResponse<Plant>>(environment.apiUrlWebAdmin + '/deletePlant', plant, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<Plant>> {
    return this.http.post<ApiResponse<Plant>>(environment.apiUrlWebAdmin + '/savePlantsExcel', file, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
