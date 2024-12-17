import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductType } from 'src/app/models/ProductType';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductTypeService {
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
  }

  getProductTypeById(idProductType: number): Observable<ApiResponse<ProductType>> {
    return this.http.get<ApiResponse<ProductType>>(environment.apiUrlWebAdmin + '/getProductTypeById/' + idProductType, { headers: this.getHeaders() });
  }

  getAllProductType(): Observable<ApiResponse<ProductType[]>> {
    return this.http.get<ApiResponse<ProductType[]>>(environment.apiUrlWebAdmin + '/getAllProductType', { headers: this.getHeaders() });
  }

  //Method Update setting
  updateProductType(productType: ProductType): Observable<ApiResponse<ProductType>> {
    return this.http
      .post<ApiResponse<ProductType>>(
        environment.apiUrlWebAdmin + '/updateProductType',
        productType,
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

  deleteProductType(productType: ProductType): Observable<ApiResponse<ProductType>> {
    return this.http.post<ApiResponse<ProductType>>(environment.apiUrlWebAdmin + '/deleteProductType', productType, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  activateProductType(productType: ProductType): Observable<ApiResponse<ProductType>> {
    return this.http.post<ApiResponse<ProductType>>(environment.apiUrlWebAdmin + '/restoreProductType', productType, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<ProductType>> {
    return this.http.post<ApiResponse<ProductType>>(environment.apiUrlWebAdmin + '/saveProductTypeExcel', file, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  exportProductTypeExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportProductTypesExcel`, { responseType: 'blob' as 'json' });
  }
  templateProductTypeExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutProductTypesExcel`, { responseType: 'blob' as 'json' });
  }
}
