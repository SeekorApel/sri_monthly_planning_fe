import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  isReadOnly: boolean = true;
  formHeaderMo: FormGroup;
  isTableVisible: boolean = false;
  monthNames: string[] = ['', '', ''];
  marketingOrderTable: any[] = [];
  excelData: any[] = [];

  workDay_M0: any[] = [];
  workDay_M1: any[] = [];
  workDay_M2: any[] = [];

  totalWorkday_M0: number = 0;
  totalOtTl_M0: number = 0;
  totalOtTt_M0: number = 0;
  totalOff_M0: number = 0;

  totalWorkday_M1: number = 0;
  totalOtTl_M1: number = 0;
  totalOtTt_M1: number = 0;
  totalOff_M1: number = 0;

  totalWorkday_M2: number = 0;
  totalOtTl_M2: number = 0;
  totalOtTt_M2: number = 0;
  totalOff_M2: number = 0;

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
      upload_file_m0: [null, [Validators.required]],
      upload_file_m1: [null, [Validators.required]],
      upload_file_m2: [null, [Validators.required]],
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

  downloadTemplate_M1() {
    // Ambil bulan dan tahun dari input
    const monthValue = this.formHeaderMo.get('month_0').value;

    // Cek apakah bulan sudah dipilih
    if (!monthValue) {
      Swal.fire({
        icon: 'error',
        title: 'Month not selected',
        text: 'Please select a month first!',
        confirmButtonText: 'OK',
      });
      return; // Stop execution if no month is selected
    }

    const date = new Date(monthValue); // Mengubah ke objek Date
    const year = date.getFullYear();
    const month = date.getMonth(); // Mengambil bulan (0-11)

    // Hitung jumlah hari dalam bulan
    const lastDay = new Date(year, month + 1, 0).getDate(); // Ambil tanggal terakhir bulan ini

    // Buat workbook baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Shift Template');

    // Data untuk shift yang akan ditulis ke Excel
    const shiftData = [['Shift 3'], ['Shift 2'], ['Shift 1'], ['OT TL 3'], ['OT TL 2'], ['OT TL 1'], ['OT TT 3'], ['OT TT 2'], ['OT TT 1'], ['OFF']];

    //Format DD/MM/YYYY
    // Menambahkan header tanggal ke worksheet
    // const headerRow = Array.from({ length: lastDay }, (_, i) => {
    //   const day = i + 1;
    //   return `${day < 10 ? '0' + day : day}/${month + 1 < 10 ? '0' + (month + 1) : month + 1}/${year}`;
    // });

    // Menambahkan header tanggal ke worksheet
    // const headerRow = Array.from({ length: lastDay }, (_, i) => {
    //   const day = new Date(year, month, i + 1); // Buat tanggal untuk setiap hari
    //   // Format tanggal menjadi "Mon, 05 October 2024"
    //   return day.toLocaleDateString('en-US', {
    //     weekday: 'short', // Nama hari singkat (Mon, Tue, dst.)
    //     day: '2-digit', // Tanggal dua digit (05, 06, dst.)
    //     month: 'long', // Nama bulan penuh (October, November, dst.)
    //     year: 'numeric', // Tahun (2024)
    //   });
    // });

    const headerRow = Array.from({ length: lastDay }, (_, i) => {
      const day = new Date(year, month, i + 1); // Buat tanggal untuk setiap hari
      // Format tanggal menjadi "Tue, 26 November 2024"
      return day
        .toLocaleDateString('en-US', {
          weekday: 'short', // Nama hari singkat (Tue, Wed, dst.)
          day: '2-digit', // Tanggal dua digit (26, 27, dst.)
          month: 'long', // Nama bulan penuh (November, Desember, dst.)
          year: 'numeric', // Tahun (2024)
        })
        .replace(',', '')
        .replace(/^(\D+)\s(\d+)\s(\D+)\s(\d+)$/, '$1, $2 $3 $4');
    });

    // Menambahkan header tanggal dari A1 Sampai lenght bulannya
    worksheet.addRow(['Tanggal', ...headerRow]);

    // Menambahkan shift ke kolom A2 Sampai A11
    shiftData.forEach((shiftRow) => {
      worksheet.addRow([shiftRow[0]]);
    });

    // Mengatur format untuk setiap hari dan mewarnai hari Minggu dan juga jumat
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      const dateValue = new Date(year, month, colNumber - 1); // Mendapatkan tanggal

      // Jika hari Minggu, warnai sel
      if (dateValue.getDay() === 0) {
        // 0 = Minggu
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF0000' },
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' },
        };
      }

      // Jika hari Jumat, warnai sel dengan hijau
      if (dateValue.getDay() === 5) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '008000' },
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' },
        };
      }

      // Menambahkan border penuh pada header tanggal
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      // Mengatur alignment (center dan middle)
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };

      // Sesuaikan lebar kolom berdasarkan isi
      worksheet.getColumn(colNumber + 0).width = cell.value.length + 2; // Menyesuaikan lebar kolom
    });

    // Menambahkan border pada setiap sel di kolom A dan B
    const totalRows = shiftData.length + 1; // +1 untuk baris header

    for (let rowNumber = 1; rowNumber <= totalRows; rowNumber++) {
      for (let colNumber = 1; colNumber <= lastDay + 1; colNumber++) {
        // +1 untuk kolom A
        const cell = worksheet.getCell(rowNumber, colNumber);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        // Mengatur alignment untuk semua sel
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
      }
    }

    // Menambahkan teks instruksi di A14
    const instructionCell = worksheet.getCell('A14');
    instructionCell.value = 'Gunakan simbol ini untuk penanda hari kerja';
    instructionCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' }, // Warna kuning
    };
    instructionCell.alignment = {
      vertical: 'middle',
      horizontal: 'left',
    };

    for (let col = 2; col <= 4; col++) {
      // B14 (2) sampai D14 (4)
      const cell = worksheet.getCell(14, col);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // Warna kuning
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    }

    // Menambahkan simbol ☑ di E9
    const checkBoxCell = worksheet.getCell('E14');
    checkBoxCell.value = '☑';
    checkBoxCell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    const now = new Date();
    const indonesiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const monthFn = date.toLocaleDateString('en-US', { month: 'long' });
    const timestamp = indonesiaTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '');
    const fileName = `workday_${monthFn}_${year}_${timestamp}.xlsx`;

    // Ekspor workbook sebagai file Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
    });
  }

  downloadTemplate_M2() {
    // Ambil bulan dan tahun dari input
    const monthValue = this.formHeaderMo.get('month_1').value;

    // Cek apakah bulan sudah dipilih
    if (!monthValue) {
      Swal.fire({
        icon: 'error',
        title: 'Month not selected',
        text: 'Please select a month first!',
        confirmButtonText: 'OK',
      });
      return; // Stop execution if no month is selected
    }

    const date = new Date(monthValue); // Mengubah ke objek Date
    const year = date.getFullYear();
    const month = date.getMonth(); // Mengambil bulan (0-11)

    // Hitung jumlah hari dalam bulan
    const lastDay = new Date(year, month + 1, 0).getDate(); // Ambil tanggal terakhir bulan ini

    // Buat workbook baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Shift Template');

    // Data untuk shift yang akan ditulis ke Excel
    const shiftData = [['Shift 3'], ['Shift 2'], ['Shift 1'], ['OT TL 3'], ['OT TL 2'], ['OT TL 1'], ['OT TT 3'], ['OT TT 2'], ['OT TT 1'], ['OFF']];

    const headerRow = Array.from({ length: lastDay }, (_, i) => {
      const day = new Date(year, month, i + 1); // Buat tanggal untuk setiap hari
      // Format tanggal menjadi "Tue, 26 November 2024"
      return day
        .toLocaleDateString('en-US', {
          weekday: 'short', // Nama hari singkat (Tue, Wed, dst.)
          day: '2-digit', // Tanggal dua digit (26, 27, dst.)
          month: 'long', // Nama bulan penuh (November, Desember, dst.)
          year: 'numeric', // Tahun (2024)
        })
        .replace(',', '')
        .replace(/^(\D+)\s(\d+)\s(\D+)\s(\d+)$/, '$1, $2 $3 $4');
    });

    // Menambahkan header tanggal dari A1 Sampai lenght bulannya
    worksheet.addRow(['Tanggal', ...headerRow]);

    // Menambahkan shift ke kolom A2 Sampai A11
    shiftData.forEach((shiftRow) => {
      worksheet.addRow([shiftRow[0]]);
    });

    // Mengatur format untuk setiap hari dan mewarnai hari Minggu dan juga jumat
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      const dateValue = new Date(year, month, colNumber - 1); // Mendapatkan tanggal

      // Jika hari Minggu, warnai sel
      if (dateValue.getDay() === 0) {
        // 0 = Minggu
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF0000' },
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' },
        };
      }

      // Jika hari Jumat, warnai sel dengan hijau
      if (dateValue.getDay() === 5) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '008000' },
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' },
        };
      }

      // Menambahkan border penuh pada header tanggal
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      // Mengatur alignment (center dan middle)
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };

      // Sesuaikan lebar kolom berdasarkan isi
      worksheet.getColumn(colNumber + 0).width = cell.value.length + 2; // Menyesuaikan lebar kolom
    });

    // Menambahkan border pada setiap sel di kolom A dan B
    const totalRows = shiftData.length + 1; // +1 untuk baris header

    for (let rowNumber = 1; rowNumber <= totalRows; rowNumber++) {
      for (let colNumber = 1; colNumber <= lastDay + 1; colNumber++) {
        // +1 untuk kolom A
        const cell = worksheet.getCell(rowNumber, colNumber);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        // Mengatur alignment untuk semua sel
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
      }
    }

    // Menambahkan teks instruksi di A14
    const instructionCell = worksheet.getCell('A14');
    instructionCell.value = 'Gunakan simbol ini untuk penanda hari kerja';
    instructionCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' }, // Warna kuning
    };
    instructionCell.alignment = {
      vertical: 'middle',
      horizontal: 'left',
    };

    for (let col = 2; col <= 4; col++) {
      // B14 (2) sampai D14 (4)
      const cell = worksheet.getCell(14, col);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // Warna kuning
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    }

    // Menambahkan simbol ☑ di E9
    const checkBoxCell = worksheet.getCell('E14');
    checkBoxCell.value = '☑';
    checkBoxCell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    const now = new Date();
    const indonesiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const monthFn = date.toLocaleDateString('en-US', { month: 'long' });
    const timestamp = indonesiaTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '');
    const fileName = `workday_${monthFn}_${year}_${timestamp}.xlsx`;

    // Ekspor workbook sebagai file Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
    });
  }

  downloadTemplate_M3() {
    // Ambil bulan dan tahun dari input
    const monthValue = this.formHeaderMo.get('month_2').value;

    // Cek apakah bulan sudah dipilih
    if (!monthValue) {
      Swal.fire({
        icon: 'error',
        title: 'Month not selected',
        text: 'Please select a month first!',
        confirmButtonText: 'OK',
      });
      return; // Stop execution if no month is selected
    }

    const date = new Date(monthValue); // Mengubah ke objek Date
    const year = date.getFullYear();
    const month = date.getMonth(); // Mengambil bulan (0-11)

    // Hitung jumlah hari dalam bulan
    const lastDay = new Date(year, month + 1, 0).getDate(); // Ambil tanggal terakhir bulan ini

    // Buat workbook baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Shift Template');

    // Data untuk shift yang akan ditulis ke Excel
    const shiftData = [['Shift 3'], ['Shift 2'], ['Shift 1'], ['OT TL 3'], ['OT TL 2'], ['OT TL 1'], ['OT TT 3'], ['OT TT 2'], ['OT TT 1'], ['OFF']];

    const headerRow = Array.from({ length: lastDay }, (_, i) => {
      const day = new Date(year, month, i + 1); // Buat tanggal untuk setiap hari
      // Format tanggal menjadi "Tue, 26 November 2024"
      return day
        .toLocaleDateString('en-US', {
          weekday: 'short', // Nama hari singkat (Tue, Wed, dst.)
          day: '2-digit', // Tanggal dua digit (26, 27, dst.)
          month: 'long', // Nama bulan penuh (November, Desember, dst.)
          year: 'numeric', // Tahun (2024)
        })
        .replace(',', '')
        .replace(/^(\D+)\s(\d+)\s(\D+)\s(\d+)$/, '$1, $2 $3 $4');
    });

    // Menambahkan header tanggal dari A1 Sampai lenght bulannya
    worksheet.addRow(['Tanggal', ...headerRow]);

    // Menambahkan shift ke kolom A2 Sampai A11
    shiftData.forEach((shiftRow) => {
      worksheet.addRow([shiftRow[0]]);
    });

    // Mengatur format untuk setiap hari dan mewarnai hari Minggu dan juga jumat
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      const dateValue = new Date(year, month, colNumber - 1); // Mendapatkan tanggal

      // Jika hari Minggu, warnai sel
      if (dateValue.getDay() === 0) {
        // 0 = Minggu
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF0000' },
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' },
        };
      }

      // Jika hari Jumat, warnai sel dengan hijau
      if (dateValue.getDay() === 5) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '008000' },
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' },
        };
      }

      // Menambahkan border penuh pada header tanggal
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      // Mengatur alignment (center dan middle)
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };

      // Sesuaikan lebar kolom berdasarkan isi
      worksheet.getColumn(colNumber + 0).width = cell.value.length + 2; // Menyesuaikan lebar kolom
    });

    // Menambahkan border pada setiap sel di kolom A dan B
    const totalRows = shiftData.length + 1; // +1 untuk baris header

    for (let rowNumber = 1; rowNumber <= totalRows; rowNumber++) {
      for (let colNumber = 1; colNumber <= lastDay + 1; colNumber++) {
        // +1 untuk kolom A
        const cell = worksheet.getCell(rowNumber, colNumber);
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        // Mengatur alignment untuk semua sel
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
      }
    }

    // Menambahkan teks instruksi di A14
    const instructionCell = worksheet.getCell('A14');
    instructionCell.value = 'Gunakan simbol ini untuk penanda hari kerja';
    instructionCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' }, // Warna kuning
    };
    instructionCell.alignment = {
      vertical: 'middle',
      horizontal: 'left',
    };

    for (let col = 2; col <= 4; col++) {
      // B14 (2) sampai D14 (4)
      const cell = worksheet.getCell(14, col);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // Warna kuning
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    }

    // Menambahkan simbol ☑ di E9
    const checkBoxCell = worksheet.getCell('E14');
    checkBoxCell.value = '☑';
    checkBoxCell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    const now = new Date();
    const indonesiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const monthFn = date.toLocaleDateString('en-US', { month: 'long' });
    const timestamp = indonesiaTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '');
    const fileName = `workday_${monthFn}_${year}_${timestamp}.xlsx`;

    // Ekspor workbook sebagai file Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
    });
  }

  readExcel_M1(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const result: any[] = [];

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Ambil nama sheet pertama
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Ambil array tanggal dari baris pertama (kolom 1 hingga akhir)
      const tanggal = jsonData[0].slice(1);

      // Menggunakan map untuk mengubah setiap elemen string menjadi objek Date (jika diperlukan)
      const convertTypeDate = tanggal.map((tgl) => new Date(tgl));

      // Iterasi melalui setiap kolom tanggal
      for (let i = 1; i <= convertTypeDate.length; i++) {
        // Perbaikan indeks dimulai dari 1
        const shift3 = jsonData[1][i] === '☑' ? 1 : 0; // Baris 1: Shift 3
        const shift2 = jsonData[2][i] === '☑' ? 1 : 0; // Baris 2: Shift 2
        const shift1 = jsonData[3][i] === '☑' ? 1 : 0; // Baris 3: Shift 1
        const ot_tl_3 = jsonData[4][i] === '☑' ? 1 : 0; // Baris 4: OT TL 3
        const ot_tl_2 = jsonData[5][i] === '☑' ? 1 : 0; // Baris 5: OT TL 2
        const ot_tl_1 = jsonData[6][i] === '☑' ? 1 : 0; // Baris 6: OT TL 1
        const ot_tt_3 = jsonData[7][i] === '☑' ? 1 : 0; // Baris 7: OT TT 3
        const ot_tt_2 = jsonData[8][i] === '☑' ? 1 : 0; // Baris 8: OT TT 2
        const ot_tt_1 = jsonData[9][i] === '☑' ? 1 : 0; // Baris 9: OT TT 1
        const off = jsonData[10][i] === '☑' ? 1 : 0; // Baris 10: OFF

        const data = {
          date: convertTypeDate[i - 1], // Tanggal pada kolom yang sesuai
          shift1: shift1,
          shift2: shift2,
          shift3: shift3,
          ot_tl_3: ot_tl_3,
          ot_tl_2: ot_tl_2,
          ot_tl_1: ot_tl_1,
          ot_tt_3: ot_tt_3,
          ot_tt_2: ot_tt_2,
          ot_tt_1: ot_tt_1,
          off: off,
        };

        // Tambahkan setiap hasil ke array
        this.workDay_M0.push(data);
      }
    };

    reader.readAsArrayBuffer(file);
  }

  readExcel_M2(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const result: any[] = [];

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Ambil nama sheet pertama
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Ambil array tanggal dari baris pertama (kolom 1 hingga akhir)
      const tanggal = jsonData[0].slice(1);

      // Menggunakan map untuk mengubah setiap elemen string menjadi objek Date (jika diperlukan)
      const convertTypeDate = tanggal.map((tgl) => new Date(tgl));

      // Iterasi melalui setiap kolom tanggal
      for (let i = 1; i <= convertTypeDate.length; i++) {
        // Perbaikan indeks dimulai dari 1
        const shift3 = jsonData[1][i] === '☑' ? 1 : 0; // Baris 1: Shift 3
        const shift2 = jsonData[2][i] === '☑' ? 1 : 0; // Baris 2: Shift 2
        const shift1 = jsonData[3][i] === '☑' ? 1 : 0; // Baris 3: Shift 1
        const ot_tl_3 = jsonData[4][i] === '☑' ? 1 : 0; // Baris 4: OT TL 3
        const ot_tl_2 = jsonData[5][i] === '☑' ? 1 : 0; // Baris 5: OT TL 2
        const ot_tl_1 = jsonData[6][i] === '☑' ? 1 : 0; // Baris 6: OT TL 1
        const ot_tt_3 = jsonData[7][i] === '☑' ? 1 : 0; // Baris 7: OT TT 3
        const ot_tt_2 = jsonData[8][i] === '☑' ? 1 : 0; // Baris 8: OT TT 2
        const ot_tt_1 = jsonData[9][i] === '☑' ? 1 : 0; // Baris 9: OT TT 1
        const off = jsonData[10][i] === '☑' ? 1 : 0; // Baris 10: OFF

        const data = {
          date: convertTypeDate[i - 1], // Tanggal pada kolom yang sesuai
          shift1: shift1,
          shift2: shift2,
          shift3: shift3,
          ot_tl_3: ot_tl_3,
          ot_tl_2: ot_tl_2,
          ot_tl_1: ot_tl_1,
          ot_tt_3: ot_tt_3,
          ot_tt_2: ot_tt_2,
          ot_tt_1: ot_tt_1,
          off: off,
        };

        // Tambahkan setiap hasil ke array
        this.workDay_M1.push(data);
      }
    };

    reader.readAsArrayBuffer(file);
  }

  readExcel_M3(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const result: any[] = [];

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Ambil nama sheet pertama
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Ambil array tanggal dari baris pertama (kolom 1 hingga akhir)
      const tanggal = jsonData[0].slice(1);

      // Menggunakan map untuk mengubah setiap elemen string menjadi objek Date (jika diperlukan)
      const convertTypeDate = tanggal.map((tgl) => new Date(tgl));

      // Iterasi melalui setiap kolom tanggal
      for (let i = 1; i <= convertTypeDate.length; i++) {
        // Perbaikan indeks dimulai dari 1
        const shift3 = jsonData[1][i] === '☑' ? 1 : 0; // Baris 1: Shift 3
        const shift2 = jsonData[2][i] === '☑' ? 1 : 0; // Baris 2: Shift 2
        const shift1 = jsonData[3][i] === '☑' ? 1 : 0; // Baris 3: Shift 1
        const ot_tl_3 = jsonData[4][i] === '☑' ? 1 : 0; // Baris 4: OT TL 3
        const ot_tl_2 = jsonData[5][i] === '☑' ? 1 : 0; // Baris 5: OT TL 2
        const ot_tl_1 = jsonData[6][i] === '☑' ? 1 : 0; // Baris 6: OT TL 1
        const ot_tt_3 = jsonData[7][i] === '☑' ? 1 : 0; // Baris 7: OT TT 3
        const ot_tt_2 = jsonData[8][i] === '☑' ? 1 : 0; // Baris 8: OT TT 2
        const ot_tt_1 = jsonData[9][i] === '☑' ? 1 : 0; // Baris 9: OT TT 1
        const off = jsonData[10][i] === '☑' ? 1 : 0; // Baris 10: OFF

        const data = {
          date: convertTypeDate[i - 1], // Tanggal pada kolom yang sesuai
          shift1: shift1,
          shift2: shift2,
          shift3: shift3,
          ot_tl_3: ot_tl_3,
          ot_tl_2: ot_tl_2,
          ot_tl_1: ot_tl_1,
          ot_tt_3: ot_tt_3,
          ot_tt_2: ot_tt_2,
          ot_tt_1: ot_tt_1,
          off: off,
        };

        // Tambahkan setiap hasil ke array
        this.workDay_M2.push(data);
      }
    };

    reader.readAsArrayBuffer(file);
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
    // if (this.formHeaderMo.invalid) {
    //   // Tandai semua form control sebagai "touched" agar error message muncul
    //   this.formHeaderMo.markAllAsTouched();
    //   return;
    // }

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

    this.workDay_M0.forEach((item) => {
      const workday = item.shift1 + item.shift2 + item.shift3;
      const ot_tl = item.ot_tl_1 + item.ot_tl_2 + item.ot_tl_3;
      const ot_tt = item.ot_tt_1 + item.ot_tt_2 + item.ot_tt_3;
      const off = item.off;

      this.totalWorkday_M0 += workday;
      this.totalOtTl_M0 += ot_tl;
      this.totalOtTt_M0 += ot_tt;
      this.totalOff_M0 += off;
    });

    this.workDay_M1.forEach((item) => {
      const workday = item.shift1 + item.shift2 + item.shift3;
      const ot_tl = item.ot_tl_1 + item.ot_tl_2 + item.ot_tl_3;
      const ot_tt = item.ot_tt_1 + item.ot_tt_2 + item.ot_tt_3;
      const off = item.off;

      this.totalWorkday_M1 += workday;
      this.totalOtTl_M1 += ot_tl;
      this.totalOtTt_M1 += ot_tt;
      this.totalOff_M1 += off;
    });

    this.workDay_M2.forEach((item) => {
      const workday = item.shift1 + item.shift2 + item.shift3;
      const ot_tl = item.ot_tl_1 + item.ot_tl_2 + item.ot_tl_3;
      const ot_tt = item.ot_tt_1 + item.ot_tt_2 + item.ot_tt_3;
      const off = item.off;

      this.totalWorkday_M2 += workday;
      this.totalOtTl_M2 += ot_tl;
      this.totalOtTt_M2 += ot_tt;
      this.totalOff_M2 += off;
    });

    // Menyimpan hasil pembagian ke dalam totalWorkday_M0
    this.totalWorkday_M0 /= 3;
    this.totalOtTl_M0 /= 3;
    this.totalOtTt_M0 /= 3;

    this.totalWorkday_M1 /= 3;
    this.totalOtTl_M1 /= 3;
    this.totalOtTt_M1 /= 3;

    this.totalWorkday_M2 /= 3;
    this.totalOtTl_M2 /= 3;
    this.totalOtTt_M2 /= 3;

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
