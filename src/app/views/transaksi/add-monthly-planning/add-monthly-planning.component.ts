import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { DetailDailyMonthlyPlanCuring } from 'src/app/models/DetailDailyMonthlPlanCuring';
import { DetailMonthlyPlanningCuring } from 'src/app/models/DetailMonthlyPlanningCuring';
import { DetailShiftMonthlyPlanCuring } from 'src/app/models/DetailShiftMonthlyPlanCuring';
import { MonthlyDailyPlan } from 'src/app/models/DetailMonthlyPlan';
import { ChangeMould } from 'src/app/models/ChangeMould';

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
  selector: 'app-add-monthly-planning',
  templateUrl: './add-monthly-planning.component.html',
  styleUrls: ['./add-monthly-planning.component.scss'],
})
export class AddMonthlyPlanningComponent implements OnInit {
  // Variable declaration
  selectedDetail: { idDetailDaily: number; countProduction: number } | null = null;
  dateHeadersTass: any[] = [];
  dateHeadersCurring: any[] = [];
  monthlyPlanningTass: any[] = [];
  dailyMonthlyPlanningTass: any[] = [];
  shiftMonthlyPlanningTass: any[] = [];

  detailMonthlyPlanCuring: DetailMonthlyPlanningCuring[] = [];
  dailyMonthlyPlanningCuring: DetailDailyMonthlyPlanCuring[] = [];
  shiftMonthlyPlanningCuring: DetailShiftMonthlyPlanCuring[] = [];
  monthlyDailyPlan: MonthlyDailyPlan[] = [];
  monly: MonthlyDailyPlan[] = [];
  description: any[] = [];
  changeMould: ChangeMould[] = [];
  productDetails: any[] = [];

  marketingOrders: MarketingOrder[] = [];
  searchText: string = '';
  allData: any;
  workCenterText: string[] = [];
  kapaShift1: number = 0;
  kapaShift2: number = 0;
  kapaShift3: number = 0;
  totalKapa: number = 0;

  partNum: number = 0;
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
  displayedColumns: string[] = ['select', 'no', 'month0', 'month1', 'month2', 'action'];
  displayedColumnsMP: string[] = ['no', 'partNumber', 'dateDailyMp', 'totalPlan'];
  childHeadersColumnsMP: string[] = ['workDay'];

  dataSourceMO: MatTableDataSource<MarketingOrder>;
  dataSourceMP: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  monthlyPlanningsCurring: any[] = [];
  showMonthlyPlanning: boolean = false;

  constructor(private router: Router, private moService: MarketingOrderService, private mpService: MonthlyPlanCuringService, private parseDateService: ParsingDateService) {}

  ngOnInit(): void {
    //this.getAllMarketingOrder();
    this.getAllMoOnlyMonth();
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

  getAllMoOnlyMonth(): void {
    this.moService.getAllMoOnlyMonth().subscribe(
      (response: ApiResponse<any[]>) => {
        let mapMonth = response.data.map((order) => {
          return {
            month0: new Date(order.MONTH0),
            month1: new Date(order.MONTH1),
            month2: new Date(order.MONTH2),
          };
        });
        this.marketingOrders = mapMonth;
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

  generateMonthlyPlanning() {
    const data = {
      month: 11,
      year: 2024,
      percentage: 5,
      limitChange: 4
    };

    this.fillBodyTableMp(data.month, data.year, data.percentage, data.limitChange);

  }
  fillBodyTableMp(month: number, year: number, percentage: number, limitChange: number): void {
    this.getDailyMonthPlan(month, year, percentage, limitChange);
  }

  navigateToDetailMo(m0: any, m1: any, m3: any, typeProduct: string) {
    const formatDate = (date: any): string => {
      const dateObj = date instanceof Date ? date : new Date(date);

      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date provided');
      }

      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();

      return `${day}-${month}-${year}`;
    };

    // Mengonversi ketiga tanggal
    const month0 = formatDate(m0);
    const month1 = formatDate(m1);
    const month2 = formatDate(m3);
    const type = typeProduct;

    // Menggunakan string tanggal yang sudah dikonversi
    this.router.navigate(['/transaksi/add-mo-front-rear/', month0, month1, month2, type]);
  }

  navigateToAddArDefectReject(month0: Date, month1: Date, month2: Date) {
    const formattedMonth0 = `${month0.getDate().toString().padStart(2, '0')}-${(month0.getMonth() + 1).toString().padStart(2, '0')}-${month0.getFullYear()}`;
    const formattedMonth1 = `${month1.getDate().toString().padStart(2, '0')}-${(month1.getMonth() + 1).toString().padStart(2, '0')}-${month1.getFullYear()}`;
    const formattedMonth2 = `${month2.getDate().toString().padStart(2, '0')}-${(month2.getMonth() + 1).toString().padStart(2, '0')}-${month2.getFullYear()}`;
    this.router.navigate(['/transaksi/add-mo-ar-defect-reject/', formattedMonth0, formattedMonth1, formattedMonth2]);
  }

  getDailyMonthPlan(month: number, year: number, percentage: number, limitChange: number) {
    // Menampilkan dialog loading
    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while we generate the monthly plan. This might take a while.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Menampilkan spinner
      },
    });

    this.mpService.generateDetailMp(month, year, percentage, limitChange).subscribe(
      (response: ApiResponse<any>) => {
        Swal.close(); // Menutup dialog loading setelah sukses
        this.showMonthlyPlanning = true;
        this.allData = response.data;
        this.fillAllData(this.allData);
      },
      (error) => {
        Swal.close(); // Menutup dialog loading jika terjadi error
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

  viewDetail(): void {
    this.fillChangeMould(this.changeMould);

    $('#changeMould').modal('show');
  }

  handleCellClick(detailDailyId: number, hDateTass: any): void {
    console.log('Selected detail id:', detailDailyId);
    console.log('Selected Date:', hDateTass);

    this.getDetailShiftMonthlyPlan(detailDailyId, hDateTass);
  }

  fillAllData(data: any) {
    console.log(data);
    const monthlyPlans = data.detailMonthlyPlanCuring || [];
    const dailyPlans = data.detailDailyMonthlyPlanCuring || [];
    const sizePa = data.sizePa || [];
    this.description = data.description || [];

    this.monly = dailyPlans;

    this.fillDataHeaderDate(dailyPlans);

    // Merging data based on `detailIdCuring`
    let mergedData: any[] = [];

    // Loop over each daily plan
    dailyPlans.forEach((daily, index) => {
      const matchingMonthly = monthlyPlans.find((monthly) => monthly.detailIdCuring === daily.detailIdCuring);

      const matchingSizePa = sizePa.find((sizeEntry) => sizeEntry.partNumber === (matchingMonthly?.partNumber || daily.partNumber));

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
      console.table('WFF' + dailyData);

      const existingEntry = mergedData.find((entry) => entry.partNumber === dailyData.partNumber && entry.detailIdCuring === dailyData.detailIdCuring);

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
    this.dateHeadersTass = dailyPlans
      .map((mp) => {
        const date = new Date(mp.dateDailyMp);
        const date2 = new Date(mp.dateDailyMp);

        // Format the date to dd-MM-yyyy
        const formattedDate = `${('0' + date2.getDate()).slice(-2)}-${('0' + (date2.getMonth() + 1)).slice(-2)}-${date2.getFullYear()}`;
        console.log('Formatted Date:', formattedDate);

        const matchingData = this.description.find((header) => this.formatDate(header.dateDailyMp) === formattedDate);

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
            status: mp.workDay === 0 ? 'off' : mp.workDay > 8 ? 'overtime' : 'normal',
            workingDay: mp.workDay,
            totalPlan: mp.totalPlan,
          };
        }

        return null; // Return null for duplicate dates
      })
      .filter((header) => header !== null); // Filter out any null values
  }

  getTotalPlan(idCuring: number, date: string): number | string {
    // Cari data yang sesuai dengan idCuring dan tanggal
    const matchingData = this.monly.find((header) => this.formatDate(header.dateDailyMp) === date && header.detailIdCuring === idCuring);
    return matchingData ? matchingData.totalPlan : '-';
  }

  formatDate(date: string | Date): string {
    if (!date) {
      return '';
    }
    const dateObj = new Date(date);

    const formattedDate = `${('0' + dateObj.getDate()).slice(-2)}-${('0' + (dateObj.getMonth() + 1)).slice(-2)}-${dateObj.getFullYear()}`;
    return formattedDate;
  }

  fillDataShift(detailShiftMonthlyPlanCuring: DetailShiftMonthlyPlanCuring[]): void {
    // Reset nilai
    this.workCenterText = [];
    this.kapaShift1 = 0;
    this.kapaShift2 = 0;
    this.kapaShift3 = 0;
    this.totalKapa = 0;

    // Loop untuk mengisi data
    detailShiftMonthlyPlanCuring.forEach((item) => {
      if (item.work_CENTER_TEXT) {
        this.workCenterText.push(item.work_CENTER_TEXT); // Tambahkan ke array
      }
      this.kapaShift1 += item.kapa_SHIFT_1 || 0;
      this.kapaShift2 += item.kapa_SHIFT_2 || 0;
      this.kapaShift3 += item.kapa_SHIFT_3 || 0;
      this.totalKapa += item.total_KAPA || 0;
    });
  }

  
  filteredChangeMould: any[] = [];  // Data yang sudah difilter
  filterType: string = 'changeDate';  // Default filter type
  searchTerm: string = '';  // Term pencarian

  fillChangeMould(changeMould: any[]): void {
    this.changeMould = changeMould;
    this.filteredChangeMould = [...changeMould]; // Menampilkan data awal
  }

  // Fungsi untuk menerapkan filter berdasarkan pilihan dan pencarian
  applyFilter(): void {
    let filteredData = this.changeMould;

    // Filter berdasarkan searchTerm
    if (this.searchTerm) {
      filteredData = filteredData.filter(item => {
        const field = item[this.filterType];
        return field && field.toString().toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    }

    // Update hasil filter
    this.filteredChangeMould = filteredData;
  }

  fillDataWorkDays(): void {}

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
