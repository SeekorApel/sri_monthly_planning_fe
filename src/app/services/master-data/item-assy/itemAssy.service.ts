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
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyODMwODA4M30.y03EN8mmoDGrL7FzHc5W7QDPLuAoVmD21CNXz4OrBMyci5OSMFW8urH69vONuD8YW87911-NUE2BvkFrpFYWhA';

  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getItemAssyById(idItemAssy: number): Observable<ApiResponse<Item_Assy>> {
    return this.http.get<ApiResponse<Item_Assy>>(
      environment.apiUrlWebAdmin + '/getItemAssyById/' + idItemAssy,
      { headers: this.getHeaders() }
    );
  }

  getAllItemAssy(): Observable<ApiResponse<Item_Assy[]>> {
    return this.http.get<ApiResponse<Item_Assy[]>>(
      environment.apiUrlWebAdmin + '/getAllItemAssy',
      { headers: this.getHeaders() }
    );
  }

  //Method Update plant
  updateItemAssy(itemAssy: Item_Assy): Observable<ApiResponse<Item_Assy>> {
    console.log(itemAssy);
    return this.http
      .post<ApiResponse<Item_Assy>>(
        environment.apiUrlWebAdmin + '/updateItemAssy',
        itemAssy,
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

  deleteItemAssy(item_Assy: Item_Assy): Observable<ApiResponse<Item_Assy>> {
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
