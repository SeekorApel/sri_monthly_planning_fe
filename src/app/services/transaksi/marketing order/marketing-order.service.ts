import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ApiResponse } from 'src/app/response/Response';
import { environment } from 'src/environments/environment';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MarketingOrderService {
  //Isi tokenya
  token: String = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXJlbCIsImV4cCI6MTcyODM0OTg1NX0.wAf4xGwS_kJRxyx8Q5qMlH6tqtJRxYCAEI9qBtWOaJfOKxLJ7PHDFryxnBrXRDRem0-kMT7gT8efCeV2tRpxnA';

  constructor(private http: HttpClient) {}

  // Method untuk menambahkan header Authorization dengan token
  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }

  // generateExcelWithCheckbox() {
  //   const workbook = new ExcelJS.Workbook(); // Menggunakan ExcelJS.Workbook
  //   const worksheet = workbook.addWorksheet('Data');

  //   // Tambahkan header di kolom
  //   worksheet.columns = [
  //     { header: 'No', key: 'no', width: 10 },
  //     { header: 'Item', key: 'item', width: 30 },
  //     { header: 'Check', key: 'check', width: 10 }, // Kolom untuk checkbox
  //   ];

  //   // Menambahkan data ke worksheet
  //   const data = [
  //     { no: 1, item: 'Item 1', check: true },
  //     { no: 2, item: 'Item 2', check: false },
  //   ];

  //   data.forEach((row) => {
  //     worksheet.addRow(row);
  //   });

  //   // Menambahkan checkbox pada kolom tertentu
  //   worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
  //     if (rowNumber > 1) {
  //       // Skip header row
  //       const checkBoxCell = row.getCell(3); // Kolom 3 untuk checkbox
  //       checkBoxCell.value = row.values[3] ? true : false;
  //     }
  //   });

  //   // Menyimpan file excel
  //   workbook.xlsx.writeBuffer().then((data: any) => {
  //     const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //     fs.saveAs(blob, 'Template_with_Checkbox.xlsx');
  //   });
  // }

  getAllMarketingOrder(): Observable<ApiResponse<MarketingOrder[]>> {
    return this.http.get<ApiResponse<[]>>(environment.apiUrlWebAdmin + '/getAllMarketingOrders', { headers: this.getHeaders() });
  }

  saveMarketingOrder(mo: MarketingOrder): Observable<ApiResponse<MarketingOrder>> {
    console.log(mo);
    return this.http
      .post<ApiResponse<MarketingOrder>>(
        environment.apiUrlWebAdmin + '/saveMarketingOrder',
        mo,
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
}
