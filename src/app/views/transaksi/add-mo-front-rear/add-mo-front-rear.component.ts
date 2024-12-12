import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailMarketingOrder } from 'src/app/models/DetailMarketingOrder';
import { HeaderMarketingOrder } from 'src/app/models/HeaderMarketingOrder';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { FrontRear } from 'src/app/models/FrontRear';
import { ApiResponse } from 'src/app/response/Response';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import { MonthlyPlanCuringService } from 'src/app/services/transaksi/monthly plan curing/monthly-plan-curing.service';
import { FrontRearService } from 'src/app/services/transaksi/front rear/front-rear.service';

import { ParsingDate } from 'src/app/utils/ParsingDate';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { ParsingDateService } from 'src/app/utils/parsing-date/parsing-date.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TempMachineProduct } from 'src/app/models/TempMachineProduct';

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
  machine: any[] = [];

  //Cheating machine
  itemCuring: string = '';
  selectedItemCuring: string = '';
  selectedPartNumber: number = 0;

  //Cheating front rear
  frontRear: FrontRear[];
  selectedList: any[] = []; // Data yang akan ditambahkan ke list
  showFrontRear: boolean = false;
  isCheckboxInvalid = false;


  // Pagination Marketing Order
  displayedColumnsMo: string[] = ['no', 'moId', 'type', 'dateValid', 'revisionPpc', 'revisionMarketing', 'month0', 'month1', 'month2', 'action'];
  dataSourceMo: MatTableDataSource<MarketingOrder>;
  @ViewChild('sortMo') sortMo = new MatSort();
  @ViewChild('paginatorMo') paginatorMo: MatPaginator;

  // Pagination Detail Marketing Order
  headersColumnsDmo: string[] = ['select','no', 'category', 'partNumber', 'description', 'machineType', 'capacity', 'qtyPerMould', 'spareMould', 'mouldMonthlyPlan', 'qtyPerRak', 'minOrder', 'maxCap', 'initialStock', 'salesForecast', 'marketingOrder','action'];
  childHeadersColumnsDmo: string[] = ['maxCapMonth0', 'maxCapMonth1', 'maxCapMonth2', 'sfMonth0', 'sfMonth1', 'sfMonth2', 'moMonth0', 'moMonth1', 'moMonth2'];
  rowDataDmo: string[] = ['select','no', 'category', 'partNumber', 'description', 'machineType', 'capacity', 'qtyPerMould', 'spareMould', 'mouldMonthlyPlan', 'qtyPerRak', 'minOrder', 'maxCapMonth0', 'maxCapMonth1', 'maxCapMonth2', 'initialStock', 'sfMonth0', 'sfMonth1', 'sfMonth2', 'moMonth0', 'moMonth1', 'moMonth2', 'action'];
  dataSourceDmo: MatTableDataSource<DetailMarketingOrder>;
  @ViewChild('sortDmo') sortDmo = new MatSort();
  @ViewChild('paginatorDmo') paginatorDmo: MatPaginator;

  constructor(private router: Router, private moService: MarketingOrderService, private mpService: MonthlyPlanCuringService, private frontrear: FrontRearService, private activeRoute: ActivatedRoute, private fb: FormBuilder, private parseDateService: ParsingDateService) {
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
      note_order_tl_0: [null, []],
      note_order_tl_1: [null, []],
      note_order_tl_2: [null, []],
      upload_file_m0: [null, []],
      upload_file_m1: [null, []],
      upload_file_m2: [null, []],

      minLimit_0_2000: [null, []],
      maxLimit_0_2000: [null, []],
      minLimit_2001_10000: [null, []],
      maxLimit_2001_10000: [null, []],
      minLimit_10001_100000: [null, []],
      maxLimit_10001_100000: [null, []],
      minLimit_gt_100000: [null, []],
      maxLimit_gt_100000: [null, []],
    });

  }

  ngOnInit(): void {
    this.idMo = this.activeRoute.snapshot.paramMap.get('idMo');
    this.getAllData(this.idMo);
    this.headerRevision = 'Header Marketing Order';
    this.detailMoRevision = 'Detail Marketing Order';
    this.getCapacity();
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

  getAllData(idMo: String) {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data marketing order.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.moService.getAllMoById(idMo).subscribe(
      (response: ApiResponse<any>) => {
        Swal.close();
        this.allData = response.data;
        this.fillAllData(this.allData);
      },
      (error) => {
        Swal.close();
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

  // Define a variable to store saved entries
  savedEntries: any[] = [];

  // Function to save the current selections
  saveEntries(): void {
    // Save current machineEntries to savedEntries
    this.savedEntries = [...this.machineEntries];
    Swal.fire({
      icon: 'success',
      title: 'Data Saved',
      text: 'Machine details have been successfully saved.',
      confirmButtonText: 'OK',
    });
    console.log(this.savedEntries);
  }

  // Function to load saved entries
  loadSavedEntries(): void {
    console.table("yooooo " + this.savedEntries);
    if (this.savedEntries.length > 0) {
      // Restore saved entries to machineEntries
      this.machineEntries = this.savedEntries.map(entry => ({
        selectedGedung: entry.selectedGedung,
        selectedMachine: entry.selectedMachine,
        filteredMesinOptions: [...entry.filteredMesinOptions], // Ensure options are preserved
      }));
    } else {
      Swal.fire({
        icon: 'info',
        title: 'No Data',
        text: 'No saved data found. Starting with a fresh entry.',
        confirmButtonText: 'OK',
      });
    }
  }

  // Update the viewDetail method to load saved data
  viewDetail(itemCuring: string, partNumber: number): void {
    this.selectedItemCuring = itemCuring; // Save selected itemCuring
    this.selectedPartNumber = partNumber; // Save selected partnumber

    console.log('Item Curing:', itemCuring);
    console.log('Item Curing:', partNumber);


    if (itemCuring) {
      // Check if saved entries exist
      if (this.savedEntries.length > 0) {
        this.loadSavedEntries(); // Load saved data
      } else {
        this.machineEntries = []; // Clear existing data
        this.getMachine(itemCuring); // Fetch fresh data
      }

      // Show the modal
      $('#dmpModal').modal('show');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Item curing not found',
        confirmButtonText: 'OK',
      });
    }
  }

  mesin: string = '';

  gedungOptions: string[] = ['Gedung G', 'Gedung C', 'Gedung D', 'Gedung A', 'Gedung B', 'Gedung H'];
  selectedGedung: string = '';
  machineEntries: Array<{ selectedGedung: string, filteredMesinOptions: string[], selectedMachine: string }> = [];
  selectedMachine: string = '';
  mesinOptions: string[] = []; // All machines from the API

  // Method for selecting Gedung
  onGedungSelect(entry: any, selectedGedung: string): void {
    entry.filteredMesinOptions = this.filterMachines(selectedGedung);
  }

  filterMachines(selectedGedung: string): string[] {
    if (!selectedGedung) return this.mesinOptions;

    // Filter options based on Gedung
    if (selectedGedung === 'Gedung G') {
      return this.mesinOptions.filter((mesin) => mesin.toLowerCase().includes('gd g'));
    } else if (selectedGedung === 'Gedung C') {
      return this.mesinOptions.filter((mesin) => mesin.toLowerCase().includes('gd c'));
    } else if (selectedGedung === 'Gedung D') {
      return this.mesinOptions.filter((mesin) => mesin.toLowerCase().includes('gd d'));
    } else if (selectedGedung === 'Gedung A') {
      return this.mesinOptions.filter((mesin) => mesin.toLowerCase().includes('gd a'));
    } else if (selectedGedung === 'Gedung B') {
      return this.mesinOptions.filter((mesin) => mesin.toLowerCase().includes('gd b'));
    } else if (selectedGedung === 'Gedung H') {
      return this.mesinOptions.filter((mesin) => mesin.toLowerCase().includes('gd h'));
    }

    return this.mesinOptions;
  }

  // Function to fetch machines from the API based on the selected item curing
  getMachine(itemCuring: string): void {
    this.mpService.getAllMachineByItemCuring(itemCuring).subscribe(
      (response: ApiResponse<any>) => {
        const machines = response.data.map((machine: any) => machine.operationShortText);
        this.mesinOptions = machines;

        // Set machines only for the latest added row
        if (this.machineEntries.length > 0) {
          const lastEntry = this.machineEntries[this.machineEntries.length - 1];
          lastEntry.filteredMesinOptions = [...machines]; // Independent copy
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load machines: ' + error.message,
          confirmButtonText: 'OK',
        });
      }
    );
  }


  // Add row functionality
  addRow(): void {
    if (this.selectedItemCuring) {
      // Add new row with independent filteredMesinOptions
      this.machineEntries.push({
        selectedGedung: '',
        filteredMesinOptions: [...this.mesinOptions], // Create a fresh copy
        selectedMachine: ''
      });

      // Fetch machines for the selected item curing (if not already fetched)
      if (!this.mesinOptions.length) {
        this.getMachine(this.selectedItemCuring);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Item Curing not selected',
        confirmButtonText: 'OK',
      });
    }
  }

  // Method untuk menghapus entri dari tabel
  removeEntry(entry: any) {
    const index = this.machineEntries.indexOf(entry);
    if (index > -1) {
      this.machineEntries.splice(index, 1);
    }
  }
  frontRearCounter: number = 1;
  i: number = 1;

  //FRONT REAR  
  // FRONT REAR  
  addToSelectedList() {
    const selectedItems = this.dataSourceDmo.data.filter((mo) => mo.selected);
  
    if (selectedItems.length > 0) {
      this.isCheckboxInvalid = false; // Reset validasi jika ada data yang dicentang
      const currentFrontRear = this.frontRearCounter;
  
      selectedItems.forEach((item) => {
        this.selectedList.push({
          ...item,
          frontRear: currentFrontRear
        });
      });
  
      this.frontRearCounter++;
      this.dataSourceDmo.data.forEach((mo) => (mo.selected = false)); // Reset checkbox
      this.showFrontRear = true; // Tampilkan tabel list
    } else {
      this.isCheckboxInvalid = true; // Tampilkan validasi
      this.showFrontRear = false; // Sembunyikan tabel list
  
      // Tampilkan pesan kesalahan menggunakan SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please check at least one item before adding to the list.',
        confirmButtonText: 'OK'
      });
    }
  }

  saveDataFrontRear() {
    // Construct FrontRear objects from selectedList
    const frontRearItems: FrontRear[] = this.selectedList.map(item => ({
      id_FRONT_REAR: item.frontRear,
      detail_ID_MO: item.detailId,
      status: 1,
      creation_DATE: new Date(),
      created_BY: null,
      last_UPDATE_DATE: new Date(),
      last_UPDATED_BY: null,
    }));
  
    console.log(this.selectedList.length);
    console.table(frontRearItems);
  
    // Call the API to save the FrontRear items as a batch
    return this.frontrear.saveFrontRearItems(frontRearItems);
  }

  saveTempMachineProduct() {
    // Construct FrontRear objects from selectedList
    const Tempitem: TempMachineProduct[] = this.selectedList.map(item => ({
      part_NUMBER: item.frontRear,
      work_CENTER_TEXT: item.detailId
    }));
  
    console.log(this.selectedList.length);
  
    // Call the API to save the FrontRear items as a batch
    return this.frontrear.saveTempMachineProduct(Tempitem);
  }
  
  updateLimitHeaderMO() {
    console.log('PPP');
  
    // Mengambil data dari form
    const headerMarketingOrder: HeaderMarketingOrder = {
      headerId: 0, // Atur sesuai kebutuhan
      moId: this.idMo, // Pastikan ada kontrol untuk moId di form
      month: this.formHeaderMo.get('date').value, // Pastikan ada kontrol untuk date di form
      wdNormalTire: Number(this.formHeaderMo.get('nwt_0').value),
      wdOtTl: Number(this.formHeaderMo.get('ot_wt_0').value),
      wdOtTt: Number(this.formHeaderMo.get('ot_wt_1').value),
      wdNormalTube: Number(this.formHeaderMo.get('nwd_0').value),
      wdOtTube: Number(this.formHeaderMo.get('ot_wt_2').value),
      totalWdTl: Number(this.formHeaderMo.get('total_wt_0').value),
      totalWdTt: Number(this.formHeaderMo.get('total_wt_1').value),
      totalWdTube: Number(this.formHeaderMo.get('total_wt_2').value),
      maxCapTube: Number(this.formHeaderMo.get('max_tube_capa_0').value),
      maxCapTl: Number(this.formHeaderMo.get('max_capa_tl_0').value),
      maxCapTt: Number(this.formHeaderMo.get('max_capa_tt_0').value),
      airbagMachine: Number(this.formHeaderMo.get('machine_airbag_m0').value),
      tl: Number(this.formHeaderMo.get('fed_tl_m0').value),
      tt: Number(this.formHeaderMo.get('fed_tt_m0').value),
      totalMo: Number(this.formHeaderMo.get('total_mo_m0').value),
      tlPercentage: Number(this.formHeaderMo.get('fed_TL_percentage_m0').value),
      ttPercentage: Number(this.formHeaderMo.get('fed_TT_percentage_m0').value),
      noteOrderTl: this.formHeaderMo.get('note_tl_m0').value,
      minLimit0: Number(this.formHeaderMo.get('minLimit_0_2000').value),
      maxLimit0: Number(this.formHeaderMo.get('maxLimit_0_2000').value),
      minLimit1: Number(this.formHeaderMo.get('minLimit_2001_10000').value),
      maxLimit1: Number(this.formHeaderMo.get('maxLimit_2001_10000').value),
      minLimit2: Number(this.formHeaderMo.get('minLimit_10001_100000').value),
      maxLimit2: Number(this.formHeaderMo.get('maxLimit_10001_100000').value),
      minLimit3: Number(this.formHeaderMo.get('minLimit_gt_100000').value),
      maxLimit3: Number(this.formHeaderMo.get('maxLimit_gt_100000').value),
      mouldChange: 0, // Atur sesuai kebutuhan
      looping: Number(this.formHeaderMo.get('looping_m0').value), // Pastikan ada kontrol untuk looping di form
      status: 1 // Atur sesuai kebutuhan
    };
  
    // Mengupdate limit header MO
    return this.moService.updateLimitHeaderMO([headerMarketingOrder]);
  }
  
  saveAndUpdate() {
    const saveFrontRear$ = this.saveDataFrontRear();
    const updateHeaderMo$ = this.updateLimitHeaderMO();
  
    if (!saveFrontRear$ || !updateHeaderMo$) {
      return; // Handle if either operation is invalid
    }
  
    // Execute both operations and show a combined response
    saveFrontRear$.subscribe(
      () => {
        updateHeaderMo$.subscribe(
          () => {
            Swal.fire({
              title: 'Success!',
              text: 'Data Marketing Order successfully processed.',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                this.navigateToViewMo();
              }
            });
          },
          (err) => {
            Swal.fire('Error!', 'Error updating data Limit Marketing Order.', 'error');
          }
        );
      },
      (err) => {
        Swal.fire('Error!', 'Error inserting data Front Rear.', 'error');
      }
    );
  }

}