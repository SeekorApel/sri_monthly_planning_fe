import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import Swal from 'sweetalert2';
import { DetailMarketingOrder } from 'src/app/models/DetailMarketingOrder';
import { ApiResponse } from 'src/app/response/Response';
import { ParsingNumberService } from 'src/app/utils/parsing-number/parsing-number.service';
import { NumberFormatService } from 'src/app/utils/number-format/number-format.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
declare var $: any;
import * as ExcelJS from 'exceljs/dist/exceljs.min.js';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-add-mo-ppc',
  templateUrl: './add-mo-ppc.component.html',
  styleUrls: ['./add-mo-ppc.component.scss'],
})
export class AddMoPpcComponent implements OnInit {
  //Variable Declaration
  capacityDb: string = '';
  lastIdMo: string = '';
  isDisable: boolean = true;
  isReadOnly: boolean = true;
  isInvalid: boolean = false;
  isSubmitted: boolean = false;
  formHeaderMo: FormGroup;
  isTableVisible: boolean = true;
  monthNames: string[] = ['', '', ''];
  searchText: string = '';
  marketingOrder: MarketingOrder = new MarketingOrder();
  headerMarketingOrder: any[] = [];
  detailMarketingOrder: DetailMarketingOrder[];
  excelData: any[] = [];
  errorMessage: string | null = null;
  workDay: any[];
  file: File | null = null;
  loadingShowData: boolean = false;
  loadingSaveData: boolean = false;
  typeMo: string = '';
  dateMo: string = '';

  //Error Message
  errorMessagesMinOrder: string[] = [];
  errorMessagesMachineType: string[] = [];

  //Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  headersColumns: string[] = ['no', 'category', 'partNumber', 'description', 'machineType', 'capacity', 'qtyPerMould', 'spareMould', 'mouldMonthlyPlan', 'qtyPerRak', 'minOrder', 'maxCap', 'status'];
  childHeadersColumns: string[] = ['maxCapMonth0', 'maxCapMonth1', 'maxCapMonth2', 'lockStatusM0', 'lockStatusM1', 'lockStatusM2'];
  rowData: string[] = ['no', 'category', 'partNumber', 'description', 'machineType', 'capacity', 'qtyPerMould', 'spareMould', 'mouldMonthlyPlan', 'qtyPerRak', 'minOrder', 'maxCapMonth0', 'maxCapMonth1', 'maxCapMonth2', 'lockStatusM0', 'lockStatusM1', 'lockStatusM2'];

  dataSource: MatTableDataSource<DetailMarketingOrder>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private router: Router, private fb: FormBuilder, private moService: MarketingOrderService, private parsingNumberService: ParsingNumberService, private numberService: NumberFormatService) {
    this.formHeaderMo = this.fb.group({
      date: [new Date().toISOString().substring(0, 10)],
      type: [null, Validators.required],
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

    this.formHeaderMo.valueChanges.subscribe((values) => {
      this.updateMonthNames();
    });

    for (let i = 0; i <= 2; i++) {
      this.formHeaderMo.get(`nwt_${i}`)?.valueChanges.subscribe(() => this.calculateTotalTube(`nwt_${i}`));
      this.formHeaderMo.get(`ot_wt_${i}`)?.valueChanges.subscribe(() => this.calculateTotalTube(`ot_wt_${i}`));
    }
  }

  ngOnInit(): void {
    this.getLastIdMo();
    this.loadValueTotal();
    this.formHeaderMo.get('month_0')?.valueChanges.subscribe((value) => {
      this.calculateNextMonths(value);
    });
    this.subscribeToValueChanges('max_tube_capa_0');
    this.subscribeToValueChanges('max_capa_tl_0');
    this.subscribeToValueChanges('max_capa_tt_0');

    this.subscribeToValueChanges('max_tube_capa_1');
    this.subscribeToValueChanges('max_capa_tl_1');
    this.subscribeToValueChanges('max_capa_tt_1');

    this.subscribeToValueChanges('max_tube_capa_2');
    this.subscribeToValueChanges('max_capa_tl_2');
    this.subscribeToValueChanges('max_capa_tt_2');
  }

  resetFileInput() {
    this.fileInput.nativeElement.value = '';
  }

  getLastIdMo(): void {
    this.moService.getLastIdMo().subscribe(
      (response: ApiResponse<string>) => {
        this.lastIdMo = response.data;
        console.log('Response lastId: ', this.lastIdMo);
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load last IDMo: ' + error.message,
        });
      }
    );
  }

  formatSeparator(value: number): string {
    return this.numberService.formatSeparator(value);
  }

  formatDecimal(value: number): string {
    return this.numberService.formatDecimal(value);
  }

  onMinOrderChange(mo: any, value: string) {
    const numericValue = Number(value.replace(/\./g, '').replace(',', '.'));
    mo.minOrder = numericValue;
  }

  formatNumberMo(value: any): string {
    if (value == null || value === '') {
      return '';
    }
    return Number(value).toLocaleString('id-ID');
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

  separatorNumber(num: number): string {
    return this.parsingNumberService.separatorTableView(num);
  }

  onSearchChange(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSource.filter = '';
  }

  onInputChange(event: any, controlName: string): void {
    const inputValue = event.target.value;
    const formattedValue = this.numberService.formatDecimal(inputValue); // Format input
    this.formHeaderMo.controls[controlName].setValue(formattedValue, { emitEvent: false }); // Update FormControl tanpa memicu event
  }

  calculateTotalTube(controlName: string): void {
    const match = controlName.match(/(\w+)_(\d+)/);
    if (match) {
      const baseName = match[1];
      const index = match[2];

      const nwtValue = this.formHeaderMo.get(`nwt_${index}`)?.value ? parseFloat(this.formHeaderMo.get(`nwt_${index}`)?.value.replace(',', '.')) : 0;

      const otValue = this.formHeaderMo.get(`ot_wt_${index}`)?.value ? parseFloat(this.formHeaderMo.get(`ot_wt_${index}`)?.value.replace(',', '.')) : 0;

      const total = nwtValue + otValue;
      const formattedTotal = total.toLocaleString('id-ID', { minimumFractionDigits: 2 });

      this.formHeaderMo.get(`total_wt_${index}`)?.setValue(formattedTotal, { emitEvent: false });
    }
  }

  onChangeWorkDay(): void {
    const month0 = this.formHeaderMo.get('month_0')?.value;
    const month1 = this.formHeaderMo.get('month_1')?.value;
    const month2 = this.formHeaderMo.get('month_2')?.value;
    const extractMonthYear = (monthYear: string) => {
      const [year, month] = monthYear.split('-'); // Pisahkan tahun dan bulan
      return { year: Number(year), month: Number(month) };
    };

    const { month: month1Val, year: year1Val } = extractMonthYear(month0);
    const { month: month2Val, year: year2Val } = extractMonthYear(month1);
    const { month: month3Val, year: year3Val } = extractMonthYear(month2);

    const varWd = {
      month1: month1Val,
      year1: year1Val,
      month2: month2Val,
      year2: year2Val,
      month3: month3Val,
      year3: year3Val,
    };
    this.getWorkDays(varWd);
  }

  getWorkDays(data: any) {
    this.moService.getWorkDay(data).subscribe(
      (response) => {
        if (response && response.data && response.data.length > 0) {
          let workDataM0 = response.data[0];
          let workDataM1 = response.data[1];
          let workDataM2 = response.data[2];

          this.formHeaderMo.patchValue({
            nwd_0: this.parsingNumberService.separatorAndDecimalView(workDataM0.wdNormalTire),
            nwt_0: this.parsingNumberService.separatorAndDecimalView(workDataM0.wdNormalTire),
            tl_ot_wd_0: this.parsingNumberService.separatorAndDecimalView(workDataM0.wdOtTl),
            tt_ot_wd_0: this.parsingNumberService.separatorAndDecimalView(workDataM0.wdOtTt),
            total_tlwd_0: this.parsingNumberService.separatorAndDecimalView(workDataM0.totalWdTl),
            total_ttwd_0: this.parsingNumberService.separatorAndDecimalView(workDataM0.totalWdTt),

            nwd_1: this.parsingNumberService.separatorAndDecimalView(workDataM1.wdNormalTire),
            nwt_1: this.parsingNumberService.separatorAndDecimalView(workDataM1.wdNormalTire),
            tl_ot_wd_1: this.parsingNumberService.separatorAndDecimalView(workDataM1.wdOtTl),
            tt_ot_wd_1: this.parsingNumberService.separatorAndDecimalView(workDataM1.wdOtTt),
            total_tlwd_1: this.parsingNumberService.separatorAndDecimalView(workDataM1.totalWdTl),
            total_ttwd_1: this.parsingNumberService.separatorAndDecimalView(workDataM1.totalWdTt),

            nwd_2: this.parsingNumberService.separatorAndDecimalView(workDataM2.wdNormalTire),
            nwt_2: this.parsingNumberService.separatorAndDecimalView(workDataM2.wdNormalTire),
            tl_ot_wd_2: this.parsingNumberService.separatorAndDecimalView(workDataM2.wdOtTl),
            tt_ot_wd_2: this.parsingNumberService.separatorAndDecimalView(workDataM2.wdOtTt),
            total_tlwd_2: this.parsingNumberService.separatorAndDecimalView(workDataM2.totalWdTl),
            total_ttwd_2: this.parsingNumberService.separatorAndDecimalView(workDataM2.totalWdTt),
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'No Data',
            text: 'No work data found.',
          });
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error Occurred',
          text: 'Unable to retrieve work data. Please try again.',
        });
        console.error('Error fetching work days:', error);
      }
    );
  }

  subscribeToValueChanges(controlName: string) {
    this.formHeaderMo.get(controlName)?.valueChanges.subscribe((value) => {
      this.formatInputValue(value, controlName);
    });
  }

  formatInputValue(value: string | null, controlName: string) {
    if (value) {
      const numericValue = value.replace(/[^0-9]/g, '');
      const formattedValue = new Intl.NumberFormat('id-ID').format(Number(numericValue));
      this.formHeaderMo.get(controlName)?.setValue(formattedValue, { emitEvent: false });
    }
  }

  parseFormattedValue(formattedValue: string | null): number | null {
    if (formattedValue && typeof formattedValue === 'string') {
      const numericString = formattedValue.replace(/\./g, '').replace(',', '.');
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

  // Fungsi untuk memperbarui array nama bulan
  updateMonthNames(): void {
    this.monthNames[0] = this.getMonthName(this.formHeaderMo.get('month_0')?.value);
    this.monthNames[1] = this.getMonthName(this.formHeaderMo.get('month_1')?.value);
    this.monthNames[2] = this.getMonthName(this.formHeaderMo.get('month_2')?.value);
  }

  // Fungsi untuk mengambil nama bulan dari inputan month
  getMonthName(monthValue: string): string {
    if (monthValue) {
      const date = new Date(monthValue + '-01'); // Format input 'yyyy-MM'
      return date.toLocaleString('default', { month: 'short' }).toUpperCase(); // Nama bulan singkat
    }
    return '';
  }

  // Fungsi untuk mengatur bulan berikutnya
  calculateNextMonths(month0: string): void {
    if (month0) {
      const month0Date = new Date(month0 + '-01');

      const month1Date = new Date(month0Date);
      month1Date.setMonth(month0Date.getMonth() + 1); // Menambahkan 1 bulan

      const month2Date = new Date(month0Date);
      month2Date.setMonth(month0Date.getMonth() + 2); // Menambahkan 2 bulan

      // Set nilai pada month_2 dan month_3
      this.formHeaderMo.patchValue({
        month_1: this.formatDate(month1Date),
        month_2: this.formatDate(month2Date),
      });
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }

  loadValueTotal() {
    const months = [0, 1, 2];

    months.forEach((month) => {
      this.formHeaderMo.get(`nwd_${month}`)?.valueChanges.subscribe(() => this.calculateTotal(month));
      this.formHeaderMo.get(`tl_ot_wd_${month}`)?.valueChanges.subscribe(() => this.calculateTotal(month));
      this.formHeaderMo.get(`tt_ot_wd_${month}`)?.valueChanges.subscribe(() => this.calculateTotal(month));
    });
  }

  calculateTotal(month: number): void {
    const nwd = this.formHeaderMo.get(`nwd_${month}`)?.value || 0;
    const tlOtWd = this.formHeaderMo.get(`tl_ot_wd_${month}`)?.value || 0;
    const ttOtWd = this.formHeaderMo.get(`tt_ot_wd_${month}`)?.value || 0;

    // Hitung total
    const totalTlWd = parseFloat(nwd) + parseFloat(tlOtWd);
    const totalTtWd = parseFloat(nwd) + parseFloat(ttOtWd);

    // Mengatur nilai dengan dua angka di belakang koma
    this.formHeaderMo.patchValue({ [`total_tlwd_${month}`]: totalTlWd.toFixed(2) });
    this.formHeaderMo.patchValue({ [`total_ttwd_${month}`]: totalTtWd.toFixed(2) });
  }

  showDetailMo() {
    if (this.formHeaderMo.invalid) {
      this.formHeaderMo.markAllAsTouched();
      return;
    }
    this.loadingShowData = true;
    this.fillTheTableMo();
    this.isTableVisible = true;
  }

  fillTheTableMo(): void {
    let month0full = this.formHeaderMo.get('month_0').value;
    let month1full = this.formHeaderMo.get('month_1').value;
    let month2full = this.formHeaderMo.get('month_2').value;
    this.typeMo = this.formHeaderMo.get('type').value;
    const monthFn = new Date(this.formHeaderMo.get('month_0').value).toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    this.dateMo = monthFn;

    function formatToMMYYYY(dateString) {
      const [year, month] = dateString.split('-');
      return `${month}-${year}`;
    }

    month0full = formatToMMYYYY(month0full);
    month1full = formatToMMYYYY(month1full);
    month2full = formatToMMYYYY(month2full);

    const totalHKTL1form = parseFloat(this.formHeaderMo.get('total_tlwd_0').value.replace(',', '.')) || 0;
    const totalHKTL2form = parseFloat(this.formHeaderMo.get('total_tlwd_1').value.replace(',', '.')) || 0;
    const totalHKTL3form = parseFloat(this.formHeaderMo.get('total_tlwd_2').value.replace(',', '.')) || 0;
    const totalHKTT1from = parseFloat(this.formHeaderMo.get('total_ttwd_0').value.replace(',', '.')) || 0;
    const totalHKTT2form = parseFloat(this.formHeaderMo.get('total_ttwd_1').value.replace(',', '.')) || 0;
    const totalHKTT3form = parseFloat(this.formHeaderMo.get('total_ttwd_2').value.replace(',', '.')) || 0;
    const typeMoForm = this.formHeaderMo.get('type').value;

    let data = {
      monthYear0: month0full,
      monthYear1: month1full,
      monthYear2: month2full,
      totalHKTT1: totalHKTT1from.toString(),
      totalHKTT2: totalHKTT2form.toString(),
      totalHKTT3: totalHKTT3form.toString(),
      totalHKTL1: totalHKTL1form.toString(),
      totalHKTL2: totalHKTL2form.toString(),
      totalHKTL3: totalHKTL3form.toString(),
      productMerk: typeMoForm,
    };

    this.moService.getDetailMarketingOrder(data).subscribe(
      (response: ApiResponse<DetailMarketingOrder[]>) => {
        this.detailMarketingOrder = response.data;
        this.dataSource = new MatTableDataSource(this.detailMarketingOrder);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.detailMarketingOrder.forEach((item) => {
          item.lockStatusM0 = 0;
          item.lockStatusM1 = 0;
          item.lockStatusM2 = 0;
        });
        this.loadingShowData = false;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to load detail Marketing Order',
          text: error.message,
          confirmButtonText: 'OK',
        });
        this.loadingShowData = false;
      }
    );
  }

  saveAllMo() {
    this.isSubmitted = true;

    const hasInvalidMinOrderOrMachineType = this.detailMarketingOrder.some((item) => item.minOrder === null || item.minOrder === 0 || item.machineType === null);

    if (hasInvalidMinOrderOrMachineType) {
      Swal.fire({
        title: 'Warning!',
        text: 'Please fill in all fields in the Marekting Order form.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    const month0 = this.formHeaderMo.get('month_0')?.value;
    const month1 = this.formHeaderMo.get('month_1')?.value;
    const month2 = this.formHeaderMo.get('month_2')?.value;
    const type = this.formHeaderMo.get('type')?.value;
    const extractMonthYear = (monthYear: string) => {
      const [year, month] = monthYear.split('-'); // Pisahkan tahun dan bulan
      return { year: Number(year), month: Number(month) };
    };

    const { month: month1Val, year: year1Val } = extractMonthYear(month0);
    const { month: month2Val, year: year2Val } = extractMonthYear(month1);
    const { month: month3Val, year: year3Val } = extractMonthYear(month2);

    const varWd = {
      month1: month1Val,
      year1: year1Val,
      month2: month2Val,
      year2: year2Val,
      month3: month3Val,
      year3: year3Val,
      type: type,
    };

    this.loadingSaveData = true;

    // Validate available months before proceeding
    this.validateAvailableMonths(varWd).then((isValid) => {
      if (!isValid) {
        this.loadingSaveData = false;
        return;
      }

      // Proceed with data preparation and saving if validation passes
      this.setDataSaveMo();

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

      this.moService.saveMarketingOrderPPC(saveMo).subscribe(
        (response) => {
          Swal.close();
          Swal.fire({
            title: 'Success!',
            text: 'Data Marketing Order successfully Added.',
            icon: 'success',
            allowOutsideClick: false,
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              this.navigateToViewMo();
            }
          });
          this.loadingSaveData = false;
        },
        (err) => {
          Swal.close();
          Swal.fire('Error!', 'Error insert data Marketing Order.', 'error');
          this.loadingSaveData = false;
        }
      );
    });
  }

  validateAvailableMonths(varWd): Promise<boolean> {
    return new Promise((resolve) => {
      this.moService.getAvaiableMonth(varWd).subscribe(
        (response) => {
          if (response.data === 0) {
            // Jika response.data adalah 0, maka validasi berhasil
            resolve(true); // Validation passed
          } else if (response.data === 1) {
            // Jika response.data adalah 1, tampilkan pesan kesalahan
            Swal.fire({
              title: 'Error',
              text: 'Marketing Order data for the same month and year already exists.',
              icon: 'error',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                resolve(false);
              }
            });
          } else {
            resolve(false);
          }
        },
        (err) => {
          Swal.fire('Error!', 'Error getting available month validation.', 'error');
          resolve(false);
        }
      );
    });
  }

  setDataSaveMo() {
    // Set data Save MO
    this.marketingOrder.moId = this.lastIdMo;
    this.marketingOrder.dateValid = this.formHeaderMo.get('date')?.value;
    this.marketingOrder.type = this.formHeaderMo.get('type')?.value;
    this.marketingOrder.month0 = new Date(this.formHeaderMo.get('month_0')?.value);
    this.marketingOrder.month1 = new Date(this.formHeaderMo.get('month_1')?.value);
    this.marketingOrder.month2 = new Date(this.formHeaderMo.get('month_2')?.value);

    // Set data save Header Mo
    this.headerMarketingOrder = [];
    for (let i = 0; i < 3; i++) {
      let otWdTubeValue = this.parseFormattedValue(this.formHeaderMo.get(`ot_wt_${i}`)?.value) ?? 0;
      this.headerMarketingOrder.push({
        moId: this.lastIdMo,
        month: new Date(this.formHeaderMo.get(`month_${i}`)?.value),
        wdNormalTire: this.parseFormattedValue(this.formHeaderMo.get(`nwd_${i}`)?.value),
        wdNormalTube: this.parseFormattedValue(this.formHeaderMo.get(`nwt_${i}`)?.value),
        wdOtTube: otWdTubeValue,
        wdOtTl: this.parseFormattedValue(this.formHeaderMo.get(`tl_ot_wd_${i}`)?.value),
        wdOtTt: this.parseFormattedValue(this.formHeaderMo.get(`tt_ot_wd_${i}`)?.value),
        totalWdTube: this.parseFormattedValue(this.formHeaderMo.get(`total_wt_${i}`)?.value),
        totalWdTl: this.parseFormattedValue(this.formHeaderMo.get(`total_tlwd_${i}`)?.value),
        totalWdTt: this.parseFormattedValue(this.formHeaderMo.get(`total_ttwd_${i}`)?.value),
        maxCapTube: this.parseFormattedValue(this.formHeaderMo.get(`max_tube_capa_${i}`)?.value || ''),
        maxCapTl: this.parseFormattedValue(this.formHeaderMo.get(`max_capa_tl_${i}`)?.value || ''),
        maxCapTt: this.parseFormattedValue(this.formHeaderMo.get(`max_capa_tt_${i}`)?.value || ''),
        noteOrderTl: this.formHeaderMo.get(`note_order_tl_${i}`)?.value,
      });
    }

    // Set data save Detail Mo
    this.detailMarketingOrder.forEach((item) => {
      item.moId = this.lastIdMo;
      item.minOrder = item.minOrder ? Number(item.minOrder.toString().replace('.', '')) : 0;
    });
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

    worksheet.getCell('Q7').value = this.formHeaderMo.get('nwd_0')?.value; // "Month 1"
    worksheet.getCell('R7').value = this.formHeaderMo.get('nwd_1')?.value; // "Month 2"
    worksheet.getCell('S7').value = this.formHeaderMo.get('nwd_2')?.value; // "Month 3"
    worksheet.getCell('Q7').numFmt = '0.00';
    worksheet.getCell('R7').numFmt = '0.00';
    worksheet.getCell('S7').numFmt = '0.00';

    worksheet.mergeCells('N8:P8');
    worksheet.getCell('N8').value = 'Normal Working Day Tube';
    worksheet.getCell('N8').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('N8').font = { name: 'Calibri Body', size: 11, bold: true, italic: true };
    setBorder(worksheet.getCell('N8'));

    worksheet.getCell('Q8').value = this.formHeaderMo.get('nwt_0')?.value; // "Month 1"
    worksheet.getCell('R8').value = this.formHeaderMo.get('nwt_1')?.value; // "Month 2"
    worksheet.getCell('S8').value = this.formHeaderMo.get('nwt_2')?.value; // "Month 3"
    worksheet.getCell('Q8').numFmt = '0.00';
    worksheet.getCell('R8').numFmt = '0.00';
    worksheet.getCell('S8').numFmt = '0.00';

    worksheet.mergeCells('N9:P9');
    worksheet.getCell('N9').value = 'Workday Overtime Tube';
    worksheet.getCell('N9').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('N9').font = { name: 'Calibri Body', size: 11, bold: true, italic: true };
    setBorder(worksheet.getCell('N9'));
    worksheet.getCell('Q9').value = this.formHeaderMo.get('ot_wt_0')?.value; // "Month 1"
    worksheet.getCell('R9').value = this.formHeaderMo.get('ot_wt_1')?.value; // "Month 2"
    worksheet.getCell('S9').value = this.formHeaderMo.get('ot_wt_2')?.value; // "Month 3"
    worksheet.getCell('Q9').numFmt = '0.00';
    worksheet.getCell('R9').numFmt = '0.00';
    worksheet.getCell('S9').numFmt = '0.00';

    worksheet.mergeCells('N10:P10');
    worksheet.getCell('N10').value = 'Workday Overtime TL';
    worksheet.getCell('N10').alignment = { vertical: 'middle', horizontal: 'left' };
    worksheet.getCell('N10').font = { name: 'Calibri Body', size: 11, bold: true, italic: true };
    setBorder(worksheet.getCell('N10'));
    worksheet.getCell('Q10').value = this.formHeaderMo.get('tl_ot_wd_0')?.value; // "Month 1"
    worksheet.getCell('R10').value = this.formHeaderMo.get('tl_ot_wd_1')?.value; // "Month 2"
    worksheet.getCell('S10').value = this.formHeaderMo.get('tl_ot_wd_2')?.value; // "Month 3"
    worksheet.getCell('Q10').numFmt = '0.00';
    worksheet.getCell('R10').numFmt = '0.00';
    worksheet.getCell('S10').numFmt = '0.00';

    worksheet.mergeCells('N11:P11');
    worksheet.getCell('N11').value = 'Workday Overtime TT';
    worksheet.getCell('N11').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N11'));
    worksheet.getCell('Q11').value = this.formHeaderMo.get('tt_ot_wd_0')?.value; // "Month 1"
    worksheet.getCell('R11').value = this.formHeaderMo.get('tt_ot_wd_1')?.value; // "Month 2"
    worksheet.getCell('S11').value = this.formHeaderMo.get('tt_ot_wd_2')?.value; // "Month 3"
    worksheet.getCell('Q11').numFmt = '0.00';
    worksheet.getCell('R11').numFmt = '0.00';
    worksheet.getCell('S11').numFmt = '0.00';

    worksheet.mergeCells('N12:P12');
    worksheet.getCell('N12').value = 'Total Workday Tube';
    worksheet.getCell('N12').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N12'));
    worksheet.getCell('Q12').value = this.formHeaderMo.get('total_wt_0')?.value ?? 0; // "Month 1"
    worksheet.getCell('R12').value = this.formHeaderMo.get('total_wt_1')?.value ?? 0; // "Month 2"
    worksheet.getCell('S12').value = this.formHeaderMo.get('total_wt_2')?.value ?? 0; // "Month 3"
    worksheet.getCell('Q12').numFmt = '0.00';
    worksheet.getCell('R12').numFmt = '0.00';
    worksheet.getCell('S12').numFmt = '0.00';

    worksheet.mergeCells('N13:P13');
    worksheet.getCell('N13').value = 'Total Workday Tire TL';
    worksheet.getCell('N13').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N13'));
    worksheet.getCell('Q13').value = this.formHeaderMo.get('total_tlwd_0')?.value; // "Month 1"
    worksheet.getCell('R13').value = this.formHeaderMo.get('total_tlwd_1')?.value; // "Month 2"
    worksheet.getCell('S13').value = this.formHeaderMo.get('total_tlwd_2')?.value; // "Month 3"
    worksheet.getCell('Q13').numFmt = '0.00';
    worksheet.getCell('R13').numFmt = '0.00';
    worksheet.getCell('S13').numFmt = '0.00';

    worksheet.mergeCells('N14:P14');
    worksheet.getCell('N14').value = 'Total Workday Tire TT';
    worksheet.getCell('N14').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N14'));
    worksheet.getCell('Q14').value = this.formHeaderMo.get('total_ttwd_0')?.value; // "Month 1"
    worksheet.getCell('R14').value = this.formHeaderMo.get('total_ttwd_1')?.value; // "Month 2"
    worksheet.getCell('S14').value = this.formHeaderMo.get('total_ttwd_2')?.value; // "Month 3"
    worksheet.getCell('Q14').numFmt = '0.00';
    worksheet.getCell('R14').numFmt = '0.00';
    worksheet.getCell('S14').numFmt = '0.00';

    worksheet.mergeCells('N15:P15');
    worksheet.getCell('N15').value = 'Max Capacity Tube';
    worksheet.getCell('N15').alignment = { vertical: 'middle', horizontal: 'left' };
    setBorder(worksheet.getCell('N15'));
    worksheet.getCell('Q15').value = this.formHeaderMo.get('max_tube_capa_0')?.value; // "Month 1"
    worksheet.getCell('R15').value = this.formHeaderMo.get('max_tube_capa_1')?.value; // "Month 2"
    worksheet.getCell('S15').value = this.formHeaderMo.get('max_tube_capa_2')?.value; // "Month 3"
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
    worksheet.getCell('Q16').value = this.formHeaderMo.get('max_capa_tl_0')?.value; // "Month 1"
    worksheet.getCell('R16').value = this.formHeaderMo.get('max_capa_tl_1')?.value; // "Month 2"
    worksheet.getCell('S16').value = this.formHeaderMo.get('max_capa_tl_2')?.value; // "Month 3"
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
    worksheet.getCell('Q17').value = this.formHeaderMo.get('max_capa_tt_0')?.value; // "Month 1"
    worksheet.getCell('R17').value = this.formHeaderMo.get('max_capa_tt_1')?.value; // "Month 2"
    worksheet.getCell('S17').value = this.formHeaderMo.get('max_capa_tt_2')?.value; // "Month 3"
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
    // worksheet.getCell('Q18').value = this.headerMarketingOrder[1].noteOrderTl; // "Month 1"
    // worksheet.getCell('R18').value = this.headerMarketingOrder[2].noteOrderTl; // "Month 2"
    // worksheet.getCell('S18').value = this.headerMarketingOrder[0].noteOrderTl; // "Month 3"
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
    const fileName = `FORM ADD MO PPC - ${this.typeMo} ${this.dateMo} - ${year} - ${timestamp}.xlsx`;
    return fileName;
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
            const machineType = String(worksheet[`E${row + 1}`]?.v) || null; // Kolom I
            const minOrder = Number(worksheet[`I${row + 1}`]?.v) || null; // Kolom E

            // Mencari dan memperbarui nilai dalam detailMarketingOrder
            const detail = this.detailMarketingOrder.find((item) => item.partNumber === partNumber);
            if (detail) {
              detail.minOrder = minOrder;
              detail.machineType = machineType;
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

  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-mo-ppc']);
  }
}
