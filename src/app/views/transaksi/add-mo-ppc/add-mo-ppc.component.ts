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
declare var $: any;

@Component({
  selector: 'app-add-mo-ppc',
  templateUrl: './add-mo-ppc.component.html',
  styleUrls: ['./add-mo-ppc.component.scss'],
})
export class AddMoPpcComponent implements OnInit {
  //Variable Declaration
  marketingOrder: MarketingOrder = new MarketingOrder();
  headerMo: any[] = [];
  dataTableMo: any[] = [];
  isDisable: boolean = true;
  isReadOnly: boolean = true;
  formHeaderMo: FormGroup;
  isTableVisible: boolean = false;
  monthNames: string[] = ['', '', ''];
  detailMarketingOrder: DetailMarketingOrder[];
  excelData: any[] = [];
  errorMessage: string | null = null;
  lastIdMo: string = '';

  //Workday
  workDay_M0: any[] = [];
  workDay_M1: any[] = [];
  workDay_M2: any[] = [];

  //Total Wd
  total_wd_m0: any = {
    total_wd: 0,
    total_ot_tl: 0,
    total_ot_tt: 0,
  };

  total_wd_m1: any = {
    total_wd: 0,
    total_ot_tl: 0,
    total_ot_tt: 0,
  };

  total_wd_m2: any = {
    total_wd: 0,
    total_ot_tl: 0,
    total_ot_tt: 0,
  };

  constructor(private router: Router, private fb: FormBuilder, private moService: MarketingOrderService) {
    this.formHeaderMo = this.fb.group({
      date: [new Date().toISOString().substring(0, 10)],
      type: [null, Validators.required],
      month_0: [null, Validators.required],
      month_1: [null, []],
      month_2: [null, []],
      nwd_0: [22.33, Validators.required],
      nwd_1: [19.67, Validators.required],
      nwd_2: [23.00, Validators.required],
      tl_ot_wd_0: [4.67, [Validators.required, Validators.min(0)]],
      tt_ot_wd_0: [2.00, [Validators.required, Validators.min(0)]],
      tl_ot_wd_1: [7.00, [Validators.required, Validators.min(0)]],
      tt_ot_wd_1: [4.33, [Validators.required, Validators.min(0)]],
      tl_ot_wd_2: [4.00, [Validators.required, Validators.min(0)]],
      tt_ot_wd_2: [4.00, [Validators.required, Validators.min(0)]],
      total_tlwd_0: [27, []],
      total_ttwd_0: [24.33, []],
      total_tlwd_1: [26.67, []],
      total_ttwd_1: [24, []],
      total_tlwd_2: [27, []],
      total_ttwd_2: [27, []],
      max_tube_capa_0: [80.388, [Validators.required, Validators.min(0)]],
      max_tube_capa_1: [70.812, [Validators.required, Validators.min(0)]],
      max_tube_capa_2: [82.800, [Validators.required, Validators.min(0)]],
      max_capa_tl_0: [1214500, [Validators.required, Validators.min(0)]],
      max_capa_tt_0: [383880, [Validators.required, Validators.min(0)]],
      max_capa_tl_1: [1168300, [Validators.required, Validators.min(0)]],
      max_capa_tt_1: [369640, [Validators.required, Validators.min(0)]],
      max_capa_tl_2: [1188130, [Validators.required, Validators.min(0)]],
      max_capa_tt_2: [363670, [Validators.required, Validators.min(0)]],
      upload_file_m0: [null, []],
      upload_file_m1: [null, []],
      upload_file_m2: [null, []],
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

  downloadTemplate_M1() {
    const monthValue = this.formHeaderMo.get('month_0').value;
    if (!monthValue) {
      Swal.fire({
        icon: 'error',
        title: 'Month not selected',
        text: 'Please select a month first!',
        confirmButtonText: 'OK',
      });
      return;
    }
    const date = new Date(monthValue);
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();

    // Buat workbook baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Workday Template');

    // Data untuk shift yang akan ditulis ke Excel
    const shiftData = [['Shift 3'], ['Shift 2'], ['Shift 1'], ['OT TL 3'], ['OT TL 2'], ['OT TL 1'], ['OT TT 3'], ['OT TT 2'], ['OT TT 1'], ['OFF']];

    const headerRow = Array.from({ length: lastDay }, (_, i) => {
      const day = new Date(year, month, i + 1);
      return day
        .toLocaleDateString('en-US', {
          weekday: 'short',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
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
      const dateValue = new Date(year, month, colNumber - 1);

      // Jika hari Minggu, warnai sel
      if (dateValue.getDay() === 0) {
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
      worksheet.getColumn(colNumber + 0).width = cell.value.length + 2;
    });

    // Menambahkan border pada setiap sel di kolom A dan B
    const totalRows = shiftData.length + 1;

    for (let rowNumber = 1; rowNumber <= totalRows; rowNumber++) {
      for (let colNumber = 1; colNumber <= lastDay + 1; colNumber++) {
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
      fgColor: { argb: 'FFFF00' },
    };
    instructionCell.alignment = {
      vertical: 'middle',
      horizontal: 'left',
    };

    for (let col = 2; col <= 3; col++) {
      const cell = worksheet.getCell(14, col);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' },
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    }

    // Menambahkan simbol V di D14
    const checkBoxCell = worksheet.getCell('D14');
    checkBoxCell.value = 'V';
    checkBoxCell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    const now = new Date();
    const indonesiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const monthFn = date.toLocaleDateString('en-US', { month: 'long' });
    const timestamp = indonesiaTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '');
    const fileName = `Workday_${monthFn}_${year}_${timestamp}.xlsx`;

    // Ekspor workbook sebagai file Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
    });
  }

  downloadTemplate_M2() {
    const monthValue = this.formHeaderMo.get('month_1').value;

    // Cek apakah bulan sudah dipilih
    if (!monthValue) {
      Swal.fire({
        icon: 'error',
        title: 'Month not selected',
        text: 'Please select a month first!',
        confirmButtonText: 'OK',
      });
      return;
    }

    const date = new Date(monthValue);
    const year = date.getFullYear();
    const month = date.getMonth(); // Mengambil bulan (0-11)

    // Hitung jumlah hari dalam bulan
    const lastDay = new Date(year, month + 1, 0).getDate();

    // Buat workbook baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Workday Template');

    // Data untuk shift yang akan ditulis ke Excel
    const shiftData = [['Shift 3'], ['Shift 2'], ['Shift 1'], ['OT TL 3'], ['OT TL 2'], ['OT TL 1'], ['OT TT 3'], ['OT TT 2'], ['OT TT 1'], ['OFF']];

    const headerRow = Array.from({ length: lastDay }, (_, i) => {
      const day = new Date(year, month, i + 1);
      return day
        .toLocaleDateString('en-US', {
          weekday: 'short',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
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
      const dateValue = new Date(year, month, colNumber - 1);

      // Jika hari Minggu, warnai sel
      if (dateValue.getDay() === 0) {
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
    const totalRows = shiftData.length + 1;

    for (let rowNumber = 1; rowNumber <= totalRows; rowNumber++) {
      for (let colNumber = 1; colNumber <= lastDay + 1; colNumber++) {
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
      fgColor: { argb: 'FFFF00' },
    };
    instructionCell.alignment = {
      vertical: 'middle',
      horizontal: 'left',
    };

    for (let col = 2; col <= 3; col++) {
      const cell = worksheet.getCell(14, col);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' },
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    }

    // Menambahkan simbol V di D14
    const checkBoxCell = worksheet.getCell('D14');
    checkBoxCell.value = 'V';
    checkBoxCell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    const now = new Date();
    const indonesiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const monthFn = date.toLocaleDateString('en-US', { month: 'long' });
    const timestamp = indonesiaTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '');
    const fileName = `Workday_${monthFn}_${year}_${timestamp}.xlsx`;

    // Ekspor workbook sebagai file Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
    });
  }

  downloadTemplate_M3() {
    const monthValue = this.formHeaderMo.get('month_2').value;

    if (!monthValue) {
      Swal.fire({
        icon: 'error',
        title: 'Month not selected',
        text: 'Please select a month first!',
        confirmButtonText: 'OK',
      });
      return;
    }

    const date = new Date(monthValue);
    const year = date.getFullYear();
    const month = date.getMonth();

    // Hitung jumlah hari dalam bulan
    const lastDay = new Date(year, month + 1, 0).getDate();

    // Buat workbook baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Workday Template');

    // Data untuk shift yang akan ditulis ke Excel
    const shiftData = [['Shift 3'], ['Shift 2'], ['Shift 1'], ['OT TL 3'], ['OT TL 2'], ['OT TL 1'], ['OT TT 3'], ['OT TT 2'], ['OT TT 1'], ['OFF']];

    const headerRow = Array.from({ length: lastDay }, (_, i) => {
      const day = new Date(year, month, i + 1); // Buat tanggal untuk setiap hari
      // Format tanggal menjadi "Tue, 26 November 2024"
      return day
        .toLocaleDateString('en-US', {
          weekday: 'short',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
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
      const dateValue = new Date(year, month, colNumber - 1);

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
      worksheet.getColumn(colNumber + 0).width = cell.value.length + 2;
    });

    // Menambahkan border pada setiap sel di kolom A dan B
    const totalRows = shiftData.length + 1;

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
      fgColor: { argb: 'FFFF00' },
    };
    instructionCell.alignment = {
      vertical: 'middle',
      horizontal: 'left',
    };

    for (let col = 2; col <= 3; col++) {
      const cell = worksheet.getCell(14, col);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' },
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    }

    // Menambahkan simbol V di D14
    const checkBoxCell = worksheet.getCell('D14');
    checkBoxCell.value = 'V';
    checkBoxCell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    const now = new Date();
    const indonesiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const monthFn = date.toLocaleDateString('en-US', { month: 'long' });
    const timestamp = indonesiaTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '');
    const fileName = `Workday_${monthFn}_${year}_${timestamp}.xlsx`;

    // Ekspor workbook sebagai file Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
    });
  }

  readExcel_M1(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    this.workDay_M0 = [];

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
        const shift3 = jsonData[1][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const shift2 = jsonData[2][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const shift1 = jsonData[3][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const ot_tl_3 = jsonData[4][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const ot_tl_2 = jsonData[5][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const ot_tl_1 = jsonData[6][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const ot_tt_3 = jsonData[7][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const ot_tt_2 = jsonData[8][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const ot_tt_1 = jsonData[9][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const off = jsonData[10][i]?.toString().toUpperCase() === 'V' ? 1 : 0;

        const data = {
          date_WD: convertTypeDate[i - 1],
          iwd_SHIFT_1: shift1,
          iwd_SHIFT_2: shift2,
          iwd_SHIFT_3: shift3,
          iot_TL_3: ot_tl_3,
          iot_TL_2: ot_tl_2,
          iot_TL_1: ot_tl_1,
          iot_TT_3: ot_tt_3,
          iot_TT_2: ot_tt_2,
          iot_TT_1: ot_tt_1,
          off: off,
        };
        this.workDay_M0.push(data);
      }

      this.total_wd_m0 = this.calculateWd(this.workDay_M0);

      // Update form jika ada perubahan
      this.formHeaderMo.patchValue({
        nwd_0: this.total_wd_m0.total_wd,
        tl_ot_wd_0: this.total_wd_m0.total_ot_tl,
        tt_ot_wd_0: this.total_wd_m0.total_ot_tt,
      });
    };

    reader.readAsArrayBuffer(file);
  }

  readExcel_M2(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    this.workDay_M1 = [];

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Ambil nama sheet pertama
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const tanggal = jsonData[0].slice(1);
      const convertTypeDate = tanggal.map((tgl) => new Date(tgl));

      // Iterasi melalui setiap kolom tanggal
      for (let i = 1; i <= convertTypeDate.length; i++) {
        const shift3 = jsonData[1][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const shift2 = jsonData[2][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const shift1 = jsonData[3][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const ot_tl_3 = jsonData[4][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const ot_tl_2 = jsonData[5][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const ot_tl_1 = jsonData[6][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const ot_tt_3 = jsonData[7][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const ot_tt_2 = jsonData[8][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const ot_tt_1 = jsonData[9][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const off = jsonData[10][i]?.toString().toUpperCase() === 'V' ? 1 : 0;

        const data = {
          date_WD: convertTypeDate[i - 1],
          iwd_SHIFT_1: shift1,
          iwd_SHIFT_2: shift2,
          iwd_SHIFT_3: shift3,
          iot_TL_3: ot_tl_3,
          iot_TL_2: ot_tl_2,
          iot_TL_1: ot_tl_1,
          iot_TT_3: ot_tt_3,
          iot_TT_2: ot_tt_2,
          iot_TT_1: ot_tt_1,
          off: off,
        };
        this.workDay_M1.push(data);
      }

      this.total_wd_m1 = this.calculateWd(this.workDay_M1);
      // Update form jika ada perubahan
      this.formHeaderMo.patchValue({
        nwd_1: this.total_wd_m1.total_wd,
        tl_ot_wd_1: this.total_wd_m1.total_ot_tl,
        tt_ot_wd_1: this.total_wd_m1.total_ot_tt,
      });
    };

    reader.readAsArrayBuffer(file);
  }

  readExcel_M3(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    this.workDay_M2 = [];

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Ambil nama sheet pertama
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const tanggal = jsonData[0].slice(1);
      const convertTypeDate = tanggal.map((tgl) => new Date(tgl));

      // Iterasi melalui setiap kolom tanggal
      for (let i = 1; i <= convertTypeDate.length; i++) {
        const shift3 = jsonData[1][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const shift2 = jsonData[2][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const shift1 = jsonData[3][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const ot_tl_3 = jsonData[4][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const ot_tl_2 = jsonData[5][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const ot_tl_1 = jsonData[6][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const ot_tt_3 = jsonData[7][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const ot_tt_2 = jsonData[8][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const ot_tt_1 = jsonData[9][i]?.toString().toUpperCase() === 'V' ? 1 : 0;
        const off = jsonData[10][i]?.toString().toUpperCase() === 'V' ? 1 : 0;

        const data = {
          date_WD: convertTypeDate[i - 1],
          iwd_SHIFT_1: shift1,
          iwd_SHIFT_2: shift2,
          iwd_SHIFT_3: shift3,
          iot_TL_3: ot_tl_3,
          iot_TL_2: ot_tl_2,
          iot_TL_1: ot_tl_1,
          iot_TT_3: ot_tt_3,
          iot_TT_2: ot_tt_2,
          iot_TT_1: ot_tt_1,
          off: off,
        };
        this.workDay_M2.push(data);
      }

      this.total_wd_m2 = this.calculateWd(this.workDay_M2);
      // Update form jika ada perubahan
      this.formHeaderMo.patchValue({
        nwd_2: this.total_wd_m2.total_wd,
        tl_ot_wd_2: this.total_wd_m2.total_ot_tl,
        tt_ot_wd_2: this.total_wd_m2.total_ot_tt,
      });
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
      Swal.fire({
        title: 'Incomplete Form',
        text: 'Please fill in all required fields!',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    } else {
      this.fillTheTableMo();
      this.isTableVisible = true;
    }
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
        wdNormal: this.formHeaderMo.get(`nwd_${i}`)?.value,
        wdOtTl: this.formHeaderMo.get(`tl_ot_wd_${i}`)?.value,
        wdOtTt: this.formHeaderMo.get(`tt_ot_wd_${i}`)?.value,
        totalWdTl: this.formHeaderMo.get(`total_tlwd_${i}`)?.value,
        totalWdTt: this.formHeaderMo.get(`total_ttwd_${i}`)?.value,
        maxCapTube: this.formHeaderMo.get(`max_tube_capa_${i}`)?.value,
        maxCapTl: this.formHeaderMo.get(`max_capa_tl_${i}`)?.value,
        maxCapTt: this.formHeaderMo.get(`max_capa_tt_${i}`)?.value,
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

    // this.moService.saveMarketingOrder(this.marketingOrder).subscribe(
    //   (response) => {
    //     const lastIdMo = response.data.moId;
    //     this.headerMo = [];
    //     for (let i = 0; i < 3; i++) {
    //       this.headerMo.push({
    //         moId: lastIdMo,
    //         month: new Date(this.formHeaderMo.get(`month_${i}`)?.value),
    //         wdNormal: this.formHeaderMo.get(`nwd_${i}`)?.value,
    //         wdOtTl: this.formHeaderMo.get(`tl_ot_wd_${i}`)?.value,
    //         wdOtTt: this.formHeaderMo.get(`tt_ot_wd_${i}`)?.value,
    //         totalWdTl: this.formHeaderMo.get(`total_tlwd_${i}`)?.value,
    //         totalWdTt: this.formHeaderMo.get(`total_ttwd_${i}`)?.value,
    //         maxCapTube: this.formHeaderMo.get(`max_tube_capa_${i}`)?.value,
    //         maxCapTl: this.formHeaderMo.get(`max_capa_tl_${i}`)?.value,
    //         maxCapTt: this.formHeaderMo.get(`max_capa_tt_${i}`)?.value,
    //       });
    //     }
    //     this.moService.saveHeaderMarketingOrder(this.headerMo).subscribe(
    //       (response) => {
    //         this.detailMarketingOrder.forEach((item) => {
    //           item.moId = lastIdMo;
    //         });
    //         this.moService.saveDetailRowMarketingOrder(this.detailMarketingOrder).subscribe(
    //           (response) => {
    //             Swal.fire({
    //               title: 'Success!',
    //               text: 'Data Marketing Order successfully Added.',
    //               icon: 'success',
    //               confirmButtonText: 'OK',
    //             }).then((result) => {
    //               if (result.isConfirmed) {
    //                 this.navigateToViewMo();
    //               }
    //             });
    //           },
    //           (err) => {
    //             Swal.fire('Error!', 'Error insert data Detaill Marketing Order.', 'error');
    //           }
    //         );
    //       },
    //       (err) => {
    //         Swal.fire('Error!', 'Error insert data Header Marketing Order.', 'error');
    //       }
    //     );
    //   },
    //   (err) => {
    //     Swal.fire('Error!', 'Error insert data Marketing Order.', 'error');
    //   }
    // );
  }

  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-mo-ppc']);
  }

  calculateWd(data: any[]) {
    let totalWd = 0;
    let totalOtTl = 0;
    let totalOtTt = 0;
    let totalOff = 0;

    data.forEach((item) => {
      const wd = item.iwd_SHIFT_1 + item.iwd_SHIFT_2 + item.iwd_SHIFT_3;
      const overtimeTl = item.iot_TL_1 + item.iot_TL_2 + item.iot_TL_3;
      const overtimeTT = item.iot_TT_1 + item.iot_TT_2 + item.iot_TT_3;
      const off = item.off;

      totalWd += wd;
      totalOtTl += overtimeTl;
      totalOtTt += overtimeTT;
      totalOff += off;
    });

    totalWd /= 3;
    totalOtTl /= 3;
    totalOtTt /= 3;

    let total_wd = totalWd.toFixed(2);
    let total_ot_tl = totalOtTl.toFixed(2);
    let total_ot_tt = totalOtTt.toFixed(2);

    return {
      total_wd,
      total_ot_tl,
      total_ot_tt,
    };
  }
}
