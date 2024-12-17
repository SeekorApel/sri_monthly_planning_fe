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
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getItemAssyById(idItemAssy: number): Observable<ApiResponse<Item_Assy>> {
    return this.http.get<ApiResponse<Item_Assy>>(environment.apiUrlWebAdmin + '/getItemAssyById/' + idItemAssy, { headers: this.getHeaders() });
  }

  getAllItemAssy(): Observable<ApiResponse<Item_Assy[]>> {
    return this.http.get<ApiResponse<Item_Assy[]>>(environment.apiUrlWebAdmin + '/getAllItemAssy', { headers: this.getHeaders() });
  }

  //Method Update plant
  updateItemAssy(plant: Item_Assy): Observable<ApiResponse<Item_Assy>> {
    return this.http
      .post<ApiResponse<Item_Assy>>(
        environment.apiUrlWebAdmin + '/updateItemAssy',
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

  deleteItemAssy(itemAssy: Item_Assy): Observable<ApiResponse<Item_Assy>> {
    return this.http.post<ApiResponse<Item_Assy>>(environment.apiUrlWebAdmin + '/deleteItemAssy', itemAssy, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  activateItemAssy(itemAssy: Item_Assy): Observable<ApiResponse<Item_Assy>> {
    return this.http.post<ApiResponse<Item_Assy>>(environment.apiUrlWebAdmin + '/restoreItemAssy', itemAssy, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<Item_Assy>> {
    return this.http.post<ApiResponse<Item_Assy>>(environment.apiUrlWebAdmin + '/saveItemAssyExcel', file, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  exportItemAssyExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportItemAssyExcel`, { responseType: 'blob' as 'json' });
  }
  templateItemAssyExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutItemAssyExcel`, { responseType: 'blob' as 'json' });
  }

}
