import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
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
import { ProductCurring } from 'src/app/models/ProductCurring';
import { NumberFormatService } from 'src/app/utils/number-format/number-format.service';

@Component({
  selector: 'app-add-mo-marketing',
  templateUrl: './add-mo-marketing.component.html',
  styleUrls: ['./add-mo-marketing.component.scss'],
})
export class AddMoMarketingComponent implements OnInit {
  //Variable Declaration
  idMo: String;
  capacityDb: string = '';
  searchText: string = '';
  monthNames: string[] = ['', '', ''];
  touchedRows: boolean[] = [];
  formHeaderMo: FormGroup;
  isReadOnly: Boolean = true;
  isTableVisible: boolean = false;
  isSubmitted: boolean = false;
  file: File | null = null;
  allData: any;
  marketingOrder: MarketingOrder;
  detailMarketingOrder: DetailMarketingOrder[];
  headerMarketingOrder: HeaderMarketingOrder[];
  detailMarketingOrderUpdate: DetailMarketingOrder[];
  productCurring: ProductCurring[];
  totalMoMonth1TT: number = 0;
  totalMoMonth2TT: number = 0;
  totalMoMonth3TT: number = 0;
  totalMoMonth1TL: number = 0;
  totalMoMonth2TL: number = 0;
  totalMoMonth3TL: number = 0;
  loading: boolean = false;
  typeMO: string = '';
  dateMo: string = '';

  //Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  headersColumns: string[] = ['no', 'category', 'partNumber', 'description', 'machineType', 'capacity', 'mouldMonthlyPlan', 'qtyPerRak', 'minOrder', 'maxCap', 'initialStock', 'salesForecast', 'marketingOrder', 'itemCuring'];
  childHeadersColumns: string[] = ['maxCapMonth0', 'maxCapMonth1', 'maxCapMonth2', 'sfMonth0', 'sfMonth1', 'sfMonth2', 'moMonth0', 'moMonth1', 'moMonth2'];
  rowData: string[] = ['no', 'category', 'partNumber', 'description', 'machineType', 'capacity', 'mouldMonthlyPlan', 'qtyPerRak', 'minOrder', 'maxCapMonth0', 'maxCapMonth1', 'maxCapMonth2', 'initialStock', 'sfMonth0', 'sfMonth1', 'sfMonth2', 'moMonth0', 'moMonth1', 'moMonth2', 'itemCuring'];
  dataSource: MatTableDataSource<DetailMarketingOrder>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('fileInput') fileInput: ElementRef;

  //Error message
  errorMessagesM0: string[] = [];
  errorMessagesM1: string[] = [];
  errorMessagesM2: string[] = [];

  //Touch status
  touchStatus: { [key: number]: { isTouchedM0: boolean } } = {};

  constructor(private router: Router, private activeRoute: ActivatedRoute, private moService: MarketingOrderService, private fb: FormBuilder, private parsingNumberService: ParsingNumberService, private numberService: NumberFormatService) {
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
  }

  resetFileInput() {
    this.fileInput.nativeElement.value = '';
  }

  onInputChangeM0(mo: any, value: string) {
    const numericValue = Number(value.replace(/\./g, '').replace(',', '.'));
    mo.moMonth0 = numericValue;
  }

  onInputChangeM1(mo: any, value: string): void {
    const numericValue = Number(value.replace(/\./g, '').replace(',', '.'));
    mo.moMonth1 = numericValue;
  }

  onInputChangeM2(mo: any, value: string): void {
    const numericValue = Number(value.replace(/\./g, '').replace(',', '.'));
    mo.moMonth2 = numericValue;
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.charCode || event.keyCode;
    // Cek apakah karakter adalah angka (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  formatNumber(value: any): string {
    if (value == null || value === '') {
      return '';
    }
    return Number(value).toLocaleString('id-ID');
  }

  onInputFormat(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const numericValue = value.replace(/\./g, '').replace(/,/g, '.');
    input.value = this.formatNumber(numericValue);
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

  onInputChange(value: string, mo: any, field: string): void {
    const numericValue = value.replace(/\./g, '').replace(/,/g, '.');
    mo[field] = numericValue;
  }

  separatorNumber(num: number): string {
    return this.parsingNumberService.separatorTableView(num);
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSource.filter = '';
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

  fillAllData(data: any): void {
    this.headerMarketingOrder = data.dataHeaderMo;
    this.detailMarketingOrder = data.dataDetailMo;
    const monthFn = new Date(this.headerMarketingOrder[0].month).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    this.dateMo = monthFn;

    this.touchedRows = new Array(this.detailMarketingOrder.length).fill(false);
    this.dataSource = new MatTableDataSource(this.detailMarketingOrder);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.typeMO = data.type;

    this.formHeaderMo.patchValue({
      date: new Date(data.dateValid).toISOString().split('T')[0],
      type: data.type,

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
    });

    this.updateMonthNames(this.headerMarketingOrder);
  }

  formatNumberView(value: number) {
    return this.parsingNumberService.separatorAndDecimalView(value);
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

    worksheet.mergeCells('N6:P6');
    worksheet.getCell('N6').value = 'Description';
    worksheet.getCell('N6').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N6'));
    worksheet.getCell('N6').font = { name: 'Calibri Body', size: 11, bold: true, italic: true };
    worksheet.getCell('N6').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('Q6').value = month0;
    setBorder(worksheet.getCell('Q6'));

    worksheet.getCell('R6').value = month1;
    setBorder(worksheet.getCell('R6'));

    worksheet.getCell('S6').value = month2;
    setBorder(worksheet.getCell('S6'));

    ['Q6', 'R6', 'S6'].forEach((cell) => {
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

    worksheet.mergeCells('N7:P7');
    worksheet.getCell('N7').value = 'Normal Working Day';
    worksheet.getCell('N7').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('N7').font = { name: 'Calibri Body', size: 11, bold: true, italic: true };
    setBorder(worksheet.getCell('N7'));

    worksheet.getCell('Q7').value = this.headerMarketingOrder[0].wdNormalTire; // "Month 1"
    worksheet.getCell('R7').value = this.headerMarketingOrder[1].wdNormalTire; // "Month 2"
    worksheet.getCell('S7').value = this.headerMarketingOrder[2].wdNormalTire; // "Month 3"
    worksheet.getCell('Q7').numFmt = '0.00';
    worksheet.getCell('R7').numFmt = '0.00';
    worksheet.getCell('S7').numFmt = '0.00';

    worksheet.mergeCells('N8:P8');
    worksheet.getCell('N8').value = 'Normal Working Day Tube';
    worksheet.getCell('N8').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('N8').font = { name: 'Calibri Body', size: 11, bold: true, italic: true };
    setBorder(worksheet.getCell('N8'));

    worksheet.getCell('Q8').value = this.headerMarketingOrder[0].wdNormalTube; // "Month 1"
    worksheet.getCell('R8').value = this.headerMarketingOrder[1].wdNormalTube; // "Month 2"
    worksheet.getCell('S8').value = this.headerMarketingOrder[2].wdNormalTube; // "Month 3"
    worksheet.getCell('Q8').numFmt = '0.00';
    worksheet.getCell('R8').numFmt = '0.00';
    worksheet.getCell('S8').numFmt = '0.00';

    worksheet.mergeCells('N9:P9');
    worksheet.getCell('N9').value = 'Workday Overtime Tube';
    worksheet.getCell('N9').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('N9').font = { name: 'Calibri Body', size: 11, bold: true, italic: true };
    setBorder(worksheet.getCell('N9'));
    worksheet.getCell('Q9').value = this.headerMarketingOrder[0].wdOtTube; // "Month 1"
    worksheet.getCell('R9').value = this.headerMarketingOrder[1].wdOtTube; // "Month 2"
    worksheet.getCell('S9').value = this.headerMarketingOrder[2].wdOtTube; // "Month 3"
    worksheet.getCell('Q9').numFmt = '0.00';
    worksheet.getCell('R9').numFmt = '0.00';
    worksheet.getCell('S9').numFmt = '0.00';

    worksheet.mergeCells('N10:P10');
    worksheet.getCell('N10').value = 'Workday Overtime TL';
    worksheet.getCell('N10').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('N10').font = { name: 'Calibri Body', size: 11, bold: true, italic: true };
    setBorder(worksheet.getCell('N10'));
    worksheet.getCell('Q10').value = this.headerMarketingOrder[0].wdOtTl; // "Month 1"
    worksheet.getCell('R10').value = this.headerMarketingOrder[1].wdOtTl; // "Month 2"
    worksheet.getCell('S10').value = this.headerMarketingOrder[2].wdOtTl; // "Month 3"
    worksheet.getCell('Q10').numFmt = '0.00';
    worksheet.getCell('R10').numFmt = '0.00';
    worksheet.getCell('S10').numFmt = '0.00';

    worksheet.mergeCells('N11:P11');
    worksheet.getCell('N11').value = 'Workday Overtime TT';
    worksheet.getCell('N11').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N11'));
    worksheet.getCell('Q11').value = this.headerMarketingOrder[0].wdOtTt; // "Month 1"
    worksheet.getCell('R11').value = this.headerMarketingOrder[1].wdOtTt; // "Month 2"
    worksheet.getCell('S11').value = this.headerMarketingOrder[2].wdOtTt; // "Month 3"
    worksheet.getCell('Q11').numFmt = '0.00';
    worksheet.getCell('R11').numFmt = '0.00';
    worksheet.getCell('S11').numFmt = '0.00';

    worksheet.mergeCells('N12:P12');
    worksheet.getCell('N12').value = 'Total Workday Tube';
    worksheet.getCell('N12').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N12'));
    worksheet.getCell('Q12').value = this.headerMarketingOrder[0].totalWdTube; // "Month 1"
    worksheet.getCell('R12').value = this.headerMarketingOrder[1].totalWdTube; // "Month 2"
    worksheet.getCell('S12').value = this.headerMarketingOrder[2].totalWdTube; // "Month 3"
    worksheet.getCell('Q12').numFmt = '0.00';
    worksheet.getCell('R12').numFmt = '0.00';
    worksheet.getCell('S12').numFmt = '0.00';

    worksheet.mergeCells('N13:P13');
    worksheet.getCell('N13').value = 'Total Workday Tire TL';
    worksheet.getCell('N13').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N13'));
    worksheet.getCell('Q13').value = this.headerMarketingOrder[0].totalWdTl; // "Month 1"
    worksheet.getCell('R13').value = this.headerMarketingOrder[1].totalWdTl; // "Month 2"
    worksheet.getCell('S13').value = this.headerMarketingOrder[2].totalWdTl; // "Month 3"
    worksheet.getCell('Q13').numFmt = '0.00';
    worksheet.getCell('R13').numFmt = '0.00';
    worksheet.getCell('S13').numFmt = '0.00';

    worksheet.mergeCells('N14:P14');
    worksheet.getCell('N14').value = 'Total Workday Tire TT';
    worksheet.getCell('N14').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N14'));
    worksheet.getCell('Q14').value = this.headerMarketingOrder[0].totalWdTt; // "Month 1"
    worksheet.getCell('R14').value = this.headerMarketingOrder[1].totalWdTt; // "Month 2"
    worksheet.getCell('S14').value = this.headerMarketingOrder[2].totalWdTt; // "Month 3"
    worksheet.getCell('Q14').numFmt = '0.00';
    worksheet.getCell('R14').numFmt = '0.00';
    worksheet.getCell('S14').numFmt = '0.00';

    worksheet.mergeCells('N15:P15');
    worksheet.getCell('N15').value = 'Max Capacity Tube';
    worksheet.getCell('N15').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N15'));
    worksheet.getCell('Q15').value = this.headerMarketingOrder[1].maxCapTube; // "Month 1"
    worksheet.getCell('R15').value = this.headerMarketingOrder[2].maxCapTube; // "Month 2"
    worksheet.getCell('S15').value = this.headerMarketingOrder[0].maxCapTube; // "Month 3"
    worksheet.getCell('Q15').numFmt = '#,##0';
    worksheet.getCell('R15').numFmt = '#,##0';
    worksheet.getCell('S15').numFmt = '#,##0';
    worksheet.getCell('N15').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' },
    };

    ['Q15', 'R15', 'S15'].forEach((cell) => {
      const cellRef = worksheet.getCell(cell);
      cellRef.alignment = { vertical: 'middle', horizontal: 'center' };

      cellRef.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9D9D9' },
      };
    });

    worksheet.mergeCells('N16:P16');
    worksheet.getCell('N16').value = 'Max Capacity Tire TL';
    worksheet.getCell('N16').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N16'));
    worksheet.getCell('Q16').value = this.headerMarketingOrder[0].maxCapTl; // "Month 1"
    worksheet.getCell('R16').value = this.headerMarketingOrder[1].maxCapTl; // "Month 2"
    worksheet.getCell('S16').value = this.headerMarketingOrder[2].maxCapTl; // "Month 3"
    worksheet.getCell('Q16').numFmt = '#,##0';
    worksheet.getCell('R16').numFmt = '#,##0';
    worksheet.getCell('S16').numFmt = '#,##0';
    worksheet.getCell('N16').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' },
    };
    ['Q16', 'R16', 'S16'].forEach((cell) => {
      const cellRef = worksheet.getCell(cell);
      cellRef.alignment = { vertical: 'middle', horizontal: 'center' };

      cellRef.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9D9D9' },
      };
    });

    worksheet.mergeCells('N17:P17');
    worksheet.getCell('N17').value = 'Max Capacity Tire TT';
    worksheet.getCell('N17').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N17'));
    worksheet.getCell('Q17').value = this.headerMarketingOrder[0].maxCapTt; // "Month 1"
    worksheet.getCell('R17').value = this.headerMarketingOrder[1].maxCapTt; // "Month 2"
    worksheet.getCell('S17').value = this.headerMarketingOrder[2].maxCapTt; // "Month 3"
    worksheet.getCell('Q17').numFmt = '#,##0';
    worksheet.getCell('R17').numFmt = '#,##0';
    worksheet.getCell('S17').numFmt = '#,##0';
    worksheet.getCell('N17').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9D9D9' },
    };
    ['Q17', 'R17', 'S17'].forEach((cell) => {
      const cellRef = worksheet.getCell(cell);
      cellRef.alignment = { vertical: 'middle', horizontal: 'center' };

      cellRef.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9D9D9' },
      };
    });

    worksheet.mergeCells('N18:P18');
    worksheet.getCell('N18').value = 'Note Order TL';
    worksheet.getCell('N18').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N18'));
    worksheet.getCell('Q18').value = this.headerMarketingOrder[1].noteOrderTl; // "Month 1"
    worksheet.getCell('R18').value = this.headerMarketingOrder[2].noteOrderTl; // "Month 2"
    worksheet.getCell('S18').value = this.headerMarketingOrder[0].noteOrderTl; // "Month 3"
    ['Q18', 'R18', 'S18'].forEach((cell) => {
      worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    for (let i = 6; i <= 20; i++) {
      worksheet.getRow(i).height = 20;
    }

    for (let row = 7; row <= 18; row++) {
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

    ['Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12', 'Q13', 'Q14', 'Q15', 'Q16', 'Q17'].forEach((cell) => {
      const cellRef = worksheet.getCell(cell);
      cellRef.alignment = { vertical: 'middle', horizontal: 'right' };
      cellRef.font = {
        name: 'Calibri Body',
        size: 11,
        bold: true,
        italic: true,
      };
    });

    ['R7', 'R8', 'R9', 'R10', 'R11', 'R12', 'R13', 'R14', 'R15', 'R16', 'R17'].forEach((cell) => {
      const cellRef = worksheet.getCell(cell);
      cellRef.alignment = { vertical: 'middle', horizontal: 'right' };
      cellRef.font = {
        name: 'Calibri Body',
        size: 11,
        bold: true,
        italic: true,
      };
    });

    ['S7', 'S8', 'S9', 'S10', 'S11', 'S12', 'S13', 'S14', 'S15', 'S16', 'S17'].forEach((cell) => {
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
    worksheet.getCell('B19').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('C19:C20');
    worksheet.getCell('C19').value = 'Item';
    worksheet.getCell('C19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('C').width = 20;
    setBorder(worksheet.getCell('C19'));
    worksheet.getCell('C19').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('D19:D20');
    worksheet.getCell('D19').value = 'Description';
    worksheet.getCell('D19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('D').width = 41;
    setBorder(worksheet.getCell('D19'));
    worksheet.getCell('D19').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('E19:E20');
    worksheet.getCell('E19').value = 'Machine Type';
    worksheet.getCell('E19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('E').width = 15;
    setBorder(worksheet.getCell('E19'));
    worksheet.getCell('E19').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('F19:F20');
    worksheet.getCell('F19').value = `Capacity ${this.capacityDb} %`;
    worksheet.getCell('F19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('F').width = 18;
    setBorder(worksheet.getCell('F19'));
    worksheet.getCell('F19').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('G19:G20');
    worksheet.getCell('G19').value = 'Mould Plan';
    worksheet.getCell('G19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('G').width = 18;
    setBorder(worksheet.getCell('G19'));
    worksheet.getCell('G19').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('H19:H20');
    worksheet.getCell('H19').value = 'Qty Per Rak';
    worksheet.getCell('H19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('H').width = 18;
    setBorder(worksheet.getCell('H19'));
    worksheet.getCell('H19').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('I19:I20');
    worksheet.getCell('I19').value = 'Minimal Order';
    worksheet.getCell('I19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('I').width = 18;
    setBorder(worksheet.getCell('I19'));
    worksheet.getCell('I19').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('J19:L19');
    worksheet.getCell('J19').value = 'Capacity Maximum';
    worksheet.getCell('J19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('J').width = 15;
    setBorder(worksheet.getCell('J19'));
    worksheet.getCell('J19').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('J20').value = month0;
    worksheet.getCell('J20').alignment = { vertical: 'middle', horizontal: 'center' };
    setBorder(worksheet.getCell('J20'));
    worksheet.getCell('J20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('K20').value = month1;
    worksheet.getCell('K20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('K').width = 15;
    setBorder(worksheet.getCell('K20'));
    worksheet.getCell('K20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('L20').value = month2;
    worksheet.getCell('L20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('L').width = 15;
    setBorder(worksheet.getCell('L20'));
    worksheet.getCell('L20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('M19:M20');
    worksheet.getCell('M19').value = 'Initial Stock';
    worksheet.getCell('M19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('M').width = 20;
    setBorder(worksheet.getCell('M19'));
    worksheet.getCell('M19').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('N19:P19');
    worksheet.getCell('N19').value = 'Sales Forecast';
    worksheet.getCell('N19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('N').width = 20;
    setBorder(worksheet.getCell('N19'));
    worksheet.getCell('N19').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('N20').value = month0;
    worksheet.getCell('N20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('O').width = 20;
    setBorder(worksheet.getCell('N20'));
    worksheet.getCell('N20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('O20').value = month1;
    worksheet.getCell('O20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('O').width = 20;
    setBorder(worksheet.getCell('O20'));
    worksheet.getCell('O20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('P20').value = month2;
    worksheet.getCell('P20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('P').width = 20;
    setBorder(worksheet.getCell('P20'));
    worksheet.getCell('P20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.mergeCells('Q19:S19');
    worksheet.getCell('Q19').value = 'Marketing Order';
    worksheet.getCell('Q19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('Q').width = 20;
    setBorder(worksheet.getCell('Q19'));
    worksheet.getCell('Q19').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('Q20').value = month0;
    worksheet.getCell('Q20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('Q').width = 20;
    setBorder(worksheet.getCell('Q20'));
    worksheet.getCell('Q20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('R20').value = month1;
    worksheet.getCell('R20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('R').width = 20;
    setBorder(worksheet.getCell('R20'));
    worksheet.getCell('R20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

    worksheet.getCell('S20').value = month2;
    worksheet.getCell('S20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('S').width = 20;
    setBorder(worksheet.getCell('S20'));
    worksheet.getCell('S20').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' },
    };

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

    let rowIndex = 21;
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
    const monthFn = indonesiaTime.toLocaleDateString('en-US', { month: 'long' });
    const year = indonesiaTime.getFullYear();
    const timestamp = indonesiaTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '');
    const fileName = `FROM ADD MO Marketing ${this.typeMO} - ${this.dateMo} - ${year} - ${timestamp}.xlsx`;
    return fileName;
  }

  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-mo-marketing']);
  }

  formatDateToString(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  updateMonthNames(hmo: HeaderMarketingOrder[]): void {
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

  formatMonthToString(date: Date) {
    const dateConvert = new Date(date);
    const options: Intl.DateTimeFormatOptions = { month: 'long' };
    const monthName = dateConvert.toLocaleString('en-US', options);
    return monthName;
  }

  navigateToView() {
    this.router.navigate(['/transaksi/view-mo-marketing']);
  }

  navigateToDetail(idMo: String) {
    this.router.navigate(['/transaksi/view-mo-marketing']);
  }

  openModalUpload(): void {
    $('#uploadModal').modal('show');
  }

  uploadFileExcel() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);

      // Membaca file Excel
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        if (result instanceof ArrayBuffer) {
          const data = new Uint8Array(result);
          const workbook = XLSX.read(data, { type: 'array' });
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
            const moMonth0Value = Number(worksheet[`Q${row + 1}`]?.v) || 0; // Kolom Q
            const moMonth1Value = Number(worksheet[`R${row + 1}`]?.v) || 0; // Kolom R
            const moMonth2Value = Number(worksheet[`S${row + 1}`]?.v) || 0; // Kolom S

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
      this.isTableVisible = true;
      $('#uploadModal').modal('hide');
      this.resetFileInput();
    }
  }

  formatNumberChange(value: number | null | undefined): string {
    return value != null ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
  }

  onModelChange(value: string, mo: any, field: string) {
    const numberValue = value ? Number(value.replace(/\./g, '')) : null;
    mo[field] = numberValue;
  }

  saveMo(): void {
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
        text: 'There is an invalid input on the detail marketing order form.',
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
        text: `Total Marketing Order TL must not exceed the total Maximum Capacity of TL ${this.formatSeparator(maxCapTlM0)} in month 1.`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (totalMoTLMonth1 > maxCapTlM1) {
      Swal.fire({
        title: 'Warning!',
        text: `Total Marketing Order TL must not exceed the total Maximum Capacity of TL ${this.formatSeparator(maxCapTlM1)} in month 2.`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (totalMoTLMonth2 > maxCapTlM2) {
      Swal.fire({
        title: 'Warning!',
        text: `Total Marketing Order TL must not exceed the total Maximum Capacity of TL ${this.formatSeparator(maxCapTlM2)} in month 3.`,
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
        text: `Total Marketing Order TT must not exceed the total Maximum Capacity of TT ${this.formatSeparator(maxCapTtM0)} in month 1.`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (totalMoTTMonth1 > maxCapTtM1) {
      Swal.fire({
        title: 'Warning!',
        text: `Total Marketing Order TT must not exceed the total Maximum Capacity of TT ${this.formatSeparator(maxCapTtM1)} in month 2.`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (totalMoTTMonth2 > maxCapTtM2) {
      Swal.fire({
        title: 'Warning!',
        text: `Total Marketing Order TT must not exceed the total Maximum Capacity of TT ${this.formatSeparator(maxCapTtM2)} in month 3.`,
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
        text: `Total Marketing Order Tube must not exceed the total Maximum Capacity of Tube ${this.formatSeparator(maxCapTubeM0)} in month 1.`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (totalMoTTubeMonth1 > maxCapTubeM1) {
      Swal.fire({
        title: 'Warning!',
        text: `Total Marketing Order Tube must not exceed the total Maximum Capacity of Tube ${this.formatSeparator(maxCapTubeM1)} in month 2.`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (totalMoTTubeMonth2 > maxCapTubeM2) {
      Swal.fire({
        title: 'Warning!',
        text: `Total Marketing Order Tube must not exceed the total Maximum Capacity of Tube ${this.formatSeparator(maxCapTubeM2)} in month 3.`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
    //Validasi End Total Mo Tube

    //End Validasi Total

    //Parsing data text to number
    // this.detailMarketingOrder.forEach((mo) => {
    //   mo.initialStock = mo.initialStock !== null ? parseFloat(mo.initialStock.toString().replace(/\./g, '')) : 0;
    //   mo.sfMonth0 = mo.sfMonth0 !== null ? parseFloat(mo.sfMonth0.toString().replace(/\./g, '')) : 0;
    //   mo.sfMonth1 = mo.sfMonth1 !== null ? parseFloat(mo.sfMonth1.toString().replace(/\./g, '')) : 0;
    //   mo.sfMonth2 = mo.sfMonth2 !== null ? parseFloat(mo.sfMonth2.toString().replace(/\./g, '')) : 0;
    //   mo.moMonth0 = mo.moMonth0 !== null ? parseFloat(mo.moMonth0.toString().replace(/\./g, '')) : 0;
    //   mo.moMonth1 = mo.moMonth1 !== null ? parseFloat(mo.moMonth1.toString().replace(/\./g, '')) : 0;
    //   mo.moMonth2 = mo.moMonth2 !== null ? parseFloat(mo.moMonth2.toString().replace(/\./g, '')) : 0;
    // });

    const filteredData = this.detailMarketingOrder.map((item) => ({
      partNumber: item.partNumber,
      moMonth0: item.moMonth0,
      moMonth1: item.moMonth1,
      moMonth2: item.moMonth2,
    }));

    this.loading = true;

    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while save data marketing order.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.moService.saveMarketingOrderMarketing(this.detailMarketingOrder).subscribe(
      (response) => {
        Swal.close();
        Swal.fire({
          title: 'Success!',
          text: 'Data Marketing Order Success added.',
          icon: 'success',
          allowOutsideClick: false,
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            this.navigateToView();
          }
        });
        this.loading = false;
      },
      (error) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add marketing order details: ' + error.message,
          confirmButtonText: 'OK',
        });
        this.loading = false;
      }
    );
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
}
