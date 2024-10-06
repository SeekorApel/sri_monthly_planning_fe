import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import Swal from 'sweetalert2';
import * as ExcelJS from 'exceljs/dist/exceljs.min.js';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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
  isDisable: boolean = true;
  formHeaderMo: FormGroup;
  isTableVisible: boolean = false;
  monthNames: string[] = ['', '', ''];
  marketingOrderTable: any[] = [];
  excelData: any[] = [];

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
      upload_file_m1: [null, Validators.required]
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
    // Ambil bulan dan tahun dari input
    const monthControl = this.formHeaderMo.get('month_0').value;
    const date = new Date(monthControl); // Mengubah ke objek Date
    const year = date.getFullYear();
    const month = date.getMonth(); // Mengambil bulan (0-11)

    // Hitung jumlah hari dalam bulan
    const lastDay = new Date(year, month + 1, 0).getDate(); // Ambil tanggal terakhir bulan ini

    // Buat workbook baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Shift Template');

    // Data untuk shift yang akan ditulis ke Excel
    const shiftData = [
      ['Shift 3'],
      ['Shift 2'],
      ['Shift 1'],
      ['OT TL 3'],
      ['OT TL 2'],
      ['OT TL 1'],
      ['OT TT 3'],
      ['OT TT 2'],
      ['OT TT 1'],
      ['OFF'],
    ];

    // Menambahkan header tanggal ke worksheet
    const headerRow = Array.from({ length: lastDay }, (_, i) => {
      const day = i + 1;
      return `${day < 10 ? '0' + day : day}/${month + 1 < 10 ? '0' + (month + 1) : month + 1}/${year}`; // Format dd/mm/yyyy
    });

    // Menambahkan header tanggal di B1
    worksheet.addRow(['Tanggal', ...headerRow]); // Menambahkan baris pertama (tanggal)

    // Menambahkan shift ke kolom A
    shiftData.forEach((shiftRow) => {
      worksheet.addRow([shiftRow[0]]); // Menambahkan baris shift di kolom A
    });

    // Mengatur format untuk setiap hari dan mewarnai hari Minggu
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      const dateValue = new Date(year, month, colNumber - 1); // Mendapatkan tanggal

      // Jika hari Minggu, warnai sel
      if (dateValue.getDay() === 0) { // 0 = Minggu
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF0000' } // Warna merah
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' } // Font berwarna putih
        };
      }

      // Menambahkan border penuh pada header tanggal
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };

      // Mengatur alignment (center dan middle)
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };

      // Sesuaikan lebar kolom berdasarkan isi
      worksheet.getColumn(colNumber + 0).width = cell.value.length + 2; // Menyesuaikan lebar kolom
    });

    // Menambahkan border pada setiap sel di kolom A dan B
    const totalRows = shiftData.length + 1; // +1 untuk baris header

    for (let rowNumber = 1; rowNumber <= totalRows; rowNumber++) {
      for (let colNumber = 1; colNumber <= lastDay + 1; colNumber++) { // +1 untuk kolom A
        const cell = worksheet.getCell(rowNumber, colNumber);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };

        // Mengatur alignment untuk semua sel
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center'
        };
      }
    }

    // Menambahkan teks di A9 dengan latar belakang kuning
    const instructionCell = worksheet.getCell('A14');
    instructionCell.value = 'Gunakan simbol ini untuk penanda hari kerja'; // Teks instruksi
    instructionCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' } // Warna kuning
    };
    instructionCell.alignment = {
      vertical: 'middle',
      horizontal: 'left'
    };

    // Mengatur warna kuning untuk sel B9 sampai D9
    for (let col = 2; col <= 4; col++) { // B14 (2) sampai D14 (4)
      const cell = worksheet.getCell(14, col);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' } // Warna kuning
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
    }

    // Menambahkan simbol ☑ di E9
    const checkBoxCell = worksheet.getCell('E14');
    checkBoxCell.value = '☑'; // Simbol checkbox yang dicentang
    checkBoxCell.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };

    // Ekspor workbook sebagai file Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'shift_template.xlsx');
    });
  }

  // Method untuk mengupload dan membaca file
  uploadFile(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Ambil nama sheet pertama
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      console.log(jsonData);

      // Konversi data ke format yang diinginkan
      this.excelData = this.formatData(jsonData);
    };

    reader.readAsArrayBuffer(file);
  }

  formatData(data: any[]): any[] {
    const result: any[] = [];

    for (let i = 1; i < data.length; i++) { // Mulai dari 1 untuk melewatkan header
      const row = data[i];
      const dateValue = row[0] || ''; // Ambil nilai tanggal dari kolom pertama

      // Buat objek baru untuk setiap baris
      const entry = {
        date: dateValue,
        shift1: row[1] || '',
        shift2: row[2] || '',
        shift3: row[3] || '',
        ot_tl_3: row[4] || '',
        ot_tl_2: row[5] || '',
        ot_tl_1: row[6] || '',
        ot_tt_3: row[7] || '',
        ot_tt_2: row[8] || '',
        ot_tt_1: row[9] || '',
        off: row[10] || ''
      };

      // Masukkan objek ke dalam array result
      result.push(entry);
    }

    return result;
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

    console.log(JSON.stringify(this.excelData, null, 2));

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
