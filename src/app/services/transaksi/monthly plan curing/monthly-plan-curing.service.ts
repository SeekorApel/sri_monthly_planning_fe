import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ApiResponse } from 'src/app/response/Response';
import { environment } from 'src/environments/environment';
import { MonthlyPlanning } from 'src/app/models/MonthlyPlanning';
import { DetailShiftMonthlyPlanCuring } from 'src/app/models/DetailShiftMonthlyPlanCuring';


import { WorkDay } from 'src/app/models/WorkDay';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MonthlyPlanCuringService {

  constructor(private http: HttpClient) { }

  //get all data mp 
  getAllMonthlyPlanning(): Observable<ApiResponse<MonthlyPlanning[]>> {
    return this.http.get<ApiResponse<[]>>(environment.apiUrlWebAdmin + '/getAllMonthlyPlanning');
  }

  getDetailMonthlyPlan(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${environment.apiUrlWebAdmin}/getDetailMonthlyPlan`);
  }

  getDetailMonthlyPlanById(docNum: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${environment.apiUrlWebAdmin}/getDetailMonthlyPlanById/` + docNum,
    );
  }

  generateDetailMp(
    month: number,
    year: number,
    limitChange: number,
    minA: number,
    maxA: number,
    minB: number,
    maxB: number,
    minC: number,
    maxC: number,
    minD: number,
    maxD: number
  ): Observable<ApiResponse<any>> {
    const params = new HttpParams()
      .set('month', month.toString())  // Convert month to string
      .set('year', year.toString())    // Convert year to string
      .set('limitChange', limitChange != null? limitChange.toString(): 0)
      .set('minA', minA != null ? minA.toString() : 0)  // If minA is not null, convert to string, otherwise set to null
      .set('maxA', maxA != null ? maxA.toString() : 0)
      .set('minB', minB != null ? minB.toString() : 0)
      .set('maxB', maxB != null ? maxB.toString() : 0)
      .set('minC', minC != null ? minC.toString() : 0)
      .set('maxC', maxC != null ? maxC.toString() : 0)
      .set('minD', minD != null ? minD.toString() : 0)
      .set('maxD', maxD != null ? maxD.toString() : 0);


    return this.http.get<ApiResponse<any>>(
      `${environment.apiUrlWebAdmin}/generateDetailMp`,
      { params }
    );
  }


exportExcelMP(
    month: number,
    year: number,
    limitChange: number,
    minA: number,
    maxA: number,
    minB: number,
    maxB: number,
    minC: number,
    maxC: number,
    minD: number,
    maxD: number
  ) {
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    this.monthNow = month;
    this.yearNow = year;

    const monthDescription = monthNames[this.monthNow - 1]; 

    const filename = `PREPARE PROD ${monthDescription.toUpperCase()} ${this.yearNow}.xlsx`;

    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while we Download Excel the monthly plan. This might take a while.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); 
      },
    });

    this.mpService
      .ExportExcelMP(
        month,
        year,
        limitChange,
        minA,
        maxA,
        minB,
        maxB,
        minC,
        maxC,
        minD,
        maxD
      )
      .subscribe(
        (response) => {
          Swal.close(); 

          saveAs(response, filename);

          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: `Monthly plan Excel file (${filename}) has been downloaded successfully.`,
            confirmButtonText: 'OK',
          });
        },
        (error) => {
          Swal.close(); 

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to download monthly plan Excel file: ' + error.message,
            confirmButtonText: 'OK',
          });
        }
      );
  }
  //get detail shift
  getDetailShiftMonthlyPlan(detailDailyId: number, actualDate: string): Observable<ApiResponse<DetailShiftMonthlyPlanCuring[]>> {
    const params = new HttpParams()
      .set('detailDailyId', detailDailyId.toString())
      .set('actualDate', actualDate); // Pastikan format sesuai dengan backend (misal: "dd-MM-yyyy")

    return this.http.get<ApiResponse<DetailShiftMonthlyPlanCuring[]>>(
      `${environment.apiUrlWebAdmin}/getDetailShiftMonthlyPlan`,
      { params }
    );
  }

  getAllMachineByItemCuring(mesin: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${environment.apiUrlWebAdmin}/getMachineByItemCuring?itemCuring=${mesin}`);
  }


}
