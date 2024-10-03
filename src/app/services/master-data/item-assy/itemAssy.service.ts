import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item_Assy } from 'src/app/models/Item_Assy';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ItemAssyService {
  //Isi tokenya
  token: String =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyODA0MzU5OX0.pwxxKwvvqirwgloPRo26rf2lJEjjzBoQ-eREftyce41rassjEIcZo47weWFQuJc9PVhw-aF9ZlGp3YEfVvTYZA';

  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }

  getQuadrantById(idItemAssy: number): Observable<ApiResponse<Item_Assy>> {
    return this.http.get<ApiResponse<Item_Assy>>(
      environment.apiUrlWebAdmin + '/getItemAssyById/' + idItemAssy,
      { headers: this.getHeaders() }
    );
  }

  getAllQuadrant(): Observable<ApiResponse<Item_Assy[]>> {
    return this.http.get<ApiResponse<Item_Assy[]>>(
      environment.apiUrlWebAdmin + '/getAllItemAssy',
      { headers: this.getHeaders() }
    );
  }

  //Method Update plant
  updateQuadrant(quadrant: Item_Assy): Observable<ApiResponse<Item_Assy>> {
    return this.http
      .post<ApiResponse<Item_Assy>>(
        environment.apiUrlWebAdmin + '/updateItemAssy',
        quadrant,
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

  deleteQuadrant(item_Assy: Item_Assy): Observable<ApiResponse<Item_Assy>> {
    return this.http
      .post<ApiResponse<Item_Assy>>(
        environment.apiUrlWebAdmin + '/deleteItemAssy',
        item_Assy,
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

  uploadFileExcel(file: FormData): Observable<ApiResponse<Item_Assy>> {
    return this.http
      .post<ApiResponse<Item_Assy>>(
        environment.apiUrlWebAdmin + '/saveItemAssyExcel',
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
