import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDeliverySchedule } from 'src/app/response/deliverySchedule';
import { ApiResponse } from 'src/app/response/ApiResponse';
import { tap } from 'rxjs/operators'; 
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryScheduleService {
  private baseUrl = 'http://localhost:8080';
  private apiUrl = 'http://localhost:8080'; 


  constructor(private http: HttpClient) {}

  getAllDeliverySchedule(): Observable<ApiResponse<IDeliverySchedule[]>> {
    return this.http.get<ApiResponse<IDeliverySchedule[]>>(`${this.baseUrl}/getAllDeliverySchedule`);
  }
   

signIn(userName: string, password: string): Observable<{ data: string }> {
    return this.http.post<{ data: string }>(`${this.baseUrl}/signin`, {
      userName,
      password
    }).pipe(
      tap(response => {
        // Store the token from the 'data' field in localStorage
        localStorage.setItem('token', response.data);
      })
    );
  }
  
  savePlantsExcelFile(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token
    if (!token) {
      console.error('Token is not available');
      // Return an observable that emits an error
      return throwError('Token is not available'); // Make sure to import throwError from 'rxjs'
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.post(`${this.baseUrl}/savePlantsExcel`, formData, { headers });
  }
}
