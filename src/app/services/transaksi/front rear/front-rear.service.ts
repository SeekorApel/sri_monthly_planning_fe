import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ApiResponse } from 'src/app/response/Response';
import { environment } from 'src/environments/environment';
import { FrontRear } from 'src/app/models/FrontRear';
import { TempMachineProduct } from 'src/app/models/TempMachineProduct';

import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FrontRearService {

  constructor(private http: HttpClient) { }

  getAllFrontRearItems(): Observable<ApiResponse<FrontRear[]>> {
    return this.http.get<ApiResponse<[]>>(environment.apiUrlWebAdmin + '/getAllFrontRearItems');
  }

  getFrontRearItemById(id_FRONT_REAR: number): Observable<ApiResponse<FrontRear[]>> {
    return this.http.get<ApiResponse<[]>>(environment.apiUrlWebAdmin + '/getFrontRearItemById/' + id_FRONT_REAR);
  }

  saveFrontRearItems(frontRear: FrontRear[]): Observable<ApiResponse<FrontRear[]>> {
    return this.http.post<ApiResponse<FrontRear[]>>(environment.apiUrlWebAdmin + '/saveFrontRearItems', frontRear).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  saveTempMachineProduct(temp: TempMachineProduct[]): Observable<ApiResponse<TempMachineProduct[]>> {
    return this.http.post<ApiResponse<TempMachineProduct[]>>(environment.apiUrlWebAdmin + '/saveMachineProduct', temp).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

}



