import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/Product';
import { ApiResponse } from 'src/app/response/Response';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  //Isi tokenya
  token: String = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyODkxMjkwOH0.A5HGKZbQj7z7pNfM2pmCwB7xz6vtoEwPKw3wRBwRpk88-F8Ubfp1j9fXPBt6Je4C1Zam02MrFZvcN1ZNkP5cLQ';
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }

  getProductById(idProduct: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(environment.apiUrlWebAdmin + '/getProductById/' + idProduct, { headers: this.getHeaders() });
  }

  getAllProduct(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(environment.apiUrlWebAdmin + '/getAllProduct', { headers: this.getHeaders() });
  }

  exportProductExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportProductsExcel`, { responseType: 'blob' as 'json' });
  }
  activateProduct(product: Product): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(environment.apiUrlWebAdmin + '/restoreProduct', product, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  //Method Update plant
  updateProduct(product: Product): Observable<ApiResponse<Product>> {
    return this.http
      .post<ApiResponse<Product>>(
        environment.apiUrlWebAdmin + '/updateProduct',
        product,
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

  deleteProduct(plant: Product): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(environment.apiUrlWebAdmin + '/deleteProduct', plant, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  uploadFileExcel(file: FormData): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(environment.apiUrlWebAdmin + '/saveProductExcel', file, { headers: this.getHeaders() }).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
