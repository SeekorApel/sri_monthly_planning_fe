import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITass_Machine_Type } from 'src/app/models/Tass_Machine_Type';
import { ApiResponse } from 'src/app/response/ApiResponse';
import { tap } from 'rxjs/operators'; 
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TassMachineTypeService {
  private baseUrl = 'http://localhost:8080';
  private apiUrl = 'http://localhost:8080'; 


  constructor(private http: HttpClient) {}

  getAllTassMachineType(): Observable<ApiResponse<ITass_Machine_Type[]>> {
    return this.http.get<ApiResponse<ITass_Machine_Type[]>>(`${this.baseUrl}/getAllTassMachineType`);
  }
  
//   getPlantById(id: number): Observable<DtoResponse> {
//     return this.http.get<DtoResponse>(`${this.baseUrl}/getObatById/${id}`);
//   }

//   savePlant(obat: IObat): Observable<DtoResponse> {
//     return this.http.post<DtoResponse>(`${this.baseUrl}/saveObat`, obat);
//   }

//   updatePlant(id: number, data: IObat): Observable<any> {
//     const updatedData = { ...data, idObat: id }; // Menambahkan idObat ke dalam body
//     return this.http.post<any>(`${this.apiUrl}/updateObat`, updatedData);
//   }
   

//   deletePlant(obat: { idObat: number }): Observable<ApiResponse<any>> {
//     const url = `${this.apiUrl}/deleteObats`;
//     return this.http.post<ApiResponse<any>>(url, obat);
//   }  

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
