import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { DetailDailyMonthlyPlanCuring } from 'src/app/models/DetailDailyMonthlPlanCuring';
import { DetailMonthlyPlanningCuring } from 'src/app/models/DetailMonthlyPlanningCuring';
import { DetailShiftMonthlyPlanCuring } from 'src/app/models/DetailShiftMonthlyPlanCuring';
import { MonthlyDailyPlan } from 'src/app/models/DetailMonthlyPlan';
import { MonthlyPlanning } from 'src/app/models/MonthlyPlanning';

import { ApiResponse } from 'src/app/response/Response';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import { MonthlyPlanCuringService } from 'src/app/services/transaksi/monthly plan curing/monthly-plan-curing.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { ParsingDateService } from 'src/app/utils/parsing-date/parsing-date.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
declare var $: any;

@Component({
  selector: 'app-view-detail-monthly-planning',
  templateUrl: './view-detail-monthly-planning.component.html',
  styleUrls: ['./view-detail-monthly-planning.component.scss']
})
export class ViewDetailMonthlyPlanningComponent implements OnInit {

formHeaderMp: FormGroup;
docNum: string | null = null;
isReadOnly: boolean = true;

// Variable declaration
selectedDetail: { idDetailDaily: number; countProduction: number } | null = null;
dateHeadersTass: any[] = [];
dateHeadersCurring: any[] = [];
monthlyPlanningTass: any[] = [];
dailyMonthlyPlanningTass: any[] = [];
shiftMonthlyPlanningTass: any[] = [];
monthlyPlanningsCurring: any[] = [];
showMonthlyPlanning: boolean = false;

monthlyPlanning: MonthlyPlanning | null = null;
detailMonthlyPlanCuring: DetailMonthlyPlanningCuring[] = [];
dailyMonthlyPlanningCuring: DetailDailyMonthlyPlanCuring[] = [];
shiftMonthlyPlanningCuring: DetailShiftMonthlyPlanCuring[] = [];
monthlyDailyPlan: MonthlyDailyPlan[] = [];
monly: MonthlyDailyPlan[] = [];
description: any[] = [];

marketingOrders: MarketingOrder[] = [];
searchText: string = '';
allData: any;
workCenterText: string = '';
kapaShift1: number = 0;
kapaShift2: number = 0;
kapaShift3: number = 0;
totalKapa: number = 0;
shift: number = 0;
wct: string = '';
changeDate: string = '';

// workCenterText: any[] = [];
// kapaShift1: number = 0;
// kapaShift2: number = 0;
// kapaShift3: number = 0;
// totalKapa: number = 0;
// shift: any[] = [];
// wct: any[] = [];
// changeDate: any[] = [];

// Pagination
pageOfItems: Array<any>;
pageSize: number = 5;
totalPages: number = 5;
displayedColumns: string[] = ['select','no', 'moId', 'type', 'dateValid', 'revisionPpc', 'revisionMarketing', 'month0', 'month1', 'month2', 'action'];
displayedColumnsMP: string[] = ['no', 'partNumber', 'dateDailyMp', 'totalPlan'];
childHeadersColumnsMP: string[] = ['workDay'];

dataSourceMO: MatTableDataSource<MarketingOrder>;
dataSourceMP: MatTableDataSource<any>;

@ViewChild(MatSort) sort: MatSort;
@ViewChild(MatPaginator) paginator: MatPaginator;

constructor(private router: Router, private moService: MarketingOrderService, private mpService: MonthlyPlanCuringService, private activeRoute: ActivatedRoute, private parseDateService: ParsingDateService, private fb: FormBuilder) {
  this.formHeaderMp = this.fb.group({
    mpCuringId: [null, []],
    docNumber: [null, []],
    effectiveDate: [null, []],
    revision: [null, []],
    workDay: [null, []],
    overtime: [null, []],
    monthOf: [null, []],
    kadept: [null, []],
    kassiePp: [null, []],
    section: [null, []],
    issueDate: [null, []],
  });
 }

ngOnInit(): void {
  this.docNum = this.activeRoute.snapshot.paramMap.get('docNum');
  console.log('Doc Number:', this.docNum);
  this.fillBodyTableMp(this.docNum);
  this.showMonthlyPlanning = true;
}

parseDate(dateParse: string): string {
  return this.parseDateService.convertDateToString(dateParse);
}

onSearchChange(): void {
  this.dataSourceMO.filter = this.searchText.trim().toLowerCase();
}

resetSearch(): void {
  this.searchText = '';
  this.dataSourceMO.filter = '';
}


formatDecimal(value: number | null | undefined): string {
  if (value === undefined || value === null || value === 0) {
    return '0';
  }
  return value.toFixed(2).replace('.', ','); 
}


formatSeparator(value: number | null | undefined): string {
  return value != null ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0';
}

formatDateToString(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

viewDetail(): void {
  $('#changeMould').modal('show');
}

getAllMarketingOrder(): void {
  this.moService.getAllMarketingOrder().subscribe(
    (response: ApiResponse<MarketingOrder[]>) => {
      this.marketingOrders = response.data;
      if (this.marketingOrders.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'No Data',
          text: 'No marketing orders found.',
          timer: null,
          showConfirmButton: true,
          confirmButtonText: 'Ok',
        });
      } else {
        this.marketingOrders = response.data;
        this.dataSourceMO = new MatTableDataSource(this.marketingOrders);
        this.dataSourceMO.sort = this.sort;
        this.dataSourceMO.paginator = this.paginator;
      }
    },
    (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load marketing orders: ' + error.message,
        timer: 3000,
        showConfirmButton: false,
      });
    }
  );
}

// navigateToDetailMo(m0: any, m1: any, m3: any, typeProduct: string) {
//   const formatDate = (date: any): string => {
//     const dateObj = date instanceof Date ? date : new Date(date);

//     if (isNaN(dateObj.getTime())) {
//       throw new Error('Invalid date provided');
//     }

//     const day = String(dateObj.getDate()).padStart(2, '0');
//     const month = String(dateObj.getMonth() + 1).padStart(2, '0');
//     const year = dateObj.getFullYear();

//     return `${day}-${month}-${year}`;
//   };

//   // Mengonversi ketiga tanggal
//   const month0 = formatDate(m0);
//   const month1 = formatDate(m1);
//   const month2 = formatDate(m3);
//   const type = typeProduct;

//   // Menggunakan string tanggal yang sudah dikonversi
//   this.router.navigate(['/transaksi/add-mo-front-rear/', month0, month1, month2, type]);
// }

navigateToDetailMo(idMo: String) {
  this.router.navigate(['/transaksi/add-mo-front-rear/', idMo]);
}

navigateToAddArDefectReject(idMo: String) {
  this.router.navigate(['/transaksi/add-mo-ar-defect-reject/', idMo]);
}

fillBodyTableMp(docNum: string): void {
  this.getDailyMonthPlan(docNum);
}

// getDailyMonthPlan(partNumber: number) {
//   this.mpService.getDailyMonthlyPlan(partNumber).subscribe(
//     (response: ApiResponse<any>) => {
//       this.allData = response.data;
//       this.fillAllData(this.allData);
//     },
//     (error) => {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Failed to load marketing order details: ' + error.message,
//         confirmButtonText: 'OK',
//       });
//     }
//   );
// }

getDailyMonthPlan(docNum: string) {
  this.mpService.getDetailMonthlyPlanById(docNum).subscribe(
    (response: ApiResponse<any>) => {
      if (response?.data) {
        this.allData = response.data;
        this.fillAllData(this.allData);
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'No data found for the given document number.',
          confirmButtonText: 'OK',
        });
      }
    },
    (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load marketing order details: ' + error.message,
        confirmButtonText: 'OK',
      });
    }
  );
}


getDetailShiftMonthlyPlan(detailDailyId: number, actualDate: string): void {
  this.mpService.getDetailShiftMonthlyPlan(detailDailyId, actualDate).subscribe(
    (response: ApiResponse<DetailShiftMonthlyPlanCuring[]>) => {
      const data = response.data;

      this.fillDataShift(data);
      this.openDmpModal();
    },
    (error) => {
      console.error('Error loading data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load data: ' + (error?.message || 'Unknown error'),
        confirmButtonText: 'OK',
      });
    }
  );
}

openDmpModal(): void {
  $('#dmpModal').modal('show');
}


handleCellClick(detailDailyId: number, hDateTass: any): void {
  console.log('Selected detail id:', detailDailyId);
  console.log('Selected Date:', hDateTass);

  this.getDetailShiftMonthlyPlan(detailDailyId, hDateTass);
}

fillAllData(data: any) {
  console.log(data);
  console.log('Data received:', data);

  this.monthlyPlanning = data.monthlyPlanningCuring || null;

  const monthlyPlans = data.detailMonthlyPlanCuring || [];
  const dailyPlans = data.detailDailyMonthlyPlanCuring || [];
  const sizePa = data.sizePa || [];
  this.description = data.description || [];
  this.monly = dailyPlans;
  this.fillDataHeaderDate(dailyPlans);

  // Merging data based on `detailIdCuring`
  let mergedData: any[] = [];

  if (this.monthlyPlanning) {
    // Gunakan this.monthlyPlanning
    this.formHeaderMp.patchValue({
      mpCuringId: this.monthlyPlanning.mpCuringId,
      docNumber: this.monthlyPlanning.docNumber,
      effectiveDate: this.formatDateToString(this.monthlyPlanning.effectiveDate),
      revision: (this.monthlyPlanning.revision),
      workDay: this.formatDecimal(this.monthlyPlanning.workDay),
      overtime: this.formatDecimal(this.monthlyPlanning.overtime),
      monthOf: this.formatDateToString(this.monthlyPlanning.monthOf),
      kadept: this.monthlyPlanning.kadept,
      kassiePp: this.monthlyPlanning.kassiePp,
      section: this.monthlyPlanning.section,
      issueDate: this.monthlyPlanning.issueDate,
    });
  } else {
    console.error('monthlyPlanning is empty or undefined');
  }  

  // Loop over each daily plan
  dailyPlans.forEach((daily, index) => {
    const matchingMonthly = monthlyPlans.find(
      (monthly) => monthly.detailIdCuring === daily.detailIdCuring
    );

    const matchingSizePa = sizePa.find(
      (sizeEntry) => sizeEntry.partNumber === (matchingMonthly?.partNumber || daily.partNumber)
    );

    const dailyData = {
      no: index + 1,
      partNumber: matchingMonthly?.partNumber || null,
      size: matchingSizePa?.description || null, // Get size from sizePa
      pattern: matchingSizePa?.patternName || null,
      total: matchingMonthly?.total || null,
      netFulfilment: matchingMonthly?.netFulfilment || null,
      grossReq: matchingMonthly?.grossReq || null,
      netReq: matchingMonthly?.netReq || null,
      reqAhmOem: matchingMonthly?.reqAhmOem || null,
      reqAhmRem: matchingMonthly?.reqAhmRem || null,
      reqFdr: matchingMonthly?.reqFdr || null,
      differenceOfs: matchingMonthly?.differenceOfs || null,

      // Fields from daily plan
      detailIdCuring: daily.detailIdCuring,
      dateDailyMp: daily.dateDailyMp,
      workDay: daily.workDay,
      totalPlan: daily.totalPlan,
    };
    console.table("WFF" + dailyData);

    const existingEntry = mergedData.find(
      (entry) => entry.partNumber === dailyData.partNumber && entry.detailIdCuring === dailyData.detailIdCuring
    );

    if (!existingEntry) {
      mergedData.push(dailyData);
    }
  });

  // Update the monthlyDailyPlan with the merged data (only unique entries)
  this.monthlyDailyPlan = mergedData;

  console.table(this.monthlyDailyPlan);

  this.dataSourceMP = new MatTableDataSource(this.monthlyDailyPlan);
  this.dataSourceMP.sort = this.sort;
  this.dataSourceMP.paginator = this.paginator;
}


fillDataHeaderDate(dailyPlans: MonthlyDailyPlan[]): void {
  const uniqueDates = new Set(); // To track already used dates
  this.dateHeadersTass = dailyPlans.map(mp => {
    const date = new Date(mp.dateDailyMp);
    const date2 = new Date(mp.dateDailyMp);

    // Format the date to dd-MM-yyyy
    const formattedDate = `${('0' + (date2.getDate())).slice(-2)}-${('0' + (date2.getMonth() + 1)).slice(-2)}-${date2.getFullYear()}`;

    const matchingData = this.description.find(
      (header) => this.formatDate(header.dateDailyMp) === formattedDate
    );

    const i = 0;
    // Check if the date has already been added
    if (!uniqueDates.has(formattedDate)) {
      uniqueDates.add(formattedDate); // Mark this date as used

      return {
        date: formattedDate,
        dateDisplay: date.getDate().toString(),
        isOff: matchingData.description === 'OFF', // Off day logic
        isOvertime: matchingData.description === 'OT_TT' || matchingData.description === 'OT_TL', // Overtime day logic
        semiOff: matchingData.description === 'SEMI_OFF',
        status: mp.workDay === 0 ? 'off' : (mp.workDay > 8 ? 'overtime' : 'normal'),
        workingDay: mp.workDay,
        totalPlan: mp.totalPlan
      };
    }

    return null; // Return null for duplicate dates
  }).filter(header => header !== null); // Filter out any null values
}


getTotalPlan(idCuring: number, date: string): number | string {
  // Cari data yang sesuai dengan idCuring dan tanggal
  const matchingData = this.monly.find(
    (header) => this.formatDate(header.dateDailyMp) === date && header.detailIdCuring === idCuring
  );
  return matchingData ? matchingData.totalPlan : '-';
}

formatDate(date: string | Date): string {
  if (!date) {
    return '';
  }
  const dateObj = new Date(date);

  const formattedDate = `${('0' + (dateObj.getDate())).slice(-2)}-${('0' + (dateObj.getMonth() + 1)).slice(-2)}-${dateObj.getFullYear()}`;
  return formattedDate;
}


fillDataShift(detailShiftMonthlyPlanCuring: DetailShiftMonthlyPlanCuring[]): void {
  // Reset nilai
  this.workCenterText = '';
  this.kapaShift1 = 0;
  this.kapaShift2 = 0;
  this.kapaShift3 = 0;
  this.totalKapa = 0;
  this.shift= 0;
  this.wct = '';
  this.changeDate = '';

  // Loop untuk mengisi data
  detailShiftMonthlyPlanCuring.forEach((item) => {
    this.workCenterText += item.work_CENTER_TEXT || this.workCenterText;
    this.kapaShift1 += item.kapa_SHIFT_1 || 0;
    this.kapaShift2 += item.kapa_SHIFT_2 || 0;
    this.kapaShift3 += item.kapa_SHIFT_3 || 0;
    this.totalKapa += item.total_KAPA || 0;
    this.changeDate += this.formatDate(item.changeDate);
    this.wct += item.wct === null? '': item.wct;
    this.shift += item.shift;
  });
}

// fillDataShift(detailShiftMonthlyPlanCuring: DetailShiftMonthlyPlanCuring[]): void {
//   // Reset nilai
//   this.workCenterText = [];
//   this.kapaShift1 = 0;
//   this.kapaShift2 = 0;
//   this.kapaShift3 = 0;
//   this.totalKapa = 0;
//   this.shift = [];  // Ubah menjadi array
//   this.wct = [];
//   this.changeDate = [];

//   // Loop untuk mengisi data
//   detailShiftMonthlyPlanCuring.forEach((item) => {
//     // Menambahkan ke array jika ada
//     if (item.workCenterText) {
//       this.workCenterText.push(item.workCenterText);
//     }
//     this.kapaShift1 += item.kapaShift1 || 0;
//     this.kapaShift2 += item.kapaShift2 || 0;
//     this.kapaShift3 += item.kapaShift3 || 0;
//     this.totalKapa += item.totalKapa || 0;

//     // Menggunakan formatDate untuk tanggal
//     if (item.changeDate) {
//       this.changeDate.push(this.formatDate(item.changeDate));
//     }

//     // Menambahkan ke array wct jika tidak null
//     if (item.wct !== null && item.wct !== undefined) {
//       this.wct.push(item.wct);
//     }

//     // Menambahkan nilai shift ke dalam array
//     if (item.shift !== undefined) {
//       this.shift.push(item.shift);
//     }
//   });
// }

fillDataWorkDays(): void {

}

selectAll(event: any): void {
  const checked = event.target.checked;
  this.marketingOrders.forEach((order) => {
    order.selected = checked;
  });
}

navigateToViewMp() {
  this.router.navigate(['/transaksi/view-monthly-planning']);
}

navigateToViewMoFrontRear() {
  this.router.navigate(['/transaksi/add-mo-front-rear']);
}

}
