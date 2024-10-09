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
  token: String = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyODQ2NDk4OX0.9gpWMtzc_mTuD8izjRbdtAO54sdnRh60W7WaulIQRSflJamyqlQWK7zkBbtwWciF4h110ZWsO7HBtU_X2UROJA';
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
