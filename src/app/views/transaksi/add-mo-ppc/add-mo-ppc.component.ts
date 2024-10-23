import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import Swal from 'sweetalert2';
import * as ExcelJS from 'exceljs/dist/exceljs.min.js';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DetailMarketingOrder } from 'src/app/models/DetailMarketingOrder';
import { ApiResponse } from 'src/app/response/Response';
import { HeaderMarketingOrder } from 'src/app/models/HeaderMarketingOrder';
import { error } from '@angular/compiler/src/util';
declare var $: any;

@Component({
  selector: 'app-add-mo-ppc',
  templateUrl: './add-mo-ppc.component.html',
  styleUrls: ['./add-mo-ppc.component.scss'],
})
export class AddMoPpcComponent implements OnInit {
  //Variable Declaration
  dataTableMo: any[] = [];
  isDisable: boolean = true;
  isReadOnly: boolean = true;
  formHeaderMo: FormGroup;
  isTableVisible: boolean = false;
  monthNames: string[] = ['', '', ''];
  marketingOrder: MarketingOrder = new MarketingOrder();
  headerMo: any[] = [];
  detailMarketingOrder: DetailMarketingOrder[];
  excelData: any[] = [];
  errorMessage: string | null = null;
  lastIdMo: string = '';
  workDay: any[];

  constructor(private router: Router, private fb: FormBuilder, private moService: MarketingOrderService) {
    this.formHeaderMo = this.fb.group({
      date: [new Date().toISOString().substring(0, 10)],
      type: [null, Validators.required],
      month_0: [null, Validators.required],
      month_1: [null, []],
      month_2: [null, []],
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

    this.formHeaderMo.valueChanges.subscribe((values) => {
      this.updateMonthNames();
    });
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

  onChangeWorkDay(): void {
    const month0 = this.formHeaderMo.get('month_0')?.value;
    const month1 = this.formHeaderMo.get('month_1')?.value;
    const month2 = this.formHeaderMo.get('month_2')?.value;
    const varWd = {
      month0: month0,
      month1: month1,
      month2: month2,
    };
    this.getWorkDays(varWd);
  }

  getWorkDays(data: any) {
    const months = [data.month0, data.month1, data.month2];
    months.forEach((month, index) => {
      const [year, monthValue] = month.split('-');
      this.fetchWorkDay(monthValue, year, index);
    });
  }

  fetchWorkDay(month: string, year: string, index: number) {
    this.moService.getWorkDay(month, year).subscribe(
      (response) => {
        const workData = response.data[0];
        this.formHeaderMo.patchValue({
          [`nwd_${index}`]: this.formatNumber(workData.wdNormal),
          [`tl_ot_wd_${index}`]: this.formatNumber(workData.wdOtTl),
          [`tt_ot_wd_${index}`]: this.formatNumber(workData.wdOtTt),
          [`total_tlwd_${index}`]: this.formatNumber(workData.totalWdTl),
          [`total_ttwd_${index}`]: this.formatNumber(workData.totalWdTt),
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  toggleLockStatus(index: number) {
    const currentStatus = this.detailMarketingOrder[index].lockStatus;
    if (currentStatus === null || currentStatus === 1) {
      this.detailMarketingOrder[index].lockStatus = 0;
    } else {
      this.detailMarketingOrder[index].lockStatus = 1;
    }
  }

  private subscribeToValueChanges(controlName: string) {
    this.formHeaderMo.get(controlName)?.valueChanges.subscribe((value) => {
      this.formatInputValue(value, controlName);
    });
  }

  private formatInputValue(value: string | null, controlName: string) {
    if (value) {
      const numericValue = value.replace(/[^0-9]/g, '');
      const formattedValue = new Intl.NumberFormat('id-ID').format(Number(numericValue));
      this.formHeaderMo.get(controlName)?.setValue(formattedValue, { emitEvent: false });
    }
  }

  private parseFormattedValue(formattedValue: string | null): number | null {
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
    this.fillTheTableMo();
    this.isTableVisible = true;
  }

  fillTheTableMo(): void {
    const totalHKTT1 = this.formHeaderMo.get('total_ttwd_0').value;
    const totalHKTT2 = this.formHeaderMo.get('total_ttwd_1').value;
    const totalHKTT3 = this.formHeaderMo.get('total_ttwd_2').value;
    const totalHKTL1 = this.formHeaderMo.get('total_ttwd_0').value;
    const totalHKTL2 = this.formHeaderMo.get('total_ttwd_1').value;
    const totalHKTL3 = this.formHeaderMo.get('total_ttwd_2').value;
    const productMerk = this.formHeaderMo.get('type').value;

    this.moService.getRowDetailMarketingOrder(totalHKTT1, totalHKTT2, totalHKTT3, totalHKTL1, totalHKTL2, totalHKTL3, productMerk).subscribe(
      (response: ApiResponse<DetailMarketingOrder[]>) => {
        this.detailMarketingOrder = response.data;
        this.detailMarketingOrder.forEach((item) => {
          item.lockStatus = 0;
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to load detail Marketing Order',
          text: error.message,
          confirmButtonText: 'OK',
        });
      }
    );
  }

  saveAllMo() {
    //Set data Save MO
    this.marketingOrder.moId = this.lastIdMo;
    this.marketingOrder.dateValid = this.formHeaderMo.get('date')?.value;
    this.marketingOrder.type = this.formHeaderMo.get('type')?.value;
    this.marketingOrder.month0 = new Date(this.formHeaderMo.get('month_0')?.value);
    this.marketingOrder.month1 = new Date(this.formHeaderMo.get('month_1')?.value);
    this.marketingOrder.month2 = new Date(this.formHeaderMo.get('month_2')?.value);

    //Set data save Header Mo
    this.headerMo = [];
    for (let i = 0; i < 3; i++) {
      this.headerMo.push({
        moId: this.lastIdMo,
        month: new Date(this.formHeaderMo.get(`month_${i}`)?.value),
        wdNormal: this.parseFormattedValue(this.formHeaderMo.get(`nwd_${i}`)?.value),
        wdOtTl: this.parseFormattedValue(this.formHeaderMo.get(`tl_ot_wd_${i}`)?.value),
        wdOtTt: this.parseFormattedValue(this.formHeaderMo.get(`tt_ot_wd_${i}`)?.value),
        totalWdTl: this.parseFormattedValue(this.formHeaderMo.get(`total_tlwd_${i}`)?.value),
        totalWdTt: this.parseFormattedValue(this.formHeaderMo.get(`total_ttwd_${i}`)?.value),
        maxCapTube: this.parseFormattedValue(this.formHeaderMo.get(`max_tube_capa_${i}`)?.value || ''),
        maxCapTl: this.parseFormattedValue(this.formHeaderMo.get(`max_capa_tl_${i}`)?.value || ''),
        maxCapTt: this.parseFormattedValue(this.formHeaderMo.get(`max_capa_tt_${i}`)?.value || ''),
        noteOrderTl: this.formHeaderMo.get(`note_order_tl_${i}`)?.value,
      });
    }

    //Set data save Detail Mo
    this.detailMarketingOrder.forEach((item) => {
      item.moId = this.lastIdMo;
    });

    const saveMo = {
      marketingOrder: this.marketingOrder,
      headerMarketingOrder: this.headerMo,
      detailMarketingOrder: this.detailMarketingOrder,
    };

    //Debbguger
    // Swal.fire({
    //   title: 'Success!',
    //   text: 'Data Marketing Order successfully Added.',
    //   icon: 'success',
    //   confirmButtonText: 'OK',
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     console.log('Save data mo PPC', saveMo);
    //     this.navigateToViewMo();
    //   }
    // });

    this.moService.saveMarketingOrderPPC(saveMo).subscribe(
      (response) => {
        Swal.fire({
          title: 'Success!',
          text: 'Data Marketing Order successfully Added.',
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

  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-mo-ppc']);
  }
}
