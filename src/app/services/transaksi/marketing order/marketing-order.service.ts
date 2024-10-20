import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ApiResponse } from 'src/app/response/Response';
import { environment } from 'src/environments/environment';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { HeaderMarketingOrder } from 'src/app/models/HeaderMarketingOrder';
import { DetailMarketingOrder } from 'src/app/models/DetailMarketingOrder';
import { WorkDay } from 'src/app/models/WorkDay';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MarketingOrderService {
  constructor(private http: HttpClient) { }

  getLastIdMo(): Observable<ApiResponse<string>> {
    return this.http.get<ApiResponse<string>>(environment.apiUrlWebAdmin + '/getLastIdMo');
  }

  getAllMarketingOrder(): Observable<ApiResponse<MarketingOrder[]>> {
    return this.http.get<ApiResponse<[]>>(environment.apiUrlWebAdmin + '/getAllMarketingOrder');
  }

  getDetailMarketingOrderById(idMo: String): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(environment.apiUrlWebAdmin + '/getMarketingOrderById/' + idMo);
  }

  saveTemp(mo: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(environment.apiUrlWebAdmin + '/saveMarketingOrderPPC', mo).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  saveMarketingOrder(mo: MarketingOrder): Observable<ApiResponse<MarketingOrder>> {
    return this.http.post<ApiResponse<MarketingOrder>>(environment.apiUrlWebAdmin + '/saveMarketingOrder', mo).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  saveHeaderMarketingOrder(hmo: HeaderMarketingOrder[]): Observable<ApiResponse<HeaderMarketingOrder>> {
    return this.http.post<ApiResponse<HeaderMarketingOrder>>(environment.apiUrlWebAdmin + '/saveHeaderMO', hmo).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getRowDetailMarketingOrder(totalHKTT1: number, totalHKTT2: number, totalHKTT3: number, totalHKTL1: number, totalHKTL2: number, totalHKTL3: number, productMerk: string): Observable<ApiResponse<DetailMarketingOrder[]>> {
    // Prepare query parameters
    let params = new HttpParams().set('totalHKTT1', totalHKTT1.toString()).set('totalHKTT2', totalHKTT2.toString()).set('totalHKTT3', totalHKTT3.toString()).set('totalHKTL1', totalHKTL1.toString()).set('totalHKTL2', totalHKTL2.toString()).set('totalHKTL3', totalHKTL3.toString()).set('productMerk', productMerk);
    return this.http.get<ApiResponse<DetailMarketingOrder[]>>(environment.apiUrlWebAdmin + '/getDetailMarketingOrders', { params: params });
  }

  saveDetailRowMarketingOrder(dmo: DetailMarketingOrder[]): Observable<ApiResponse<DetailMarketingOrder>> {
    return this.http.post<ApiResponse<DetailMarketingOrder>>(environment.apiUrlWebAdmin + '/saveDetailMO', dmo).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getDetailMoMarketing(idMo: String): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(environment.apiUrlWebAdmin + '/getDetailMoMarketing/' + idMo);
  }

  addMarketingOrderMarketing(dtmo: DetailMarketingOrder[]) {
    return this.http.post<ApiResponse<any>>(environment.apiUrlWebAdmin + '/updateDetailMOMarketing', dtmo).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  enableMarketingOrder(mo: MarketingOrder): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(environment.apiUrlWebAdmin + '/enableMarketingOrder', mo).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  disableMarketingOrder(mo: MarketingOrder): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(environment.apiUrlWebAdmin + '/disableMarketingOrder', mo).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
