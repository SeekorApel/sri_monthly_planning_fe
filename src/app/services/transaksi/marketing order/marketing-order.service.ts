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

  getAvaiableMonth(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(environment.apiUrlWebAdmin + '/getMonthAvailable', data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getLastIdMo(): Observable<ApiResponse<string>> {
    return this.http.get<ApiResponse<string>>(environment.apiUrlWebAdmin + '/getLastIdMo');
  }

  getCapacity(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(environment.apiUrlWebAdmin + '/getCapacity');
  }

  //Get All Mo PPC
  getAllMarketingOrder(): Observable<ApiResponse<MarketingOrder[]>> {
    return this.http.get<ApiResponse<[]>>(environment.apiUrlWebAdmin + '/getAllMarketingOrderLatest');
  }

  // Print Summary Marketing Order
  downloadSummaryExcelMo(moMonth0: string, moMonth1: string, moMonth2: string) {
    return this.http.get(
      `${environment.apiUrlWebAdmin}/exportResumeMO/${moMonth0}/${moMonth1}/${moMonth2}`,
      { responseType: 'blob' }
    );
  }


  //Get All DistinctMarketingOrder
  getDistinctMarketingOrder(): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(environment.apiUrlWebAdmin + '/getDistinctMonthMo', {}).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  //Get All Mo Marketing By role
  getAllMarketingOrderMarketing(role: string): Observable<ApiResponse<MarketingOrder[]>> {
    let params = new HttpParams().set('role', role);
    return this.http.get<ApiResponse<[]>>(environment.apiUrlWebAdmin + '/getAllMarketingOrderMarketing', { params });
  }

  //get all data mo (MO, Header, Detail)
  getAllMoById(idMo: String): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(environment.apiUrlWebAdmin + '/getAllMoById/' + idMo);
  }

  saveMarketingOrderPPC(mo: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(environment.apiUrlWebAdmin + '/saveMarketingOrderPPC', mo).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  saveMarketingOrderMarketing(dtmo: DetailMarketingOrder[]): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(environment.apiUrlWebAdmin + '/saveMarketingOrderMarketing', dtmo).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  updateMarketingOrderMarketing(mo: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(environment.apiUrlWebAdmin + '/revisiMarketingOrderMarketing', mo).pipe(
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

  getWorkDay(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(environment.apiUrlWebAdmin + '/getWorkday', data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  arRejectDefect(mo: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(environment.apiUrlWebAdmin + '/arRejectDefectMo', mo).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  downloadExcelMo(idMo: string) {
    return this.http.get(environment.apiUrlWebAdmin + '/exportMOExcel/' + idMo, { responseType: 'blob' });
  }

  getAllDetailRevision(month0: string, month1: string, month2: string, type: string): Observable<ApiResponse<MarketingOrder[]>> {
    let params = new HttpParams().set('month0', month0).set('month1', month1).set('month2', month2).set('type', type);
    return this.http.get<ApiResponse<[]>>(environment.apiUrlWebAdmin + '/getAllDetailRevisionMo', { params });
  }

  updateLimitHeaderMO(hmo: HeaderMarketingOrder[]): Observable<ApiResponse<HeaderMarketingOrder>> {
    return this.http.post<ApiResponse<HeaderMarketingOrder>>(environment.apiUrlWebAdmin + '/updateHeaderMOLimit', hmo).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }


  //Not used Alll
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

  getDetailMarketingOrder(data: any): Observable<ApiResponse<DetailMarketingOrder[]>> {
    return this.http.post<ApiResponse<DetailMarketingOrder[]>>(environment.apiUrlWebAdmin + '/getDetailMarketingOrders', data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getAllMoOnlyMonth(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<[]>>(environment.apiUrlWebAdmin + '/getAllMoOnlyMonth');
  }

  getAllTypeMoByMonth(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(environment.apiUrlWebAdmin + '/getAllTypeMarketingOrder', data).pipe(
      map((response) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  //Not used Alll ke bawah
  // saveMarketingOrder(mo: MarketingOrder): Observable<ApiResponse<MarketingOrder>> {
  //   return this.http.post<ApiResponse<MarketingOrder>>(environment.apiUrlWebAdmin + '/saveMarketingOrder', mo).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //     catchError((err) => {
  //       return throwError(err);
  //     })
  //   );
  // }

  // saveHeaderMarketingOrder(hmo: HeaderMarketingOrder[]): Observable<ApiResponse<HeaderMarketingOrder>> {
  //   return this.http.post<ApiResponse<HeaderMarketingOrder>>(environment.apiUrlWebAdmin + '/saveHeaderMO', hmo).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //     catchError((err) => {
  //       return throwError(err);
  //     })
  //   );
  // }

  // saveDetailRowMarketingOrder(dmo: DetailMarketingOrder[]): Observable<ApiResponse<DetailMarketingOrder>> {
  //   return this.http.post<ApiResponse<DetailMarketingOrder>>(environment.apiUrlWebAdmin + '/saveDetailMO', dmo).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //     catchError((err) => {
  //       return throwError(err);
  //     })
  //   );
  // }

  // getDetailMoMarketing(idMo: String): Observable<ApiResponse<any>> {
  //   return this.http.get<ApiResponse<any>>(environment.apiUrlWebAdmin + '/getDetailMoMarketing/' + idMo);
  // }

  // saveMarketingOrderMarketing(dtmo: DetailMarketingOrder[]) {
  //   return this.http.post<ApiResponse<any>>(environment.apiUrlWebAdmin + '/saveMarketingOrderMarketing', dtmo).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //     catchError((err) => {
  //       return throwError(err);
  //     })
  //   );
  // }
}
