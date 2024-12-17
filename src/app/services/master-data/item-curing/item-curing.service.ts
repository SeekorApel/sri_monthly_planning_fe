import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item_Curing } from 'src/app/models/Item_Curing';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ItemCuringService {
  //Isi tokenya
  token: String =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyODA0MjAzNH0.j_HYWCIoDutMP1jk2VbfOJOlbMpUEKkpaP_S4uPOu4Ajds66XOpxxA7t0nFi7zgG7YgC0KVmKPhv2wpb4XQLPA';

  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getItemCuringById(idItemCuring: string): Observable<ApiResponse<Item_Curing>> {
    return this.http.get<ApiResponse<Item_Curing>>(
      environment.apiUrlWebAdmin + '/getItemCuringById/' + idItemCuring,
      { headers: this.getHeaders() }
    );
  }

  getAllItemCuring(): Observable<ApiResponse<Item_Curing[]>> {
    return this.http.get<ApiResponse<Item_Curing[]>>(
      environment.apiUrlWebAdmin + '/getAllItemCuring',
      { headers: this.getHeaders() }
    );
  }

  //Method Update plant
  updateItemCuring(itemcuring: Item_Curing): Observable<ApiResponse<Item_Curing>> {
    console.log(itemcuring);
    return this.http
      .post<ApiResponse<Item_Curing>>(
        environment.apiUrlWebAdmin + '/updateItemCuring',
        itemcuring,
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

  deleteItemCuring(itemcuring: Item_Curing): Observable<ApiResponse<Item_Curing>> {
    return this.http
      .post<ApiResponse<Item_Curing>>(
        environment.apiUrlWebAdmin + '/deleteItemCuring',
        itemcuring,
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
  activateItemCuring(item_curing: Item_Curing): Observable<ApiResponse<Item_Curing>> {
    return this.http.post<ApiResponse<Item_Curing>>(environment.apiUrlWebAdmin + '/restoreItemCuring', item_curing, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  uploadFileExcel(file: FormData): Observable<ApiResponse<Item_Curing>> {
    return this.http
      .post<ApiResponse<Item_Curing>>(
        environment.apiUrlWebAdmin + '/saveItemCuringExcel',
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
  exportItemCuringsExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportItemCuringExcel`, { responseType: 'blob' as 'json' });
  }
  templateItemCuringsExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutItemCuringExcel`, { responseType: 'blob' as 'json' });
  }
}
