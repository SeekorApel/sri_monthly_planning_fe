import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
declare var $: any;

@Component({
  selector: 'app-add-marketing-order',
  templateUrl: './add-marketing-order.component.html',
  styleUrls: ['./add-marketing-order.component.scss'],
})
export class AddMarketingOrderComponent implements OnInit {
  //Variable Declaration
  marketingOrder: MarketingOrder = new MarketingOrder();
  headerMo: any[] = [];
  dataTableMo: any[] = [];
  public isDisable: boolean = true;
  formHeaderMo: FormGroup;
  isTableVisible: boolean = false;
  monthNames: string[] = ['', '', ''];
  marketingOrderTable: any[] = [];

  constructor(private router: Router, private fb: FormBuilder, private moService: MarketingOrderService) {
    this.formHeaderMo = this.fb.group({
      date: ['', Validators.required],
      type: ['', Validators.required],
      revision: ['', []],
      month_0: ['', Validators.required],
      month_1: ['', []],
      month_2: ['', []],
      nwd_0: ['', Validators.required],
      nwd_1: ['', Validators.required],
      nwd_2: ['', Validators.required],
      tl_ot_wd_0: ['', [Validators.required, Validators.min(0)]],
      tt_ot_wd_0: ['', [Validators.required, Validators.min(0)]],
      tl_ot_wd_1: ['', [Validators.required, Validators.min(0)]],
      tt_ot_wd_1: ['', [Validators.required, Validators.min(0)]],
      tl_ot_wd_2: ['', [Validators.required, Validators.min(0)]],
      tt_ot_wd_2: ['', [Validators.required, Validators.min(0)]],
      total_tlwd_0: ['', []],
      total_ttwd_0: ['', []],
      total_tlwd_1: ['', []],
      total_ttwd_1: ['', []],
      total_tlwd_2: ['', []],
      total_ttwd_2: ['', []],
      max_tube_capa_0: ['', [Validators.required, Validators.min(0)]],
      max_tube_capa_1: ['', [Validators.required, Validators.min(0)]],
      max_tube_capa_2: ['', [Validators.required, Validators.min(0)]],
      max_capa_tl_0: ['', [Validators.required, Validators.min(0)]],
      max_capa_tt_0: ['', [Validators.required, Validators.min(0)]],
      max_capa_tl_1: ['', [Validators.required, Validators.min(0)]],
      max_capa_tt_1: ['', [Validators.required, Validators.min(0)]],
      max_capa_tl_2: ['', [Validators.required, Validators.min(0)]],
      max_capa_tt_2: ['', [Validators.required, Validators.min(0)]],
    });

    // Memonitor perubahan setiap input bulan dengan memantau formHeaderMo, bukan fb
    this.formHeaderMo.valueChanges.subscribe((values) => {
      this.updateMonthNames();
    });
  }

  ngOnInit(): void {
    this.loadValueTotal();
    this.formHeaderMo.get('month_0')?.valueChanges.subscribe((value) => {
      this.calculateNextMonths(value);
    });
  }

  downloadTemplate() {
    // Data yang akan ditulis ke Excel
    const worksheetData = [
      ['Tanggal'], // A1
      ['Shift 3'], // A2
      ['Shift 2'], // A3
      ['Shift 1'], // A4
      ['Shift 1'], // A5
      ['Shift 1'], // A6
      ['Shift 1'], // A7
      ['Shift 1'], // A8
      ['Shift 1'], // A9
      ['OFF'], // A10
    ];

    // Buat worksheet dari data
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Buat workbook baru
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Shift Template');

    // Ekspor workbook sebagai file Excel
    XLSX.writeFile(wb, 'shift_template.xlsx');
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

  // Fungsi untuk format date ke YYYY-MM
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

  saveHeaderMo() {
    //Save MO
    this.marketingOrder.revision = this.formHeaderMo.get('revision')?.value;
    this.marketingOrder.date = this.formHeaderMo.get('date')?.value;
    this.marketingOrder.type = this.formHeaderMo.get('type')?.value;
    this.marketingOrder.month_0 = new Date(this.formHeaderMo.get('month_0')?.value);
    this.marketingOrder.month_1 = new Date(this.formHeaderMo.get('month_1')?.value);
    this.marketingOrder.month_2 = new Date(this.formHeaderMo.get('month_2')?.value);

    for (let i = 0; i < 3; i++) {
      this.headerMo.push({
        mo_id: this.getLastIdMo(),
        month: new Date(this.formHeaderMo.get(`month_${i}`)?.value),
        nwd: this.formHeaderMo.get(`nwd_${i}`)?.value,
        tl_ot_wd: this.formHeaderMo.get(`tl_ot_wd_${i}`)?.value,
        tt_ot_wd: this.formHeaderMo.get(`tt_ot_wd_${i}`)?.value,
        total_tlwd: this.formHeaderMo.get(`total_tlwd_${i}`)?.value,
        total_ttwd: this.formHeaderMo.get(`total_ttwd_${i}`)?.value,
        max_tube_capa: this.formHeaderMo.get(`max_tube_capa_${i}`)?.value,
        max_capa_tl: this.formHeaderMo.get(`max_capa_tl_${i}`)?.value,
        max_capa_tt: this.formHeaderMo.get(`max_capa_tt_${i}`)?.value,
      });
    }

    this.fillTheTableMo();
    this.isTableVisible = true;
  }

  fillTheTableMo(): void {
    // Inisialisasi data tabel marketing order
    this.marketingOrderTable = [
      {
        category: 'FED TB NR',
        item: 1060204000038,
        description: 'FED TB NR 2.25-17 H',
        type: 'A/B',
        kapasitas: 447,
        qtyMould: 64,
        qtyPerRak: 1200,
        minOrder: 1200,
        kpm_m1: 613.2,
        kpm_m2: 540.0,
        kpm_m3: 631.2,
      },
      {
        category: 'OEM TT',
        item: 1110904064059,
        description: 'FED SET-R 70/90-17 FT 138',
        type: 'A/B',
        kapasitas: 447,
        qtyMould: 80,
        qtyPerRak: 1200,
        minOrder: 1200,
        kpm_m1: 93.04,
        kpm_m2: 91.76,
        kpm_m3: 103.2,
      },
    ];
  }

  saveAllMo() {
    // this.dataTableMo = this.marketingOrderTable.map((mo) => {
    //   return {
    //     category: mo.category,
    //     item: mo.item,
    //     description: mo.description,
    //     type: mo.type,
    //     kapasitas: mo.kapasitas,
    //     qtyMould: mo.qtyMould,
    //     qtyPerRak: mo.qtyPerRak,
    //     minOrder: mo.minOrder,
    //     kpm_m1: mo.kpm_m1,
    //     kpm_m2: mo.kpm_m2,
    //     kpm_m3: mo.kpm_m3,
    //     inputSalesForecastMonth1: mo.inputSalesForecastMonth1,
    //     inputSalesForecastMonth2: mo.inputSalesForecastMonth2,
    //     inputSalesForecastMonth3: mo.inputSalesForecastMonth3,
    //     inputMarketingOrderMonth1: mo.inputMarketingOrderMonth1,
    //     inputMarketingOrderMonth2: mo.inputMarketingOrderMonth2,
    //     inputMarketingOrderMonth3: mo.inputMarketingOrderMonth3,
    //     inputInitialStock: mo.inputInitialStock,
    //   };
    // });
    this.dataTableMo = this.getMarketingOrderData();
    console.log('Table Data: ', JSON.stringify(this.dataTableMo, null, 2));
    console.log('Marketing order : ', this.marketingOrder);
    console.log('Header Mo : ', this.headerMo);
  }

  // Tambahkan fungsi ini ke dalam komponen Anda
  getMarketingOrderData() {
    const dataTableMo = this.marketingOrderTable.map((mo) => {
      return {
        category: mo.category,
        item: mo.item,
        description: mo.description,
        type: mo.type,
        kapasitas: mo.kapasitas,
        qtyMould: mo.qtyMould,
        qtyPerRak: mo.qtyPerRak,
        minOrder: mo.minOrder,
        kpm_m1: mo.kpm_m1,
        kpm_m2: mo.kpm_m2,
        kpm_m3: mo.kpm_m3,
        inputSalesForecastMonth1: mo.inputSalesForecastMonth1,
        inputSalesForecastMonth2: mo.inputSalesForecastMonth2,
        inputSalesForecastMonth3: mo.inputSalesForecastMonth3,
        inputMarketingOrderMonth1: mo.inputMarketingOrderMonth1,
        inputMarketingOrderMonth2: mo.inputMarketingOrderMonth2,
        inputMarketingOrderMonth3: mo.inputMarketingOrderMonth3,
        inputInitialStock: mo.inputInitialStock,
      };
    });

    return dataTableMo; // Kembalikan data sebagai array objek
  }

  getLastIdMo() {
    let number = 1;
    return number;
  }

  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-marketing-order']);
  }
}
