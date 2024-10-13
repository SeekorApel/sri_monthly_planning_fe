import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as ExcelJS from 'exceljs/dist/exceljs.min.js';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DetailMarketingOrder } from 'src/app/models/DetailMarketingOrder';

@Component({
  selector: 'app-edit-mo-ppc',
  templateUrl: './edit-mo-ppc.component.html',
  styleUrls: ['./edit-mo-ppc.component.scss']
})
export class EditMoPpcComponent implements OnInit {

  //Variable Declaration
  idMo: String;
  formHeaderMo: FormGroup;
  isReadOnly: boolean = true;
  monthNames: string[] = ['', '', ''];
  marketingOrderTable: DetailMarketingOrder[];

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

  constructor(private router: Router, private activeRoute: ActivatedRoute, private fb: FormBuilder) {
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
      max_tube_capa_0: [10, [Validators.required, Validators.min(0)]],
      max_tube_capa_1: [20, [Validators.required, Validators.min(0)]],
      max_tube_capa_2: [30, [Validators.required, Validators.min(0)]],
      max_capa_tl_0: [10, [Validators.required, Validators.min(0)]],
      max_capa_tt_0: [20, [Validators.required, Validators.min(0)]],
      max_capa_tl_1: [30, [Validators.required, Validators.min(0)]],
      max_capa_tt_1: [10, [Validators.required, Validators.min(0)]],
      max_capa_tl_2: [20, [Validators.required, Validators.min(0)]],
      max_capa_tt_2: [30, [Validators.required, Validators.min(0)]],
      looping_m0:['',[]],
      machine_airbag_m0:['',[]],
      fed_tl_m0:['',[]],
      fed_tt_m0:['',[]],
      total_mo_m0:['',[]],
      note_tl_m0:['',[]],
      upload_file_m0: [null, [Validators.required]],
      upload_file_m1: [null, [Validators.required]],
      upload_file_m2: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.idMo = this.activeRoute.snapshot.paramMap.get('idMo');
    console.log("Ini id mo edit", this.idMo);
  }

  downloadTemplate_M1() {
    // Ambil bulan dan tahun dari input
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

    // Hitung jumlah hari dalam bulan
    const lastDay = new Date(year, month + 1, 0).getDate();

    // Buat workbook baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Shift Template');

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
      const dateValue = new Date(year, month, colNumber - 1); // Mendapatkan tanggal

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

    for (let col = 2; col <= 4; col++) {
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
    const worksheet = workbook.addWorksheet('Shift Template');

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

    for (let col = 2; col <= 4; col++) {
      // B14 (2) sampai D14 (4)
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
        const shift3 = jsonData[1][i] === '☑' ? 1 : 0;
        const shift2 = jsonData[2][i] === '☑' ? 1 : 0;
        const shift1 = jsonData[3][i] === '☑' ? 1 : 0;
        const ot_tl_3 = jsonData[4][i] === '☑' ? 1 : 0;
        const ot_tl_2 = jsonData[5][i] === '☑' ? 1 : 0;
        const ot_tl_1 = jsonData[6][i] === '☑' ? 1 : 0;
        const ot_tt_3 = jsonData[7][i] === '☑' ? 1 : 0;
        const ot_tt_2 = jsonData[8][i] === '☑' ? 1 : 0;
        const ot_tt_1 = jsonData[9][i] === '☑' ? 1 : 0;
        const off = jsonData[10][i] === '☑' ? 1 : 0;

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
        const shift3 = jsonData[1][i] === '☑' ? 1 : 0;
        const shift2 = jsonData[2][i] === '☑' ? 1 : 0;
        const shift1 = jsonData[3][i] === '☑' ? 1 : 0;
        const ot_tl_3 = jsonData[4][i] === '☑' ? 1 : 0;
        const ot_tl_2 = jsonData[5][i] === '☑' ? 1 : 0;
        const ot_tl_1 = jsonData[6][i] === '☑' ? 1 : 0;
        const ot_tt_3 = jsonData[7][i] === '☑' ? 1 : 0;
        const ot_tt_2 = jsonData[8][i] === '☑' ? 1 : 0;
        const ot_tt_1 = jsonData[9][i] === '☑' ? 1 : 0;
        const off = jsonData[10][i] === '☑' ? 1 : 0;

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
        const shift3 = jsonData[1][i] === '☑' ? 1 : 0;
        const shift2 = jsonData[2][i] === '☑' ? 1 : 0;
        const shift1 = jsonData[3][i] === '☑' ? 1 : 0;
        const ot_tl_3 = jsonData[4][i] === '☑' ? 1 : 0;
        const ot_tl_2 = jsonData[5][i] === '☑' ? 1 : 0;
        const ot_tl_1 = jsonData[6][i] === '☑' ? 1 : 0;
        const ot_tt_3 = jsonData[7][i] === '☑' ? 1 : 0;
        const ot_tt_2 = jsonData[8][i] === '☑' ? 1 : 0;
        const ot_tt_1 = jsonData[9][i] === '☑' ? 1 : 0;
        const off = jsonData[10][i] === '☑' ? 1 : 0;

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

  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-mo-ppc']);
  }

}
