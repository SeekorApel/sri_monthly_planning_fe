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
  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
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

  getProductById(idProduct: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(environment.apiUrlWebAdmin + '/getProductById/' + idProduct, { headers: this.getHeaders() });
  }

  getAllProduct(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(environment.apiUrlWebAdmin + '/getAllProduct', { headers: this.getHeaders() });
  }

  //Method Update product
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

  deleteProduct(product: Product): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(environment.apiUrlWebAdmin + '/deleteProduct', product, { headers: this.getHeaders() }).pipe(
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

  exportExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/exportProductsExcel`, { responseType: 'blob' as 'json' });
  }
  tamplateExcel(): Observable<Blob> {
    return this.http.get<Blob>(`${environment.apiUrlWebAdmin}/layoutProductsExcel`, { responseType: 'blob' as 'json' });
  }
}
