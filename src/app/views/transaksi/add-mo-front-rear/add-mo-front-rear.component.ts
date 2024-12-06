import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailMarketingOrder } from 'src/app/models/DetailMarketingOrder';
import { HeaderMarketingOrder } from 'src/app/models/HeaderMarketingOrder';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { ApiResponse } from 'src/app/response/Response';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import { ParsingDate } from 'src/app/utils/ParsingDate';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { ParsingDateService } from 'src/app/utils/parsing-date/parsing-date.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

declare var $: any;

@Component({
  selector: 'app-add-mo-front-rear',
  templateUrl: './add-mo-front-rear.component.html',
  styleUrls: ['./add-mo-front-rear.component.scss']
})
export class AddMoFrontRearComponent implements OnInit {

  //Declaration
  idMo: String;
  formHeaderMo: FormGroup;
  formLimit: FormGroup;
  errorMessage: string | null = null;
  searchText: string = '';
  dataTemp: any[];
  dateUtil: typeof ParsingDate;
  marketingOrder: MarketingOrder;
  isReadOnly: boolean = true;
  monthNames: string[] = ['', '', ''];
  month0: string;
  month1: string;
  month2: string;
  type: string;
  allData: any;
  marketingOrders: MarketingOrder[] = [];
  headerMarketingOrder: HeaderMarketingOrder[];
  detailMarketingOrder: DetailMarketingOrder[];
  headerRevision: string;
  detailMoRevision: string;
  capacity: string = '';
  checked = [];  // Your data source
  machine: any;

  // Pagination Marketing Order
  displayedColumnsMo: string[] = ['no', 'moId', 'type', 'dateValid', 'revisionPpc', 'revisionMarketing', 'month0', 'month1', 'month2', 'action'];
  dataSourceMo: MatTableDataSource<MarketingOrder>;
  @ViewChild('sortMo') sortMo = new MatSort();
  @ViewChild('paginatorMo') paginatorMo: MatPaginator;

  // Pagination Detail Marketing Order
  headersColumnsDmo: string[] = ['select','no', 'category', 'partNumber', 'description', 'machineType', 'capacity', 'qtyPerMould', 'spareMould', 'mouldMonthlyPlan', 'qtyPerRak', 'minOrder', 'maxCap', 'initialStock', 'salesForecast', 'marketingOrder','action'];
  childHeadersColumnsDmo: string[] = ['maxCapMonth0', 'maxCapMonth1', 'maxCapMonth2', 'sfMonth0', 'sfMonth1', 'sfMonth2', 'moMonth0', 'moMonth1', 'moMonth2'];
  rowDataDmo: string[] = ['select','no', 'category', 'partNumber', 'description', 'machineType', 'capacity', 'qtyPerMould', 'spareMould', 'mouldMonthlyPlan', 'qtyPerRak', 'minOrder', 'maxCapMonth0', 'maxCapMonth1', 'maxCapMonth2', 'initialStock', 'sfMonth0', 'sfMonth1', 'sfMonth2', 'moMonth0', 'moMonth1', 'moMonth2', 'action'];
  childHeadersColumnsDmo: string[] = ['maxCapMonth0', 'maxCapMonth1', 'maxCapMonth2', 'sfMonth0', 'sfMonth1', 'sfMonth2', 'moMonth0', 'moMonth1', 'moMonth2'];
  rowDataDmo: string[] = ['select','no', 'category', 'partNumber', 'description', 'machineType', 'capacity', 'qtyPerMould', 'spareMould', 'mouldMonthlyPlan', 'qtyPerRak', 'minOrder', 'maxCapMonth0', 'maxCapMonth1', 'maxCapMonth2', 'initialStock', 'sfMonth0', 'sfMonth1', 'sfMonth2', 'moMonth0', 'moMonth1', 'moMonth2', 'action'];
  dataSourceDmo: MatTableDataSource<DetailMarketingOrder>;
  @ViewChild('sortDmo') sortDmo = new MatSort();
  @ViewChild('paginatorDmo') paginatorDmo: MatPaginator;

  constructor(private router: Router, private moService: MarketingOrderService, private activeRoute: ActivatedRoute, private fb: FormBuilder, private parseDateService: ParsingDateService) {
    this.dateUtil = ParsingDate;
    this.formHeaderMo = this.fb.group({
      date: [null, []],
      type: [null, []],
      revision: [null, []],
      month_0: [null, []],
      month_1: [null, []],
      month_2: [null, []],
      nwt_0: [null, []],
      nwt_1: [null, []],
      nwt_2: [null, []],
      ot_wt_0: [null, []],
      ot_wt_1: [null, []],
      ot_wt_2: [null, []],
      total_wt_0: [null, []],
      total_wt_1: [null, []],
      total_wt_2: [null, []],
      nwd_0: [null, []],
      nwd_1: [null, []],
      nwd_2: [null, []],
      tl_ot_wd_0: [null, []],
      tt_ot_wd_0: [null, []],
      tl_ot_wd_1: [null, []],
      tt_ot_wd_1: [null, []],
      tl_ot_wd_2: [null, []],
      tt_ot_wd_2: [null, []],
      total_tlwd_0: [null, []],
      total_ttwd_0: [null, []],
      total_tlwd_1: [null, []],
      total_ttwd_1: [null, []],
      total_tlwd_2: [null, []],
      total_ttwd_2: [null, []],
      max_tube_capa_0: [null, []],
      max_tube_capa_1: [null, []],
      max_tube_capa_2: [null, []],
      max_capa_tl_0: [null, []],
      max_capa_tt_0: [null, []],
      max_capa_tl_1: [null, []],
      max_capa_tt_1: [null, []],
      max_capa_tl_2: [null, []],
      max_capa_tt_2: [null, []],
      looping_m0: [null, []],
      machine_airbag_m0: [null, []],
      fed_tl_m0: [null, []],
      fed_tt_m0: [null, []],
      fdr_tl_m0: [null, []],
      fdr_tt_m0: [null, []],
      total_mo_m0: [null, []],
      fed_TL_percentage_m0: [null, []],
      fdr_TL_percentage_m0: [null, []],
      fed_TT_percentage_m0: [null, []],
      fdr_TT_percentage_m0: [null, []],
      note_tl_m0: [null, []],
      looping_m1: [null, []],
      machine_airbag_m1: [null, []],
      fed_tl_m1: [null, []],
      fed_tt_m1: [null, []],
      fdr_tl_m1: [null, []],
      fdr_tt_m1: [null, []],
      total_mo_m1: [null, []],
      fed_TL_percentage_m1: [null, []],
      fdr_TL_percentage_m1: [null, []],
      fed_TT_percentage_m1: [null, []],
      fdr_TT_percentage_m1: [null, []],
      note_tl_m1: [null, []],
      looping_m2: [null, []],
      machine_airbag_m2: [null, []],
      fed_tl_m2: [null, []],
      fed_tt_m2: [null, []],
      fdr_tl_m2: [null, []],
      fdr_tt_m2: [null, []],
      total_mo_m2: [null, []],
      fed_TL_percentage_m2: [null, []],
      fdr_TL_percentage_m2: [null, []],
      fed_TT_percentage_m2: [null, []],
      fdr_TT_percentage_m2: [null, []],
      note_tl_m2: [null, []],
      upload_file_m0: [null, []],
      upload_file_m1: [null, []],
      upload_file_m2: [null, []],
    });

    this.formLimit = this.fb.group({
      minLimit_0_2000: [''],
      maxLimit_0_2000: [''],
      minLimit_2001_10000: [''],
      maxLimit_2001_10000: [''],
      minLimit_10001_100000: [''],
      maxLimit_10001_100000: [''],
      minLimit_gt_100000: [''],
      maxLimit_gt_100000: [''],
    });
    
  }

  ngOnInit(): void {
    this.month0 = this.activeRoute.snapshot.paramMap.get('month0');
    this.month1 = this.activeRoute.snapshot.paramMap.get('month1');
    this.month2 = this.activeRoute.snapshot.paramMap.get('month2');
    this.type = this.activeRoute.snapshot.paramMap.get('type');
    this.getAllDetailRevision(this.month0, this.month1, this.month2, this.type);
    this.headerRevision = 'Header Marketing Order';
    this.detailMoRevision = 'Detail Marketing Order';
    this.getCapacity();
  }

  getCapacity(): void {
    this.moService.getCapacity().subscribe(
      (response: ApiResponse<any>) => {
        this.capacity = response.data;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load capacity ' + error.message,
          confirmButtonText: 'OK',
        });
      }
    );
  }

  getMachine(mesin: string): void {
    this.machine.getAllMachineByItemCuring(mesin).subscribe(
      (response: ApiResponse<any>) => {
        this.machine = response.data;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load machine ' + error.message,
          confirmButtonText: 'OK',
        });
      }
    );
  }

  onSearchChangeMo(): void {
    this.dataSourceMo.filter = this.searchText.trim().toLowerCase();
  }

  resetSearchMo(): void {
    this.searchText = '';
    this.dataSourceMo.filter = '';
  }

  parseDate(dateParse: string): string {
    return this.parseDateService.convertDateToString(dateParse);
  }

  isAllSelected() {
    return this.checked.every(item => item.selected);
  }

  isSomeSelected() {
    return this.checked.some(item => item.selected) && !this.isAllSelected();
  }

  selectAll(event) {
    const selected = event.checked;
    this.checked.forEach(item => item.selected = selected);
  }

  getAllDetailRevision(month0: string, month1: string, month2: string, type: string): void {
    this.moService.getAllDetailRevision(month0, month1, month2, type).subscribe(
      (response: ApiResponse<MarketingOrder[]>) => {
        this.marketingOrders = response.data;
        if (this.marketingOrders.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'No Data',
            text: 'No marketing orders found.',
            timer: 3000,
            showConfirmButton: false,
          });
        } else {
          this.dataSourceMo = new MatTableDataSource(this.marketingOrders);
          this.dataSourceMo.sort = this.sortMo;
          this.dataSourceMo.paginator = this.paginatorMo;
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

  showDataRevision(idMo: string) {
    this.moService.getAllMoById(idMo).subscribe(
      (response: ApiResponse<any>) => {
        this.allData = response.data;
        this.fillAllData(this.allData);
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

  fillAllData(data: any) {
    this.headerMarketingOrder = data.dataHeaderMo;

    //Fill table
    this.detailMarketingOrder = data.dataDetailMo;
    this.dataSourceDmo = new MatTableDataSource(this.detailMarketingOrder);
    this.dataSourceDmo.sort = this.sortDmo;
    this.dataSourceDmo.paginator = this.paginatorDmo;

    let typeProduct = data.type;

    if (this.allData) {
      this.headerRevision = `Header Marketing Order Rev ${data.revisionPpc}`;
      this.detailMoRevision = `Detail Marketing Order Rev ${data.revisionPpc}`;
    }

    this.formHeaderMo.patchValue({
      date: new Date(data.dateValid).toISOString().split('T')[0],
      type: data.type,
      revision: data.revisionPpc,

      // Header Month 1
      month_0: this.formatDateToString(this.headerMarketingOrder[0].month),
      nwd_0: this.formatDecimal(this.headerMarketingOrder[0].wdNormalTire),
      nwt_0: this.formatDecimal(this.headerMarketingOrder[0].wdNormalTube),
      ot_wt_0: this.formatDecimal(this.headerMarketingOrder[0].wdOtTube),
      tl_ot_wd_0: this.formatDecimal(this.headerMarketingOrder[0].wdOtTl),
      tt_ot_wd_0: this.formatDecimal(this.headerMarketingOrder[0].wdOtTt),
      total_wt_0: this.formatDecimal(this.headerMarketingOrder[0].totalWdTube),
      total_tlwd_0: this.formatDecimal(this.headerMarketingOrder[0].totalWdTl),
      total_ttwd_0: this.formatDecimal(this.headerMarketingOrder[0].totalWdTt),
      max_tube_capa_0: this.formatSeparator(this.headerMarketingOrder[0].maxCapTube),
      max_capa_tl_0: this.formatSeparator(this.headerMarketingOrder[0].maxCapTl),
      max_capa_tt_0: this.formatSeparator(this.headerMarketingOrder[0].maxCapTt),
      machine_airbag_m0: this.formatSeparator(this.headerMarketingOrder[0].airbagMachine),
      fed_tl_m0: typeProduct === 'FED' ? this.formatSeparator(this.headerMarketingOrder[0].tl) : null,
      fed_tt_m0: typeProduct === 'FED' ? this.formatSeparator(this.headerMarketingOrder[0].tt) : null,
      fdr_tl_m0: typeProduct === 'FDR' ? this.formatSeparator(this.headerMarketingOrder[0].tl) : null,
      fdr_tt_m0: typeProduct === 'FDR' ? this.formatSeparator(this.headerMarketingOrder[0].tt) : null,
      fed_TL_percentage_m0: typeProduct === 'FED' ? this.formatDecimal(this.headerMarketingOrder[0].tlPercentage) : null,
      fed_TT_percentage_m0: typeProduct === 'FED' ? this.formatDecimal(this.headerMarketingOrder[0].ttPercentage) : null,
      fdr_TL_percentage_m0: typeProduct === 'FDR' ? this.formatDecimal(this.headerMarketingOrder[0].tlPercentage) : null,
      fdr_TT_percentage_m0: typeProduct === 'FDR' ? this.formatDecimal(this.headerMarketingOrder[0].ttPercentage) : null,
      total_mo_m0: this.formatSeparator(this.headerMarketingOrder[0].totalMo),
      note_tl_m0: this.headerMarketingOrder[0].noteOrderTl,
      // Header Month 2
      month_1: this.formatDateToString(this.headerMarketingOrder[1].month),
      nwd_1: this.formatDecimal(this.headerMarketingOrder[1].wdNormalTire),
      nwt_1: this.formatDecimal(this.headerMarketingOrder[1].wdNormalTube),
      ot_wt_1: this.formatDecimal(this.headerMarketingOrder[1].wdOtTube),
      tl_ot_wd_1: this.formatDecimal(this.headerMarketingOrder[1].wdOtTl),
      tt_ot_wd_1: this.formatDecimal(this.headerMarketingOrder[1].wdOtTt),
      total_wt_1: this.formatDecimal(this.headerMarketingOrder[1].totalWdTube),
      total_tlwd_1: this.formatDecimal(this.headerMarketingOrder[1].totalWdTl),
      total_ttwd_1: this.formatDecimal(this.headerMarketingOrder[1].totalWdTt),
      max_tube_capa_1: this.formatSeparator(this.headerMarketingOrder[1].maxCapTube),
      max_capa_tl_1: this.formatSeparator(this.headerMarketingOrder[1].maxCapTl),
      max_capa_tt_1: this.formatSeparator(this.headerMarketingOrder[1].maxCapTt),
      machine_airbag_m1: this.formatSeparator(this.headerMarketingOrder[1].airbagMachine),
      fed_tl_m1: typeProduct === 'FED' ? this.formatSeparator(this.headerMarketingOrder[1].tl) : null,
      fed_tt_m1: typeProduct === 'FED' ? this.formatSeparator(this.headerMarketingOrder[1].tt) : null,
      fdr_tl_m1: typeProduct === 'FDR' ? this.formatSeparator(this.headerMarketingOrder[1].tl) : null,
      fdr_tt_m1: typeProduct === 'FDR' ? this.formatSeparator(this.headerMarketingOrder[1].tt) : null,
      fed_TL_percentage_m1: typeProduct === 'FED' ? this.formatDecimal(this.headerMarketingOrder[1].tlPercentage) : null,
      fed_TT_percentage_m1: typeProduct === 'FED' ? this.formatDecimal(this.headerMarketingOrder[1].ttPercentage) : null,
      fdr_TL_percentage_m1: typeProduct === 'FDR' ? this.formatDecimal(this.headerMarketingOrder[1].tlPercentage) : null,
      fdr_TT_percentage_m1: typeProduct === 'FDR' ? this.formatDecimal(this.headerMarketingOrder[1].ttPercentage) : null,
      total_mo_m1: this.formatSeparator(this.headerMarketingOrder[1].totalMo),
      note_tl_m1: this.headerMarketingOrder[1].noteOrderTl,
      // Header Month 3
      month_2: this.formatDateToString(this.headerMarketingOrder[2].month),
      nwd_2: this.formatDecimal(this.headerMarketingOrder[2].wdNormalTire),
      nwt_2: this.formatDecimal(this.headerMarketingOrder[2].wdNormalTube),
      ot_wt_2: this.formatDecimal(this.headerMarketingOrder[2].wdOtTube),
      tl_ot_wd_2: this.formatDecimal(this.headerMarketingOrder[2].wdOtTl),
      tt_ot_wd_2: this.formatDecimal(this.headerMarketingOrder[2].wdOtTt),
      total_wt_2: this.formatDecimal(this.headerMarketingOrder[2].totalWdTube),
      total_tlwd_2: this.formatDecimal(this.headerMarketingOrder[2].totalWdTl),
      total_ttwd_2: this.formatDecimal(this.headerMarketingOrder[2].totalWdTt),
      max_tube_capa_2: this.formatSeparator(this.headerMarketingOrder[2].maxCapTube),
      max_capa_tl_2: this.formatSeparator(this.headerMarketingOrder[2].maxCapTl),
      max_capa_tt_2: this.formatSeparator(this.headerMarketingOrder[2].maxCapTt),
      machine_airbag_m2: this.formatSeparator(this.headerMarketingOrder[2].airbagMachine),
      fed_tl_m2: typeProduct === 'FED' ? this.formatSeparator(this.headerMarketingOrder[2].tl) : null,
      fed_tt_m2: typeProduct === 'FED' ? this.formatSeparator(this.headerMarketingOrder[2].tt) : null,
      fdr_tl_m2: typeProduct === 'FDR' ? this.formatSeparator(this.headerMarketingOrder[2].tl) : null,
      fdr_tt_m2: typeProduct === 'FDR' ? this.formatSeparator(this.headerMarketingOrder[2].tt) : null,
      fed_TL_percentage_m2: typeProduct === 'FED' ? this.formatDecimal(this.headerMarketingOrder[2].tlPercentage) : null,
      fed_TT_percentage_m2: typeProduct === 'FED' ? this.formatDecimal(this.headerMarketingOrder[2].ttPercentage) : null,
      fdr_TL_percentage_m2: typeProduct === 'FDR' ? this.formatDecimal(this.headerMarketingOrder[2].tlPercentage) : null,
      fdr_TT_percentage_m2: typeProduct === 'FDR' ? this.formatDecimal(this.headerMarketingOrder[2].ttPercentage) : null,
      total_mo_m2: this.formatSeparator(this.headerMarketingOrder[2].totalMo),
      note_tl_m2: this.headerMarketingOrder[2].noteOrderTl,
    });
    this.updateMonthNames(this.headerMarketingOrder);
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

  updateMonthNames(hm: HeaderMarketingOrder[]): void {
    this.monthNames[0] = this.getMonthName(new Date(this.headerMarketingOrder[1].month));
    this.monthNames[1] = this.getMonthName(new Date(this.headerMarketingOrder[2].month));
    this.monthNames[2] = this.getMonthName(new Date(this.headerMarketingOrder[0].month));
  }

  getMonthName(monthValue: Date): string {
    if (monthValue) {
      return monthValue.toLocaleString('default', { month: 'short' }).toUpperCase();
    }
    return '';
  }

  navigateToViewMo() {
    this.router.navigate(['/transaksi/add-monthly-planning']);
  }

  exportExcelMo(id: string): void {
    this.moService.downloadExcelMo(id).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Marketing_Order_${id}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal mendownload file. Silakan coba lagi!',
        });
        console.error('Error downloading file:', error);
      }
    );
  }

  viewDetail(): void {
    $('#dmpModal').modal('show');
  }

  fillMachine(data: any) {
  
  }
  
  mesin: string = '';

  gedungOptions: string[] = ['Gedung G', 'Gedung C', 'Gedung D', 'Gedung A', 'Gedung B', 'Gedung H'];
  mesinOptions: string[] = [
    'CURING BOM 4 CAVITY GD G NO.001', 'CURING BOM 4 CAVITY GD G NO.002', 'CURING BOM 4 CAVITY GD G NO.003',
    'CURING BOM 4 CAVITY GD G NO.004', 'CURING BOM 4 CAVITY GD G NO.005', 'CURING BOM 4 CAVITY GD C NO.001',
    'CURING BOM 4 CAVITY GD C NO.002', 'CURING BOM 4 CAVITY GD C NO.003', 'CURING BOM 4 CAVITY GD C NO.004',
    'CURING BOM 4 CAVITY GD C NO.005', 'CURING BOM 4 CAVITY GD D NO.001', 'CURING BOM 4 CAVITY GD D NO.002',
    'CURING BOM 4 CAVITY GD D NO.003', 'CURING BOM 4 CAVITY GD D NO.004', 'CURING BOM 4 CAVITY GD D NO.005',
    'CURING AB 5 ST CHOP GD A NO.013', 'CURING AB 5 ST CHOP GD A NO.014', 'CURING AB 5 ST CHOP GD A NO.015',
    'CURING AB 5 ST CHOP GD A NO.016', 'CURING AB 5 ST CHOP GD B NO.001', 'CURING AB 5 ST CHOP GD B NO.002',
    'CURING AB 5 ST CHOP GD B NO.003', 'CURING BOM 4 CAVITY GD H NO.020', 'CURING BOM 4 CAVITY GD H NO.021'
  ];

  selectedGedung: string = '';
  machineEntries: { gedung: string, mesin: string, filteredMesinOptions: string[] }[] = [];

  onGedungSelect(index: number) {
    this.filterMachines(index); // Apply the filter when Gedung is selected in a particular row
  }

  filterMachines(index: number) {
    const selectedGedung = this.machineEntries[index].gedung;
    let filteredOptions: string[] = [];

    if (selectedGedung === 'Gedung G') {
      filteredOptions = this.mesinOptions.filter(mesin => mesin.toLowerCase().includes('gd g'));
    } else if (selectedGedung === 'Gedung C') {
      filteredOptions = this.mesinOptions.filter(mesin => mesin.toLowerCase().includes('gd c'));
    } else if (selectedGedung === 'Gedung D') {
      filteredOptions = this.mesinOptions.filter(mesin => mesin.toLowerCase().includes('gd d'));
    } else if (selectedGedung === 'Gedung A') {
      filteredOptions = this.mesinOptions.filter(mesin => mesin.toLowerCase().includes('gd a'));
    } else if (selectedGedung === 'Gedung B') {
      filteredOptions = this.mesinOptions.filter(mesin => mesin.toLowerCase().includes('gd b'));
    } else if (selectedGedung === 'Gedung H') {
      filteredOptions = this.mesinOptions.filter(mesin => mesin.toLowerCase().includes('gd h'));
    }

    this.machineEntries[index].filteredMesinOptions = filteredOptions;
  }

  addRow() {
    this.machineEntries.push({ gedung: '', mesin: '', filteredMesinOptions: [] });
  }

  // Method untuk menghapus entri dari tabel
  removeEntry(entry: { gedung: string, mesin: string, filteredMesinOptions: string[] }) {
    const index = this.machineEntries.findIndex(e => e === entry); // Menggunakan findIndex untuk mencocokkan entri
    if (index > -1) {
      this.machineEntries.splice(index, 1); // Menghapus entri berdasarkan index
    }
  }

}
