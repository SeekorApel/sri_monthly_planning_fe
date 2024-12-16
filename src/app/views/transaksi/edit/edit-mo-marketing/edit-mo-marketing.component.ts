import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailMarketingOrder } from 'src/app/models/DetailMarketingOrder';
import { HeaderMarketingOrder } from 'src/app/models/HeaderMarketingOrder';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { ApiResponse } from 'src/app/response/Response';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import Swal from 'sweetalert2';
import * as ExcelJS from 'exceljs/dist/exceljs.min.js';
import * as XLSX from 'xlsx';
declare var $: any;
import { saveAs } from 'file-saver';
import { ParsingNumberService } from 'src/app/utils/parsing-number/parsing-number.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-edit-mo-marketing',
  templateUrl: './edit-mo-marketing.component.html',
  styleUrls: ['./edit-mo-marketing.component.scss'],
})
export class EditMoMarketingComponent implements OnInit {
  //Variable Declaration
  idMo: string;
  capacityDb: string = '';
  searchTextDmo: string = '';
  formHeaderMo: FormGroup;
  isReadOnly: boolean = true;
  monthNames: string[] = ['', '', ''];
  allData: any;
  lastIdMo: string = '';
  file: File | null = null;
  isSubmitted: boolean = false;
  typeMo: string = '';
  loading: boolean = false;
  dateMo: string = '';

  //Error message
  errorMessagesM0: string[] = [];
  errorMessagesM1: string[] = [];
  errorMessagesM2: string[] = [];

  marketingOrder: MarketingOrder = new MarketingOrder();
  headerMarketingOrder: any[] = [];
  detailMarketingOrder: DetailMarketingOrder[] = [];

  headersColumns: string[] = ['no', 'category', 'partNumber', 'description', 'machineType', 'capacity', 'mouldMonthlyPlan', 'qtyPerRak', 'minOrder', 'maxCap', 'initialStock', 'salesForecast', 'marketingOrder', 'itemCuring'];
  childHeadersColumns: string[] = ['maxCapMonth0', 'maxCapMonth1', 'maxCapMonth2', 'sfMonth0', 'sfMonth1', 'sfMonth2', 'moMonth0', 'moMonth1', 'moMonth2'];
  rowData: string[] = ['no', 'category', 'partNumber', 'description', 'machineType', 'capacity', 'mouldMonthlyPlan', 'qtyPerRak', 'minOrder', 'maxCapMonth0', 'maxCapMonth1', 'maxCapMonth2', 'initialStock', 'sfMonth0', 'sfMonth1', 'sfMonth2', 'moMonth0', 'moMonth1', 'moMonth2', 'itemCuring'];
  dataSource: MatTableDataSource<DetailMarketingOrder>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private fb: FormBuilder, private moService: MarketingOrderService, private parsingNumberService: ParsingNumberService) {
    this.formHeaderMo = this.fb.group({
      date: [null, []],
      type: [null, []],
      revision: [null, []],
      month_0: [null, Validators.required],
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
      nwd_0: [null, Validators.required],
      nwd_1: [null, Validators.required],
      nwd_2: [null, Validators.required],
      tl_ot_wd_0: [null, [Validators.required, Validators.min(0)]],
      tt_ot_wd_0: [null, [Validators.required, Validators.min(0)]],
      tl_ot_wd_1: [null, [Validators.required, Validators.min(0)]],
      tt_ot_wd_1: [null, [Validators.required, Validators.min(0)]],
      tl_ot_wd_2: [null, [Validators.required, Validators.min(0)]],
      tt_ot_wd_2: [null, [Validators.required, Validators.min(0)]],
      total_tlwd_0: [null, []],
      total_ttwd_0: [null, []],
      total_tlwd_1: [null, []],
      total_ttwd_1: [null, []],
      total_tlwd_2: [null, []],
      total_ttwd_2: [null, []],
      max_tube_capa_0: [null, [Validators.required, Validators.min(0)]],
      max_tube_capa_1: [null, [Validators.required, Validators.min(0)]],
      max_tube_capa_2: [null, [Validators.required, Validators.min(0)]],
      max_capa_tl_0: [null, [Validators.required, Validators.min(0)]],
      max_capa_tt_0: [null, [Validators.required, Validators.min(0)]],
      max_capa_tl_1: [null, [Validators.required, Validators.min(0)]],
      max_capa_tt_1: [null, [Validators.required, Validators.min(0)]],
      max_capa_tl_2: [null, [Validators.required, Validators.min(0)]],
      max_capa_tt_2: [null, [Validators.required, Validators.min(0)]],
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
    });

    this.moService.getCapacity().subscribe(
      (response: ApiResponse<any>) => {
        this.capacityDb = response.data;
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

  ngOnInit(): void {
    this.idMo = this.activeRoute.snapshot.paramMap.get('idMo');
    this.getAllData(this.idMo);
    this.getLastIdMo();
  }

  resetFileInput() {
    this.fileInput.nativeElement.value = '';
  }

  onInputFormat(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const numericValue = value.replace(/\./g, '').replace(/,/g, '.');
    input.value = this.formatNumber(numericValue);
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.charCode || event.keyCode;
    // Cek apakah karakter adalah angka (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onInputChangeM0(mo: any, value: string) {
    if (value === ' ' || value === null) {
      mo.moMonth0 = null;
    } else {
      const numericValue = Number(value.replace(/\./g, '').replace(',', '.'));
      mo.moMonth0 = numericValue;
    }
  }

  onInputChangeM1(mo: any, value: string): void {
    const numericValue = Number(value.replace(/\./g, '').replace(',', '.'));
    mo.moMonth1 = numericValue;
  }

  onInputChangeM2(mo: any, value: string): void {
    const numericValue = Number(value.replace(/\./g, '').replace(',', '.'));
    mo.moMonth2 = numericValue;
  }

  formatNumber(value: any): string {
    if (value == null || value === '') {
      return '';
    }
    return Number(value).toLocaleString('id-ID');
  }

  onSearchChange(): void {
    this.dataSource.filter = this.searchTextDmo.trim().toLowerCase();
  }

  resetSearch(): void {
    this.searchTextDmo = '';
    this.dataSource.filter = '';
  }

  onModelChange(value: string, mo: any, field: string) {
    const numberValue = value ? Number(value.replace(/\./g, '')) : null;
    mo[field] = numberValue;
  }

  isInvalidValue(value: any | null | undefined, index: number): boolean {
    let data = this.detailMarketingOrder[index];
    return false;
  }

  formatNumberChange(value: number | null | undefined): string {
    return value != null ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
  }

  parseFormattedValue(formattedValue: string | null): number | null {
    if (formattedValue && typeof formattedValue === 'string') {
      const numericString = formattedValue.replace(/\./g, '').replace(/,/g, '.');
      return parseFloat(numericString);
    }
    return null;
  }

  getLastIdMo(): void {
    this.moService.getLastIdMo().subscribe(
      (response: ApiResponse<string>) => {
        this.lastIdMo = response.data;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load data: ' + error.message,
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
    this.typeMo = data.type;
    this.headerMarketingOrder = data.dataHeaderMo;
    const monthFn = new Date(this.headerMarketingOrder[0].month).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    this.dateMo = monthFn;
    this.detailMarketingOrder = data.dataDetailMo;
    this.dataSource = new MatTableDataSource(this.detailMarketingOrder);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    let typeProduct = data.type;
    this.formHeaderMo.patchValue({
      date: new Date(data.dateValid).toISOString().split('T')[0],
      type: data.type,
      revision: data.revisionMarketing,

      // Header Month 1
      month_0: this.formatDateToString(this.headerMarketingOrder[0].month),
      nwd_0: this.formatDecimalView(this.headerMarketingOrder[0].wdNormalTire),
      nwt_0: this.formatDecimalView(this.headerMarketingOrder[0].wdNormalTube),
      ot_wt_0: this.formatDecimalView(this.headerMarketingOrder[0].wdOtTube),
      tl_ot_wd_0: this.formatDecimalView(this.headerMarketingOrder[0].wdOtTl),
      tt_ot_wd_0: this.formatDecimalView(this.headerMarketingOrder[0].wdOtTt),
      total_wt_0: this.formatDecimalView(this.headerMarketingOrder[0].totalWdTube),
      total_tlwd_0: this.formatDecimalView(this.headerMarketingOrder[0].totalWdTl),
      total_ttwd_0: this.formatDecimalView(this.headerMarketingOrder[0].totalWdTt),
      max_tube_capa_0: this.formatSeparatorView(this.headerMarketingOrder[0].maxCapTube),
      max_capa_tl_0: this.formatSeparatorView(this.headerMarketingOrder[0].maxCapTl),
      max_capa_tt_0: this.formatSeparatorView(this.headerMarketingOrder[0].maxCapTt),
      machine_airbag_m0: this.formatSeparatorView(this.headerMarketingOrder[0].airbagMachine),
      fed_tl_m0: typeProduct === 'FED' ? this.formatSeparatorView(this.headerMarketingOrder[0].tl) : null,
      fed_tt_m0: typeProduct === 'FED' ? this.formatSeparatorView(this.headerMarketingOrder[0].tt) : null,
      fdr_tl_m0: typeProduct === 'FDR' ? this.formatSeparatorView(this.headerMarketingOrder[0].tl) : null,
      fdr_tt_m0: typeProduct === 'FDR' ? this.formatSeparatorView(this.headerMarketingOrder[0].tt) : null,
      fed_TL_percentage_m0: typeProduct === 'FED' ? this.formatDecimalView(this.headerMarketingOrder[0].tlPercentage) : null,
      fed_TT_percentage_m0: typeProduct === 'FED' ? this.formatDecimalView(this.headerMarketingOrder[0].ttPercentage) : null,
      fdr_TL_percentage_m0: typeProduct === 'FDR' ? this.formatDecimalView(this.headerMarketingOrder[0].tlPercentage) : null,
      fdr_TT_percentage_m0: typeProduct === 'FDR' ? this.formatDecimalView(this.headerMarketingOrder[0].ttPercentage) : null,
      total_mo_m0: this.formatSeparatorView(this.headerMarketingOrder[0].totalMo),
      note_tl_m0: this.headerMarketingOrder[0].noteOrderTl,

      // Header Month 2
      month_1: this.formatDateToString(this.headerMarketingOrder[1].month),
      nwd_1: this.formatDecimalView(this.headerMarketingOrder[1].wdNormalTire),
      nwt_1: this.formatDecimalView(this.headerMarketingOrder[1].wdNormalTube),
      ot_wt_1: this.formatDecimalView(this.headerMarketingOrder[1].wdOtTube),
      tl_ot_wd_1: this.formatDecimalView(this.headerMarketingOrder[1].wdOtTl),
      tt_ot_wd_1: this.formatDecimalView(this.headerMarketingOrder[1].wdOtTt),
      total_wt_1: this.formatDecimalView(this.headerMarketingOrder[1].totalWdTube),
      total_tlwd_1: this.formatDecimalView(this.headerMarketingOrder[1].totalWdTl),
      total_ttwd_1: this.formatDecimalView(this.headerMarketingOrder[1].totalWdTt),
      max_tube_capa_1: this.formatSeparatorView(this.headerMarketingOrder[1].maxCapTube),
      max_capa_tl_1: this.formatSeparatorView(this.headerMarketingOrder[1].maxCapTl),
      max_capa_tt_1: this.formatSeparatorView(this.headerMarketingOrder[1].maxCapTt),
      machine_airbag_m1: this.formatSeparatorView(this.headerMarketingOrder[1].airbagMachine),
      fed_tl_m1: typeProduct === 'FED' ? this.formatSeparatorView(this.headerMarketingOrder[1].tl) : null,
      fed_tt_m1: typeProduct === 'FED' ? this.formatSeparatorView(this.headerMarketingOrder[1].tt) : null,
      fdr_tl_m1: typeProduct === 'FDR' ? this.formatSeparatorView(this.headerMarketingOrder[1].tl) : null,
      fdr_tt_m1: typeProduct === 'FDR' ? this.formatSeparatorView(this.headerMarketingOrder[1].tt) : null,
      fed_TL_percentage_m1: typeProduct === 'FED' ? this.formatDecimalView(this.headerMarketingOrder[1].tlPercentage) : null,
      fed_TT_percentage_m1: typeProduct === 'FED' ? this.formatDecimalView(this.headerMarketingOrder[1].ttPercentage) : null,
      fdr_TL_percentage_m1: typeProduct === 'FDR' ? this.formatDecimalView(this.headerMarketingOrder[1].tlPercentage) : null,
      fdr_TT_percentage_m1: typeProduct === 'FDR' ? this.formatDecimalView(this.headerMarketingOrder[1].ttPercentage) : null,
      total_mo_m1: this.formatSeparatorView(this.headerMarketingOrder[1].totalMo),
      note_tl_m1: this.headerMarketingOrder[1].noteOrderTl,

      // Header Month 3
      month_2: this.formatDateToString(this.headerMarketingOrder[2].month),
      nwd_2: this.formatDecimalView(this.headerMarketingOrder[2].wdNormalTire),
      nwt_2: this.formatDecimalView(this.headerMarketingOrder[2].wdNormalTube),
      ot_wt_2: this.formatDecimalView(this.headerMarketingOrder[2].wdOtTube),
      tl_ot_wd_2: this.formatDecimalView(this.headerMarketingOrder[2].wdOtTl),
      tt_ot_wd_2: this.formatDecimalView(this.headerMarketingOrder[2].wdOtTt),
      total_wt_2: this.formatDecimalView(this.headerMarketingOrder[2].totalWdTube),
      total_tlwd_2: this.formatDecimalView(this.headerMarketingOrder[2].totalWdTl),
      total_ttwd_2: this.formatDecimalView(this.headerMarketingOrder[2].totalWdTt),
      max_tube_capa_2: this.formatSeparatorView(this.headerMarketingOrder[2].maxCapTube),
      max_capa_tl_2: this.formatSeparatorView(this.headerMarketingOrder[2].maxCapTl),
      max_capa_tt_2: this.formatSeparatorView(this.headerMarketingOrder[2].maxCapTt),
      machine_airbag_m2: this.formatSeparatorView(this.headerMarketingOrder[2].airbagMachine),
      fed_tl_m2: typeProduct === 'FED' ? this.formatSeparatorView(this.headerMarketingOrder[2].tl) : null,
      fed_tt_m2: typeProduct === 'FED' ? this.formatSeparatorView(this.headerMarketingOrder[2].tt) : null,
      fdr_tl_m2: typeProduct === 'FDR' ? this.formatSeparatorView(this.headerMarketingOrder[2].tl) : null,
      fdr_tt_m2: typeProduct === 'FDR' ? this.formatSeparatorView(this.headerMarketingOrder[2].tt) : null,
      fed_TL_percentage_m2: typeProduct === 'FED' ? this.formatDecimalView(this.headerMarketingOrder[2].tlPercentage) : null,
      fed_TT_percentage_m2: typeProduct === 'FED' ? this.formatDecimalView(this.headerMarketingOrder[2].ttPercentage) : null,
      fdr_TL_percentage_m2: typeProduct === 'FDR' ? this.formatDecimalView(this.headerMarketingOrder[2].tlPercentage) : null,
      fdr_TT_percentage_m2: typeProduct === 'FDR' ? this.formatDecimalView(this.headerMarketingOrder[2].ttPercentage) : null,
      total_mo_m2: this.formatSeparatorView(this.headerMarketingOrder[2].totalMo),
      note_tl_m2: this.headerMarketingOrder[2].noteOrderTl,
    });

    this.updateMonthNames(this.headerMarketingOrder);
  }

  formatDateToString(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  updateMonthNames(hm: HeaderMarketingOrder[]): void {
    this.monthNames[0] = this.getMonthName(new Date(this.headerMarketingOrder[0].month));
    this.monthNames[1] = this.getMonthName(new Date(this.headerMarketingOrder[1].month));
    this.monthNames[2] = this.getMonthName(new Date(this.headerMarketingOrder[2].month));
  }

  getMonthName(monthValue: Date): string {
    if (monthValue) {
      return monthValue.toLocaleString('default', { month: 'short' }).toUpperCase();
    }
    return '';
  }

  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-mo-marketing']);
  }

  editMo(): void {
    this.isSubmitted = true;
    let hasInvalidInput = false;

    // Group by itemCuring and calculate total moMonth0 for each group
    const curingGroupsM0: { [key: string]: number } = {};
    const curingGroupsM1: { [key: string]: number } = {};
    const curingGroupsM2: { [key: string]: number } = {};

    this.detailMarketingOrder.forEach((dmo) => {
      const moMonth0 = dmo.moMonth0 ? parseFloat(dmo.moMonth0.toString().replace(/\./g, '')) : 0;
      const moMonth1 = dmo.moMonth1 ? parseFloat(dmo.moMonth1.toString().replace(/\./g, '')) : 0;
      const moMonth2 = dmo.moMonth2 ? parseFloat(dmo.moMonth2.toString().replace(/\./g, '')) : 0;

      dmo.validationMessageM0 = '';
      dmo.validationMessageM1 = '';
      dmo.validationMessageM2 = '';

      if (dmo.itemCuring) {
        curingGroupsM0[dmo.itemCuring] = (curingGroupsM0[dmo.itemCuring] || 0) + moMonth0;
        curingGroupsM1[dmo.itemCuring] = (curingGroupsM1[dmo.itemCuring] || 0) + moMonth1;
        curingGroupsM2[dmo.itemCuring] = (curingGroupsM2[dmo.itemCuring] || 0) + moMonth2;
      }

      // Validate moMonth0 and update validation messages
      if (dmo.lockStatusM0 !== 1) {
        if (moMonth0 === null) {
          dmo.validationMessageM0 = 'This field is required';
          hasInvalidInput = true;
        } else if (moMonth0 !== 0 && moMonth0 < dmo.minOrder) {
          dmo.validationMessageM0 = 'MO must not be less than the minimum order.';
          hasInvalidInput = true;
        } else if (moMonth0 > dmo.maxCapMonth0) {
          dmo.validationMessageM0 = 'MO cannot be more than the maximum capacity M1.';
          hasInvalidInput = true;
        } else if (moMonth0 % dmo.qtyPerRak !== 0) {
          dmo.validationMessageM0 = `MO must be a multiple of ${dmo.qtyPerRak}.`;
          hasInvalidInput = true;
        }
      }

      // Validate moMonth1 and update validation messages
      if (dmo.lockStatusM1 !== 1) {
        if (moMonth1 === null) {
          dmo.validationMessageM1 = 'This field is required';
          hasInvalidInput = true;
        } else if (moMonth1 !== 0 && moMonth1 < dmo.minOrder) {
          dmo.validationMessageM1 = 'MO must not be less than the minimum order.';
          hasInvalidInput = true;
        } else if (moMonth1 > dmo.maxCapMonth1) {
          dmo.validationMessageM1 = 'MO cannot be more than the maximum capacity M2.';
          hasInvalidInput = true;
        } else if (moMonth1 % dmo.qtyPerRak !== 0) {
          dmo.validationMessageM1 = `MO must be a multiple of ${dmo.qtyPerRak}.`;
          hasInvalidInput = true;
        }
      }

      // Validate moMonth2 and update validation messages
      if (dmo.lockStatusM2 !== 1) {
        if (moMonth2 === null) {
          dmo.validationMessageM2 = 'This field is required';
          hasInvalidInput = true;
        } else if (moMonth2 !== 0 && moMonth2 < dmo.minOrder) {
          dmo.validationMessageM2 = 'MO must not be less than the minimum order.';
          hasInvalidInput = true;
        } else if (moMonth2 > dmo.maxCapMonth2) {
          dmo.validationMessageM2 = 'MO cannot be more than the maximum capacity M3.';
          hasInvalidInput = true;
        } else if (moMonth2 % dmo.qtyPerRak !== 0) {
          dmo.validationMessageM2 = `MO must be a multiple of ${dmo.qtyPerRak}.`;
          hasInvalidInput = true;
        }
      }
    });

    this.detailMarketingOrder.forEach((dmo) => {
      if (dmo.itemCuring) {
        if (curingGroupsM0[dmo.itemCuring] > dmo.maxCapMonth0) {
          if (!dmo.validationMessageM0) {
            dmo.validationMessageM0 = 'Maximal Capacity with the same curing item is overloaded';
            hasInvalidInput = true;
          }
        }
        if (curingGroupsM1[dmo.itemCuring] > dmo.maxCapMonth1) {
          if (!dmo.validationMessageM1) {
            dmo.validationMessageM1 = 'Maximal Capacity with the same curing item is overloaded';
            hasInvalidInput = true;
          }
        }
        if (curingGroupsM2[dmo.itemCuring] > dmo.maxCapMonth2) {
          if (!dmo.validationMessageM2) {
            dmo.validationMessageM2 = 'Maximal Capacity with the same curing item is overloaded';
            hasInvalidInput = true;
          }
        }
      }
    });

    if (hasInvalidInput) {
      Swal.fire({
        title: 'Warning!',
        text: 'There is an invalid input on the marketing order form.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    //Validasi Total
    const maxCapTubeM0 = this.headerMarketingOrder[0].maxCapTube;
    const maxCapTlM0 = this.headerMarketingOrder[0].maxCapTl;
    const maxCapTtM0 = this.headerMarketingOrder[0].maxCapTt;

    const maxCapTubeM1 = this.headerMarketingOrder[1].maxCapTube;
    const maxCapTlM1 = this.headerMarketingOrder[1].maxCapTl;
    const maxCapTtM1 = this.headerMarketingOrder[1].maxCapTt;

    const maxCapTubeM2 = this.headerMarketingOrder[2].maxCapTube;
    const maxCapTlM2 = this.headerMarketingOrder[2].maxCapTl;
    const maxCapTtM2 = this.headerMarketingOrder[2].maxCapTt;

    let totalMoTTubeMonth0 = 0;
    let totalMoTTMonth0 = 0;
    let totalMoTLMonth0 = 0;

    let totalMoTTubeMonth1 = 0;
    let totalMoTTMonth1 = 0;
    let totalMoTLMonth1 = 0;

    let totalMoTTubeMonth2 = 0;
    let totalMoTTMonth2 = 0;
    let totalMoTLMonth2 = 0;

    this.detailMarketingOrder.forEach((dmo) => {
      if (dmo.category.includes('TL')) {
        totalMoTLMonth0 += dmo.moMonth0;
        totalMoTLMonth1 += dmo.moMonth1;
        totalMoTLMonth2 += dmo.moMonth2;
      }
      if (dmo.category.includes('TT')) {
        totalMoTTMonth0 += dmo.moMonth0;
        totalMoTTMonth1 += dmo.moMonth1;
        totalMoTTMonth2 += dmo.moMonth2;
      }
      if (dmo.category.includes('TUBE')) {
        totalMoTTubeMonth0 += dmo.moMonth0;
        totalMoTTubeMonth1 += dmo.moMonth1;
        totalMoTTubeMonth2 += dmo.moMonth2;
      }
    });

    //Validasi Total Mo TL
    if (totalMoTLMonth0 > maxCapTlM0) {
      Swal.fire({
        title: 'Warning!',
        text: `Total Marketing Order TL must not exceed the total Maximum Capacity of TL 1st month (${this.formatSeparatorView(maxCapTlM0)}).`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (totalMoTLMonth1 > maxCapTlM1) {
      Swal.fire({
        title: 'Warning!',
        text: `Total Marketing Order TL must not exceed the total Maximum Capacity of TL 2st month (${this.formatSeparatorView(maxCapTlM1)}).`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (totalMoTLMonth2 > maxCapTlM2) {
      Swal.fire({
        title: 'Warning!',
        text: `Total Marketing Order TL must not exceed the total Maximum Capacity of TL 3st month (${this.formatSeparatorView(maxCapTlM2)}).`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
    //Validasi End Total Mo TL

    //Validasi Total Mo TT
    if (totalMoTTMonth0 > maxCapTtM0) {
      Swal.fire({
        title: 'Warning!',
        text: `Total Marketing Order TT must not exceed the total Maximum Capacity of TT 1st month (${this.formatSeparatorView(maxCapTtM0)}).`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (totalMoTTMonth1 > maxCapTtM1) {
      Swal.fire({
        title: 'Warning!',
        text: `Total Marketing Order TT must not exceed the total Maximum Capacity of TT 2st month (${this.formatSeparatorView(maxCapTtM1)}).`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (totalMoTTMonth2 > maxCapTtM2) {
      Swal.fire({
        title: 'Warning!',
        text: `Total Marketing Order TT must not exceed the total Maximum Capacity of TT 3st month (${this.formatSeparatorView(maxCapTtM2)}).`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
    //Validasi End Total Mo TT

    //Validasi Total Mo Tube
    if (totalMoTTubeMonth0 > maxCapTubeM0) {
      Swal.fire({
        title: 'Warning!',
        text: `Total Marketing Order Tube must not exceed the total Maximum Capacity of Tube 1st month (${this.formatSeparatorView(maxCapTubeM0)}).`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (totalMoTTubeMonth1 > maxCapTubeM1) {
      Swal.fire({
        title: 'Warning!',
        text: `Total Marketing Order Tube must not exceed the total Maximum Capacity of Tube 2st month (${this.formatSeparatorView(maxCapTubeM1)}).`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (totalMoTTubeMonth2 > maxCapTubeM2) {
      Swal.fire({
        title: 'Warning!',
        text: `Total Marketing Order Tube must not exceed the total Maximum Capacity of Tube 3st month (${this.formatSeparatorView(maxCapTubeM2)}).`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
    //Validasi End Total Mo Tube

    //End Validasi Total

    const type = this.formHeaderMo.get('type')?.value;

    //Set data Save MO
    this.marketingOrder.moId = this.lastIdMo;
    this.marketingOrder.dateValid = this.formHeaderMo.get('date')?.value;
    this.marketingOrder.type = this.formHeaderMo.get('type')?.value;
    this.marketingOrder.revisionMarketing = this.formHeaderMo.get('revision')?.value;
    this.marketingOrder.revisionPpc = this.allData.revisionPpc;
    this.marketingOrder.month0 = new Date(this.formHeaderMo.get('month_0')?.value);
    this.marketingOrder.month1 = new Date(this.formHeaderMo.get('month_1')?.value);
    this.marketingOrder.month2 = new Date(this.formHeaderMo.get('month_2')?.value);
    this.marketingOrder.statusFilled = this.allData.statusFilled;

    //Set data save Header Mo
    this.headerMarketingOrder = [];
    for (let i = 0; i < 3; i++) {
      const tlField = type === 'FDR' ? `fdr_tl_m${i}` : `fed_tl_m${i}`;
      const ttField = type === 'FDR' ? `fdr_tt_m${i}` : `fed_tt_m${i}`;

      const tlFieldPercentage = type === 'FDR' ? `fdr_TL_percentage_m${i}` : `fed_TL_percentage_m${i}`;
      const ttFieldPercentage = type === 'FDR' ? `fdr_TT_percentage_m${i}` : `fed_TT_percentage_m${i}`;

      this.headerMarketingOrder.push({
        moId: this.lastIdMo,
        month: new Date(this.formHeaderMo.get(`month_${i}`)?.value),
        wdNormalTire: this.parseFormattedValue(this.formHeaderMo.get(`nwd_${i}`)?.value),
        wdNormalTube: this.parseFormattedValue(this.formHeaderMo.get(`nwt_${i}`)?.value),
        wdOtTube: this.parseFormattedValue(this.formHeaderMo.get(`ot_wt_${i}`)?.value),
        wdOtTl: this.parseFormattedValue(this.formHeaderMo.get(`tl_ot_wd_${i}`)?.value),
        wdOtTt: this.parseFormattedValue(this.formHeaderMo.get(`tt_ot_wd_${i}`)?.value),
        totalWdTube: this.parseFormattedValue(this.formHeaderMo.get(`total_wt_${i}`)?.value),
        totalWdTl: this.parseFormattedValue(this.formHeaderMo.get(`total_tlwd_${i}`)?.value || ''),
        totalWdTt: this.parseFormattedValue(this.formHeaderMo.get(`total_ttwd_${i}`)?.value || ''),
        maxCapTube: this.parseFormattedValue(this.formHeaderMo.get(`max_tube_capa_${i}`)?.value || ''),
        maxCapTl: this.parseFormattedValue(this.formHeaderMo.get(`max_capa_tl_${i}`)?.value || ''),
        maxCapTt: this.parseFormattedValue(this.formHeaderMo.get(`max_capa_tt_${i}`)?.value || ''),
        looping: this.parseFormattedValue(this.formHeaderMo.get(`looping_m${i}`)?.value || ''),
        airbagMachine: this.parseFormattedValue(this.formHeaderMo.get(`machine_airbag_m${i}`)?.value || ''),
        tl: this.parseFormattedValue(this.formHeaderMo.get(tlField)?.value || ''),
        tt: this.parseFormattedValue(this.formHeaderMo.get(ttField)?.value || ''),
        totalMo: this.parseFormattedValue(this.formHeaderMo.get(`total_mo_m${i}`)?.value || ''),
        tlPercentage: this.parseFormattedValue(this.formHeaderMo.get(tlFieldPercentage)?.value || ''),
        ttPercentage: this.parseFormattedValue(this.formHeaderMo.get(ttFieldPercentage)?.value || ''),
        noteOrderTl: this.formHeaderMo.get(`note_tl_m${i}`)?.value,
      });
    }

    this.detailMarketingOrder.forEach((mo) => {
      mo.moId = this.lastIdMo;
    });

    const revisionMo = {
      marketingOrder: this.marketingOrder,
      headerMarketingOrder: this.headerMarketingOrder,
      detailMarketingOrder: this.detailMarketingOrder,
    };

    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while save data marketing order.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.loading = true;
    this.moService.updateMarketingOrderMarketing(revisionMo).subscribe(
      (response) => {
        Swal.close();
        Swal.fire({
          title: 'Success!',
          text: 'Data Marketing Order successfully Revision.',
          icon: 'success',
          allowOutsideClick: false,
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            this.navigateToViewMo();
          }
        });
        this.loading = false;
      },
      (err) => {
        Swal.close();
        Swal.fire('Error!', 'Error insert data Marketing Order.', 'error');
        this.loading = false;
      }
    );
  }

  downloadTemplate() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Form Input MO');
    const month0 = this.monthNames[0];
    const month1 = this.monthNames[1];
    const month2 = this.monthNames[2];
    const type = this.typeMo;

    const formattedMonths = this.headerMarketingOrder.map((item) => {
      const date = new Date(item.month);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    });

    // Fungsi untuk mengatur border pada suatu range sel
    const setBorder = (cellRange: ExcelJS.Cell) => {
      cellRange.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    };

    //Header
    worksheet.mergeCells('B1:L2');
    worksheet.getCell('B1').value = 'Form Input Marketing Order';
    worksheet.getCell('B1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B1').font = {
      name: 'Candara',
      size: 20,
      bold: true,
    };

    worksheet.mergeCells('B3:L5');
    worksheet.getCell('B3').value = `${month0} - ${month1} - ${month2}`;
    worksheet.getCell('B3').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('B3').font = {
      name: 'Candara',
      size: 20,
      bold: true,
    };

    worksheet.mergeCells('N1:P1');
    worksheet.getCell('N1').value = 'Description';
    worksheet.getCell('N1').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N1'));
    worksheet.getCell('N1').font = { name: 'Calibri Body', size: 11, bold: true, italic: true };
    worksheet.getCell('N1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('Q1').value = month0;
    setBorder(worksheet.getCell('Q1'));

    worksheet.getCell('R1').value = month1;
    setBorder(worksheet.getCell('R1'));

    worksheet.getCell('S1').value = month2;
    setBorder(worksheet.getCell('S1'));

    ['Q1', 'R1', 'S1'].forEach((cell) => {
      const cellRef = worksheet.getCell(cell);
      cellRef.alignment = { vertical: 'middle', horizontal: 'center' };
      cellRef.font = {
        name: 'Calibri Body',
        size: 11,
        bold: true,
        italic: true,
      };

      // Menambahkan warna pada sel
      cellRef.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDCE6F1' },
      };
    });

    worksheet.mergeCells('N2:P2');
    worksheet.getCell('N2').value = 'Normal Working Day';
    worksheet.getCell('N2').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('N2').font = { name: 'Calibri Body', size: 11, bold: true, italic: true };
    setBorder(worksheet.getCell('N2'));

    worksheet.getCell('Q2').value = this.headerMarketingOrder[0].wdNormalTire; // "Month 1"
    worksheet.getCell('R2').value = this.headerMarketingOrder[1].wdNormalTire; // "Month 2"
    worksheet.getCell('S2').value = this.headerMarketingOrder[2].wdNormalTire; // "Month 3"
    worksheet.getCell('Q2').numFmt = '0.00';
    worksheet.getCell('R2').numFmt = '0.00';
    worksheet.getCell('S2').numFmt = '0.00';

    worksheet.mergeCells('N3:P3');
    worksheet.getCell('N3').value = 'Normal Working Day Tube';
    worksheet.getCell('N3').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('N3').font = { name: 'Calibri Body', size: 11, bold: true, italic: true };
    setBorder(worksheet.getCell('N3'));

    worksheet.getCell('Q3').value = this.headerMarketingOrder[0].wdNormalTube; // "Month 1"
    worksheet.getCell('R3').value = this.headerMarketingOrder[1].wdNormalTube; // "Month 2"
    worksheet.getCell('S3').value = this.headerMarketingOrder[2].wdNormalTube; // "Month 3"
    worksheet.getCell('Q3').numFmt = '0.00';
    worksheet.getCell('R3').numFmt = '0.00';
    worksheet.getCell('S3').numFmt = '0.00';

    worksheet.mergeCells('N4:P4');
    worksheet.getCell('N4').value = 'Workday Overtime Tube';
    worksheet.getCell('N4').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('N4').font = { name: 'Calibri Body', size: 11, bold: true, italic: true };
    setBorder(worksheet.getCell('N4'));
    worksheet.getCell('Q4').value = this.headerMarketingOrder[0].wdOtTube; // "Month 1"
    worksheet.getCell('R4').value = this.headerMarketingOrder[1].wdOtTube; // "Month 2"
    worksheet.getCell('S4').value = this.headerMarketingOrder[2].wdOtTube; // "Month 3"
    worksheet.getCell('Q4').numFmt = '0.00';
    worksheet.getCell('R4').numFmt = '0.00';
    worksheet.getCell('S4').numFmt = '0.00';

    worksheet.mergeCells('N5:P5');
    worksheet.getCell('N5').value = 'Workday Overtime TL';
    worksheet.getCell('N5').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('N5').font = { name: 'Calibri Body', size: 11, bold: true, italic: true };
    setBorder(worksheet.getCell('N5'));
    worksheet.getCell('Q5').value = this.headerMarketingOrder[0].wdOtTl; // "Month 1"
    worksheet.getCell('R5').value = this.headerMarketingOrder[1].wdOtTl; // "Month 2"
    worksheet.getCell('S5').value = this.headerMarketingOrder[2].wdOtTl; // "Month 3"
    worksheet.getCell('Q5').numFmt = '0.00';
    worksheet.getCell('R5').numFmt = '0.00';
    worksheet.getCell('S5').numFmt = '0.00';

    worksheet.mergeCells('N6:P6');
    worksheet.getCell('N6').value = 'Workday Overtime TT';
    worksheet.getCell('N6').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N6'));
    worksheet.getCell('Q6').value = this.headerMarketingOrder[0].wdOtTt; // "Month 1"
    worksheet.getCell('R6').value = this.headerMarketingOrder[1].wdOtTt; // "Month 2"
    worksheet.getCell('S6').value = this.headerMarketingOrder[2].wdOtTt; // "Month 3"
    worksheet.getCell('Q6').numFmt = '0.00';
    worksheet.getCell('R6').numFmt = '0.00';
    worksheet.getCell('S6').numFmt = '0.00';

    worksheet.mergeCells('N7:P7');
    worksheet.getCell('N7').value = 'Total Workday Tube';
    worksheet.getCell('N7').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N7'));
    worksheet.getCell('Q7').value = this.headerMarketingOrder[0].totalWdTube; // "Month 1"
    worksheet.getCell('R7').value = this.headerMarketingOrder[1].totalWdTube; // "Month 2"
    worksheet.getCell('S7').value = this.headerMarketingOrder[2].totalWdTube; // "Month 3"
    worksheet.getCell('Q7').numFmt = '0.00';
    worksheet.getCell('R7').numFmt = '0.00';
    worksheet.getCell('S7').numFmt = '0.00';

    worksheet.mergeCells('N8:P8');
    worksheet.getCell('N8').value = 'Total Workday Tire TL';
    worksheet.getCell('N8').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N8'));
    worksheet.getCell('Q8').value = this.headerMarketingOrder[0].totalWdTl; // "Month 1"
    worksheet.getCell('R8').value = this.headerMarketingOrder[1].totalWdTl; // "Month 2"
    worksheet.getCell('S8').value = this.headerMarketingOrder[2].totalWdTl; // "Month 3"
    worksheet.getCell('Q8').numFmt = '0.00';
    worksheet.getCell('R8').numFmt = '0.00';
    worksheet.getCell('S8').numFmt = '0.00';

    worksheet.mergeCells('N9:P9');
    worksheet.getCell('N9').value = 'Total Workday Tire TT';
    worksheet.getCell('N9').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N9'));
    worksheet.getCell('Q9').value = this.headerMarketingOrder[0].totalWdTt; // "Month 1"
    worksheet.getCell('R9').value = this.headerMarketingOrder[1].totalWdTt; // "Month 2"
    worksheet.getCell('S9').value = this.headerMarketingOrder[2].totalWdTt; // "Month 3"
    worksheet.getCell('Q9').numFmt = '0.00';
    worksheet.getCell('R9').numFmt = '0.00';
    worksheet.getCell('S9').numFmt = '0.00';

    worksheet.mergeCells('N10:P10');
    worksheet.getCell('N10').value = 'Max Capacity Tube';
    worksheet.getCell('N10').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N10'));
    worksheet.getCell('Q10').value = this.headerMarketingOrder[1].maxCapTube; // "Month 1"
    worksheet.getCell('R10').value = this.headerMarketingOrder[2].maxCapTube; // "Month 2"
    worksheet.getCell('S10').value = this.headerMarketingOrder[0].maxCapTube; // "Month 3"
    worksheet.getCell('Q10').numFmt = '#,##0';
    worksheet.getCell('R10').numFmt = '#,##0';
    worksheet.getCell('S10').numFmt = '#,##0';
    worksheet.getCell('N10').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' },
    };

    ['Q10', 'R10', 'S10'].forEach((cell) => {
      const cellRef = worksheet.getCell(cell);
      cellRef.alignment = { vertical: 'middle', horizontal: 'center' };

      cellRef.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9D9D9' },
      };
    });

    worksheet.mergeCells('N11:P11');
    worksheet.getCell('N11').value = 'Max Capacity Tire TL';
    worksheet.getCell('N11').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N11'));
    worksheet.getCell('Q11').value = this.headerMarketingOrder[0].maxCapTl; // "Month 1"
    worksheet.getCell('R11').value = this.headerMarketingOrder[1].maxCapTl; // "Month 2"
    worksheet.getCell('S11').value = this.headerMarketingOrder[2].maxCapTl; // "Month 3"
    worksheet.getCell('Q11').numFmt = '#,##0';
    worksheet.getCell('R11').numFmt = '#,##0';
    worksheet.getCell('S11').numFmt = '#,##0';
    worksheet.getCell('N11').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' },
    };
    ['Q11', 'R11', 'S11'].forEach((cell) => {
      const cellRef = worksheet.getCell(cell);
      cellRef.alignment = { vertical: 'middle', horizontal: 'center' };

      cellRef.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9D9D9' },
      };
    });

    worksheet.mergeCells('N12:P12');
    worksheet.getCell('N12').value = 'Max Capacity Tire TT';
    worksheet.getCell('N12').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N12'));
    worksheet.getCell('Q12').value = this.headerMarketingOrder[0].maxCapTt; // "Month 1"
    worksheet.getCell('R12').value = this.headerMarketingOrder[1].maxCapTt; // "Month 2"
    worksheet.getCell('S12').value = this.headerMarketingOrder[2].maxCapTt; // "Month 3"
    worksheet.getCell('Q12').numFmt = '#,##0';
    worksheet.getCell('R12').numFmt = '#,##0';
    worksheet.getCell('S12').numFmt = '#,##0';
    worksheet.getCell('N12').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' },
    };
    ['Q12', 'R12', 'S12'].forEach((cell) => {
      const cellRef = worksheet.getCell(cell);
      cellRef.alignment = { vertical: 'middle', horizontal: 'center' };

      cellRef.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9D9D9' },
      };
    });

    worksheet.mergeCells('N13:P13');
    worksheet.getCell('N13').value = 'Capacity Machine Airbag';
    worksheet.getCell('N13').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N13'));
    worksheet.getCell('Q13').value = this.headerMarketingOrder[0].airbagMachine; // "Month 1"
    worksheet.getCell('R13').value = this.headerMarketingOrder[1].airbagMachine; // "Month 2"
    worksheet.getCell('S13').value = this.headerMarketingOrder[2].airbagMachine; // "Month 3"
    worksheet.getCell('Q13').numFmt = '#,##0';
    worksheet.getCell('R13').numFmt = '#,##0';
    worksheet.getCell('S13').numFmt = '#,##0';
    ['Q13', 'R13', 'S13'].forEach((cell) => {
      worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.mergeCells('N14:P14');
    worksheet.getCell('N14').value = type === 'FED' ? 'FED TL' : 'FDR TL';
    worksheet.getCell('N14').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N14'));
    worksheet.getCell('Q14').value = this.headerMarketingOrder[0].tl; // "Month 1"
    worksheet.getCell('R14').value = this.headerMarketingOrder[1].tl; // "Month 2"
    worksheet.getCell('S14').value = this.headerMarketingOrder[2].tl; // "Month 3"
    worksheet.getCell('Q14').numFmt = '#,##0';
    worksheet.getCell('R14').numFmt = '#,##0';
    worksheet.getCell('S14').numFmt = '#,##0';
    ['Q14', 'R14', 'S14'].forEach((cell) => {
      worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.mergeCells('N15:P15');
    worksheet.getCell('N15').value = type === 'FED' ? 'FED TT' : 'FDR TT';
    worksheet.getCell('N15').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N15'));
    worksheet.getCell('Q15').value = this.headerMarketingOrder[0].tt; // "Month 1"
    worksheet.getCell('R15').value = this.headerMarketingOrder[1].tt; // "Month 2"
    worksheet.getCell('S15').value = this.headerMarketingOrder[2].tt; // "Month 3"
    worksheet.getCell('Q15').numFmt = '#,##0';
    worksheet.getCell('R15').numFmt = '#,##0';
    worksheet.getCell('S15').numFmt = '#,##0';
    ['Q15', 'R15', 'S15'].forEach((cell) => {
      worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.mergeCells('N16:P16');
    worksheet.getCell('N16').value = 'Total Marketing Order';
    worksheet.getCell('N16').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N16'));
    worksheet.getCell('Q16').value = this.headerMarketingOrder[0].totalMo; // "Month 1"
    worksheet.getCell('R16').value = this.headerMarketingOrder[1].totalMo; // "Month 2"
    worksheet.getCell('S16').value = this.headerMarketingOrder[2].totalMo; // "Month 3"
    worksheet.getCell('Q16').numFmt = '#,##0';
    worksheet.getCell('R16').numFmt = '#,##0';
    worksheet.getCell('S16').numFmt = '#,##0';
    ['Q16', 'R16', 'S16'].forEach((cell) => {
      worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.mergeCells('N17:P17');
    worksheet.getCell('N17').value = type === 'FED' ? '% FED TL' : '% FDR TL';
    worksheet.getCell('N17').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N17'));
    worksheet.getCell('Q17').value = this.headerMarketingOrder[0].tlPercentage; // "Month 1"
    worksheet.getCell('R17').value = this.headerMarketingOrder[1].tlPercentage; // "Month 2"
    worksheet.getCell('S17').value = this.headerMarketingOrder[2].tlPercentage; // "Month 3"
    worksheet.getCell('Q17').numFmt = '0.00';
    worksheet.getCell('R17').numFmt = '0.00';
    worksheet.getCell('S17').numFmt = '0.00';
    ['Q17', 'R17', 'S17'].forEach((cell) => {
      worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.mergeCells('N18:P18');
    worksheet.getCell('N18').value = type === 'FED' ? '% FED TT' : '% FDR TT';
    worksheet.getCell('N18').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N18'));
    worksheet.getCell('Q18').value = this.headerMarketingOrder[0].tlPercentage; // "Month 1"
    worksheet.getCell('R18').value = this.headerMarketingOrder[1].tlPercentage; // "Month 2"
    worksheet.getCell('S18').value = this.headerMarketingOrder[2].tlPercentage; // "Month 3"
    worksheet.getCell('Q18').numFmt = '0.00';
    worksheet.getCell('R18').numFmt = '0.00';
    worksheet.getCell('S18').numFmt = '0.00';
    ['Q18', 'R18', 'S18'].forEach((cell) => {
      worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.mergeCells('N19:P19');
    worksheet.getCell('N19').value = 'Note Order TL';
    worksheet.getCell('N19').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N19'));
    worksheet.getCell('Q19').value = this.headerMarketingOrder[0].noteOrderTl; // "Month 1"
    worksheet.getCell('R19').value = this.headerMarketingOrder[1].noteOrderTl; // "Month 2"
    worksheet.getCell('S19').value = this.headerMarketingOrder[2].noteOrderTl; // "Month 3"
    ['Q19', 'R19', 'S19'].forEach((cell) => {
      worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    for (let i = 1; i <= 20; i++) {
      worksheet.getRow(i).height = 20;
    }

    for (let row = 2; row <= 20; row++) {
      setBorder(worksheet.getCell(`Q${row}`));
      setBorder(worksheet.getCell(`R${row}`));
      setBorder(worksheet.getCell(`S${row}`));
    }

    ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N9', 'N10', 'N11', 'N12', 'N13', 'N14', 'N15', 'N16', 'N17', 'N18', 'N19'].forEach((cell) => {
      const cellRef = worksheet.getCell(cell);
      cellRef.font = {
        name: 'Calibri Body',
        size: 11,
        bold: true,
        italic: true,
      };
    });

    ['Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12', 'Q13', 'Q14', 'Q15', 'Q16', 'Q17', 'Q18', 'Q19'].forEach((cell) => {
      const cellRef = worksheet.getCell(cell);
      cellRef.alignment = { vertical: 'middle', horizontal: 'right' };
      cellRef.font = {
        name: 'Calibri Body',
        size: 11,
        bold: true,
        italic: true,
      };
    });

    ['R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10', 'R11', 'R12', 'R13', 'R14', 'R15', 'R16', 'R17', 'R18', 'R19'].forEach((cell) => {
      const cellRef = worksheet.getCell(cell);
      cellRef.alignment = { vertical: 'middle', horizontal: 'right' };
      cellRef.font = {
        name: 'Calibri Body',
        size: 11,
        bold: true,
        italic: true,
      };
    });

    ['S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12', 'S13', 'S14', 'S15', 'S16', 'S17', 'S18', 'S19'].forEach((cell) => {
      const cellRef = worksheet.getCell(cell);
      cellRef.alignment = { vertical: 'middle', horizontal: 'right' };
      cellRef.font = {
        name: 'Calibri Body',
        size: 11,
        bold: true,
        italic: true,
      };
    });
    //End Header

    // Detail Marketing Order
    worksheet.mergeCells('B20:B21');
    worksheet.getCell('B20').value = 'Category';
    worksheet.getCell('B20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('B').width = 20;
    setBorder(worksheet.getCell('B20'));
    worksheet.getCell('B20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('C20:C21');
    worksheet.getCell('C20').value = 'Item';
    worksheet.getCell('C20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('C').width = 20;
    setBorder(worksheet.getCell('C20'));
    worksheet.getCell('C20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('D20:D21');
    worksheet.getCell('D20').value = 'Description';
    worksheet.getCell('D20').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getColumn('D').width = 41;
    setBorder(worksheet.getCell('D20'));
    worksheet.getCell('D20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('E20:E21');
    worksheet.getCell('E20').value = 'Machine Type';
    worksheet.getCell('E20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('E').width = 15;
    setBorder(worksheet.getCell('E20'));
    worksheet.getCell('E20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('F20:F21');
    worksheet.getCell('F20').value = 'Capacity 99,5%';
    worksheet.getCell('F20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('F').width = 18;
    setBorder(worksheet.getCell('F20'));
    worksheet.getCell('F20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('G20:G21');
    worksheet.getCell('G20').value = 'Mould Plan';
    worksheet.getCell('G20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('G').width = 18;
    setBorder(worksheet.getCell('G20'));
    worksheet.getCell('G20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('H20:H21');
    worksheet.getCell('H20').value = 'Qty Per Rak';
    worksheet.getCell('H20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('H').width = 18;
    setBorder(worksheet.getCell('H20'));
    worksheet.getCell('H20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('I20:I21');
    worksheet.getCell('I20').value = 'Minimal Order';
    worksheet.getCell('I20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('I').width = 18;
    setBorder(worksheet.getCell('I20'));
    worksheet.getCell('I20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('J20:L20');
    worksheet.getCell('J20').value = 'Capacity Maximum';
    worksheet.getCell('J20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('J').width = 15;
    setBorder(worksheet.getCell('J20'));
    worksheet.getCell('J20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('J21').value = month0;
    worksheet.getCell('J21').alignment = { vertical: 'middle', horizontal: 'center' };
    setBorder(worksheet.getCell('J21'));
    worksheet.getCell('J21').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('K21').value = month1;
    worksheet.getCell('K21').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('K').width = 15;
    setBorder(worksheet.getCell('K21'));
    worksheet.getCell('K21').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('L21').value = month2;
    worksheet.getCell('L21').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('L').width = 15;
    setBorder(worksheet.getCell('L21'));
    worksheet.getCell('L21').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('M20:M21');
    worksheet.getCell('M20').value = 'Initial Stock';
    worksheet.getCell('M20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('M').width = 20;
    setBorder(worksheet.getCell('M20'));
    worksheet.getCell('M20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('N20:P20');
    worksheet.getCell('N20').value = 'Sales Forecast';
    worksheet.getCell('N20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('N').width = 20;
    setBorder(worksheet.getCell('N20'));
    worksheet.getCell('N20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('N21').value = month0;
    worksheet.getCell('N21').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('O').width = 20;
    setBorder(worksheet.getCell('N21'));
    worksheet.getCell('N21').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('O21').value = month1;
    worksheet.getCell('O21').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('O').width = 20;
    setBorder(worksheet.getCell('O21'));
    worksheet.getCell('O21').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('P21').value = month2;
    worksheet.getCell('P21').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('P').width = 20;
    setBorder(worksheet.getCell('P21'));
    worksheet.getCell('P21').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('Q20:S20');
    worksheet.getCell('Q20').value = 'Marketing Order';
    worksheet.getCell('Q20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('Q').width = 20;
    setBorder(worksheet.getCell('Q20'));
    worksheet.getCell('Q20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('Q21').value = month0;
    worksheet.getCell('Q21').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('Q').width = 20;
    setBorder(worksheet.getCell('Q21'));
    worksheet.getCell('Q21').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('R21').value = month1;
    worksheet.getCell('R21').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('R').width = 20;
    setBorder(worksheet.getCell('R21'));
    worksheet.getCell('R21').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('S21').value = month2;
    worksheet.getCell('S21').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('S').width = 20;
    setBorder(worksheet.getCell('S21'));
    worksheet.getCell('S21').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    //Styling Font Header Detail Markting Order
    ['B20', 'C20', 'D20', 'E20', 'F20', 'G20', 'H20', 'I20', 'J20', 'J21', 'K21', 'L21', 'M20', 'N20', 'N21', 'O21', 'P21', 'Q20', 'Q21', 'R21', 'S21'].forEach((cell) => {
      const cellRef = worksheet.getCell(cell);
      cellRef.alignment = { vertical: 'middle', horizontal: 'center' };
      cellRef.font = {
        name: 'Calibri Body',
        size: 11,
        bold: true,
      };
    });

    let rowIndex = 22;
    this.detailMarketingOrder.forEach((item) => {
      worksheet.getCell(`B${rowIndex}`).value = item.category;
      worksheet.getCell(`C${rowIndex}`).value = item.partNumber;
      worksheet.getCell(`C${rowIndex}`).numFmt = '0';

      worksheet.getCell(`D${rowIndex}`).value = item.description;
      worksheet.getCell(`E${rowIndex}`).value = item.machineType;

      worksheet.getCell(`F${rowIndex}`).value = item.capacity;
      worksheet.getCell(`F${rowIndex}`).numFmt = '#,##0';

      worksheet.getCell(`G${rowIndex}`).value = item.mouldMonthlyPlan;
      worksheet.getCell(`G${rowIndex}`).numFmt = '#,##0';

      worksheet.getCell(`H${rowIndex}`).value = item.qtyPerRak;
      worksheet.getCell(`H${rowIndex}`).numFmt = '#,##0';

      worksheet.getCell(`I${rowIndex}`).value = item.minOrder;
      worksheet.getCell(`I${rowIndex}`).numFmt = '#,##0';

      worksheet.getCell(`J${rowIndex}`).value = item.maxCapMonth0;
      worksheet.getCell(`J${rowIndex}`).numFmt = '#,##0';

      worksheet.getCell(`K${rowIndex}`).value = item.maxCapMonth1;
      worksheet.getCell(`K${rowIndex}`).numFmt = '#,##0';

      worksheet.getCell(`L${rowIndex}`).value = item.maxCapMonth2;
      worksheet.getCell(`L${rowIndex}`).numFmt = '#,##0';

      worksheet.getCell(`M${rowIndex}`).value = item.initialStock;
      worksheet.getCell(`M${rowIndex}`).numFmt = '#,##0';

      worksheet.getCell(`N${rowIndex}`).value = item.sfMonth0;
      worksheet.getCell(`N${rowIndex}`).numFmt = '#,##0';

      worksheet.getCell(`O${rowIndex}`).value = item.sfMonth1;
      worksheet.getCell(`O${rowIndex}`).numFmt = '#,##0';

      worksheet.getCell(`P${rowIndex}`).value = item.sfMonth2;
      worksheet.getCell(`P${rowIndex}`).numFmt = '#,##0';

      if (item.lockStatusM0 !== 1) {
        worksheet.getCell(`Q${rowIndex}`).value = item.moMonth0;
        worksheet.getCell(`Q${rowIndex}`).numFmt = '#,##0';
      }

      if (item.lockStatusM1 !== 1) {
        worksheet.getCell(`R${rowIndex}`).value = item.moMonth1;
        worksheet.getCell(`R${rowIndex}`).numFmt = '#,##0';
      }

      if (item.lockStatusM2 !== 1) {
        worksheet.getCell(`S${rowIndex}`).value = item.moMonth2;
        worksheet.getCell(`S${rowIndex}`).numFmt = '#,##0';
      }

      // Cek status lockStatusM0
      if (item.lockStatusM0 === 1) {
        worksheet.getCell(`Q${rowIndex}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF0000' },
        };
      } else {
        worksheet.getCell(`Q${rowIndex}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFC000' },
        };
      }

      if (item.lockStatusM1 === 1) {
        worksheet.getCell(`R${rowIndex}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF0000' },
        };
      } else {
        worksheet.getCell(`R${rowIndex}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFC000' },
        };
      }

      if (item.lockStatusM2 === 1) {
        worksheet.getCell(`S${rowIndex}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF0000' },
        };
      } else {
        worksheet.getCell(`S${rowIndex}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFC000' },
        };
      }

      //Style column description
      ['D'].forEach((col) => {
        const cell = worksheet.getCell(`${col}${rowIndex}`);
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      ['B', 'C', 'E'].forEach((col) => {
        const cell = worksheet.getCell(`${col}${rowIndex}`);
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      ['F', 'G', 'H', 'I', 'J', 'K', 'L'].forEach((col) => {
        const cell = worksheet.getCell(`${col}${rowIndex}`);
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      ['M'].forEach((col) => {
        const cell = worksheet.getCell(`${col}${rowIndex}`);
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD9D9D9' },
        };
      });

      ['N', 'O', 'P'].forEach((col) => {
        const cell = worksheet.getCell(`${col}${rowIndex}`);
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFF2CC' },
        };
      });

      ['Q', 'R', 'S'].forEach((col) => {
        const cell = worksheet.getCell(`${col}${rowIndex}`);
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // Pengaturan alignment dan border untuk Q, R, dan S
      ['Q', 'R', 'S'].forEach((col) => {
        const cell = worksheet.getCell(`${col}${rowIndex}`);
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      rowIndex++;
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileName = this.getFileNameExcel();
      saveAs(blob, fileName);
    });
  }

  getFileNameExcel(): string {
    const now = new Date();
    const indonesiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const monthFn = indonesiaTime.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const year = indonesiaTime.getFullYear();
    const timestamp = indonesiaTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '');
    const fileName = `FROM REV MO ${this.typeMo} - ${this.dateMo} - ${year} - ${timestamp}.xlsx`;
    return fileName;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileName = file.name.toLowerCase();

      // Validasi ekstensi file
      if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
        this.file = file;
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid File Type',
          text: 'Please upload a valid Excel file (.xls or .xlsx).',
          confirmButtonText: 'OK',
        });
        this.file = null;
        input.value = '';
      }
    }
  }

  uploadFileExcel() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);

      // Membaca file Excel
      const reader = new FileReader();
      reader.onload = (e) => {
        // Memastikan hasil pembacaan adalah ArrayBuffer
        const result = e.target.result;
        if (result instanceof ArrayBuffer) {
          const data = new Uint8Array(result);
          const workbook = XLSX.read(data, { type: 'array' });

          // Ambil nama sheet pertama
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // Menentukan kolom yang akan dibaca (M sampai S)
          const startRow = 21; // Baris awal
          const endRow = worksheet['!ref'] ? XLSX.utils.decode_range(worksheet['!ref']).e.r : startRow; // Menghitung baris terakhir

          // Membaca data dari kolom M hingga S
          for (let row = startRow - 1; row <= endRow; row++) {
            const partNumber = Number(worksheet[`C${row + 1}`]?.v) || null; // Kolom C
            const initialStockValue = Number(worksheet[`M${row + 1}`]?.v) || null; // Kolom M
            const sfMonth0Value = Number(worksheet[`N${row + 1}`]?.v) || null; // Kolom N
            const sfMonth1Value = Number(worksheet[`O${row + 1}`]?.v) || null; // Kolom O
            const sfMonth2Value = Number(worksheet[`P${row + 1}`]?.v) || null; // Kolom P
            const moMonth0Value = Number(worksheet[`Q${row + 1}`]?.v) || null; // Kolom Q
            const moMonth1Value = Number(worksheet[`R${row + 1}`]?.v) || null; // Kolom R
            const moMonth2Value = Number(worksheet[`S${row + 1}`]?.v) || null; // Kolom S

            // Mencari dan memperbarui nilai dalam detailMarketingOrder
            const detail = this.detailMarketingOrder.find((item) => item.partNumber === partNumber);
            if (detail) {
              detail.initialStock = initialStockValue;
              detail.sfMonth0 = sfMonth0Value;
              detail.sfMonth1 = sfMonth1Value;
              detail.sfMonth2 = sfMonth2Value;
              detail.moMonth0 = detail.lockStatusM0 === 1 ? 0 : moMonth0Value;
              detail.moMonth1 = detail.lockStatusM1 === 1 ? 0 : moMonth1Value;
              detail.moMonth2 = detail.lockStatusM2 === 1 ? 0 : moMonth2Value;
              detail.isTouchedM0 = true;
              detail.isTouchedM1 = true;
              detail.isTouchedM2 = true;
            }
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'File tidak dapat dibaca',
          });
        }
      };

      reader.readAsArrayBuffer(this.file); // Membaca file sebagai ArrayBuffer
      this.resetFileInput();
      $('#uploadModal').modal('hide');
    }
  }

  openModalUpload(): void {
    $('#uploadModal').modal('show');
  }

  formatDecimalView(value: number | null | undefined): string {
    if (value === undefined || value === null || value === 0) {
      return '0';
    }
    return value.toFixed(2).replace('.', ',');
  }

  formatSeparatorView(value: number | null | undefined): string {
    return value != null ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0';
  }
}
