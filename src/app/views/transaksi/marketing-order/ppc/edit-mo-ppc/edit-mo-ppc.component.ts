import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as ExcelJS from 'exceljs/dist/exceljs.min.js';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DetailMarketingOrder } from 'src/app/models/DetailMarketingOrder';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import { ApiResponse } from 'src/app/response/Response';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { HeaderMarketingOrder } from 'src/app/models/HeaderMarketingOrder';
import { MatTableDataSource } from '@angular/material/table';
import { ParsingDateService } from 'src/app/utils/parsing-date/parsing-date.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ParsingNumberService } from 'src/app/utils/parsing-number/parsing-number.service';

@Component({
  selector: 'app-edit-mo-ppc',
  templateUrl: './edit-mo-ppc.component.html',
  styleUrls: ['./edit-mo-ppc.component.scss'],
})
export class EditMoPpcComponent implements OnInit {
  //Variable Declaration
  idMo: string = '';
  capacityDb: string = '';
  formHeaderMo: FormGroup;
  isReadOnly: boolean = true;
  monthNames: string[] = ['', '', ''];
  allData: any;
  lastIdMo: string = '';
  loading: boolean = false;

  marketingOrder: MarketingOrder = new MarketingOrder();
  headerMarketingOrder: any[] = [];
  detailMarketingOrder: DetailMarketingOrder[];

  // Pagination Detail Marketing Order
  headersColumnsDmo: string[] = ['no', 'category', 'partNumber', 'description', 'machineType', 'capacity', 'qtyPerMould', 'spareMould', 'mouldMonthlyPlan', 'qtyPerRak', 'minOrder', 'maxCap', 'initialStock', 'salesForecast', 'marketingOrder', 'status'];
  childHeadersColumnsDmo: string[] = ['maxCapMonth0', 'maxCapMonth1', 'maxCapMonth2', 'sfMonth0', 'sfMonth1', 'sfMonth2', 'moMonth0', 'moMonth1', 'moMonth2', 'lockStatusM0', 'lockStatusM1', 'lockStatusM2'];
  rowDataDmo: string[] = ['no', 'category', 'partNumber', 'description', 'machineType', 'capacity', 'qtyPerMould', 'spareMould', 'mouldMonthlyPlan', 'qtyPerRak', 'minOrder', 'maxCapMonth0', 'maxCapMonth1', 'maxCapMonth2', 'initialStock', 'sfMonth0', 'sfMonth1', 'sfMonth2', 'moMonth0', 'moMonth1', 'moMonth2', 'lockStatusM0', 'lockStatusM1', 'lockStatusM2'];
  dataSourceDmo: MatTableDataSource<DetailMarketingOrder>;
  @ViewChild('sortDmo') sortDmo = new MatSort();
  @ViewChild('paginatorDmo') paginatorDmo: MatPaginator;
  searchTextDmo: string = '';

  constructor(private router: Router, private activeRoute: ActivatedRoute, private fb: FormBuilder, private moService: MarketingOrderService, private parsingNumberService: ParsingNumberService) {
    this.formHeaderMo = this.fb.group({
      date: [null, []],
      type: [null, []],
      revision: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
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
      max_tube_capa_0: [null, [Validators.required]],
      max_tube_capa_1: [null, [Validators.required]],
      max_tube_capa_2: [null, [Validators.required]],
      max_capa_tl_0: [null, [Validators.required]],
      max_capa_tt_0: [null, [Validators.required]],
      max_capa_tl_1: [null, [Validators.required]],
      max_capa_tt_1: [null, [Validators.required]],
      max_capa_tl_2: [null, [Validators.required]],
      max_capa_tt_2: [null, [Validators.required]],
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

  get revisionControl() {
    return this.formHeaderMo.get('revision');
  }

  // Mencegah input non-angka saat mengetik
  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  // Mencegah menempelkan teks non-angka
  blockNonNumbers(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData?.getData('text') || '';
    if (!/^[0-9]*$/.test(clipboardData)) {
      event.preventDefault();
    }
  }

  lockUpdate(partNumber: number, lockStatusField: string) {
    const data = this.detailMarketingOrder.find((dmo) => dmo.partNumber === partNumber);
    if (data) {
      Swal.fire({
        title: 'Confirmation',
        text: `Are you sure you want to ${data[lockStatusField] === 0 ? 'lock' : 'unlock'} this?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          // If confirmed, toggle the lock status
          if (lockStatusField === 'lockStatusM0') {
            data.lockStatusM0 = data.lockStatusM0 === 0 ? 1 : 0;
          } else if (lockStatusField === 'lockStatusM1') {
            data.lockStatusM1 = data.lockStatusM1 === 0 ? 1 : 0;
          } else if (lockStatusField === 'lockStatusM2') {
            data.lockStatusM2 = data.lockStatusM2 === 0 ? 1 : 0;
          } else {
            console.error(`Field ${lockStatusField} is not valid`);
          }
          Swal.fire('Success!', 'Status has been updated.', 'success');
        }
      });
    } else {
      // Show SweetAlert if part number is not found
      Swal.fire({
        title: 'Error',
        text: `Part number ${partNumber} not found.`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }

  calculateTotalTube(controlName: string): void {
    const match = controlName.match(/(\w+)_(\d+)/);
    if (match) {
      const baseName = match[1];
      const index = match[2];

      const nwtValue = parseFloat(this.formHeaderMo.get(`nwt_${index}`)?.value.replace(',', '.') || '0');
      const otValue = parseFloat(this.formHeaderMo.get(`ot_wt_${index}`)?.value.replace(',', '.') || '0');

      const total = nwtValue + otValue;
      const formattedTotal = total.toLocaleString('id-ID', { minimumFractionDigits: 2 });

      this.formHeaderMo.get(`total_wt_${index}`)?.setValue(formattedTotal, { emitEvent: false });
    }
  }

  onInputChangeMinimumOrder(event: any, mo: any, field: string, index: number) {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, '');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    mo[field] = value;
    event.target.value = value;
  }

  onSearchChangeDmo(): void {
    this.dataSourceDmo.filter = this.searchTextDmo.trim().toLowerCase();
  }

  resetSearchDmo(): void {
    this.searchTextDmo = '';
    this.dataSourceDmo.filter = '';
  }

  toggleLockStatus(index: number) {
    const currentStatus = this.detailMarketingOrder[index].lockStatusM0;
    const action = currentStatus === null || currentStatus === 1 ? 'unlock' : 'lock';
    const newStatus = action === 'lock' ? 1 : 0;

    Swal.fire({
      title: `Are you sure you want to ${action} this item?`,
      text: `This will ${action === 'lock' ? 'lock' : 'unlock'} the item.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action} it!`,
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.detailMarketingOrder[index].lockStatusM0 = newStatus;
        Swal.fire(`${action === 'lock' ? 'Locked' : 'Unlocked'}!`, `The item has been ${action === 'lock' ? 'locked' : 'unlocked'}.`, 'success');
      }
    });
  }

  onInputChange(event: any, formControlName: string): void {
    const inputValue = event.target.value;
    const formattedValue = this.parsingNumberService.separatorAndDecimalInput(inputValue);
    this.formHeaderMo.get(formControlName)?.setValue(formattedValue, { emitEvent: false });
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

  fillAllData(data: any) {
    this.headerMarketingOrder = data.dataHeaderMo;
    //Fill table
    this.detailMarketingOrder = data.dataDetailMo;
    this.dataSourceDmo = new MatTableDataSource(this.detailMarketingOrder);
    this.dataSourceDmo.sort = this.sortDmo;
    this.dataSourceDmo.paginator = this.paginatorDmo;

    this.detailMarketingOrder.forEach((item) => {
      item.initialStock = item.initialStock !== null ? item.initialStock : 0;
      item.sfMonth0 = item.sfMonth0 !== null ? item.sfMonth0 : 0;
      item.sfMonth1 = item.sfMonth1 !== null ? item.sfMonth1 : 0;
      item.sfMonth2 = item.sfMonth2 !== null ? item.sfMonth2 : 0;
      item.moMonth0 = item.moMonth0 !== null ? item.moMonth0 : 0;
      item.moMonth1 = item.moMonth1 !== null ? item.moMonth1 : 0;
      item.moMonth2 = item.moMonth2 !== null ? item.moMonth2 : 0;
    });

    let typeProduct = data.type;
    this.formHeaderMo.patchValue({
      date: new Date(data.dateValid).toISOString().split('T')[0],
      type: data.type,
      revision: data.revisionPpc,

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

  editMo(): void {
    const type = this.formHeaderMo.get('type')?.value;
    let revPpc = this.formHeaderMo.get('revision').value;

    if (revPpc === null || revPpc === '') {
      Swal.fire({
        title: 'Warning!',
        text: 'Please fill the revision version.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    //Set data Save MO
    this.marketingOrder.moId = this.lastIdMo;
    this.marketingOrder.dateValid = this.formHeaderMo.get('date')?.value;
    this.marketingOrder.type = this.formHeaderMo.get('type')?.value;
    this.marketingOrder.revisionPpc = this.formHeaderMo.get('revision')?.value;
    this.marketingOrder.revisionMarketing = this.allData.revisionMarketing;
    this.marketingOrder.month0 = new Date(this.formHeaderMo.get('month_0')?.value);
    this.marketingOrder.month1 = new Date(this.formHeaderMo.get('month_1')?.value);
    this.marketingOrder.month2 = new Date(this.formHeaderMo.get('month_2')?.value);
    this.marketingOrder.statusFilled = this.allData.statusFilled;

    //Set data save Header Mo
    this.headerMarketingOrder = [];
    for (let i = 0; i < 3; i++) {
      let nwdValue = this.parseFormattedValue(this.formHeaderMo.get(`nwd_${i}`)?.value);
      let nwtValue = this.parseFormattedValue(this.formHeaderMo.get(`nwt_${i}`)?.value);
      let otWdTubeValue = this.parseFormattedValue(this.formHeaderMo.get(`ot_wt_${i}`)?.value);
      let totalWdTube = this.parseFormattedValue(this.formHeaderMo.get(`total_wt_${i}`)?.value);

      // Validate: if nwt is null or not filled, set it to nwd
      if (nwtValue === null) {
        nwtValue = nwdValue;
        otWdTubeValue = 0;
        totalWdTube = nwtValue + otWdTubeValue;
      }

      const tlField = type === 'FDR' ? `fdr_tl_m${i}` : `fed_tl_m${i}`;
      const ttField = type === 'FDR' ? `fdr_tt_m${i}` : `fed_tt_m${i}`;

      const tlFieldPercentage = type === 'FDR' ? `fdr_TL_percentage_m${i}` : `fed_TL_percentage_m${i}`;
      const ttFieldPercentage = type === 'FDR' ? `fdr_TT_percentage_m${i}` : `fed_TT_percentage_m${i}`;

      this.headerMarketingOrder.push({
        moId: this.lastIdMo,
        month: new Date(this.formHeaderMo.get(`month_${i}`)?.value),
        wdNormalTire: this.parseFormattedValue(this.formHeaderMo.get(`nwd_${i}`)?.value),
        wdNormalTube: nwtValue,
        wdOtTube: otWdTubeValue,
        wdOtTl: this.parseFormattedValue(this.formHeaderMo.get(`tl_ot_wd_${i}`)?.value),
        wdOtTt: this.parseFormattedValue(this.formHeaderMo.get(`tt_ot_wd_${i}`)?.value),
        totalWdTube: totalWdTube,
        totalWdTl: this.parseFormattedValue(this.formHeaderMo.get(`total_tlwd_${i}`)?.value || ''),
        totalWdTt: this.parseFormattedValue(this.formHeaderMo.get(`total_ttwd_${i}`)?.value || ''),
        maxCapTube: this.parseFormattedValue(this.formHeaderMo.get(`max_tube_capa_${i}`)?.value || ''),
        maxCapTl: this.parseFormattedValue(this.formHeaderMo.get(`max_capa_tl_${i}`)?.value || ''),
        maxCapTt: this.parseFormattedValue(this.formHeaderMo.get(`max_capa_tt_${i}`)?.value || ''),
        airbagMachine: this.parseFormattedValue(this.formHeaderMo.get(`machine_airbag_m${i}`)?.value || ''),
        tl: this.parseFormattedValue(this.formHeaderMo.get(tlField)?.value || ''),
        tt: this.parseFormattedValue(this.formHeaderMo.get(ttField)?.value || ''),
        totalMo: this.parseFormattedValue(this.formHeaderMo.get(`total_mo_m${i}`)?.value || ''),
        tlPercentage: this.parseFormattedValue(this.formHeaderMo.get(tlFieldPercentage)?.value || ''),
        ttPercentage: this.parseFormattedValue(this.formHeaderMo.get(ttFieldPercentage)?.value || ''),
        noteOrderTl: this.formHeaderMo.get(`note_tl_m${i}`)?.value,
      });
    }

    //Set data save Detail Mo
    this.detailMarketingOrder.forEach((item) => {
      item.moId = this.lastIdMo;
    });

    const saveMo = {
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
    this.moService.saveMarketingOrderPPC(saveMo).subscribe(
      (response) => {
        Swal.close();
        Swal.fire({
          title: 'Success!',
          text: 'Data Marketing Order successfully Revision.',
          icon: 'success',
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

  parseFormattedValue(formattedValue: string | null): number | null {
    if (formattedValue && typeof formattedValue === 'string') {
      const numericString = formattedValue.replace(/\./g, '').replace(/,/g, '.');
      return parseFloat(numericString);
    }
    return null;
  }

  formatNumber(value: number): string {
    if (value !== null && value !== undefined) {
      // Mengubah angka menjadi string
      let strValue = value.toString();

      // Memisahkan bagian desimal dan bagian bulat
      const parts = strValue.split('.');
      const integerPart = parts[0];
      const decimalPart = parts[1] ? ',' + parts[1] : '';

      // Menambahkan separator ribuan
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

      return formattedInteger + decimalPart;
    }
    return '';
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

  formatDecimalView(value: number | null | undefined): string {
    if (value === undefined || value === null || value === 0) {
      return '0';
    }
    return value.toFixed(2).replace('.', ',');
  }

  formatSeparatorView(value: number | null | undefined): string {
    return value != null ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0';
  }

  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-mo-ppc']);
  }
}
