import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-edit-mo-marketing',
  templateUrl: './edit-mo-marketing.component.html',
  styleUrls: ['./edit-mo-marketing.component.scss'],
})
export class EditMoMarketingComponent implements OnInit {
  //Variable Declaration
  idMo: String;
  formHeaderMo: FormGroup;
  isReadOnly: boolean = true;
  monthNames: string[] = ['', '', ''];
  allData: any;
  lastIdMo: string = '';
  file: File | null = null;

  marketingOrder: MarketingOrder = new MarketingOrder();
  headerMarketingOrder: any[] = [];
  detailMarketingOrder: DetailMarketingOrder[];

  constructor(private router: Router, private activeRoute: ActivatedRoute, private fb: FormBuilder, private moService: MarketingOrderService) {
    this.formHeaderMo = this.fb.group({
      date: [null, []],
      type: [null, []],
      revision: [null, []],
      month_0: [null, Validators.required],
      month_1: [null, []],
      month_2: [null, []],
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
      upload_file_m0: [null, [Validators.required]],
      upload_file_m1: [null, [Validators.required]],
      upload_file_m2: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.idMo = this.activeRoute.snapshot.paramMap.get('idMo');
    this.getAllData(this.idMo);
    this.getLastIdMo();
  }

  onInputChange(event: any, mo: any, field: string) {
    let value = event.target.value;
    value = value.replace(/[^0-9]/g, '');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    mo[field] = value;
    event.target.value = value;
  }

  onModelChange(value: string, mo: any, field: string) {
    const numberValue = value ? Number(value.replace(/\./g, '')) : null;
    mo[field] = numberValue;
  }

  isInvalidValue(value: any | null | undefined, minOrder: number, maxCap: number): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    const stringValue = typeof value === 'string' ? value : value.toString();
    const numericValue = parseFloat(stringValue.replace(/\./g, ''));
    return numericValue < minOrder || numericValue > maxCap;
  }

  formatNumberChange(value: number | null | undefined): string {
    return value != null ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
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
    this.moService.getAllMoPPCById(idMo).subscribe(
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
    this.detailMarketingOrder = data.dataDetailMo;
    let typeProduct = data.type;
    this.formHeaderMo.patchValue({
      date: new Date(data.dateValid).toISOString().split('T')[0],
      type: data.type,
      revision: data.revisionMarketing,

      // Header Month 1
      month_0: this.formatDateToString(this.headerMarketingOrder[0].month),
      nwd_0: this.formatNumber(this.headerMarketingOrder[0].wdNormal),
      tl_ot_wd_0: this.formatNumber(this.headerMarketingOrder[0].wdOtTl),
      tt_ot_wd_0: this.formatNumber(this.headerMarketingOrder[0].wdOtTt),
      total_tlwd_0: this.formatNumber(this.headerMarketingOrder[0].totalWdTl),
      total_ttwd_0: this.formatNumber(this.headerMarketingOrder[0].totalWdTt),
      max_tube_capa_0: new Intl.NumberFormat('id-ID').format(this.headerMarketingOrder[0].maxCapTube),
      max_capa_tl_0: new Intl.NumberFormat('id-ID').format(this.headerMarketingOrder[0].maxCapTl),
      max_capa_tt_0: new Intl.NumberFormat('id-ID').format(this.headerMarketingOrder[0].maxCapTt),
      looping_m0: this.formatNumber(this.headerMarketingOrder[0].looping),
      machine_airbag_m0: this.formatNumber(this.headerMarketingOrder[0].airbagMachine),
      fed_tl_m0: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[0].tl) : null,
      fed_tt_m0: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[0].tt) : null,
      fdr_tl_m0: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[0].tl) : null,
      fdr_tt_m0: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[0].tt) : null,
      fed_TL_percentage_m0: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[0].tlPercentage) : null,
      fed_TT_percentage_m0: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[0].ttPercentage) : null,
      fdr_TL_percentage_m0: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[0].tlPercentage) : null,
      fdr_TT_percentage_m0: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[0].ttPercentage) : null,
      total_mo_m0: this.formatNumber(this.headerMarketingOrder[0].totalMo),
      note_tl_m0: this.headerMarketingOrder[0].noteOrderTl,
      // Header Month 2
      month_1: this.formatDateToString(this.headerMarketingOrder[1].month),
      nwd_1: this.formatNumber(this.headerMarketingOrder[1].wdNormal),
      tl_ot_wd_1: this.formatNumber(this.headerMarketingOrder[1].wdOtTl),
      tt_ot_wd_1: this.formatNumber(this.headerMarketingOrder[1].wdOtTt),
      total_tlwd_1: this.formatNumber(this.headerMarketingOrder[1].totalWdTl),
      total_ttwd_1: this.formatNumber(this.headerMarketingOrder[1].totalWdTt),
      max_tube_capa_1: new Intl.NumberFormat('id-ID').format(this.headerMarketingOrder[1].maxCapTube),
      max_capa_tl_1: new Intl.NumberFormat('id-ID').format(this.headerMarketingOrder[1].maxCapTl),
      max_capa_tt_1: new Intl.NumberFormat('id-ID').format(this.headerMarketingOrder[1].maxCapTt),
      looping_m1: this.formatNumber(this.headerMarketingOrder[1].looping),
      machine_airbag_m1: this.formatNumber(this.headerMarketingOrder[1].airbagMachine),
      fed_tl_m1: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[1].tl) : null,
      fed_tt_m1: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[1].tt) : null,
      fdr_tl_m1: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[1].tl) : null,
      fdr_tt_m1: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[1].tt) : null,
      fed_TL_percentage_m1: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[1].tlPercentage) : null,
      fed_TT_percentage_m1: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[1].ttPercentage) : null,
      fdr_TL_percentage_m1: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[1].tlPercentage) : null,
      fdr_TT_percentage_m1: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[1].ttPercentage) : null,
      total_mo_m1: this.formatNumber(this.headerMarketingOrder[1].totalMo),
      note_tl_m1: this.headerMarketingOrder[1].noteOrderTl,
      // Header Month 3
      month_2: this.formatDateToString(this.headerMarketingOrder[2].month),
      nwd_2: this.formatNumber(this.headerMarketingOrder[2].wdNormal),
      tl_ot_wd_2: this.formatNumber(this.headerMarketingOrder[2].wdOtTl),
      tt_ot_wd_2: this.formatNumber(this.headerMarketingOrder[2].wdOtTt),
      total_tlwd_2: this.formatNumber(this.headerMarketingOrder[2].totalWdTl),
      total_ttwd_2: this.formatNumber(this.headerMarketingOrder[2].totalWdTt),
      max_tube_capa_2: new Intl.NumberFormat('id-ID').format(this.headerMarketingOrder[2].maxCapTube),
      max_capa_tl_2: new Intl.NumberFormat('id-ID').format(this.headerMarketingOrder[2].maxCapTl),
      max_capa_tt_2: new Intl.NumberFormat('id-ID').format(this.headerMarketingOrder[2].maxCapTt),
      looping_m2: this.formatNumber(this.headerMarketingOrder[2].looping),
      machine_airbag_m2: this.formatNumber(this.headerMarketingOrder[2].airbagMachine),
      fed_tl_m2: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[2].tl) : null,
      fed_tt_m2: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[2].tt) : null,
      fdr_tl_m2: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[2].tl) : null,
      fdr_tt_m2: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[2].tt) : null,
      fed_TL_percentage_m2: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[2].tlPercentage) : null,
      fed_TT_percentage_m2: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[2].ttPercentage) : null,
      fdr_TL_percentage_m2: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[2].tlPercentage) : null,
      fdr_TT_percentage_m2: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[2].ttPercentage) : null,
      total_mo_m2: this.formatNumber(this.headerMarketingOrder[2].totalMo),
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
    const hasInvalidInput = this.detailMarketingOrder.some((mo) => {
      // Mengubah inputan string menjadi number dengan menghapus karakter '.'
      const sfMonth0 = parseFloat(mo.sfMonth0.toString().replace(/\./g, '')) || 0; // fallback ke 0 jika NaN
      const sfMonth1 = parseFloat(mo.sfMonth1.toString().replace(/\./g, '')) || 0;
      const sfMonth2 = parseFloat(mo.sfMonth2.toString().replace(/\./g, '')) || 0;
      const moMonth0 = parseFloat(mo.moMonth0.toString().replace(/\./g, '')) || 0;
      const moMonth1 = parseFloat(mo.moMonth1.toString().replace(/\./g, '')) || 0;
      const moMonth2 = parseFloat(mo.moMonth2.toString().replace(/\./g, '')) || 0;

      // Pastikan minOrder dan maxCapMonthX adalah number
      const minOrder = Number(mo.minOrder);
      const maxCapMonth0 = Number(mo.maxCapMonth0);
      const maxCapMonth1 = Number(mo.maxCapMonth1);
      const maxCapMonth2 = Number(mo.maxCapMonth2);

      return sfMonth0 < minOrder || sfMonth0 > maxCapMonth0 || sfMonth1 < minOrder || sfMonth1 > maxCapMonth1 || sfMonth2 < minOrder || sfMonth2 > maxCapMonth2 || moMonth0 < minOrder || moMonth0 > maxCapMonth0 || moMonth1 < minOrder || moMonth1 > maxCapMonth1 || moMonth2 < minOrder || moMonth2 > maxCapMonth2;
    });

    // Jika terdapat input yang tidak valid, tampilkan SweetAlert dan hentikan fungsi
    if (hasInvalidInput) {
      Swal.fire({
        title: 'Warning!',
        text: 'There is an invalid input on the marketing order form.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

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
        wdNormal: this.parseFormattedValue(this.formHeaderMo.get(`nwd_${i}`)?.value),
        wdOtTl: this.parseFormattedValue(this.formHeaderMo.get(`tl_ot_wd_${i}`)?.value),
        wdOtTt: this.parseFormattedValue(this.formHeaderMo.get(`tt_ot_wd_${i}`)?.value),
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
      mo.initialStock = parseFloat(mo.initialStock.toString().replace(/\./g, '')) || 0;
      mo.sfMonth0 = parseFloat(mo.sfMonth0.toString().replace(/\./g, '')) || 0;
      mo.sfMonth1 = parseFloat(mo.sfMonth1.toString().replace(/\./g, '')) || 0;
      mo.sfMonth2 = parseFloat(mo.sfMonth2.toString().replace(/\./g, '')) || 0;
      mo.moMonth0 = parseFloat(mo.moMonth0.toString().replace(/\./g, '')) || 0;
      mo.moMonth1 = parseFloat(mo.moMonth1.toString().replace(/\./g, '')) || 0;
      mo.moMonth2 = parseFloat(mo.moMonth2.toString().replace(/\./g, '')) || 0;
    });

    const revisionMo = {
      marketingOrder: this.marketingOrder,
      headerMarketingOrder: this.headerMarketingOrder,
      detailMarketingOrder: this.detailMarketingOrder,
    };

    // Swal.fire({
    //   title: 'Success!',
    //   text: 'Data Marketing Order successfully Revision.',
    //   icon: 'success',
    //   confirmButtonText: 'OK',
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     console.log(revisionMo);
    //     this.navigateToViewMo();
    //   }
    // });

    this.moService.updateMarketingOrderMarketing(revisionMo).subscribe(
      (response) => {
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
      },
      (err) => {
        Swal.fire('Error!', 'Error insert data Marketing Order.', 'error');
      }
    );
  }

  downloadTemplate() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Form Input MO');
    const month0 = this.monthNames[0];
    const month1 = this.monthNames[1];
    const month2 = this.monthNames[2];

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

    worksheet.mergeCells('N9:P9');
    worksheet.getCell('N9').value = 'Description';
    worksheet.getCell('N9').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N9'));
    worksheet.getCell('N9').font = { name: 'Calibri Body', size: 11, bold: true, italic: true };

    worksheet.mergeCells('N10:P10');
    worksheet.getCell('N10').value = 'Workday Normal / Workday Tube';
    worksheet.getCell('N10').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('N10').font = { name: 'Calibri Body', size: 11, bold: true, italic: true };
    setBorder(worksheet.getCell('N10'));

    worksheet.getCell('Q10').value = this.headerMarketingOrder[0].wdNormal; // "Month 1"
    worksheet.getCell('R10').value = this.headerMarketingOrder[1].wdNormal; // "Month 2"
    worksheet.getCell('S10').value = this.headerMarketingOrder[2].wdNormal; // "Month 3"

    worksheet.mergeCells('N11:P11');
    worksheet.getCell('N11').value = 'Workday Overtime TL';
    worksheet.getCell('N11').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N11'));
    worksheet.getCell('Q11').value = this.headerMarketingOrder[0].wdOtTl; // "Month 1"
    worksheet.getCell('R11').value = this.headerMarketingOrder[1].wdOtTl; // "Month 2"
    worksheet.getCell('S11').value = this.headerMarketingOrder[2].wdOtTl; // "Month 3"
    ['Q11', 'R11', 'S11'].forEach((cell) => {
      worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.mergeCells('N12:P12');
    worksheet.getCell('N12').value = 'Workday Overtime TT';
    worksheet.getCell('N12').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N12'));
    worksheet.getCell('Q12').value = this.headerMarketingOrder[0].wdOtTt; // "Month 1"
    worksheet.getCell('R12').value = this.headerMarketingOrder[1].wdOtTt; // "Month 2"
    worksheet.getCell('S12').value = this.headerMarketingOrder[2].wdOtTt; // "Month 3"
    ['Q12', 'R12', 'S12'].forEach((cell) => {
      worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.mergeCells('N13:P13');
    worksheet.getCell('N13').value = 'Total Workday Tire TL';
    worksheet.getCell('N13').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N13'));
    worksheet.getCell('Q13').value = this.headerMarketingOrder[0].totalWdTl; // "Month 1"
    worksheet.getCell('R13').value = this.headerMarketingOrder[1].totalWdTl; // "Month 2"
    worksheet.getCell('S13').value = this.headerMarketingOrder[2].totalWdTl; // "Month 3"
    ['Q13', 'R13', 'S13'].forEach((cell) => {
      worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.mergeCells('N14:P14');
    worksheet.getCell('N14').value = 'Total Workday Tire TT';
    worksheet.getCell('N14').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N14'));
    worksheet.getCell('Q14').value = this.headerMarketingOrder[0].totalWdTt; // "Month 1"
    worksheet.getCell('R14').value = this.headerMarketingOrder[1].totalWdTt; // "Month 2"
    worksheet.getCell('S14').value = this.headerMarketingOrder[2].totalWdTt; // "Month 3"
    ['Q14', 'R14', 'S14'].forEach((cell) => {
      worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.mergeCells('N15:P15');
    worksheet.getCell('N15').value = 'Max Capacity Tube';
    worksheet.getCell('N15').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N15'));
    worksheet.getCell('Q15').value = this.headerMarketingOrder[0].maxCapTube; // "Month 1"
    worksheet.getCell('R15').value = this.headerMarketingOrder[1].maxCapTube; // "Month 2"
    worksheet.getCell('S15').value = this.headerMarketingOrder[2].maxCapTube; // "Month 3"
    ['Q15', 'R15', 'S15'].forEach((cell) => {
      worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.mergeCells('N16:P16');
    worksheet.getCell('N16').value = 'Max Capacity Tire TL';
    worksheet.getCell('N16').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N16'));
    worksheet.getCell('Q16').value = this.headerMarketingOrder[0].maxCapTl; // "Month 1"
    worksheet.getCell('R16').value = this.headerMarketingOrder[1].maxCapTl; // "Month 2"
    worksheet.getCell('S16').value = this.headerMarketingOrder[2].maxCapTl; // "Month 3"
    ['Q16', 'R16', 'S16'].forEach((cell) => {
      worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.mergeCells('N17:P17');
    worksheet.getCell('N17').value = 'Max Capacity Tire TT';
    worksheet.getCell('N17').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N17'));
    worksheet.getCell('Q17').value = this.headerMarketingOrder[0].maxCapTt; // "Month 1"
    worksheet.getCell('R17').value = this.headerMarketingOrder[1].maxCapTt; // "Month 2"
    worksheet.getCell('S17').value = this.headerMarketingOrder[2].maxCapTt; // "Month 3"
    ['Q17', 'R17', 'S17'].forEach((cell) => {
      worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.mergeCells('N18:P18');
    worksheet.getCell('N18').value = 'Note Order TL';
    worksheet.getCell('N18').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N18'));
    worksheet.getCell('Q18').value = this.headerMarketingOrder[0].noteOrderTl; // "Month 1"
    worksheet.getCell('R18').value = this.headerMarketingOrder[1].noteOrderTl; // "Month 2"
    worksheet.getCell('S18').value = this.headerMarketingOrder[2].noteOrderTl; // "Month 3"
    ['Q18', 'R18', 'S18'].forEach((cell) => {
      worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    for (let i = 9; i <= 20; i++) {
      worksheet.getRow(i).height = 20;
    }

    worksheet.getCell('Q9').value = month0;
    setBorder(worksheet.getCell('Q9'));

    worksheet.getCell('R9').value = month1;
    setBorder(worksheet.getCell('R9'));

    worksheet.getCell('S9').value = month2;
    setBorder(worksheet.getCell('S9'));

    ['Q9', 'R9', 'S9'].forEach((cell) => {
      const cellRef = worksheet.getCell(cell);
      cellRef.alignment = { vertical: 'middle', horizontal: 'center' };
      cellRef.font = {
        name: 'Calibri Body',
        size: 11,
        bold: true,
        italic: true,
      };
    });

    for (let row = 10; row <= 18; row++) {
      setBorder(worksheet.getCell(`Q${row}`));
      setBorder(worksheet.getCell(`R${row}`));
      setBorder(worksheet.getCell(`S${row}`));
    }

    ['N11', 'N12', 'N13', 'N14', 'N15', 'N16', 'N17', 'N18'].forEach((cell) => {
      const cellRef = worksheet.getCell(cell);
      cellRef.font = {
        name: 'Calibri Body',
        size: 11,
        bold: true,
        italic: true,
      };
    });

    ['Q10', 'Q11', 'Q12', 'Q13', 'Q14', 'Q15', 'Q16', 'Q17'].forEach((cell) => {
      const cellRef = worksheet.getCell(cell);
      cellRef.alignment = { vertical: 'middle', horizontal: 'right' };
      cellRef.font = {
        name: 'Calibri Body',
        size: 11,
        bold: true,
        italic: true,
      };
    });

    ['R10', 'R11', 'R12', 'R13', 'R14', 'R15', 'R16', 'R17'].forEach((cell) => {
      const cellRef = worksheet.getCell(cell);
      cellRef.alignment = { vertical: 'middle', horizontal: 'right' };
      cellRef.font = {
        name: 'Calibri Body',
        size: 11,
        bold: true,
        italic: true,
      };
    });

    ['S10', 'S11', 'S12', 'S13', 'S14', 'S15', 'S16', 'S17'].forEach((cell) => {
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
    worksheet.mergeCells('B19:B20');
    worksheet.getCell('B19').value = 'Category';
    worksheet.getCell('B19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('B').width = 20;
    setBorder(worksheet.getCell('B19'));

    worksheet.mergeCells('C19:C20');
    worksheet.getCell('C19').value = 'Item';
    worksheet.getCell('C19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('C').width = 20;
    setBorder(worksheet.getCell('C19'));

    worksheet.mergeCells('D19:D20');
    worksheet.getCell('D19').value = 'Description';
    worksheet.getCell('D19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('D').width = 41;
    setBorder(worksheet.getCell('D19'));

    worksheet.mergeCells('E19:E20');
    worksheet.getCell('E19').value = 'Machine Type';
    worksheet.getCell('E19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('E').width = 15;
    setBorder(worksheet.getCell('E19'));

    worksheet.mergeCells('F19:F20');
    worksheet.getCell('F19').value = 'Capacity 99,5%';
    worksheet.getCell('F19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('F').width = 18;
    setBorder(worksheet.getCell('F19'));

    worksheet.mergeCells('G19:G20');
    worksheet.getCell('G19').value = 'Qty Mould';
    worksheet.getCell('G19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('G').width = 18;
    setBorder(worksheet.getCell('G19'));

    worksheet.mergeCells('H19:H20');
    worksheet.getCell('H19').value = 'Qty Per Rak';
    worksheet.getCell('H19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('H').width = 18;
    setBorder(worksheet.getCell('H19'));

    worksheet.mergeCells('I19:I20');
    worksheet.getCell('I19').value = 'Minimal Order';
    worksheet.getCell('I19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('I').width = 18;
    setBorder(worksheet.getCell('I19'));

    worksheet.mergeCells('J19:L19');
    worksheet.getCell('J19').value = 'Capacity Maximum';
    worksheet.getCell('J19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('J').width = 15;
    setBorder(worksheet.getCell('J19'));

    worksheet.getCell('J20').value = month0;
    worksheet.getCell('J20').alignment = { vertical: 'middle', horizontal: 'center' };
    setBorder(worksheet.getCell('J20'));

    worksheet.getCell('K20').value = month1;
    worksheet.getCell('K20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('K').width = 15;
    setBorder(worksheet.getCell('K20'));

    worksheet.getCell('L20').value = month2;
    worksheet.getCell('L20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('L').width = 15;
    setBorder(worksheet.getCell('L20'));

    worksheet.mergeCells('M19:M20');
    worksheet.getCell('M19').value = 'Initial Stock';
    worksheet.getCell('M19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('M').width = 20;
    setBorder(worksheet.getCell('M19'));

    worksheet.mergeCells('N19:P19');
    worksheet.getCell('N19').value = 'Sales Forecast';
    worksheet.getCell('N19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('N').width = 20;
    setBorder(worksheet.getCell('N19'));

    worksheet.getCell('N20').value = month0;
    worksheet.getCell('N20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('O').width = 20;
    setBorder(worksheet.getCell('N20'));

    worksheet.getCell('O20').value = month1;
    worksheet.getCell('O20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('O').width = 20;
    setBorder(worksheet.getCell('O20'));

    worksheet.getCell('P20').value = month2;
    worksheet.getCell('P20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('P').width = 20;
    setBorder(worksheet.getCell('P20'));

    worksheet.mergeCells('Q19:S19');
    worksheet.getCell('Q19').value = 'Marketing Order';
    worksheet.getCell('Q19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('Q').width = 20;
    setBorder(worksheet.getCell('Q19'));

    worksheet.getCell('Q20').value = month0;
    worksheet.getCell('Q20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('Q').width = 20;
    setBorder(worksheet.getCell('Q20'));

    worksheet.getCell('R20').value = month1;
    worksheet.getCell('R20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('R').width = 20;
    setBorder(worksheet.getCell('R20'));

    worksheet.getCell('S20').value = month2;
    worksheet.getCell('S20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('S').width = 20;
    setBorder(worksheet.getCell('S20'));

    //Styling Font Header Detail Markting Order
    ['B19', 'C19', 'D19', 'E19', 'F19', 'G19', 'H19', 'I19', 'J19', 'J20', 'K20', 'L20', 'M19', 'N19', 'N20', 'O20', 'P20', 'Q19', 'Q20', 'R20', 'S20'].forEach((cell) => {
      const cellRef = worksheet.getCell(cell);
      cellRef.alignment = { vertical: 'middle', horizontal: 'center' };
      cellRef.font = {
        name: 'Calibri Body',
        size: 11,
        bold: true,
      };
    });

    let rowIndex = 21; // Starting row for data
    this.detailMarketingOrder.forEach((item) => {
      worksheet.getCell(`B${rowIndex}`).value = item.category;
      worksheet.getCell(`C${rowIndex}`).value = item.partNumber;
      worksheet.getCell(`C${rowIndex}`).numFmt = '0';

      worksheet.getCell(`D${rowIndex}`).value = item.description;
      worksheet.getCell(`E${rowIndex}`).value = item.machineType;

      worksheet.getCell(`F${rowIndex}`).value = item.capacity;
      worksheet.getCell(`F${rowIndex}`).numFmt = '#,##0';

      worksheet.getCell(`G${rowIndex}`).value = item.qtyPerMould;
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

      worksheet.getCell(`Q${rowIndex}`).value = item.moMonth0;
      worksheet.getCell(`Q${rowIndex}`).numFmt = '#,##0';

      worksheet.getCell(`R${rowIndex}`).value = item.moMonth1;
      worksheet.getCell(`R${rowIndex}`).numFmt = '#,##0';

      worksheet.getCell(`S${rowIndex}`).value = item.moMonth2;
      worksheet.getCell(`S${rowIndex}`).numFmt = '#,##0';

      ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'].forEach((col) => {
        const cell = worksheet.getCell(`${col}${rowIndex}`);
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      worksheet.getCell(`M${rowIndex}`).numFmt = '#,##0';
      worksheet.getCell(`N${rowIndex}`).numFmt = '#,##0';
      worksheet.getCell(`O${rowIndex}`).numFmt = '#,##0';
      worksheet.getCell(`P${rowIndex}`).numFmt = '#,##0';
      worksheet.getCell(`Q${rowIndex}`).numFmt = '#,##0';
      worksheet.getCell(`R${rowIndex}`).numFmt = '#,##0';
      worksheet.getCell(`S${rowIndex}`).numFmt = '#,##0';

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
    const monthFn = indonesiaTime.toLocaleDateString('en-US', { month: 'long' });
    const year = indonesiaTime.getFullYear();
    const timestamp = indonesiaTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '');
    const fileName = `From_Revision_Marketing Order_${monthFn}_${year}_${timestamp}.xlsx`;
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
              detail.moMonth0 = moMonth0Value;
              detail.moMonth1 = moMonth1Value;
              detail.moMonth2 = moMonth2Value;
            }
          }
        } else {
          console.error('File tidak dapat dibaca sebagai ArrayBuffer');
        }
      };

      reader.readAsArrayBuffer(this.file); // Membaca file sebagai ArrayBuffer
      $('#uploadModal').modal('hide');
    }
  }

  openModalUpload(): void {
    $('#uploadModal').modal('show');
  }
}
